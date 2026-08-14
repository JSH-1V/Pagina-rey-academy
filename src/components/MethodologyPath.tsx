/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from "react";
import { motion, useTransform, useReducedMotion, type MotionValue } from "motion/react";
import SpotlightCard from "./fx/SpotlightCard";

interface MethodItem {
  title: string;
  desc: string;
}

interface Point {
  x: number;
  y: number;
}

/** Punto a lo largo de una polilínea, repartido por longitud real de cada
 * tramo (no por índice) — así la chispa viaja a velocidad visual constante
 * en vez de acelerar en los tramos cortos. */
function pointAtProgress(points: Point[], t: number): Point {
  if (points.length === 0) return { x: 0, y: 0 };
  if (points.length === 1) return points[0];

  const segLens: number[] = [];
  let total = 0;
  for (let i = 0; i < points.length - 1; i++) {
    const dx = points[i + 1].x - points[i].x;
    const dy = points[i + 1].y - points[i].y;
    const len = Math.sqrt(dx * dx + dy * dy);
    segLens.push(len);
    total += len;
  }
  if (total === 0) return points[0];

  let target = Math.min(1, Math.max(0, t)) * total;
  for (let i = 0; i < segLens.length; i++) {
    if (target <= segLens[i] || i === segLens.length - 1) {
      const localT = segLens[i] > 0 ? Math.min(1, Math.max(0, target / segLens[i])) : 0;
      return {
        x: points[i].x + (points[i + 1].x - points[i].x) * localT,
        y: points[i].y + (points[i + 1].y - points[i].y) * localT
      };
    }
    target -= segLens[i];
  }
  return points[points.length - 1];
}

/** Umbral de progreso (0–1) al que la línea llega a cada punto, por longitud real. */
function thresholdsOf(points: Point[]): number[] {
  if (points.length === 0) return [];
  const segLens: number[] = [];
  let total = 0;
  for (let i = 0; i < points.length - 1; i++) {
    const dx = points[i + 1].x - points[i].x;
    const dy = points[i + 1].y - points[i].y;
    const len = Math.sqrt(dx * dx + dy * dy);
    segLens.push(len);
    total += len;
  }
  const out = [0];
  let acc = 0;
  for (const len of segLens) {
    acc += len;
    out.push(total > 0 ? acc / total : 1);
  }
  return out;
}

function buildPathD(points: Point[]): string {
  if (points.length === 0) return "";
  const [first, ...rest] = points;
  return `M ${first.x} ${first.y} ` + rest.map((p) => `L ${p.x} ${p.y}`).join(" ");
}

const REVEAL_RAMP = 0.07;

function MethodCard({
  item,
  index,
  cardRef,
  progress,
  threshold
}: {
  item: MethodItem;
  index: number;
  cardRef: (el: HTMLDivElement | null) => void;
  progress: MotionValue<number>;
  threshold: number;
}) {
  const reveal = useTransform(progress, (t) => {
    if (t >= threshold) return 1;
    if (t <= threshold - REVEAL_RAMP) return 0;
    return (t - (threshold - REVEAL_RAMP)) / REVEAL_RAMP;
  });
  const opacity = reveal;
  const scale = useTransform(reveal, [0, 1], [0.82, 1]);
  const rotateX = useTransform(reveal, [0, 1], [30, 0]);
  const clipPath = useTransform(reveal, (r) => `circle(${(r * 75 + 1).toFixed(1)}% at 50% 50%)`);
  const flashOpacity = useTransform(reveal, [0, 0.22, 0.55, 1], [0, 0.9, 0.25, 0]);

  return (
    <div ref={cardRef} className="h-full">
      <motion.div
        style={{
          opacity,
          scale,
          rotateX,
          clipPath,
          transformPerspective: 800,
          willChange: "transform, opacity, clip-path"
        }}
        className="h-full relative"
      >
        <SpotlightCard className="group h-full !bg-background !rounded-2xl !p-5 lg:!p-6" spotlightColor="rgba(255,255,255,0.10)">
          {/* Destello de ignición: se enciende justo cuando la línea toca la tarjeta y se apaga rápido. */}
          <motion.div
            aria-hidden="true"
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{
              opacity: flashOpacity,
              background: "radial-gradient(60% 60% at 50% 50%, rgba(244,37,37,0.35), transparent 72%)"
            }}
          />
          <div className="relative flex items-baseline gap-3 mb-2.5">
            <span
              className="font-display-xl text-[13px] font-extrabold tabular-nums tracking-widest transition-opacity duration-300 opacity-50 group-hover:opacity-100"
              style={{ color: "rgb(244, 37, 37)" }}
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <h4 className="font-headline-md text-[16px] lg:text-[17px] text-primary font-bold">{item.title}</h4>
          </div>
          <span
            aria-hidden="true"
            className="relative block h-[2px] w-7 mb-3 transition-all duration-500 ease-out group-hover:w-16"
            style={{ backgroundColor: "rgb(244, 37, 37)", boxShadow: "0 0 10px rgba(244,37,37,0.5)" }}
          />
          <p className="relative text-[13px] lg:text-sm text-on-surface-variant leading-relaxed">{item.desc}</p>
        </SpotlightCard>
      </motion.div>
    </div>
  );
}

