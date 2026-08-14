/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, type RefObject } from "react";

/**
 * Scroll en pasos fijos, con un piso de tiempo garantizado entre cada uno —
 * a diferencia de `useScrollLeash` (física continua de velocidad/inercia),
 * acá la velocidad de la RUEDA no se traduce en velocidad de scroll: cada
 * empujón hacia abajo dispara SIEMPRE un paso del mismo tamaño, animado en
 * SIEMPRE la misma duración corta, y mientras ese paso está en curso
 * cualquier empujón adicional se ignora (pero el scroll nativo se sigue
 * bloqueando, no se cuela nada). Pasos chicos y rápidos encadenados uno
 * atrás de otro se leen como scroll fluido, no como saltos — un paso grande
 * cada vez sí se lee como un salto, por eso el tamaño importa más que la
 * duración total.
 *
 * El rango que gobierna NO es el alto completo de la sección: `sticky`
 * (position: sticky) se desengancha físicamente bastante antes del final
 * del wrapper — el mismo cálculo de `releaseFrac` que usa
 * `useReleaseFracProgress` para el reveal. Sin este ajuste, el paso a paso
 * seguía "gobernando" el scroll durante todo el resto del wrapper después
 * de que el contenido ya había terminado de revelarse — se sentía como una
 * zona muerta, trabada, sin pasar nada, antes de que la página soltara la
 * sección. Acotar el rango del stepper a ese mismo `releaseFrac` hace que
 * termine exactamente cuando el reveal termina, y lo que queda del recorrido
 * (donde el `sticky` ya se está soltando) vuelve a ser scroll libre.
 *
 * Un wheel/touch hacia ARRIBA es siempre libre e inmediato (cancela
 * cualquier paso en curso). Fuera del rango, no-op total.
 */
interface ScrollStepperOptions {
  /** Tamaño fijo de cada paso, en píxeles. Chico = se lee fluido. */
  stepPx?: number;
  /** Cuánto tarda en animarse cada paso (ms). También actúa como cooldown
   *  mínimo antes de aceptar el siguiente empujón. */
  stepDuration?: number;
}

export function useScrollStepper(sectionRef: RefObject<HTMLElement>, options: ScrollStepperOptions = {}) {
  const { stepPx = 55, stepDuration = 190 } = options;

  useEffect(() => {
    const EDGE_EPS = 3;

    const getBounds = () => {
      const el = sectionRef.current;
      if (!el) return null;
      const rect = el.getBoundingClientRect();
      const top = Math.round(rect.top + window.scrollY);
      const viewportH = window.innerHeight;
      const sectionH = el.offsetHeight;
      const scrollable = sectionH - viewportH;
      if (scrollable <= 1) return null;
      const releaseFrac = Math.max(0.05, Math.min(1, 1 - viewportH / sectionH));
      return { top, bottom: top + Math.round(scrollable * releaseFrac) };
    };

    let stepRaf = 0;
    let animating = false;
    let cooldownUntil = 0;

    const cancelStep = () => {
      cancelAnimationFrame(stepRaf);
      animating = false;
    };

    const animateStepTo = (target: number) => {
      const startY = window.scrollY;
      const startT = performance.now();
      animating = true;

      const frame = (now: number) => {
        const t = Math.min(1, (now - startT) / stepDuration);
        // Ease-out suave: un paso tan chico no necesita frenada dramática,
        // solo lo justo para no sentirse mecánico.
        const eased = 1 - (1 - t) * (1 - t);
        window.scrollTo(0, Math.round(startY + (target - startY) * eased));
        if (t < 1) {
          stepRaf = requestAnimationFrame(frame);
        } else {
          animating = false;
        }
      };
      cancelAnimationFrame(stepRaf);
      stepRaf = requestAnimationFrame(frame);
    };

    const tryStep = (bounds: { top: number; bottom: number }) => {
      const now = performance.now();
      if (animating || now < cooldownUntil) return;
      const y = window.scrollY;
      const target = Math.min(bounds.bottom, y + stepPx);
      cooldownUntil = now + stepDuration;
      animateStepTo(target);
    };

    const onWheel = (e: WheelEvent) => {
      const bounds = getBounds();
      if (!bounds) return;

      if (e.deltaY < 0) {
        cancelStep();
        return;
      }

      const y = window.scrollY;
      if (y <= bounds.top + EDGE_EPS || y >= bounds.bottom - EDGE_EPS) return;

      e.preventDefault();
      tryStep(bounds);
    };

    let lastTouchY = 0;
    const onTouchStart = (e: TouchEvent) => {
      lastTouchY = e.touches[0]?.clientY ?? 0;
    };
    const onTouchMove = (e: TouchEvent) => {
      const yPos = e.touches[0]?.clientY ?? lastTouchY;
      const deltaY = lastTouchY - yPos; // arrastrar el dedo hacia arriba = scrollear hacia abajo
      lastTouchY = yPos;

      const bounds = getBounds();
      if (!bounds) return;

      if (deltaY < 0) {
        cancelStep();
        return;
      }

      const y = window.scrollY;
      if (y <= bounds.top + EDGE_EPS || y >= bounds.bottom - EDGE_EPS) return;

      e.preventDefault();
      tryStep(bounds);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });

    return () => {
      cancelAnimationFrame(stepRaf);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, [sectionRef, stepPx, stepDuration]);
}
