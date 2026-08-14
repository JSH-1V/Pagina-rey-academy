/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, type RefObject } from "react";
import { useTransform, type MotionValue } from "motion/react";

/**
 * Para una sección pineada (wrapper alto + `sticky top-0 h-[100svh]`
 * adentro): `scrollYProgress` (con `offset: ["start start", "end end"]`)
 * llega a 1 recién cuando el WRAPPER entero termina de pasar — pero el
 * bloque `sticky` se desengancha bastante antes de eso, en cuanto falta
 * exactamente su propia altura para llegar al final del wrapper (así
 * funciona `position: sticky`, no hay forma de evitarlo). Cualquier reveal
 * atado al `scrollYProgress` crudo que todavía esté "en curso" después de
 * ese punto se sigue animando con el bloque ya deslizándose fuera de
 * pantalla — se lee como que el contenido "desaparece" o revela tarde.
 *
 * Este hook mide en vivo cuánto del recorrido corresponde al tramo
 * realmente pineado (`releaseFrac = 1 - viewportH / sectionH`) y reescala
 * `scrollYProgress` para que el 0→1 devuelto siempre termine de completarse
 * ANTES de que el pin se suelte, sea cual sea la altura de la sección o el
 * tamaño de pantalla.
 */
export function useReleaseFracProgress(
  sectionRef: RefObject<HTMLElement>,
  scrollYProgress: MotionValue<number>
): MotionValue<number> {
  const releaseFracRef = useRef(1);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const measure = () => {
      const sectionH = el.offsetHeight;
      const viewportH = window.innerHeight;
      if (sectionH > 0) {
        releaseFracRef.current = Math.max(0.05, Math.min(1, 1 - viewportH / sectionH));
      }
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [sectionRef]);

  return useTransform(scrollYProgress, (v) => Math.min(1, v / releaseFracRef.current));
}
