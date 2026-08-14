/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Topography from "./fx/Topography";
import LightRays from "./fx/LightRays";
import { DitherField } from "./fx/DitherField";
import DarkVeil from "./fx/DarkVeil";
import Plasma from "./fx/Plasma";
import LineWaves from "./fx/LineWaves";
import Ferrofluid from "./fx/Ferrofluid";

// Referencias estables — varios componentes vendored (React Bits) incluyen
// props de tipo array directamente en su dependency array interno. Si acá se
// pasara un literal `[...]` inline, cada re-render del padre generaría una
// referencia nueva y el efecto de esos componentes se reiniciaría en bucle
// sin llegar nunca a pintar un frame (el bug real detrás de la pantalla negra).
const DITHER_COLORS: [string, string, string, string] = ["#0d0d0d", "#3a0d0d", "#f42525", "#ffffff"];
// Misma rampa pero sin rojo: negro → gris carbón → gris claro → blanco.
const DITHER_BW_COLORS: [string, string, string, string] = ["#000000", "#3d3d3d", "#a8a8a8", "#ffffff"];
const FERROFLUID_COLORS = ["#f42525", "#ffffff", "#7a1414"];

export type HeroVariant =
  | "fusion"
  | "dither"
  | "dither-bw"
  | "parallax"
  | "dark-veil"
  | "plasma"
  | "line-waves"
  | "ferrofluid";

/**
 * Capas comunes a todas las variantes: brasa roja de marca anclada arriba +
 * viñeta + fundido inferior hacia el fondo de la página. Así la comparación
 * entre variantes es justa — solo cambia el patrón, no el "marco".
 */
export function HeroFrame({ mono = false }: { mono?: boolean } = {}) {
  return (
    <>
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: mono
            ? "radial-gradient(120% 80% at 50% -10%, rgba(255,255,255,0.10), transparent 62%)"
            : "radial-gradient(120% 80% at 50% -10%, rgba(244,37,37,0.22), transparent 62%)"
        }}
      />
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(100% 100% at 50% 50%, transparent 40%, rgba(19,19,19,0.75) 100%)"
        }}
      />
      <div className="absolute inset-x-0 bottom-0 h-48 z-0 pointer-events-none bg-gradient-to-t from-background via-background/70 to-transparent" />
    </>
  );
}

export function HeroBackground({ variant }: { variant: HeroVariant }) {
  if (variant === "dither" || variant === "dither-bw") {
    const bw = variant === "dither-bw";
    return (
      <>
        {/* La corona, vestida con dither Bayer ordenado — el video real
            sampleado y cuantizado a la paleta REY (negro, rojo, blanco), o a
            una rampa puramente monocroma en la variante "bw". */}
        <div className="absolute inset-0 z-0">
          <DitherField
            videoSrc="/hero/hero-crown.mp4"
            posterSrc="/hero/hero-crown-poster.webp"
            colors={bw ? DITHER_BW_COLORS : DITHER_COLORS}
            pixelSize={4}
            ditherStrength={1}
            contrast={1.25}
            brightness={1.05}
          />
        </div>
        {/* Scrim sobre toda la franja de texto. El dither es de altísimo
            contraste (celdas blancas puras) justo donde va el copy, y ni el
            drop-shadow del texto alcanzaba: el párrafo quedaba ilegible. Se
            usa un degradado sólido y no `backdrop-filter` a propósito —
            desenfocar en cada frame de scroll ya causó un problema de
            rendimiento serio en este proyecto. */}
        <div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(72% 58% at 50% 52%, rgba(6,6,6,0.86) 0%, rgba(6,6,6,0.62) 45%, rgba(6,6,6,0.25) 70%, transparent 85%)"
          }}
        />
        <HeroFrame mono={bw} />
      </>
    );
  }

  if (variant === "dark-veil") {
    return (
      <>
        <div className="absolute inset-0 z-0">
          {/* hueShift calibrado empíricamente para que el CPPN base
              (violeta/azul de fábrica) caiga en rojo de marca. */}
          <DarkVeil
            hueShift={-120}
            noiseIntensity={0.06}
            scanlineIntensity={0.08}
            scanlineFrequency={0.8}
            speed={0.35}
            warpAmount={0.12}
            resolutionScale={1}
          />
        </div>
        <HeroFrame />
      </>
    );
  }

  if (variant === "plasma") {
    return (
      <>
        {/* Plasma renderiza con alpha:true — sin este respaldo negro sólido
            detrás, la transparencia deja ver el fondo de la página (#131313,
            gris), no negro puro. */}
        <div className="absolute inset-0 z-0 bg-black">
          <Plasma
            color="#f42525"
            speed={0.6}
            direction="forward"
            scale={1.3}
            opacity={1}
            mouseInteractive={false}
          />
        </div>
        <HeroFrame />
      </>
    );
  }

  if (variant === "line-waves") {
    return (
      <>
        <div className="absolute inset-0 z-0 bg-black">
          <LineWaves
            speed={0.25}
            innerLineCount={28}
            outerLineCount={32}
            warpIntensity={1.1}
            rotation={-45}
            colorCycleSpeed={0.4}
            brightness={0.32}
            color1="#f42525"
            color2="#ffffff"
            color3="#7a1414"
            enableMouseInteraction={true}
            mouseInfluence={1.6}
          />
        </div>
        <HeroFrame />
      </>
    );
  }

  if (variant === "ferrofluid") {
    return (
      <>
        <div className="absolute inset-0 z-0 bg-black">
          <Ferrofluid
            colors={FERROFLUID_COLORS}
            backgroundColor="#000000"
            speed={0.45}
            scale={1.5}
            turbulence={0.9}
            fluidity={0.12}
            rimWidth={0.22}
            sharpness={2.8}
            shimmer={1.2}
            glow={1.8}
            flowDirection="up"
            mouseInteraction={true}
          />
        </div>
        <HeroFrame />
      </>
    );
  }

  // "fusion" — variante original: Topography + LightRays
  return (
    <>
      <div className="absolute inset-0 z-0 opacity-[0.55]">
        <Topography
          lowColor="#1a0d0d"
          midColor="#7a1414"
          highColor="#f42525"
          speed={0.18}
          morphAmount={2.2}
          bands={2.4}
          thickness={0.008}
          scale={1.15}
          glow={0.65}
          contrast={2.6}
          brightness={0.85}
          grain={true}
          opacity={0.75}
        />
      </div>
      <div className="absolute inset-0 z-0">
        <LightRays
          raysOrigin="top-center"
          raysColor="#ffffff"
          raysSpeed={0.7}
          lightSpread={0.7}
          rayLength={2.4}
          fadeDistance={1.4}
          saturation={0.6}
          followMouse={true}
          mouseInfluence={0.08}
          noiseAmount={0.06}
          distortion={0.02}
        />
      </div>
      <HeroFrame />
    </>
  );
}
