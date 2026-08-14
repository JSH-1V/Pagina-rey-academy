/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useRef, type ReactNode, type CSSProperties } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** translateY inicial (px). */
  y?: number;
  /** blur inicial (px). */
  blur?: number;
  /** escala inicial (1 = sin escala). */
  scale?: number;
  /**
   * Rango de scroll donde ocurre el reveal, en sintaxis de `useScroll` offset.
   * Por defecto: empieza cuando el borde superior del elemento entra al 90%
   * del viewport y termina cuando llega al 50% (centro-alto).
   */
  start?: string;
  end?: string;
  id?: string;
}

/**
 * Reveal ligado al scroll (scrubbed): el elemento sube, se desvanece y se
 * desenfoca en función de su posición de scroll — no es un on/off de
 * `whileInView`. Reversible al subir. Respeta `prefers-reduced-motion`.
 */
export function ScrollReveal({
  children,
  className,
  style,
  y = 34,
  blur = 5,
  scale = 1,
  start = "start 0.9",
  end = "start 0.55",
  id,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: [start, end] as never,
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const ty = useTransform(scrollYProgress, [0, 1], [y, 0]);
  const sc = useTransform(scrollYProgress, [0, 1], [scale, 1]);
  const filter = useTransform(
    scrollYProgress,
    [0, 1],
    [`blur(${blur}px)`, "blur(0px)"]
  );

  if (reduce) {
    return (
      <div ref={ref} id={id} className={className} style={style}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      id={id}
      className={className}
      style={{
        ...style,
        opacity,
        y: ty,
        scale: scale !== 1 ? sc : undefined,
        filter,
        willChange: "transform, opacity, filter",
      }}
    >
      {children}
    </motion.div>
  );
}