/**
 * Grilla de la Metodología, recorrida por una línea roja pulsante que se
 * dibuja con el scroll: cada tarjeta permanece invisible hasta que la línea
 * la alcanza, momento en el que "enciende" con un iris de apertura + destello
 * + leve caída 3D.
 *
 * La línea conecta los centros REALES de las tarjetas (medidos en el DOM), no
 * coordenadas fijas — por eso funciona igual con 1, 2 o 3 columnas según el
 * breakpoint, sin lógica especial por tamaño de pantalla.
 *
 * `progress` llega desde afuera (0–1): quien la usa es responsable de pinear
 * la sección mientras dura el recorrido — acá adentro solo se dibuja en
 * función de ese número, sin saber nada de scroll.
 */
export function MethodologyPath({ items, progress }: { items: MethodItem[]; progress: MotionValue<number> }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardEls = useRef<(HTMLDivElement | null)[]>([]);
  const pointsRef = useRef<Point[]>([]);
  const [points, setPoints] = useState<Point[]>([]);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;

    const measure = () => {
      const container = containerRef.current;
      if (!container) return;
      const cRect = container.getBoundingClientRect();
      const pts = cardEls.current
        .filter((el): el is HTMLDivElement => !!el)
        .map((el) => {
          const r = el.getBoundingClientRect();
          return { x: r.left - cRect.left + r.width / 2, y: r.top - cRect.top + r.height / 2 };
        });
      pointsRef.current = pts;
      setPoints(pts);
      setSize({ w: cRect.width, h: cRect.height });
    };

    measure();
    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    window.addEventListener("resize", measure);
    // Refonts/imágenes que asienten el layout un poco después del primer paint.
    const t = setTimeout(measure, 400);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
      clearTimeout(t);
    };
  }, [reduce, items.length]);

  const thresholds = thresholdsOf(points);
  const pathD = buildPathD(points);

  const sparkX = useTransform(progress, (t) => pointAtProgress(pointsRef.current, t).x);
  const sparkY = useTransform(progress, (t) => pointAtProgress(pointsRef.current, t).y);
  const sparkOpacity = useTransform(progress, [0, 0.02, 0.97, 1], [0, 1, 1, 0]);

  if (reduce) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map((item, i) => (
          <SpotlightCard key={i} className="h-full !bg-background !rounded-3xl !p-10" spotlightColor="rgba(255,255,255,0.10)">
            <div className="flex items-baseline gap-4 mb-4">
              <span className="font-display-xl text-[15px] font-extrabold tabular-nums tracking-widest" style={{ color: "rgb(244, 37, 37)" }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <h4 className="font-headline-md text-[20px] text-primary font-bold">{item.title}</h4>
            </div>
            <span className="block h-[2px] w-8 mb-5" style={{ backgroundColor: "rgb(244, 37, 37)" }} />
            <p className="text-base text-on-surface-variant leading-relaxed">{item.desc}</p>
          </SpotlightCard>
        ))}
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative">
      {size.w > 0 && (
        <svg
          className="absolute inset-0 pointer-events-none"
          width="100%"
          height="100%"
          viewBox={`0 0 ${size.w} ${size.h}`}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {/* Traza tenue de fondo: muestra el recorrido completo desde el
              principio, para que se entienda que hay un circuito por delante. */}
          <path d={pathD} stroke="rgba(255,255,255,0.08)" strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          {/* Traza roja: se dibuja con el scroll. El wrapper <g> le agrega el
              pulso (parpadeo suave) por encima del draw-in. */}
          <motion.g animate={{ opacity: [1, 0.55, 1] }} transition={{ duration: 1.7, repeat: Infinity, ease: "easeInOut" }}>
            <motion.path
              d={pathD}
              stroke="rgb(244, 37, 37)"
              strokeWidth={2.5}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ pathLength: progress, filter: "drop-shadow(0 0 6px rgba(244,37,37,0.75))" }}
            />
          </motion.g>
          {/* Chispa viajera en la punta de la traza. */}
          <motion.circle r={5.5} fill="#ffffff" style={{ cx: sparkX, cy: sparkY, opacity: sparkOpacity, filter: "drop-shadow(0 0 8px rgba(244,37,37,0.95))" }}>
            <animate attributeName="r" values="5.5;7.5;5.5" dur="1s" repeatCount="indefinite" />
          </motion.circle>
        </svg>
      )}

      {/* 2 columnas incluso en móvil (no 1): esta grilla vive dentro de una
          sección pineada de alto fijo — con 1 sola columna, 6 tarjetas
          apiladas no entrarían nunca en una pantalla y las últimas quedarían
          cortadas por el `overflow-hidden` del contenedor sticky. */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5 lg:gap-8 relative z-10">
        {items.map((item, i) => (
          <MethodCard
            key={i}
            item={item}
            index={i}
            cardRef={(el) => {
              cardEls.current[i] = el;
            }}
            progress={progress}
            threshold={thresholds[i] ?? i / Math.max(1, items.length - 1)}
          />
        ))}
      </div>
    </div>
  );
}
