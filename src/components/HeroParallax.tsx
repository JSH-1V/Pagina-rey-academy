/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform, useReducedMotion, type MotionValue } from "motion/react";

/**
 * Hero de parallax por capas. La escena es el interior de la nave del mercado:
 * atmósfera de brasa al fondo, la nave, la corona flotando en el eje, y cadenas
 * en primer plano. Al scrollear la cámara "atraviesa" la nave — cada capa se
 * mueve y escala a distinta velocidad, que es lo único que crea profundidad
 * real; el resto son sombras y viñeta.
 *
 * Todo va sobre `transform` y `opacity` (nunca top/width/height), y el driver
 * es el scroll, no el puntero: la mayoría del tráfico entra desde móvil y ahí
 * no hay hover que valga.
 */

interface HeroParallaxProps {
  children: ReactNode;
  heightClassName?: string;
}

/** Capa de imagen a pantalla completa con encuadre cover. */
function Layer({
  src,
  alt = "",
  y,
  scale,
  opacity,
  className = "",
  style,
  objectPosition = "center"
}: {
  src: string;
  alt?: string;
  y: MotionValue<string> | MotionValue<number>;
  scale: MotionValue<number>;
  opacity?: MotionValue<number>;
  className?: string;
  style?: React.CSSProperties;
  objectPosition?: string;
}) {
  return (
    <motion.div
      aria-hidden={alt === "" ? true : undefined}
      className={`absolute inset-0 ${className}`}
      style={{ y, scale, opacity, willChange: "transform, opacity", ...style }}
    >
      <img
        src={src}
        alt={alt}
        draggable={false}
        className="w-full h-full object-cover select-none pointer-events-none"
        style={{ objectPosition }}
      />
    </motion.div>
  );
}

