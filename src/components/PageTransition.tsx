/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { ReactNode } from "react";
import { motion } from "motion/react";

/**
 * Transición de página al estilo Swup (fade + rise), pero implementada con
 * Motion para no pelearse con react-router.
 *
 * Swup está pensado para sitios multi-página: intercepta el click, hace fetch
 * del HTML de la página destino y reemplaza contenedores. En una SPA con
 * react-router ambos querrían controlar la navegación al mismo tiempo, así que
 * el equivalente idiomático (y el que produce exactamente el mismo efecto
 * visual) es animar la salida/entrada de cada ruta con AnimatePresence.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/** Velo que barre la pantalla durante el cambio de ruta. */
export function PageTransitionVeil() {
  return (
    <motion.div
      initial={{ scaleY: 1 }}
      animate={{ scaleY: 0 }}
      exit={{ scaleY: 1 }}
      transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
      style={{ transformOrigin: "top" }}
      className="fixed inset-0 z-[200] bg-background pointer-events-none"
    />
  );
}
