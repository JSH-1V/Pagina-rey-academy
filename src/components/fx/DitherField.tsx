/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, type MutableRefObject } from "react";
import { Renderer, Program, Triangle, Mesh, Texture } from "ogl";

interface DitherFieldProps {
  /**
   * Si se pasa, el dither se aplica sobre ESTE video (la corona) en vez de
   * sobre un campo de ruido procedural — el efecto "video a través del
   * dither" que se ve en sitios de agencias premium.
   */
  videoSrc?: string;
  posterSrc?: string;
  /**
   * Secuencia de frames (ffmpeg) como fuente alternativa al video: el frame
   * mostrado lo decide `progressRef` (0–1), no el reloj. Ej: "/scrub/frame_".
   * Tiene prioridad sobre `videoSrc` si ambos están presentes.
   */
  framePath?: string;
  frameExt?: string;
  frameCount?: number;
  /**
   * Progreso de scroll 0–1 que manda el frame. Se lee por ref dentro del bucle
   * de render (no por prop) para que mover el scroll no re-renderice React.
   */
  progressRef?: MutableRefObject<number>;
  /**
   * Constante de tiempo del suavizado del scrub, en segundos. Más alto =
   * la imagen "persigue" al scroll con más inercia (sensación de cámara lenta).
   */
  smoothing?: number;
  /** Paleta de 4 paradas, de más oscuro a más claro. Por defecto, marca REY. */
  colors?: [string, string, string, string];
  /** Tamaño de celda del dither, en píxeles CSS (se escala por DPR). */
  pixelSize?: number;
  /** Cuánto perturba el patrón Bayer el nivel de gris (0–1). */
  ditherStrength?: number;
  /** Velocidad del ruido procedural (ignorado si hay video o frames). */
  speed?: number;
  /** Escala del patrón de ruido (ignorado si hay video o frames). */
  scale?: number;
  contrast?: number;
  brightness?: number;
  className?: string;
  /** Callback de progreso de precarga de la secuencia (0–1). */
  onFramesProgress?: (ratio: number) => void;
}

function hexToRgb(hex: string): [number, number, number] {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return m
    ? [parseInt(m[1], 16) / 255, parseInt(m[2], 16) / 255, parseInt(m[3], 16) / 255]
    : [1, 1, 1];
}

const VERT = `
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}`;

const FRAG = `
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
uniform sampler2D uVideo;
uniform sampler2D uVideoB;
uniform float uMix;
uniform float uHasVideo;
uniform vec2 uSrcSize;
uniform float uPixelSize;
uniform float uDitherStrength;
uniform vec3 uColor0;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform float uSpeed;
uniform float uScale;
uniform float uContrast;
uniform float uBrightness;
varying vec2 vUv;

float hash(vec2 p) { return fract(sin(dot(p, vec2(41.3, 289.1))) * 43758.5453); }

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

float fbm(vec2 p) {
  float v = 0.0;
  float amp = 0.55;
  for (int i = 0; i < 4; i++) {
    v += amp * noise(p);
    p *= 2.02;
    amp *= 0.5;
  }
  return v;
}

float bayer4x4(vec2 pos) {
  float x = mod(pos.x, 4.0);
  float y = mod(pos.y, 4.0);
  float idx = x + y * 4.0;
  if (idx < 0.5) return 0.0;
  if (idx < 1.5) return 8.0;
  if (idx < 2.5) return 2.0;
  if (idx < 3.5) return 10.0;
  if (idx < 4.5) return 12.0;
  if (idx < 5.5) return 4.0;
  if (idx < 6.5) return 14.0;
  if (idx < 7.5) return 6.0;
  if (idx < 8.5) return 3.0;
  if (idx < 9.5) return 11.0;
  if (idx < 10.5) return 1.0;
  if (idx < 11.5) return 9.0;
  if (idx < 12.5) return 15.0;
  if (idx < 13.5) return 7.0;
  if (idx < 14.5) return 13.0;
  return 5.0;
}

vec3 rampColor(float t) {
  t = clamp(t, 0.0, 1.0);
  if (t < 0.3333) return mix(uColor0, uColor1, t / 0.3333);
  if (t < 0.6666) return mix(uColor1, uColor2, (t - 0.3333) / 0.3333);
  return mix(uColor2, uColor3, (t - 0.6666) / 0.3334);
}

/**
 * Mapea la UV de pantalla a la UV de la textura con encuadre "cover": la
 * fuente llena el contenedor recortando el excedente en vez de estirarse.
 * Sin esto, un frame 16:9 en un viewport vertical de móvil sale deformado.
 */
vec2 coverUv(vec2 uv, vec2 res, vec2 src) {
  if (src.x <= 0.0 || src.y <= 0.0) return uv;
  float rRes = res.x / res.y;
  float rSrc = src.x / src.y;
  vec2 k = rRes > rSrc ? vec2(1.0, rSrc / rRes) : vec2(rRes / rSrc, 1.0);
  return (uv - 0.5) * k + 0.5;
}

void main() {
  vec2 fragCoord = vUv * iResolution;
  vec2 cellIndex = floor(fragCoord / uPixelSize);
  vec2 cellUv = (cellIndex * uPixelSize) / iResolution;

  float lum;
  if (uHasVideo > 0.5) {
    // ogl ya voltea la textura verticalmente al subirla (flipY por defecto
    // en TEXTURE_2D), así que acá se samplea directo sin invertir de nuevo.
    vec2 uv = coverUv(cellUv, iResolution, uSrcSize);
    vec3 srcA = texture2D(uVideo, uv).rgb;
    vec3 srcB = texture2D(uVideoB, uv).rgb;
    float lumA = dot(srcA, vec3(0.299, 0.587, 0.114));
    float lumB = dot(srcB, vec3(0.299, 0.587, 0.114));
    // Mezcla en luminancia entre el frame actual y el siguiente: con pocos
    // frames repartidos en mucho scroll, esto evita el "salto" y da el
    // movimiento continuo de cámara lenta.
    lum = mix(lumA, lumB, uMix);
  } else {
    vec2 p = cellUv * uScale * 3.0 + vec2(iTime * uSpeed * 0.05, iTime * uSpeed * 0.035);
    lum = fbm(p);
  }

  lum = clamp((lum - 0.5) * uContrast + 0.5, 0.0, 1.0) * uBrightness;

  float threshold = (bayer4x4(cellIndex) + 0.5) / 16.0;
  float dithered = lum + (threshold - 0.5) * uDitherStrength * 0.55;

  float bins = 4.0;
  float level = floor(clamp(dithered, 0.0, 1.0) * bins) / (bins - 1.0);

  gl_FragColor = vec4(rampColor(level), 1.0);
}`;

