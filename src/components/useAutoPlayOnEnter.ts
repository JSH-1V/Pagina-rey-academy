/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef } from "react";
import { useMotionValue, type MotionValue } from "motion/react";
import type { RefObject } from "react";

/**
 * Progreso 0→1 para las secciones que se "reproducen" mientras la página
 * queda quieta (Metodología y Nuestra Convicción).
 *
 * Historia corta de por qué está hecho así: primero el progreso estuvo atado
 * al scroll (física de velocidad, después pasos fijos) y nunca hubo un número
 * que funcionara — dependía de cuántos eventos de `wheel` dispara cada
 * dispositivo. Después pasó a ser un temporizador puro, que arregló eso pero
 * trajo el problema opuesto: durante toda la reproducción el usuario podía
 * scrollear todo lo que quisiera y no pasaba absolutamente nada, así que la
 * página se sentía colgada.
 *
 * Esta versión combina las dos ideas y evita las dos fallas:
 *
 * - Hay un **piso de velocidad garantizado**: aunque el usuario no toque
 *   nada, la animación termina sola en `duration` ms. Nunca se puede quedar
 *   trabada, que era el defecto del modelo atado al scroll.
 * - Scrollear hacia abajo **acelera** la reproducción (hasta `maxSpeed`×) en
 *   vez de ser ignorado. El que tiene prisa empuja y avanza; el que no,
 *   ve la animación completa. Eso es lo que elimina la sensación de "tiempo
 *   muerto": todo scroll produce una respuesta visible, siempre.
 * - Scrollear hacia **arriba** corta y libera al instante, y además termina
 *   de revelar el contenido (antes lo dejaba congelado a medias para
 *   siempre, porque la sección no se vuelve a reproducir).
 *
 * Detalles que importan para que se sienta fluido:
 *
 * - Dispara cuando el techo de la sección ya está casi en el techo del
 *   viewport (`startOffset`), no cuando está a media pantalla — así el
 *   ajuste de encuadre es de unos pocos píxeles en vez de medio viewport, y
 *   se deja de sentir como un tirón de cámara.
 * - Al bloquear el scroll con `overflow:hidden` desaparece la barra de
 *   scroll y toda la página se corre unos píxeles en horizontal. Se compensa
 *   con un `padding-right` del mismo ancho mientras dura el bloqueo.
 * - La curva de tiempo tiene arranque suave pero **termina a velocidad
 *   plena**: una cola lenta al final se lee como que la sección "no se
 *   decide a terminar", que es justo lo que hay que evitar.
 */
interface AutoPlayOnEnterOptions {
  /** Duración a velocidad normal, en ms (si el usuario no scrollea nada). */
  duration?: number;
  /** Multiplicador máximo de velocidad cuando el usuario empuja hacia abajo. */
  maxSpeed?: number;
  /**
   * Qué tan cerca del techo del viewport tiene que estar el techo de la
   * sección para arrancar, como fracción del alto de pantalla.
   */
  startOffset?: number;
}

/** Cuánto tarda el empujón de un scroll en desvanecerse, en segundos. */
const BOOST_DECAY = 0.5;
/** Tramo inicial (en fracción de la curva) con arranque suave. */
const EASE_IN_SPAN = 0.16;
const EASE_NORM = 1 - EASE_IN_SPAN / 2;

/**
 * Arranque suave, final seco. `t*t*(3-2t)` y demás curvas simétricas suavizan
 * también el final, y eso acá es un defecto: las últimas palabras/tarjetas
 * entrarían cada vez más despacio y la espera hasta la liberación se leería
 * como tiempo muerto.
 */
function easeStartOnly(t: number): number {
  const v = t < EASE_IN_SPAN ? (t * t) / (2 * EASE_IN_SPAN) : t - EASE_IN_SPAN / 2;
  return Math.min(1, Math.max(0, v / EASE_NORM));
}