export function HeroParallax({
  children,
  // Cuanto más alto, más lento el recorrido de la cámara. En móvil se acorta:
  // la misma distancia se siente el doble con el pulgar.
  heightClassName = "h-[190vh] sm:h-[230vh] lg:h-[280vh]"
}: HeroParallaxProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"]
  });

  // --- Capas, de atrás hacia adelante. La diferencia entre estos números ES
  // el efecto: si todas se movieran igual, sería una foto que se desplaza.
  const emberY = useTransform(scrollYProgress, [0, 1], ["0%", "-7%"]);
  const emberScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.25]);
  const emberOpacity = useTransform(scrollYProgress, [0, 0.7, 1], [1, 0.75, 0.25]);

  const skylineY = useTransform(scrollYProgress, [0, 1], ["0%", "-13%"]);
  const skylineScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const skylineOpacity = useTransform(scrollYProgress, [0, 0.45, 0.8], [0.55, 0.3, 0]);

  const hallY = useTransform(scrollYProgress, [0, 1], ["0%", "-4%"]);
  // La nave es la que da la sensación de atravesar: escala fuerte y se apaga.
  const hallScale = useTransform(scrollYProgress, [0, 1], [1, 1.62]);
  const hallOpacity = useTransform(scrollYProgress, [0, 0.62, 0.94], [1, 0.85, 0.1]);

  const crownY = useTransform(scrollYProgress, [0, 1], ["0%", "-18%"]);
  const crownScale = useTransform(scrollYProgress, [0, 0.75, 1], [1, 1.28, 1.5]);
  const crownOpacity = useTransform(scrollYProgress, [0, 0.55, 0.85], [1, 0.9, 0]);

  // El primer plano baja y crece: es lo que pasa "al lado" de la cámara.
  const hooksY = useTransform(scrollYProgress, [0, 1], ["0%", "26%"]);
  const hooksScale = useTransform(scrollYProgress, [0, 1], [1, 1.7]);
  const hooksOpacity = useTransform(scrollYProgress, [0, 0.5, 0.85], [0.85, 0.6, 0]);

  // Contenido: se va antes que la imagen para dejar el remate visual limpio.
  const contentOpacity = useTransform(scrollYProgress, [0, 0.3, 0.55], [1, 1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.55], [0, -80]);
  const contentBlur = useTransform(scrollYProgress, [0.3, 0.55], ["blur(0px)", "blur(10px)"]);

  // Fogonazo de brasa que cubre la costura con la sección siguiente.
  const flareOpacity = useTransform(scrollYProgress, [0.6, 0.92, 1], [0, 0.85, 0.35]);
  const flareScale = useTransform(scrollYProgress, [0.6, 1], [0.4, 2.6]);

  const hintOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);

  // Sin movimiento: una sola composición fija, sin sección de 3 pantallas que
  // solo existe para animar.
  if (reduce) {
    return (
      <header className="relative min-h-[95vh] flex flex-col items-center justify-center text-center px-margin-mobile overflow-hidden pt-24 bg-background">
        <img
          src="/parallax/hall.webp"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover opacity-70"
        />
        <img
          src="/parallax/crown.webp"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-contain scale-[0.62] opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-background/70" />
        <div className="relative z-10 max-w-[1200px] mx-auto flex flex-col items-center">{children}</div>
      </header>
    );
  }

  return (
    <header ref={sectionRef} className={`relative bg-background ${heightClassName}`}>
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden flex flex-col items-center justify-center text-center px-margin-mobile pt-24">
        {/* 1 · Atmósfera de brasa */}
        <Layer src="/parallax/ember.webp" y={emberY} scale={emberScale} opacity={emberOpacity} className="z-0" />

        {/* 2 · Silueta industrial sobre la línea del horizonte. `screen` la
            despega del fondo sin necesidad de recortarla otra vez. */}
        <Layer
          src="/parallax/skyline.webp"
          y={skylineY}
          scale={skylineScale}
          opacity={skylineOpacity}
          className="z-[1]"
          objectPosition="center 78%"
          style={{ filter: "brightness(0.35)" }}
        />

        {/* 3 · La nave del mercado. La máscara funde los bordes con la
            atmósfera para que no se lea como una foto pegada encima. */}
        <Layer
          src="/parallax/hall.webp"
          y={hallY}
          scale={hallScale}
          opacity={hallOpacity}
          className="z-[2]"
          style={{
            maskImage:
              "radial-gradient(125% 115% at 50% 45%, #000 42%, rgba(0,0,0,0.55) 72%, transparent 100%)",
            WebkitMaskImage:
              "radial-gradient(125% 115% at 50% 45%, #000 42%, rgba(0,0,0,0.55) 72%, transparent 100%)"
          }}
        />

        {/* Brasa del punto de fuga: da un foco de luz al fondo del pasillo y
            hace que la corona se recorte contra algo. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 z-[3] pointer-events-none"
          style={{
            background:
              "radial-gradient(28% 22% at 50% 52%, rgba(244,37,37,0.38), rgba(244,37,37,0.10) 45%, transparent 75%)"
          }}
        />

        {/* 4 · La corona */}
        <motion.div
          aria-hidden="true"
          className="absolute inset-0 z-[4] flex items-center justify-center pointer-events-none"
          style={{ y: crownY, scale: crownScale, opacity: crownOpacity, willChange: "transform, opacity" }}
        >
          <img
            src="/parallax/crown.webp"
            alt=""
            draggable={false}
            className="w-[135%] sm:w-[95%] lg:w-[72%] max-w-[1100px] object-contain select-none -translate-y-[6%]"
            // Sube el contraste: hunde los grises sueltos del recorte original
            // y hace que el acero se lea contra la nave oscura.
            style={{
              filter: "contrast(1.14) brightness(0.94) drop-shadow(0 30px 60px rgba(0,0,0,0.75))"
            }}
          />
        </motion.div>

        {/* Viñeta + fundido inferior hacia el fondo de la página */}
        <div
          aria-hidden="true"
          className="absolute inset-0 z-[5] pointer-events-none"
          style={{
            background:
              "radial-gradient(100% 100% at 50% 45%, transparent 38%, rgba(19,19,19,0.82) 100%)"
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-56 z-[5] pointer-events-none bg-gradient-to-t from-background via-background/75 to-transparent"
        />

        {/* Contenido del hero — entre la corona y las cadenas: que algo pase
            POR DELANTE del título es lo que vende la profundidad. */}
        <motion.div
          style={{ opacity: contentOpacity, y: contentY, filter: contentBlur, willChange: "transform, opacity, filter" }}
          className="relative z-[6] max-w-[1200px] mx-auto flex flex-col items-center"
        >
          {children}
        </motion.div>

        {/* 5 · Cadenas y ganchos en primer plano */}
        <Layer
          src="/parallax/hooks.webp"
          y={hooksY}
          scale={hooksScale}
          opacity={hooksOpacity}
          className="z-[7]"
          objectPosition="center top"
          style={{ filter: "brightness(0.5) blur(1.5px)" }}
        />

        {/* 6 · Grano de película, fijo. `screen` deja pasar solo el polvo. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 z-[8] pointer-events-none opacity-[0.35]"
          style={{ mixBlendMode: "screen" }}
        >
          <img src="/parallax/grain.webp" alt="" className="w-full h-full object-cover" />
        </div>

        {/* Fogonazo final: tapa la costura con la sección siguiente */}
        <motion.div
          aria-hidden="true"
          className="absolute inset-0 z-[9] pointer-events-none flex items-center justify-center"
          style={{ opacity: flareOpacity }}
        >
          <motion.div
            className="w-full h-full"
            style={{
              scale: flareScale,
              background:
                "radial-gradient(circle at 50% 50%, rgba(244,37,37,0.55) 0%, rgba(244,37,37,0.18) 30%, transparent 62%)"
            }}
          />
        </motion.div>

        {/* Indicador de scroll */}
        <motion.div
          style={{ opacity: hintOpacity }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 z-[10] flex flex-col items-center gap-2 pointer-events-none"
        >
          <span className="font-label-caps text-[10px] tracking-[0.35em] text-on-surface-variant/60 font-bold uppercase">
            Desliza
          </span>
          <motion.span
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="material-symbols-outlined text-on-surface-variant/60 text-3xl block"
          >
            keyboard_arrow_down
          </motion.span>
        </motion.div>
      </div>
    </header>
  );
}