export function DitherField({
  videoSrc,
  posterSrc,
  framePath,
  frameExt = "webp",
  frameCount = 62,
  progressRef,
  smoothing = 0.22,
  colors = ["#0d0d0d", "#3a0d0d", "#f42525", "#ffffff"],
  pixelSize = 4,
  ditherStrength = 1,
  speed = 1,
  scale = 1,
  contrast = 1.15,
  brightness = 1,
  className = "",
  onFramesProgress
}: DitherFieldProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  // Clave estable derivada de `colors`: el prop llega como array literal
  // inline desde el padre (nueva referencia en cada render), así que no se
  // puede usar `colors` directo en el arreglo de dependencias sin que el
  // efecto se reinicie en cada render y el bucle nunca llegue a pintar un frame.
  const colorsKey = colors.join("|");

  // Los callbacks y el ref de progreso se leen por ref dentro del bucle para
  // no tener que meterlos en las dependencias del efecto (reiniciarían WebGL).
  const progressSourceRef = useRef(progressRef);
  progressSourceRef.current = progressRef;
  const onFramesProgressRef = useRef(onFramesProgress);
  onFramesProgressRef.current = onFramesProgress;

  // Se usa exclusivamente como fondo de hero (siempre visible al montar), así
  // que inicializa directo — sin gating por IntersectionObserver.
  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const renderer = new Renderer({ dpr: Math.min(window.devicePixelRatio, 2), alpha: false });
    const gl = renderer.gl;
    gl.canvas.style.width = "100%";
    gl.canvas.style.height = "100%";
    container.appendChild(gl.canvas);

    const textureA = new Texture(gl, { generateMipmaps: false });
    const textureB = new Texture(gl, { generateMipmaps: false });
    const video = framePath ? null : videoRef.current;

    const uniforms = {
      iTime: { value: 0 },
      iResolution: { value: [1, 1] },
      uVideo: { value: textureA },
      uVideoB: { value: textureB },
      uMix: { value: 0 },
      uHasVideo: { value: 0 },
      uSrcSize: { value: [0, 0] },
      uPixelSize: { value: pixelSize * renderer.dpr },
      uDitherStrength: { value: ditherStrength },
      uColor0: { value: hexToRgb(colors[0]) },
      uColor1: { value: hexToRgb(colors[1]) },
      uColor2: { value: hexToRgb(colors[2]) },
      uColor3: { value: hexToRgb(colors[3]) },
      uSpeed: { value: speed },
      uScale: { value: scale },
      uContrast: { value: contrast },
      uBrightness: { value: brightness }
    };

    const program = new Program(gl, { vertex: VERT, fragment: FRAG, uniforms });
    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });

    let lastW = -1;
    let lastH = -1;
    const resize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      // Nunca pasar un tamaño degenerado al renderer: un ResizeObserver puede
      // disparar con una medición transitoria de 0 (p. ej. el navegador móvil
      // recalculando el viewport al ocultar la barra de direcciones durante un
      // scroll). Sin este guard, `renderer.setSize(0, h)` deja el canvas en
      // 0px y el siguiente `render()` puede fallar dentro del loop.
      if (w <= 0 || h <= 0) return;
      if (w === lastW && h === lastH) return;
      lastW = w;
      lastH = h;
      renderer.setSize(w, h);
      // `setSize` deja el canvas en píxeles fijos; devolverlo a 100% evita que
      // se quede visualmente encogido si llegara a medirse en un momento malo.
      gl.canvas.style.width = "100%";
      gl.canvas.style.height = "100%";
      uniforms.iResolution.value = [w * renderer.dpr, h * renderer.dpr];
      // El tamaño de celda se define en px CSS: sin escalar por DPR, el dither
      // se vuelve casi invisible en pantallas retina y en móvil.
      uniforms.uPixelSize.value = pixelSize * renderer.dpr;
    };
    resize();
    // ResizeObserver y no solo `window.resize`: el CSS de Tailwind con valores
    // arbitrarios (h-[100svh], h-[360vh]) lo inyecta Vite por JS, así que en la
    // primera carga el contenedor todavía puede medir casi 0px cuando corre
    // este efecto. Sin observarlo, el canvas se quedaba clavado en ese tamaño.
    const ro = new ResizeObserver(resize);
    ro.observe(container);
    window.addEventListener("resize", resize);

    // --- Precarga de la secuencia de frames (modo scrub) -------------------
    const frames: HTMLImageElement[] = [];
    let framesReady = 0;
    if (framePath) {
      for (let i = 1; i <= frameCount; i++) {
        const img = new Image();
        img.decoding = "async";
        img.src = `${framePath}${String(i).padStart(3, "0")}.${frameExt}`;
        img.onload = () => {
          framesReady += 1;
          onFramesProgressRef.current?.(framesReady / frameCount);
        };
        img.onerror = () => {
          framesReady += 1;
          onFramesProgressRef.current?.(framesReady / frameCount);
        };
        frames.push(img);
      }
    }

    let smoothed = 0;
    let primed = false;
    let lastA = -1;
    let lastB = -1;
    let raf = 0;
    let lastT = performance.now();
    let lastSizeCheck = 0;
    let lastVideoNudge = 0;
    // Se pone en true mientras el contexto WebGL está perdido — evita seguir
    // llamando a render()/texImage2D sobre un contexto muerto hasta que el
    // navegador confirme que lo restauró.
    let contextLost = false;

    const loop = (t: number) => {
      // Bug real encontrado: antes, cualquier excepción sin capturar dentro de
      // este callback (p. ej. `renderer.render()` sobre un framebuffer de
      // tamaño degenerado, o un contexto WebGL perdido) mataba el rAF para
      // siempre — la última línea `raf = requestAnimationFrame(loop)` nunca
      // se ejecutaba y el loop se quedaba congelado en el último frame válido,
      // sin ningún error visible para el usuario. Con try/finally, el loop
      // SIEMPRE se vuelve a programar pase lo que pase dentro de este frame.
      try {
        if (contextLost) return;

        const dt = Math.min(0.05, (t - lastT) / 1000);
        lastT = t;
        uniforms.iTime.value = t * 0.001;

        // Red de seguridad además del ResizeObserver: si el contenedor
        // todavía medía ~0 cuando montó el efecto (CSS en vuelo, layout sin
        // asentar), esto lo corrige sin depender de que llegue un evento de
        // resize.
        if (t - lastSizeCheck > 250) {
          lastSizeCheck = t;
          resize();
        }

        if (framePath) {
          const target = Math.min(1, Math.max(0, progressSourceRef.current?.current ?? 0));
          // Primer frame: sin suavizado, para no arrancar siempre desde 0
          // cuando se entra a la página con el scroll ya avanzado (recarga a
          // media página).
          if (!primed) {
            smoothed = target;
            primed = true;
          } else {
            smoothed += (target - smoothed) * (1 - Math.exp(-dt / smoothing));
          }

          const f = smoothed * (frameCount - 1);
          const i0 = Math.min(frameCount - 1, Math.max(0, Math.floor(f)));
          const i1 = Math.min(frameCount - 1, i0 + 1);
          const imgA = frames[i0];
          const imgB = frames[i1];

          if (imgA?.complete && imgA.naturalWidth > 0) {
            if (i0 !== lastA) {
              textureA.image = imgA;
              textureA.needsUpdate = true;
              lastA = i0;
            }
            if (i1 !== lastB && imgB?.complete && imgB.naturalWidth > 0) {
              textureB.image = imgB;
              textureB.needsUpdate = true;
              lastB = i1;
            }
            uniforms.uSrcSize.value = [imgA.naturalWidth, imgA.naturalHeight];
            uniforms.uMix.value = lastB === i1 ? f - i0 : 0;
            uniforms.uHasVideo.value = 1;
          }
        } else if (video) {
          // Vigilante: algunos navegadores pausan silenciosamente un <video>
          // que consideran "no visible" (por su tamaño de 1px/opacity 0) al
          // recalcular visibilidad durante un scroll, sin disparar ningún
          // evento que se pueda escuchar. Si eso pasa, se reintenta play()
          // cada segundo en vez de quedarse pegado en un frame para siempre.
          if (video.paused && !video.ended && t - lastVideoNudge > 1000) {
            lastVideoNudge = t;
            video.play().catch(() => {});
          }
          if (video.readyState >= video.HAVE_CURRENT_DATA) {
            textureA.image = video;
            textureA.needsUpdate = true;
            // Sin segundo frame que interpolar: el video ya trae su propia cadencia.
            uniforms.uMix.value = 0;
            uniforms.uSrcSize.value = [video.videoWidth, video.videoHeight];
            uniforms.uHasVideo.value = 1;
          }
        }

        renderer.render({ scene: mesh });
      } catch (err) {
        console.error("DitherField: frame descartado por error, el loop continúa", err);
      } finally {
        raf = requestAnimationFrame(loop);
      }
    };
    raf = requestAnimationFrame(loop);

    // Recuperación de pérdida de contexto WebGL (crash del GPU process, límite
    // de contextos simultáneos del navegador, etc.): sin esto, `render()`
    // sigue corriendo sobre un contexto muerto y la pantalla queda congelada
    // en el último frame renderizado, indistinguible de un loop detenido.
    const handleContextLost = (e: Event) => {
      e.preventDefault();
      contextLost = true;
    };
    const handleContextRestored = () => {
      // ogl no expone una forma de "revivir" un Renderer existente — lo más
      // simple y confiable es recrear el efecto entero. `lastW/lastH` se
      // resetean para forzar un resize real en el próximo tick.
      lastW = -1;
      lastH = -1;
      contextLost = false;
    };
    gl.canvas.addEventListener("webglcontextlost", handleContextLost);
    gl.canvas.addEventListener("webglcontextrestored", handleContextRestored);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("resize", resize);
      gl.canvas.removeEventListener("webglcontextlost", handleContextLost);
      gl.canvas.removeEventListener("webglcontextrestored", handleContextRestored);
      frames.forEach((img) => {
        img.onload = null;
        img.onerror = null;
        img.src = "";
      });
      try {
        const lose = gl.getExtension("WEBGL_lose_context");
        lose?.loseContext();
        gl.canvas.parentNode?.removeChild(gl.canvas);
      } catch {
        // no-op: contexto ya liberado por el navegador
      }
    };
  }, [
    videoSrc,
    framePath,
    frameExt,
    frameCount,
    smoothing,
    pixelSize,
    ditherStrength,
    speed,
    scale,
    contrast,
    brightness,
    colorsKey
  ]);

  return (
    <div ref={containerRef} className={`relative w-full h-full overflow-hidden ${className}`}>
      {videoSrc && !framePath && (
        <video
          ref={videoRef}
          // "display: none" (Tailwind `hidden`) hace que algunos navegadores
          // pausen la decodificación del video aunque tenga autoplay — se
          // queda pegado en un solo frame. Con esto queda fuera de vista
          // pero sigue "presente" en el layout, así el navegador lo sigue
          // reproduciendo con normalidad.
          className="absolute w-px h-px overflow-hidden opacity-0 pointer-events-none"
          src={videoSrc}
          poster={posterSrc}
          autoPlay
          muted
          loop
          playsInline
        />
      )}
    </div>
  );
}
