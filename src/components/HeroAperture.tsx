/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from "react";

interface HeroApertureProps {
  /** Imagen de póster / fallback (la actual sirve hasta tener el video). */
  posterSrc: string;
  /**
   * Clip de INTRO: la apertura iris abriéndose sobre la corona.
   * Se reproduce UNA vez al cargar. La apertura vive dentro del video,
   * no la hace la página. Opcional (dejá `public/hero/`).
   */
  introWebm?: string;
  introMp4?: string;
  /**
   * Clip de LOOP: la corona girando en bucle sin fin.
   * Arranca cuando termina el intro (o directo si no hay intro).
   * Su primer frame debe coincidir con el último del intro (corona de frente)
   * para que el corte sea invisible.
   */
  loopWebm?: string;
  loopMp4?: string;
}

/**
 * Fondo del hero. Con material real: reproduce el intro (con la apertura
 * baked-in) y luego el loop de la corona. Sin material: muestra el póster
 * con una apertura iris hecha por CSS (placeholder). Degrada con gracia y
 * respeta `prefers-reduced-motion`.
 */
export function HeroAperture({
  posterSrc,
  introWebm,
  introMp4,
  loopWebm,
  loopMp4,
}: HeroApertureProps) {
  const hasIntro = !!(introWebm || introMp4);
  const hasLoop = !!(loopWebm || loopMp4);
  const hasVideo = hasIntro || hasLoop;

  // Fase: si hay intro, arranca en "intro"; si no, directo al "loop".
  const [phase, setPhase] = useState<"intro" | "loop">(hasIntro ? "intro" : "loop");
  const [videoFailed, setVideoFailed] = useState(false);

  const introRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = introRef.current;
    if (!v) return;
    const onError = () => setVideoFailed(true);
    v.addEventListener("error", onError);
    return () => v.removeEventListener("error", onError);
  }, []);

  const showVideo = hasVideo && !videoFailed;
  // La apertura CSS se aplica siempre que NO haya un clip de intro con la
  // apertura ya horneada en los píxeles. Si hay intro, la apertura vive
  // 100% en el video y la página no agrega nada encima.
  const showCssIris = !hasIntro;

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <div className={`absolute inset-0 ${showCssIris ? "hero-aperture-reveal" : ""}`}>
        {showVideo ? (
          <>
            {hasIntro && phase === "intro" && (
              <video
                ref={introRef}
                className="w-full h-full object-cover"
                autoPlay
                muted
                playsInline
                poster={posterSrc}
                onEnded={() => hasLoop && setPhase("loop")}
              >
                {introWebm && <source src={introWebm} type="video/webm" />}
                {introMp4 && <source src={introMp4} type="video/mp4" />}
              </video>
            )}

            {hasLoop && (phase === "loop" || !hasIntro) && (
              <video
                className="w-full h-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                poster={posterSrc}
              >
                {loopWebm && <source src={loopWebm} type="video/webm" />}
                {loopMp4 && <source src={loopMp4} type="video/mp4" />}
              </video>
            )}
          </>
        ) : (
          <div
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url("${posterSrc}")` }}
          />
        )}

        {/* Glow rojo de marca sobre la escena */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(120% 90% at 50% 0%, rgba(244,37,37,0.16), transparent 55%)",
          }}
        />
      </div>

      {/* Degradado para fundir con la página */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50 pointer-events-none" />
    </div>
  );
}
