/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { ProgramBooking } from "../data";

interface ScheduleModalProps {
  product: ProgramBooking | null;
  onClose: () => void;
}

export function ScheduleModal({ product, onClose }: ScheduleModalProps) {
  useEffect(() => {
    if (!product) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [product, onClose]);

  const isConfigured = !!product && !product.calendarEmbedUrl.startsWith("REEMPLAZAR_URL");

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label={`Agendar llamada — ${product.productName}`}
        >
          <motion.div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="relative w-full max-w-4xl max-h-[90vh] bg-surface-container-low rounded-[24px] border overflow-hidden flex flex-col shadow-2xl"
            style={{ borderColor: product.accentColorSoft }}
          >
            <div
              className="flex items-center justify-between gap-4 px-6 sm:px-8 py-6 border-b border-white/5 flex-shrink-0"
              style={{ backgroundColor: product.accentColorSoft }}
            >
              <div>
                <span
                  className="font-label-caps text-[10px] font-bold tracking-widest uppercase block mb-1"
                  style={{ color: product.accentColor }}
                >
                  {product.badgeText}
                </span>
                <h3 className="font-headline-md text-[18px] sm:text-[22px] font-extrabold uppercase text-primary leading-tight">
                  Agendar llamada · {product.productName}
                </h3>
              </div>
              <button
                onClick={onClose}
                aria-label="Cerrar"
                className="w-10 h-10 flex-shrink-0 rounded-full flex items-center justify-center text-primary hover:bg-white/10 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto min-h-[600px] bg-white">
              {isConfigured ? (
                <iframe
                  src={product.calendarEmbedUrl}
                  title={`Agendar llamada — ${product.productName}`}
                  className="w-full h-full min-h-[600px] border-0"
                />
              ) : (
                <div className="w-full h-full min-h-[600px] flex flex-col items-center justify-center text-center px-8 bg-surface-container-low">
                  <span
                    className="material-symbols-outlined text-5xl mb-6"
                    style={{ color: product.accentColor }}
                  >
                    calendar_month
                  </span>
                  <p className="font-body-md text-on-surface-variant max-w-sm">
                    El calendario de <span className="font-bold text-primary">{product.productName}</span> todavía no está conectado. Mientras tanto, escribinos a{" "}
                    <a href="mailto:info@mg.reyacademy.com" className="underline hover:text-primary">
                      info@mg.reyacademy.com
                    </a>{" "}
                    para coordinar tu llamada.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
