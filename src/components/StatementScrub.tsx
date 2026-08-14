/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useReducedMotion,
  type MotionValue
} from "motion/react";
import { DitherField } from "./fx/DitherField";
import ShinyText from "./fx/ShinyText";
import { useScrollLeash } from "./useScrollLeash";
import { useReleaseFracProgress } from "./useReleaseFracProgress";

const DITHER_COLORS: [string, string, string, string] = ["#0d0d0d", "#3a0d0d", "#f42525", "#ffffff"];

/**
 * Una palabra del titular, ligada DIRECTO a la posición de scroll (no a un
 * timer). Es a propósito: el fondo (la corona ditherizada) también avanza
 * con el scroll, y si el texto terminaba de aparecer a los pocos centímetros
 * mientras quedaban 2 pantallas de fondo por recorrer, se sentía como scroll
 * perdido mirando lo mismo. Atado 1:1 a la misma barra de progreso, el texto
 * acompaña al fondo de principio a fin — nunca se "adelanta" ni se "atrasa".
 */
function ScrubWord({
  word,
  progress,
  start,
  end,
  color
}: {
  word: string;
  progress: MotionValue<number>;
  start: number;
  end: number;
  color: string;
}) {
  // Progreso local 0–1, clampeado a mano en vez de confiar en el clamp
  // implícito de la forma [inputRange, outputRange] de useTransform: así
  // queda matemáticamente garantizado que una vez `progress` supera `end`,
  // la palabra se queda en 1 para siempre (nunca vuelve a bajar) sin
  // depender de ningún comportamiento por default de la librería.
  const local = useTransform(progress, (p) => {
    if (end <= start) return p >= start ? 1 : 0;
    return Math.min(1, Math.max(0, (p - start) / (end - start)));
  });
  const opacity = local;
  const y = useTransform(local, (v) => `${(0.4 * (1 - v)).toFixed(3)}em`);
  // Antes el "contraste fijo" era un drop-shadow con offset (0 2px, 0 10px) —
  // eso solo oscurece un lado de cada letra (abajo). Contra un frame del
  // dither que sale casi blanco, el resto del contorno (arriba, costados)
  // sigue sin nada detrás y se sigue lavando — por eso el texto seguía
  // "desapareciendo" pese al fix anterior. Un blur no arregla eso, hace falta
  // un CONTORNO real a los cuatro lados.
  const blur = useTransform(local, (v) => `blur(${(8 * (1 - v)).toFixed(2)}px)`);

  return (
    <span className="relative inline-block whitespace-nowrap">
      {/* Reserva de espacio, totalmente invisible: solo existe para que el
          bloque de texto ocupe su sitio y el layout no salte mientras las
          palabras se encienden. Antes iba en gris tenue y se leía como un
          "fantasma" del titular antes de tiempo. */}
      <span aria-hidden="true" style={{ color: "transparent" }}>
        {word}
      </span>
      <motion.span
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          opacity,
          y,
          filter: blur,
          color,
          // Contorno negro real (no un drop-shadow con offset): rodea la
          // letra por los cuatro lados, así se lee contra CUALQUIER fondo,
          // sin importar qué tan claro salga el frame del dither en ese punto.
          WebkitTextStroke: "1.4px rgba(0,0,0,0.9)",
          paintOrder: "stroke fill",
          textShadow: "0 6px 18px rgba(0,0,0,0.75)",
          willChange: "transform, opacity, filter"
        }}
      >
        {word}
      </motion.span>
    </span>
  );
}

function ScrubLine({
  text,
  progress,
  from,
  to,
  color,
  className = ""
}: {
  text: string;
  progress: MotionValue<number>;
  from: number;
  to: number;
  color: string;
  className?: string;
}) {
  const words = text.split(" ");
  // Cada palabra ocupa un tramo con solape: sin solape se enciende una por una
  // como un semáforo; con solape se lee como una ola.
  const step = (to - from) / Math.max(1, words.length);
  const windowSize = step * 2.4;

  return (
    <span className={`block ${className}`}>
      {words.map((word, i) => {
        const start = from + i * step;
        // El solape (windowSize > step) hace que el `end` de la ÚLTIMA
        // palabra caiga bastante después de `to` — con pocas palabras y un
        // `to` cercano a 1 (como "Construimos imperios rentables."), ese
        // `end` terminaba pasando el propio 1.0 del progreso. Como el
        // progreso nunca llega más allá de 1, esa palabra nunca alcanzaba
        // local=1: se quedaba con blur y opacidad residual para siempre, por
        // más que siguieras scrolleando. Clampear el `end` de la última
        // palabra a `to` garantiza que SIEMPRE termine de enfocarse.
        const end = i === words.length - 1 ? to : start + windowSize;
        return (
          <span key={`${word}-${i}`}>
            <ScrubWord word={word} progress={progress} start={start} end={end} color={color} />
            {i < words.length - 1 && " "}
          </span>
        );
      })}
    </span>
  );
}

