import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FAQS } from "../data";

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      {FAQS.map((faq, i) => {
        const isOpen = openIndex === i;
        return (
          <motion.div
            key={i}
            className="bg-surface-container-low rounded-2xl border border-white/5 overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: faq.delay }}
          >
            <button
              onClick={() => toggle(i)}
              className="w-full p-8 text-left cursor-pointer flex justify-between items-center transition-colors hover:bg-white/[0.02]"
              aria-expanded={isOpen}
            >
              <span className="font-bold text-primary text-base sm:text-lg">{faq.question}</span>
              <motion.span
                className="material-symbols-outlined text-primary text-2xl select-none"
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.3, ease: [0.2, 1, 0.3, 1] }}
              >
                expand_more
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.2, 1, 0.3, 1] }}
                >
                  <div className="px-8 pb-8 text-on-surface-variant text-sm sm:text-base leading-relaxed border-t border-white/[0.02] pt-4">
                    {faq.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
