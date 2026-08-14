/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";

/**
 * Animación de apertura de la página — sin texto.
 *
 * Secuencia: pantalla negra → una línea roja se dibuja desde el centro →
 * la línea se expande verticalmente en un haz de luz → dos paneles se separan
 * revelando la página. Todo dura ~2.1s.
 *
 * Respeta `prefers-reduced-motion`: si está activo, no bloquea nada.
 */
export function PageOpening({ onDone }: { onDone?: () => void }) {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (reduce) {
      setOpen(false);
      onDone?.();
      return;
    }
    const t = setTimeout(() => {
      setOpen(false);
      onDone?.();
    }, 2100);
    return () => clearTimeout(t);
  }, [reduce, onDone]);

  if (reduce) return null;

  const panel = {
    initial: { y: 0 },
    exit: (dir: number) => ({
      y: dir * -100 + "%",
      transition: { duration: 0.85, ease: [0.76, 0, 0.24, 1] as const }
    })
  };

  return (
    <AnimatePresence>
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

          {/* Línea roja que se dibuja y luego se expande en un haz */}
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{
                width: ["0%", "42%", "42%", "100%"],
                opacity: [0, 1, 1, 0]
              }}
              transition={{
                duration: 1.9,
                times: [0, 0.42, 0.68, 1],
                ease: [0.76, 0, 0.24, 1]
              }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
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
              transition={{ duration: 1.9, times: [0, 0.72, 1], ease: "easeOut" }}
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(60% 100% at 50% 50%, rgba(244,37,37,0.30), transparent 70%)",
                transformOrigin: "center"
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
