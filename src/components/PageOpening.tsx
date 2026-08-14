/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import Orb from "./fx/Orb";

/**
 * Animación de apertura de la página — sin texto.
 *
 * Mientras la página carga en segundo plano (fuentes, recursos, primer
 * render), se ve un ícono chico y centrado (`Orb`) girando solo, sin texto,
 * y el scroll real queda bloqueado — así nadie scrollea "compitiendo" con la
 * carga, y ninguna sección de más abajo llega a activar su reveal-on-scroll
 * antes de tiempo mientras está tapada. Apenas la página está lista (con un
 * techo duro de 4s para que una conexión mala nunca trabe a nadie), el Orb
 * da paso a la secuencia ya existente: una línea roja se dibuja desde el
 * centro → se expande en un haz de luz → dos paneles se separan revelando
 * la página.
 *
 * Respeta `prefers-reduced-motion`: si está activo, no bloquea nada — ni
 * gate, ni scroll, la página queda interactiva al toque.
 */
export function PageOpening({ onDone }: { onDone?: () => void }) {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(true);
  const [ready, setReady] = useState(false);
  const scrollLockCleanupRef = useRef<() => void>(() => {});

  useEffect(() => {
    if (!reduce) return;
    setOpen(false);
    onDone?.();
  }, [reduce, onDone]);

  // Bloqueo de scroll real: `overflow:hidden` solo no alcanza en iOS/Safari
  // (no frena el touch-scroll), así que además se intercepta wheel/touch
  // directamente — mismo patrón usado en useAutoPlayOnEnter.ts. Se libera
  // en `onExitComplete` de abajo, no con el cleanup normal de este efecto:
  // HomeV2 nunca desmonta este componente, así que un cleanup atado a `[]`
  // nunca se dispararía solo porque `open` pase a false.
  useEffect(() => {
    if (reduce) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const block = (e: Event) => e.preventDefault();
    window.addEventListener("wheel", block, { passive: false });
    window.addEventListener("touchmove", block, { passive: false });
    scrollLockCleanupRef.current = () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("wheel", block);
      window.removeEventListener("touchmove", block);
    };
    // Red de seguridad absoluta: pase lo que pase con la secuencia de arriba
    // (`ready`/`open`/`onExitComplete`), el scroll nunca debe quedar
    // bloqueado más que unos segundos. 8s da margen de sobra sobre el peor
    // caso diseñado (4s de techo duro + 1.45s de trazo + ~1s de salida de
    // los paneles ≈ 6.5s) sin arriesgar que alguien quede atrapado si algo
    // de la secuencia normal no dispara. Llamar la limpieza dos veces es
    // inofensivo.
    const safety = setTimeout(() => scrollLockCleanupRef.current(), 8000);
    return () => {
      clearTimeout(safety);
      scrollLockCleanupRef.current();
    };
  }, [reduce]);

  // Señal de "listo": fuentes + recursos de la página + un mínimo visible
  // (para que el Orb no sea solo un flash en conexiones rápidas), contra un
  // techo duro de 4s — lo que llegue primero gana, así nunca queda trabado
  // esperando en una conexión mala.
  useEffect(() => {
    if (reduce) return;
    let cancelled = false;
    const minDelay = new Promise<void>((r) => setTimeout(r, 500));
    const fontsReady = document.fonts?.ready ?? Promise.resolve();
    const pageLoaded =
      document.readyState === "complete"
        ? Promise.resolve()
        : new Promise<void>((r) => window.addEventListener("load", () => r(), { once: true }));
    const hardCap = new Promise<void>((r) => setTimeout(r, 4000));

    Promise.race([Promise.all([minDelay, fontsReady, pageLoaded]), hardCap]).then(() => {
      if (!cancelled) setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, [reduce]);

  // Recién cuando está "listo" arranca el trazo + paneles. Acortado de
  // 2100ms a 1450ms (y el trazo de 1.9s a 1.3s más abajo) — la apertura se
  // sentía larga.
  useEffect(() => {
    if (reduce || !ready) return;
    const t = setTimeout(() => setOpen(false), 1450);
    return () => clearTimeout(t);
  }, [reduce, ready]);

  // Segunda red de seguridad, independiente de `ready`: si por lo que sea
  // la señal de "listo" nunca llegara, el overlay se cierra solo igual — no
  // debe quedar un ícono de carga girando para siempre en pantalla.
  useEffect(() => {
    if (reduce) return;
    const t = setTimeout(() => setOpen(false), 6000);
    return () => clearTimeout(t);
  }, [reduce]);

  if (reduce) return null;

  const panel = {
    initial: { y: 0 },
    exit: (dir: number) => ({
      y: dir * -100 + "%",
      transition: { duration: 0.85, ease: [0.76, 0, 0.24, 1] as const }
    })
  };

  return (
    <AnimatePresence
      onExitComplete={() => {
        scrollLockCleanupRef.current();
        onDone?.();
      }}
    >
      {open && (
        <motion.div
          className="fixed inset-0 z-[300] pointer-events-none"
          aria-hidden="true"
        >
          {/* Panel superior */}
          <motion.div
            custom={1}
            variants={panel}
            initial="initial"
            exit="exit"
            className="absolute inset-x-0 top-0 h-1/2 bg-background"
          />
          {/* Panel inferior */}
          <motion.div
            custom={-1}
            variants={panel}
            initial="initial"
            exit="exit"
            className="absolute inset-x-0 bottom-0 h-1/2 bg-background"
          />

          {/* AnimatePresence propio para el cambio Orb → trazo: sin esto, el
              `exit` del Orb no corría (no hay boundary que lo espere) y React
              lo desmontaba en el mismo tick — el cleanup de `Orb` saca el
              canvas del DOM y fuerza la pérdida del contexto WebGL
              (`loseContext()`), y ese corte instantáneo se veía como un
              cuadrado en blanco de un frame antes de desaparecer. Con
              `mode="wait"`, el Orb primero se desvanece a opacity 0 y RECIÉN
              ENTONCES se desmonta — cuando el cleanup corre, ya es invisible. */}
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
            <AnimatePresence mode="wait">
              {!ready ? (
                <motion.div
                  key="orb"
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.4 }}
                  className="w-16 h-16 sm:w-20 sm:h-20"
                  style={{ filter: "drop-shadow(0 0 22px rgba(244,37,37,0.35))" }}
                >
                  <Orb hue={0} hoverIntensity={0} rotateOnHover={false} backgroundColor="#131313" />
                </motion.div>
              ) : (
                <motion.div
                  key="line"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.25 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  {/* Línea roja que se dibuja y luego se expande en un haz */}
                  <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{
                      width: ["0%", "42%", "42%", "100%"],
                      opacity: [0, 1, 1, 0]
                    }}
                    transition={{
                      duration: 1.3,
                      times: [0, 0.42, 0.68, 1],
                      ease: [0.76, 0, 0.24, 1]
                    }}
                    className="h-[2px] relative"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent, #f42525 18%, #ffffff 50%, #f42525 82%, transparent)",
                      boxShadow: "0 0 24px rgba(244,37,37,0.85), 0 0 60px rgba(244,37,37,0.35)"
                    }}
                  />
                  {/* Destello vertical al final del trazo */}
                  <motion.div
                    initial={{ scaleY: 0, opacity: 0 }}
                    animate={{ scaleY: [0, 0, 1], opacity: [0, 0, 0.5] }}
                    transition={{ duration: 1.3, times: [0, 0.72, 1], ease: "easeOut" }}
                    className="absolute inset-0"
                    style={{
                      background:
                        "radial-gradient(60% 100% at 50% 50%, rgba(244,37,37,0.30), transparent 70%)",
                      transformOrigin: "center"
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
