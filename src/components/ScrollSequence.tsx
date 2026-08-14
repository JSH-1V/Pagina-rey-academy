/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "motion/react";

interface ScrollSequenceProps {
  /**
   * Base de ruta de los frames extraídos del video (ffmpeg).
   * Ej: "/scrub/frame_" → /scrub/frame_001.webp ... frame_120.webp
   * Si los frames aún no existen, se dibuja un placeholder procedural
   * que igual demuestra el efecto de scrub con el scroll.
   */
  framePath?: string;
  frameExt?: string;
  frameCount?: number;
  /** Alto de scroll de la sección, en vh. Más alto = scrub más lento. */
  scrollVh?: number;
}

const PHASES = ["Caos", "Ensamblaje", "Máquina"];

// Partículas para el placeholder procedural (caos → orden).
interface Particle {
  cx: number; // caos (0..1)
  cy: number;
  ox: number; // orden (0..1) — grilla
  oy: number;
  rot: number;
  size: number;
}

function buildParticles(count: number): Particle[] {
  // PRNG determinista para posiciones de caos estables entre redibujos.
  let seed = 20260812;
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
  const cols = Math.ceil(Math.sqrt(count));
  const rows = Math.ceil(count / cols);
  const parts: Particle[] = [];
  for (let i = 0; i < count; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    parts.push({
      cx: rand(),
      cy: rand(),
      ox: 0.5 + ((col - (cols - 1) / 2) / cols) * 0.62,
      oy: 0.5 + ((row - (rows - 1) / 2) / rows) * 0.62,
      rot: rand() * Math.PI,
      size: 6 + rand() * 10,
    });
  }
  return parts;
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

// Suaviza la interpolación caos→orden.
function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

export function ScrollSequence({
  framePath,
  frameExt = "webp",
  frameCount = 120,
  scrollVh = 260,
}: ScrollSequenceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const particlesRef = useRef<Particle[]>(buildParticles(90));
  const progressRef = useRef(0);
  const [loadedCount, setLoadedCount] = useState(0);
  const [phase, setPhase] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Precarga de frames reales (si existen).
  useEffect(() => {
    if (!framePath) return;
    let loaded = 0;
    const imgs: HTMLImageElement[] = [];
    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      img.src = `${framePath}${String(i).padStart(3, "0")}.${frameExt}`;
      img.onload = () => {
        loaded += 1;
        setLoadedCount(loaded);
      };
      imgs[i - 1] = img;
    }
    imagesRef.current = imgs;
  }, [framePath, frameExt, frameCount]);

  // Ajusta el tamaño del canvas al viewport (retina-aware).
  useEffect(() => {
    const resize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      draw(progressRef.current);
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Dibuja el frame correspondiente al progreso (real o placeholder).
  const draw = (progress: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;

    const realFramesReady = !!framePath && loadedCount >= frameCount;

    if (realFramesReady) {
      const idx = Math.min(frameCount - 1, Math.floor(progress * frameCount));
      const img = imagesRef.current[idx];
      if (img && img.complete && img.naturalWidth > 0) {
        // cover-fit
        const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
        const dw = img.naturalWidth * scale;
        const dh = img.naturalHeight * scale;
        ctx.clearRect(0, 0, w, h);
        ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
        return;
      }
    }

    drawPlaceholder(ctx, w, h, progress);
  };

  // Placeholder procedural: fragmentos dispersos que se ordenan en una grilla.
  const drawPlaceholder = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    progress: number
  ) => {
    ctx.clearRect(0, 0, w, h);
    // Fondo
    ctx.fillStyle = "#0d0d0d";
    ctx.fillRect(0, 0, w, h);

    // Glow rojo que crece con el progreso
    const glow = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h) * 0.6);
    glow.addColorStop(0, `rgba(244,37,37,${0.05 + progress * 0.16})`);
    glow.addColorStop(1, "rgba(244,37,37,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, w, h);

    const t = easeInOut(Math.min(1, Math.max(0, progress)));
    const parts = particlesRef.current;

    for (const p of parts) {
      const x = lerp(p.cx, p.ox, t) * w;
      const y = lerp(p.cy, p.oy, t) * h;
      const size = p.size * (Math.min(w, h) / 800);
      const rot = lerp(p.rot, 0, t);

      // Color: acero frío (caos) → rojo REY (orden)
      const r = Math.round(lerp(90, 244, t));
      const g = Math.round(lerp(96, 37, t));
      const b = Math.round(lerp(102, 37, t));
      const alpha = 0.5 + t * 0.5;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
      if (t > 0.55) {
        ctx.shadowColor = "rgba(244,37,37,0.7)";
        ctx.shadowBlur = (t - 0.55) * 40;
      }
      ctx.fillRect(-size / 2, -size / 2, size, size);
      ctx.restore();

      // Líneas de energía conectando a la grilla en la fase de ensamblaje
      if (t > 0.35 && t < 0.95) {
        ctx.strokeStyle = `rgba(244,37,37,${(t - 0.35) * 0.5})`;
        ctx.lineWidth = Math.max(1, size * 0.08);
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(p.ox * w, p.oy * h);
        ctx.stroke();
      }
    }
  };

  // Redibuja al cambiar el progreso de scroll.
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    progressRef.current = v;
    draw(v);
    const ph = v < 0.34 ? 0 : v < 0.7 ? 1 : 2;
    setPhase(ph);
  });

  // Redibuja cuando terminan de cargar los frames reales.
  useEffect(() => {
    draw(progressRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadedCount]);

  const usingPlaceholder = !framePath || loadedCount < frameCount;

  return (
    <section
      ref={containerRef}
      className="relative bg-background"
      style={{ height: `${scrollVh}vh` }}
      id="transformacion"
      aria-label="De Caos a Máquina"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

        {/* Overlay de texto */}
        <div className="relative z-10 text-center px-margin-mobile pointer-events-none">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-label-caps text-primary tracking-[0.4em] mb-4 block font-bold"
          >
            TRANSFORMACIÓN
          </motion.span>
          <h2 className="font-headline-lg text-[30px] sm:text-[48px] md:text-headline-lg text-primary font-extrabold uppercase leading-tight mb-8">
            De Caos<br />a Máquina
          </h2>

          {/* Indicador de fases */}
          <div className="flex items-center justify-center gap-3 sm:gap-5">
            {PHASES.map((label, i) => (
              <div key={label} className="flex items-center gap-3 sm:gap-5">
                <span
                  className="font-label-caps text-[11px] sm:text-[13px] font-bold tracking-widest uppercase transition-colors duration-300"
                  style={{ color: phase === i ? "rgb(244,37,37)" : "rgba(196,199,200,0.4)" }}
                >
                  {label}
                </span>
                {i < PHASES.length - 1 && (
                  <span className="w-6 sm:w-10 h-px bg-white/15" />
                )}
              </div>
            ))}
          </div>

          {usingPlaceholder && (
            <p className="mt-8 font-body-md text-[12px] text-on-surface-variant/40 max-w-xs mx-auto">
              Vista previa del efecto · reemplazá con los frames reales en{" "}
              <code className="text-on-surface-variant/60">public/scrub/</code>
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
