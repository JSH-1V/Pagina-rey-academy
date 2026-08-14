/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, type RefObject } from "react";

/**
 * Scroll con física de "carril": un scroll hacia abajo empuja la página, y
 * después la inercia la sigue empujando sola (con fricción) hasta que se
 * frena, en vez de responder 1:1 al gesto o cortarse en seco. Como un objeto
 * con peso al que le diste un empujón, no un ascensor que obedece cada pixel
 * de la rueda.
 *
 * Mientras el scroll real está dentro del rango pineado de la sección:
 * - Un wheel/touch hacia ABAJO cancela el scroll nativo de ese evento y en
 *   cambio suma un impulso a una velocidad interna (con techo, para que un
 *   scroll agresivo no dispare la página instantáneamente).
 * - Cada frame, esa velocidad mueve `window.scrollY` y decae por fricción —
 *   así sigue "deslizando" un rato después de soltar la rueda, hasta parar.
 * - Un wheel/touch hacia ARRIBA es siempre libre e inmediato, y cancela
 *   cualquier inercia pendiente (para no pelear contra el usuario).
 *
 * Fuera del rango pineado de la sección, es un no-op total — el scroll de
 * el resto de la página nunca se toca.
 */
interface ScrollLeashOptions {
  /** Tope de velocidad (px/s): ningún spam de wheel puede superarlo. */
  maxVelocity?: number;
  /** Fracción de la velocidad que sobrevive cada 1/60s. */
  frictionPerFrame?: number;
  /** Cuánto empuja cada unidad de deltaY de un wheel tick. */
  impulse?: number;
}

export function useScrollLeash(sectionRef: RefObject<HTMLElement>, options: ScrollLeashOptions = {}) {
  const { maxVelocity = 950, frictionPerFrame = 0.9, impulse = 2.4 } = options;

  useEffect(() => {
    const MAX_VELOCITY = maxVelocity;
    const FRICTION_PER_FRAME = frictionPerFrame;
    const IMPULSE = impulse;

    let velocity = 0;
    let lastT = performance.now();
    let raf = 0;

    // Margen de tolerancia en los bordes: `window.scrollTo` puede redondear
    // la posición que le pedimos (subpíxel, DPI, zoom del navegador). Sin
    // este margen, justo en el borde inferior quedaba una trampa: tick()
    // clava el scroll en `bounds.bottom` (con decimales) y pone velocity en
    // 0, pero el navegador guarda un `scrollY` redondeado un pelo por debajo
    // — el siguiente wheel event lee ese `scrollY` ligeramente menor, la
    // comparación `y >= bounds.bottom` da falso, así que el hook sigue
    // pensando que estás "adentro" y vuelve a interceptar el scroll. Eso se
    // repite en cada tick, atrapando el scroll ahí para siempre (se sentía
    // como "extremadamente pesado" o directamente trabado). Con un colchón
    // de unos pocos píxeles en la comparación, un desfasaje de redondeo ya
    // no puede volver a cerrar la trampa.
    const EDGE_EPS = 3;

    const getBounds = () => {
      const el = sectionRef.current;
      if (!el) return null;
      const rect = el.getBoundingClientRect();
      const top = Math.round(rect.top + window.scrollY);
      const scrollable = el.offsetHeight - window.innerHeight;
      return scrollable > 1 ? { top, bottom: top + Math.round(scrollable) } : null;
    };

    const onWheel = (e: WheelEvent) => {
      const bounds = getBounds();
      if (!bounds) return;

      if (e.deltaY < 0) {
        // Hacia arriba: siempre libre, y corta cualquier inercia hacia abajo
        // pendiente para que no se sienta que "pelea" con el usuario.
        velocity = 0;
        return;
      }

      const y = window.scrollY;
      // Todavía no llegó a la sección, o ya la dejó atrás del todo — scroll
      // nativo normal, no intervenir.
      if (y <= bounds.top + EDGE_EPS || y >= bounds.bottom - EDGE_EPS) return;

      e.preventDefault();
      velocity = Math.min(MAX_VELOCITY, velocity + e.deltaY * IMPULSE);
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
        velocity = 0;
        return;
      }

      const y = window.scrollY;
      if (y <= bounds.top + EDGE_EPS || y >= bounds.bottom - EDGE_EPS) return;

      e.preventDefault();
      velocity = Math.min(MAX_VELOCITY, velocity + deltaY * IMPULSE);
    };

    const tick = (t: number) => {
      const dt = Math.min(0.05, (t - lastT) / 1000);
      lastT = t;

      if (Math.abs(velocity) > 0.5) {
        const bounds = getBounds();
        if (bounds) {
          let next = window.scrollY + velocity * dt;
          if (next <= bounds.top) {
            next = bounds.top;
            velocity = 0;
          } else if (next >= bounds.bottom) {
            next = bounds.bottom;
            velocity = 0;
          }
          window.scrollTo(0, Math.round(next));
        }
        // Decaimiento independiente del framerate real (no solo "por frame").
        velocity *= Math.pow(FRICTION_PER_FRAME, dt * 60);
      } else {
        velocity = 0;
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, [sectionRef, maxVelocity, frictionPerFrame, impulse]);
}
