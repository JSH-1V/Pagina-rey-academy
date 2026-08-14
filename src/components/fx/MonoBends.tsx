/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { CSSProperties } from "react";
import "./MonoBends.css";

interface MonoBendsProps {
  /** Desenfoque en móvil/desktop, px. Por defecto, el original (70/100). */
  blur?: number;
  blurMd?: number;
  /** Multiplicador de opacidad de los 4 blobs (1 = original). */
  opacity?: number;
}

/**
 * Fondo de "bandas" de color en flujo lento — la versión monocromática (blanco
 * y negro puro, sin nada de rojo) del efecto "Color Bends" que suelen usar
 * los sitios de agencias premium: unos pocos blobs grandes muy desenfocados
 * que derivan despacio unos sobre otros, mezclándose por transparencia.
 *
 * CSS puro (radial-gradient + blur + keyframes), no WebGL — para un fondo
 * decorativo detrás de una grilla de tarjetas no vale la pena el costo de un
 * canvas nuevo. Respeta `prefers-reduced-motion` (los blobs quedan fijos).
 *
 * `blur`/`opacity` son opcionales — sin pasarlos, el resultado es idéntico al
 * original (que quedó demasiado sutil para leerse como "animado" detrás de
 * una grilla de tarjetas sólidas); se usan para subir la intensidad puntual
 * sin tocar el look en los sitios donde ya se usa tal cual.
 */
export function MonoBends({ blur, blurMd, opacity }: MonoBendsProps = {}) {
  const vars: CSSProperties = {
    ...(blur !== undefined && { "--mb-blur": `${blur}px` }),
    ...(blurMd !== undefined && { "--mb-blur-md": `${blurMd}px` }),
    ...(opacity !== undefined && { "--mb-opacity": opacity })
  } as CSSProperties;

  return (
    <div className="mono-bends" aria-hidden="true" style={vars}>
      <div className="mono-bends__blob mono-bends__blob--a" />
      <div className="mono-bends__blob mono-bends__blob--b" />
      <div className="mono-bends__blob mono-bends__blob--c" />
      <div className="mono-bends__blob mono-bends__blob--d" />
    </div>
  );
}