interface StatementScrubProps {
  eyebrow: string;
  lead: string;
  accent: string;
  framePath?: string;
  frameExt?: string;
  frameCount?: number;
  heightClassName?: string;
}

/**
 * Sección de declaración de marca sobre la corona ditherizada, que avanza
 * frame a frame con el scroll (no se reproduce sola). El bloque mide varias
 * pantallas de alto y el contenido queda pegado mientras la secuencia corre
 * despacio por detrás.
 *
 * Los frames se precargan solo cuando la sección se acerca al viewport: son
 * ~3 MB y no tienen por qué pesar en la carga inicial de la página.
 */
export function StatementScrub({
  eyebrow,
  lead,
  accent,
  framePath = "/scrub/frame_",
  frameExt = "webp",
  frameCount = 62,
  // Mobile achicado a la mitad del recorrido real (200vh - 100svh de sticky
  // = 100vh de scroll antes; 150vh - 100svh = 50vh ahora): en pantallas
  // chicas hacía falta demasiado scroll para terminar de revelar el texto y
  // el frame-scrub de fondo. sm:/lg: quedan igual — el pedido era solo mobile.
  heightClassName = "h-[150vh] sm:h-[240vh] lg:h-[300vh]"
}: StatementScrubProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useRef(0);
  const reduce = useReducedMotion();
  const [active, setActive] = useState(false);

  // Mismo "carril" con física de Metodología, pero con tope más bajo (acá el
  // recorrido es más corto, así que con el tope original alcanzaba con
  // spamear la rueda un segundo para cruzar toda la sección). El primer
  // ajuste bajó demasiado el impulso y aceleró la fricción a la vez — al
  // retomar el scroll después de subir (la velocidad se resetea a 0 al
  // subir, a propósito, para no pelear contra el usuario), casi no quedaba
  // "empuje" con el que reconstruir velocidad, y se sentía trabado en vez de
  // solo lento. Acá el tope sigue bajo, pero el impulso y la fricción vuelven
  // a valores cercanos a los de Metodología para que retomar el scroll no
  // cueste. En la rama de `reduce` el ref nunca se attachea a un elemento,
  // así que el hook queda inerte solo (getBounds da null).
  useScrollLeash(sectionRef, { maxVelocity: 480, frictionPerFrame: 0.91, impulse: 1.8 });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"]
  });

  // Reescala 0→releaseFrac a 0→1 para que tanto el texto como el frame del
  // fondo terminen de armarse ANTES de que el pin (`sticky`) se suelte, nunca
  // durante — ver el comentario en useReleaseFracProgress.ts para el porqué.
  const activeProgress = useReleaseFracProgress(sectionRef, scrollYProgress);

  useMotionValueEvent(activeProgress, "change", (v) => {
    progressRef.current = v;
  });

  // Monta el WebGL y dispara la precarga de los frames con una pantalla de
  // anticipación. Van los dos mecanismos a propósito: el observer resuelve el
  // caso de entrar a la página con el scroll ya en esta sección (recarga a
  // media página, enlace con ancla), y el listener de scroll cubre navegadores
  // donde el observer llega tarde.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    let done = false;
    const activate = () => {
      if (done) return;
      done = true;
      setActive(true);
      window.removeEventListener("scroll", check);
      io.disconnect();
    };
    const check = () => {
      if (done) return;
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 2 && r.bottom > -window.innerHeight) activate();
    };

    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) activate();
    }, { rootMargin: "100% 0px 100% 0px" });
    io.observe(el);

    check();
    window.addEventListener("scroll", check, { passive: true });
    return () => {
      window.removeEventListener("scroll", check);
      io.disconnect();
    };
  }, []);

  // Solo entrada. Antes había un fundido de salida al final del recorrido
  // (0.94→1 bajaba a 0.6) que hacía que el titular empezara a desaparecer justo
  // cuando terminaba de armarse — lo que se busca es que, una vez encendido,
  // quede fijo el resto de la sección.
  const contentOpacity = useTransform(activeProgress, [0, 0.06], [0, 1]);

  const headingClasses =
    "font-headline-lg text-[30px] sm:text-[46px] md:text-[62px] lg:text-[74px] uppercase leading-[1.08] tracking-[-0.02em] max-w-5xl mx-auto text-center font-extrabold";

  if (reduce) {
    return (
      <section className="relative bg-background py-section-padding overflow-hidden">
        <div className="relative max-w-container-max mx-auto px-margin-mobile md:px-gutter text-center">
          <span className="font-label-caps tracking-[0.4em] font-bold block mb-10">{eyebrow}</span>
          <h2 className={headingClasses}>
            <span className="block text-primary">{lead}</span>
            <span className="block mt-3" style={{ color: "rgb(244, 37, 37)" }}>
              {accent}
            </span>
          </h2>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className={`relative bg-background ${heightClassName}`} id="conviccion">
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          {active && (
            <DitherField
              framePath={framePath}
              frameExt={frameExt}
              frameCount={frameCount}
              progressRef={progressRef}
              // Inercia alta: la imagen persigue al scroll en vez de saltar con
              // él. Es lo que hace que se lea como cámara lenta.
              smoothing={0.3}
              colors={DITHER_COLORS}
              pixelSize={4}
              ditherStrength={1}
              contrast={1.25}
              brightness={1.05}
            />
          )}
        </div>

        {/* Oscurecido general: el dither es de alto contraste y el titular
            tiene que ganarle sin subir el texto a un blanco quemado. */}
        <div aria-hidden="true" className="absolute inset-0 z-[1] bg-background/55" />
        <div
          aria-hidden="true"
          className="absolute inset-0 z-[1] pointer-events-none"
          style={{
            background:
              "radial-gradient(100% 100% at 50% 50%, transparent 32%, rgba(19,19,19,0.9) 100%)"
          }}
        />
        {/* Fundidos arriba y abajo: la sección vive entre otras dos oscuras y
            no debe leerse como un recuadro pegado. */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-40 z-[1] pointer-events-none bg-gradient-to-b from-background to-transparent"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-40 z-[1] pointer-events-none bg-gradient-to-t from-background to-transparent"
        />

        <motion.div
          style={{ opacity: contentOpacity }}
          className="relative z-10 w-full max-w-container-max mx-auto px-margin-mobile md:px-gutter text-center"
        >
          {/* Mismo drop-shadow que el eyebrow del hero: sin esto, contra un
              frame claro del dither el gris se lava igual que le pasaba al
              texto del hero antes de aplicárselo ahí. */}
          <span
            className="font-label-caps tracking-[0.4em] font-bold block mb-8 sm:mb-12"
            style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.95)) drop-shadow(0 4px 12px rgba(0,0,0,0.8))" }}
          >
            <ShinyText text={eyebrow} speed={5} color="#8e9192" shineColor="#ffffff" spread={80} />
          </span>

          {/* Ligado a `activeProgress` (no al `scrollYProgress` crudo del
              wrapper completo): así el armado del titular termina ANTES de
              que el bloque `sticky` se desenganche y empiece a deslizarse
              fuera de la pantalla — ver el comentario junto a `activeProgress`
              más arriba. Antes, con `scrollYProgress` directo, el tramo final
              del reveal (después de ~0.6–0.7) ocurría con el bloque ya
              saliendo del viewport: se leía como que el texto "desaparecía". */}
          <h2 className={headingClasses}>
            <ScrubLine text={lead} progress={activeProgress} from={0.04} to={0.46} color="#ffffff" />
            <ScrubLine
              text={accent}
              progress={activeProgress}
              from={0.42}
              to={0.9}
              color="rgb(244, 37, 37)"
              className="mt-3 sm:mt-5"
            />
          </h2>
        </motion.div>
      </div>
    </section>
  );
}
