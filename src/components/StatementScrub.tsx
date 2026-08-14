/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from "react";
import { motion, useTransform, useMotionValueEvent, useReducedMotion, type MotionValue } from "motion/react";
import { DitherField } from "./fx/DitherField";
import ShinyText from "./fx/ShinyText";
import { useAutoPlayOnEnter } from "./useAutoPlayOnEnter";

const DITHER_COLORS: [string, string, string, string] = ["#0d0d0d", "#3a0d0d", "#f42525", "#ffffff"];

/**
 * Una palabra del titular, ligada al progreso automático (no al scroll del
 * usuario — ver `useAutoPlayOnEnter`). El fondo (la corona ditherizada)
 * avanza con el mismo progreso, así que texto y fondo siempre terminan de
 * armarse juntos, sin importar nada de lo que haga el usuario mientras tanto.
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
}

/**
 * Sección de declaración de marca sobre la corona ditherizada. Igual que
 * Metodología (ver useAutoPlayOnEnter.ts): ya no depende de qué tan fuerte
 * scrollee el usuario — calibrar esa velocidad a control remoto resultó
 * imposible (siempre quedaba "muy rápido" o "muy lento" sin punto medio
 * estable). Al entrar en pantalla, el titular + el frame-scrub de fondo se
 * reproducen solos a un ritmo fijo, con el scroll bloqueado mientras dura, y
 * se liberan solos al terminar.
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
  frameCount = 62
}: StatementScrubProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useRef(0);
  const reduce = useReducedMotion();
  const [active, setActive] = useState(false);

  // 4500ms lineales se sentían eternos y, sobre todo, no se podía hacer nada
  // para apurarlos. Ahora el piso son 3000ms y scrollear hacia abajo acelera
  // hasta ~3x, así que el punto medio entre "fluido" y "rápido" lo termina de
  // elegir el usuario en el momento — no hay un número que acertar.
  const activeProgress = useAutoPlayOnEnter(sectionRef, { duration: 3000 });

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
    <section
      ref={sectionRef}
      className="relative bg-background h-[100svh] w-full overflow-hidden flex items-center justify-center"
      id="conviccion"
    >
      <div className="absolute inset-0 z-0">
        {active && (
          <DitherField
            framePath={framePath}
            frameExt={frameExt}
            frameCount={frameCount}
            progressRef={progressRef}
            // Bajado de 0.3s a 0.1s: con 0.3 la corona iba casi un tercio de
            // segundo por detrás del titular, y al terminar el texto todavía
            // seguía acomodándose ~1s más. Se leía como lag, no como cámara
            // lenta, y era parte del "tiempo muerto" del final. Con 0.1 sigue
            // suavizando el salto entre frames pero acompaña al texto.
            smoothing={0.1}
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

        <h2 className={headingClasses}>
          {/* Los dos tramos ahora cubren casi todo el 0→1. Antes el segundo
              cerraba en 0.9: el titular quedaba terminado y todavía faltaba
              un 10% de reproducción con la página bloqueada sin que pasara
              nada visible. El 0.05 que sobra al final es a propósito — un
              respiro corto para leer la frase completa antes de soltar. */}
          <ScrubLine text={lead} progress={activeProgress} from={0.02} to={0.44} color="#ffffff" />
          <ScrubLine
            text={accent}
            progress={activeProgress}
            from={0.4}
            to={0.95}
            color="rgb(244, 37, 37)"
            className="mt-3 sm:mt-5"
          />
        </h2>
      </motion.div>
    </section>
  );
}