export function useAutoPlayOnEnter(
  sectionRef: RefObject<HTMLElement>,
  options: AutoPlayOnEnterOptions = {}
): MotionValue<number> {
  const { duration = 2800, maxSpeed = 2.3, startOffset = 0.14 } = options;
  const progress = useMotionValue(0);
  const playedRef = useRef(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const reduce =
      typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      progress.set(1);
      return;
    }

    let raf = 0;
    let safety = 0;
    let locked = false;
    let prevOverflow = "";
    let prevPaddingRight = "";
    /** 0–1: cuánto está empujando el usuario ahora mismo. Decae solo. */
    let boost = 0;
    let lastTouchY = 0;

    // --- bloqueo de scroll -------------------------------------------------

    const lock = () => {
      if (locked) return;
      locked = true;
      prevOverflow = document.body.style.overflow;
      prevPaddingRight = document.body.style.paddingRight;
      const widthBefore = document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      // Con `scrollbar-gutter: stable` (index.css) el hueco de la barra queda
      // reservado y nada se mueve al ocultarla — medido: nav, hero y el
      // contenido de la sección conservan exactamente su ancho. Ahí NO hay
      // que compensar nada (`clientWidth` igual reporta +8px, pero es solo el
      // dato, no un desplazamiento real: compensarlo corría el contenido 8px
      // para el otro lado). El relleno queda solo como respaldo para los
      // navegadores sin soporte, donde el salto sí es real.
      const hasGutter =
        typeof CSS !== "undefined" && CSS.supports?.("scrollbar-gutter", "stable");
      if (!hasGutter) {
        const grew = document.documentElement.clientWidth - widthBefore;
        if (grew > 0) document.body.style.paddingRight = `${grew}px`;
      }
      // `overflow:hidden` solo no frena el touch-scroll en iOS/Safari, por eso
      // además se interceptan los eventos directamente.
      window.addEventListener("wheel", onWheel, { passive: false });
      window.addEventListener("touchstart", onTouchStart, { passive: true });
      window.addEventListener("touchmove", onTouchMove, { passive: false });
    };

    const unlock = () => {
      clearTimeout(safety);
      if (!locked) return;
      locked = false;
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPaddingRight;
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
    };

    // --- entrada del usuario durante la reproducción -----------------------

    /**
     * Un scroll hacia abajo no se descarta: se convierte en velocidad. La
     * ganancia es deliberadamente baja frente al decaimiento (`BOOST_DECAY`)
     * para que haya matiz: un scroll suelto acelera un poco, y solo empujar
     * de verdad y sostenido llega a `maxSpeed`. Con una ganancia alta, el
     * simple hecho de venir scrolleando de la sección anterior ya saturaba el
     * multiplicador y la animación se veía siempre a la máxima velocidad.
     */
    const pushForward = (delta: number) => {
      boost = Math.min(1, boost + Math.min(1, Math.abs(delta) / 220) * 0.33);
    };

    const onWheel = (e: WheelEvent) => {
      if (e.deltaY < 0) {
        abort();
        return;
      }
      e.preventDefault();
      pushForward(e.deltaY);
    };

    const onTouchStart = (e: TouchEvent) => {
      lastTouchY = e.touches[0]?.clientY ?? 0;
    };

    const onTouchMove = (e: TouchEvent) => {
      const y = e.touches[0]?.clientY ?? lastTouchY;
      // Arrastrar el dedo hacia arriba (dy > 0) es "bajar en la página".
      const dy = lastTouchY - y;
      lastTouchY = y;
      if (dy < -6) {
        abort();
        return;
      }
      e.preventDefault();
      pushForward(dy * 2.2);
    };

    // --- reproducción ------------------------------------------------------

    /** Sale de la secuencia dejando el contenido revelado del todo. */
    const abort = () => {
      cancelAnimationFrame(raf);
      unlock();
      // Sin esto el titular quedaba congelado a medio encender para siempre:
      // la sección ya está marcada como reproducida y no vuelve a arrancar,
      // así que al volver a bajar se veía media frase borrosa.
      const from = progress.get();
      if (from >= 1) return;
      const start = performance.now();
      const settle = (now: number) => {
        const t = Math.min(1, (now - start) / 320);
        progress.set(from + (1 - from) * (1 - (1 - t) * (1 - t)));
        if (t < 1) raf = requestAnimationFrame(settle);
      };
      raf = requestAnimationFrame(settle);
    };

    const runReveal = () => {
      let elapsed = 0;
      let last = performance.now();
      const frame = (now: number) => {
        const dt = Math.min(0.05, (now - last) / 1000);
        last = now;
        boost = Math.max(0, boost - dt / BOOST_DECAY);
        const speed = 1 + boost * (maxSpeed - 1);
        elapsed += dt * 1000 * speed;
        const t = Math.min(1, elapsed / duration);
        progress.set(easeStartOnly(t));
        if (t < 1) {
          raf = requestAnimationFrame(frame);
        } else {
          // Se libera en el mismo frame en que el contenido termina: cualquier
          // espera extra acá es exactamente el "tiempo muerto" que se quiere
          // evitar.
          unlock();
        }
      };
      raf = requestAnimationFrame(frame);
    };

    const play = () => {
      if (playedRef.current) return;
      playedRef.current = true;
      lock();
      // Red de seguridad de reloj de pared, igual que en PageOpening: si el
      // usuario deja la pestaña en segundo plano a mitad de la reproducción,
      // `requestAnimationFrame` se congela y el bloqueo de scroll se quedaría
      // puesto indefinidamente. Pase lo que pase, a los pocos segundos se
      // libera y el contenido queda revelado del todo.
      safety = window.setTimeout(() => {
        cancelAnimationFrame(raf);
        unlock();
        progress.set(1);
      }, duration + 6000);

      // Ajuste de encuadre. Como se dispara con la sección casi alineada, la
      // distancia es de unas decenas de píxeles: la duración se calcula sobre
      // esa distancia en vez de ser fija, así nunca se ve como un salto.
      const startY = window.scrollY;
      const targetY = Math.round(startY + el.getBoundingClientRect().top);
      const dist = targetY - startY;
      if (Math.abs(dist) < 2) {
        runReveal();
        return;
      }
      const alignDuration = Math.min(280, 90 + Math.abs(dist) * 0.9);
      const alignStart = performance.now();
      const alignFrame = (now: number) => {
        const t = Math.min(1, (now - alignStart) / alignDuration);
        const eased = 1 - (1 - t) * (1 - t);
        window.scrollTo(0, Math.round(startY + dist * eased));
        if (t < 1) {
          raf = requestAnimationFrame(alignFrame);
        } else {
          runReveal();
        }
      };
      raf = requestAnimationFrame(alignFrame);
    };

    // --- disparo -----------------------------------------------------------

    // Se mira la posición real en vez de un `IntersectionObserver` con
    // threshold: lo que importa acá no es "qué fracción se ve" sino "qué tan
    // lejos está el techo de la sección del techo del viewport", que es
    // exactamente lo que decide si el ajuste de encuadre se nota o no.
    let lastY = window.scrollY;
    const check = () => {
      if (playedRef.current) return;
      const y = window.scrollY;
      const goingUp = y < lastY;
      lastY = y;
      // Nada se dispara mientras el usuario sube. Entrar a la sección desde
      // abajo y que se bloquee el scroll para reproducir una animación sería
      // exactamente pelear contra alguien que está volviendo atrás.
      if (goingUp) return;

      const vh = window.innerHeight;
      const top = el.getBoundingClientRect().top;
      if (top <= vh * startOffset && top > -vh * 0.2) {
        window.removeEventListener("scroll", check);
        play();
        return;
      }
      // Pasó de largo bajando (scroll muy rápido, ancla, recarga a media
      // página): no tiene sentido tirarlo para atrás, pero tampoco puede
      // quedarse la sección a medio revelar.
      if (top <= -vh * 0.2) {
        playedRef.current = true;
        progress.set(1);
        window.removeEventListener("scroll", check);
      }
    };

    window.addEventListener("scroll", check, { passive: true });
    check();

    return () => {
      window.removeEventListener("scroll", check);
      cancelAnimationFrame(raf);
      clearTimeout(safety);
      unlock();
    };
  }, [sectionRef, duration, maxSpeed, startOffset, progress]);

  return progress;
}
