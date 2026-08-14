/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import SpotlightCard from "./fx/SpotlightCard";
import type { ServiceItem } from "../data";

/**
 * Tarjeta de servicio con resumen + detalle desplegable.
 *
 * Antes el botón "VER MÁS" no hacía nada porque la tarjeta ya mostraba todo
 * el texto. Ahora la descripción se corta en 3 líneas y el botón realmente
 * despliega/pliega, cambiando a "VER MENOS" con la flecha invertida.
 */
export function ServiceCard({ service }: { service: ServiceItem }) {
  const [open, setOpen] = useState(false);

  // Primera oración como resumen siempre visible; el resto es el detalle.
  const firstStop = service.description.indexOf(". ");
  const summary =
    firstStop > 0 ? service.description.slice(0, firstStop + 1) : service.description;
  const detail =
    firstStop > 0 ? service.description.slice(firstStop + 2) : "";

  return (
    <SpotlightCard
      className="group h-full !bg-background !p-8 sm:!p-10 flex flex-col justify-between"
      spotlightColor="rgba(255,255,255,0.12)"
    >
      <div>
        <span className="material-symbols-outlined text-primary text-4xl mb-8 block w-fit transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
          {service.icon}
        </span>
        <h3 className="font-headline-md text-[22px] sm:text-headline-md text-primary font-bold mb-4">
          {service.title}
        </h3>

        <p className="font-body-md text-on-surface-variant leading-relaxed">
          {summary}
        </p>

        <AnimatePresence initial={false}>
          {open && detail && (
            <motion.div
              key="detail"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <p className="font-body-md text-on-surface-variant leading-relaxed pt-4">
                {detail}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {detail && (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="mt-8 text-primary font-label-caps text-[12px] flex items-center gap-2 font-bold tracking-widest w-fit cursor-pointer transition-all duration-300 hover:gap-4"
        >
          {open ? "VER MENOS" : "VER MÁS"}
          <motion.span
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="material-symbols-outlined text-base"
          >
            arrow_downward
          </motion.span>
        </button>
      )}
    </SpotlightCard>
  );
}
