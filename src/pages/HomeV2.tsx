/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform, type Variants } from "motion/react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  NAV_LINKS,
  WHAT_IS_CARDS,
  SERVICES,
  TIMELINE_STEPS,
  STATS,
  TESTIMONIAL_VIDEOS,
  PROGRAM_BOOKINGS,
  type ProgramBooking
} from "../data";
import { FaqAccordion } from "../components/FaqAccordion";
import { VideoTestimonialCarousel } from "../components/VideoTestimonialCarousel";
import { ScheduleModal } from "../components/ScheduleModal";
import { ScrollReveal } from "../components/ScrollReveal";
import { PageOpening } from "../components/PageOpening";
import { ServiceCard } from "../components/ServiceCard";
import { HeroBackground, type HeroVariant } from "../components/HeroBackground";
import { HeroParallax } from "../components/HeroParallax";
import { ParallaxCard } from "../components/ParallaxCard";
import { StatementScrub } from "../components/StatementScrub";
// Animaciones (React Bits · MIT) adaptadas al branding REY
import BlurText from "../components/fx/BlurText";
import ShinyText from "../components/fx/ShinyText";
import CountUp from "../components/fx/CountUp";
import ScrollFloat from "../components/fx/ScrollFloat";
import GradientText from "../components/fx/GradientText";
import VariableProximity from "../components/fx/VariableProximity";
import SpotlightCard from "../components/fx/SpotlightCard";
import ClickSpark from "../components/fx/ClickSpark";
import BorderGlow from "../components/fx/BorderGlow";
import StarBorder from "../components/fx/StarBorder";
import LogoLoop from "../components/fx/LogoLoop";
import { MonoBends } from "../components/fx/MonoBends";
import Topography from "../components/fx/Topography";
import LightRays from "../components/fx/LightRays";
import Plasma from "../components/fx/Plasma";
import { MethodologyPath } from "../components/MethodologyPath";
import { useScrollLeash } from "../components/useScrollLeash";
import SplitText from "../components/fx/SplitText";
import AnimatedContent from "../components/fx/AnimatedContent";

// Idempotente — ScrollFloat también lo registra, pero no hay que depender del
// orden de imports para que esté disponible cuando corre el refresh de abajo.
gsap.registerPlugin(ScrollTrigger);

// Los 3 programas insignia — se usan en el marquee justo debajo del hero.
const PROGRAM_NAMES = ["Máquina del Éxito", "Nitro Branding", "Maestría de la Carne"];

const METHOD_ITEMS = [
  { title: "Aprender Haciendo", desc: "No somos teóricos. Cada lección se basa en la práctica real del mostrador." },
  { title: "Implementación Inmediata", desc: "Lo que aprendes hoy lo aplicas mañana para ver resultados en caja." },
  { title: "Acompañamiento", desc: "Nunca caminas solo; nuestro equipo de soporte está siempre disponible." },
  { title: "Medición", desc: "Lo que no se mide no se mejora. Auditoría constante de KPIS." },
  { title: "Automatización", desc: "Creamos sistemas que trabajan para ti, no al revés." },
  { title: "Escalabilidad", desc: "Diseñado para crecer de una carnicería de barrio a un imperio." }
];

// Comunidad (solo dither): la primera versión usaba la metáfora de una
// tarjeta de crédito (chip, campos tipo carnet) — se sentía como que el
// mensaje era "nos importa el dinero", que no es lo que la marca quiere
// transmitir, y el borde animado (ElectricBorder) se veía disforme. Esta
// versión mantiene el panel oscuro con textura diagonal (eso sí funcionaba),
// pero sin ningún lenguaje de tarjeta/billetera: es un panel editorial con
// una declaración corta + los mismos datos reales como lista, con
// `SpotlightCard` (glow de cursor sutil, ya probado y aprobado en el resto
// del sitio) en vez de un borde animado.
function CommunityPersonalityPanel() {
  const items = [
    { icon: "calendar_month", text: "12 meses de comunidad y acompañamiento" },
    { icon: "co_present", text: "8 semanas de mentoría grupal en vivo" },
    { icon: "person", text: "Con Elbio Prida y expertos" }
  ];

  return (
    <SpotlightCard className="relative w-full !p-0" spotlightColor="rgba(244,37,37,0.16)">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-br from-[rgb(30,19,19)] via-[rgb(17,12,12)] to-black"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-[0.05]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(115deg, #fff 0px, #fff 1px, transparent 1px, transparent 14px)"
        }}
      />

      <div className="relative px-8 py-12 sm:px-12 sm:py-14">
        <span
          className="material-symbols-outlined text-4xl block mb-6"
          style={{ color: "rgb(244, 37, 37)" }}
        >
          diversity_3
        </span>
        <h3 className="font-headline-md text-2xl sm:text-[28px] font-extrabold uppercase text-white leading-tight mb-10">
          No estás solo en esto.
        </h3>

        <ul>
          {items.map((item, i) => (
            <li
              key={item.text}
              className={`flex items-center gap-4 py-5 ${i > 0 ? "border-t border-white/10" : ""}`}
            >
              <span
                className="material-symbols-outlined text-2xl flex-shrink-0"
                style={{ color: "rgb(244, 37, 37)" }}
              >
                {item.icon}
              </span>
              <span className="font-body-md font-bold text-lg text-white">{item.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </SpotlightCard>
  );
}

export default function HomeV2({ heroVariant = "fusion" }: { heroVariant?: HeroVariant }) {
  // Ronda de ajustes pedida solo para las variantes dither — las demás
  // conservan el diseño de secciones que ya tenían antes de esta sesión.
  // `dither-bw` es la misma página, solo cambia la paleta del hero.
  const isDither = heroVariant === "dither" || heroVariant === "dither-bw";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeBooking, setActiveBooking] = useState<ProgramBooking | null>(null);
  const ctaContainerRef = useRef<HTMLDivElement>(null);
  // Metodología (solo dither): la sección se pinea mientras la línea roja
  // recorre las 6 tarjetas, y recién se suelta cuando termina.
  const methodSectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress: methodProgress } = useScroll({
    target: methodSectionRef,
    offset: ["start start", "end end"]
  });
  // Scroll con física de carril: un empujón hacia abajo y la inercia sigue
  // moviendo la página sola (con fricción) hasta frenar, en vez de responder
  // 1:1 al gesto o de bloquear en seco. Como el scroll real ya queda
  // gobernado por esta física, `methodProgress` (que lo sigue) hereda el
  // mismo ritmo — no hace falta un segundo valor "suavizado" aparte.
  useScrollLeash(methodSectionRef);
  const methodHeaderOpacity = useTransform(methodProgress, [0, 0.05], [0, 1]);

  // Monitor scroll for header background opacity
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Red de seguridad además del fix de limpieza en ScrollFloat: cada
  // ScrollTrigger cachea la posición de scroll de su título en el momento en
  // que se crea. Si algo debajo cambia de alto después (fuentes recién
  // cargadas, imágenes sin aspect-ratio reservado), esa posición queda vieja.
  // Refrescar una vez que la página se asienta corrige todos los ScrollTrigger
  // de golpe, sin tener que perseguir cada caso a mano.
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    document.fonts?.ready?.then(refresh).catch(() => {});
    const t1 = setTimeout(refresh, 1200);
    const t2 = setTimeout(refresh, 3000);
    return () => {
      window.removeEventListener("load", refresh);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  // Reveal animation presets
  const revealUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.2, 1, 0.3, 1] }
    }
  };

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // El contenido del hero es idéntico en todas las variantes; lo que cambia es
  // el envoltorio (hero fijo de 95vh vs. sección alta con scrub de frames).
  const heroContent = (
    <>
      {/* drop-shadow solo en dither: el eyebrow y el subtítulo se perdían
          contra las celdas claras del video ditherizado, igual que le pasaba
          al H1 (ver comentario más abajo). */}
      <motion.span
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="font-label-caps text-[11px] sm:text-[12px] tracking-[0.4em] mb-8 flex items-center justify-center gap-4 font-bold uppercase"
        style={isDither ? { filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.95)) drop-shadow(0 4px 12px rgba(0,0,0,0.8))" } : undefined}
      >
        {isDither && (
          <motion.span
            aria-hidden="true"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="hidden sm:block w-8 h-px bg-white/30 origin-right"
          />
        )}
        <ShinyText
          text="ACADEMIA #1 DEL SECTOR CÁRNICO EN LATAM"
          speed={4}
          color="#8e9192"
          shineColor="#ffffff"
          spread={90}
        />
        {isDither && (
          <motion.span
            aria-hidden="true"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="hidden sm:block w-8 h-px bg-white/30 origin-left"
          />
        )}
      </motion.span>

      {/* drop-shadow (no text-shadow): BlurText particiona el texto en spans
          por palabra, así que un filter en el contenedor es lo único que da
          una sombra unificada a todo el bloque. Sin esto, el blanco del
          título se mezclaba con las celdas claras del fondo dither. */}
      <h1
        className="font-display-xl text-[40px] sm:text-[56px] md:text-[68px] lg:text-display-xl text-primary mb-stack-lg leading-[1.05] sm:leading-[0.95] font-extrabold uppercase text-white break-words"
        style={{
          filter:
            "drop-shadow(0 2px 3px rgba(0,0,0,0.9)) drop-shadow(0 10px 30px rgba(0,0,0,0.7))"
        }}
      >
        <BlurText
          text="Domina el mercado"
          delay={90}
          animateBy="words"
          direction="top"
          className="justify-center"
        />
        <BlurText
          text="Multiplica tu ROI"
          delay={90}
          animateBy="words"
          direction="top"
          className="justify-center"
        />
      </h1>

      {/* Sobre el dither el gris `on-surface-variant` desaparecía entre las
          celdas claras: acá el texto va en blanco puro, con un peso más y una
          sombra de contorno cerrada (2px) que lo despega del patrón. */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.9 }}
        className={`font-body-lg text-[16px] sm:text-body-lg max-w-2xl mx-auto mb-10 sm:mb-12 ${
          isDither ? "text-white font-semibold" : "text-on-surface-variant font-medium"
        }`}
        style={
          isDither
            ? {
                textShadow:
                  "0 0 2px rgba(0,0,0,0.98), 0 1px 3px rgba(0,0,0,0.95), 0 4px 18px rgba(0,0,0,0.9)"
              }
            : undefined
        }
      >
        Formamos a dueños de negocios cárnicos que buscan rentabilidad, libertad operativa y resultados desde el primer día.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 1.1 }}
        className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center w-full sm:w-auto px-4 sm:px-0"
      >
        <motion.a
          href="#programas"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="bg-primary text-background px-8 sm:px-12 py-5 sm:py-6 font-label-caps text-label-caps font-extrabold tracking-[0.2em] rounded-full w-full sm:w-auto shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(255,255,255,0.25)] transition-shadow duration-300 cursor-pointer inline-flex items-center justify-center"
          id="hero-btn-empezar"
        >
          QUIERO SABER MÁS
        </motion.a>

        <StarBorder
          as="a"
          href="https://plataforma.reyacademy.com/login"
          target="_blank"
          rel="noopener noreferrer"
          color="#f42525"
          speed="4s"
          className="cursor-pointer"
        >
          <span className="font-label-caps text-[12px] font-extrabold tracking-[0.2em] uppercase">
            Acceder a la academia
          </span>
        </StarBorder>
      </motion.div>
    </>
  );

  return (
    <ClickSpark sparkColor="#ffffff" sparkSize={9} sparkRadius={18} sparkCount={8} duration={450}>
    <PageOpening />
    <div className="bg-background text-on-surface font-sans overflow-x-clip max-w-[100vw] selection:bg-white selection:text-black">

      {/* Navigation */}
      <nav 
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b ${
          isScrolled 
            ? "bg-background/90 backdrop-blur-md border-white/5 py-4" 
            : "bg-transparent border-transparent py-6"
        }`}
        id="navbar"
      >
        <div className="flex justify-between items-center w-full px-margin-mobile md:px-gutter max-w-container-max mx-auto">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="font-headline-md text-[18px] sm:text-[22px] font-extrabold text-primary flex items-center gap-3 whitespace-nowrap flex-shrink-0"
          >
            REY ACADEMY
          </motion.div>

          {/* Desktop Navigation Links */}
          <div className="hidden xl:flex items-center gap-7">
            {NAV_LINKS.map((link, idx) => (
              <motion.a
                key={link.label}
                href={link.href}
                className="text-primary font-label-caps text-[13px] hover:text-white transition-colors tracking-wide font-extrabold whitespace-nowrap relative group"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full" />
              </motion.a>
            ))}
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            {/* CTA Button */}
            <motion.a
              href="https://plataforma.reyacademy.com/login"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="bg-primary text-background px-4 sm:px-5 py-2.5 font-label-caps text-[10px] sm:text-[11px] rounded-full tracking-wide font-extrabold shadow-[0_0_20px_rgba(255,255,255,0.15)] cursor-pointer inline-flex items-center justify-center"
              id="cta-acceder"
            >
              <span className="sm:hidden">ACCEDER</span>
              <span className="hidden sm:inline">ACCEDER A LA ACADEMIA</span>
            </motion.a>

            {/* Mobile Hamburger menu */}
            <button 
              className="xl:hidden flex items-center justify-center w-9 h-9 text-primary cursor-pointer select-none" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              id="mobile-menu-toggle"
            >
              <span className="material-symbols-outlined text-3xl">
                {mobileMenuOpen ? "close" : "menu"}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile menu Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="xl:hidden bg-background/98 backdrop-blur-md border-t border-white/5 px-margin-mobile py-6 flex flex-col gap-1 overflow-hidden"
              id="mobile-menu-drawer"
            >
              {NAV_LINKS.map((link) => (
                <a 
                  key={link.label} 
                  href={link.href} 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-primary font-label-caps text-[13px] py-3 border-b border-white/5 tracking-wide font-extrabold hover:text-white transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section — fondo animado WebGL en lugar de video.
          La variante "parallax" es otra cosa: una escena por capas que ocupa
          varias pantallas de scroll, así que trae su propio envoltorio. */}
      {heroVariant === "parallax" ? (
        <HeroParallax>{heroContent}</HeroParallax>
      ) : (
      <header className="relative min-h-[95vh] flex flex-col items-center justify-center text-center px-margin-mobile overflow-hidden pt-24">
        <HeroBackground variant={heroVariant} />

        <div className="relative z-10 max-w-[1200px] mx-auto flex flex-col items-center">
          {heroContent}
        </div>

        {/* Indicador de scroll */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.8 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
        >
          <motion.span
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="material-symbols-outlined text-on-surface-variant/50 text-3xl block"
          >
            keyboard_arrow_down
          </motion.span>
        </motion.div>
      </header>
      )}

      {/* Programs Marquee — LogoLoop: bucle continuo por rAF, con degradados
          en los bordes para que los nombres nazcan y mueran en el fondo en vez
          de cortarse de golpe, y pausa al pasar el mouse. Los 3 programas
          insignia, con un punto de brasa como separador entre cada uno. */}
      <section className="py-12 bg-surface-container-lowest border-y border-white/5 overflow-hidden">
        <LogoLoop
          logos={PROGRAM_NAMES.flatMap((name: string, i: number) => [
            {
              node: (
                <span className="font-black text-lg sm:text-2xl tracking-tighter uppercase italic select-none whitespace-nowrap text-on-surface-variant/40 hover:text-on-surface-variant/90 transition-colors duration-300">
                  {name}
                </span>
              ),
              title: name,
              ariaLabel: name
            },
            {
              node: (
                <span
                  aria-hidden="true"
                  className="w-2 h-2 rounded-full inline-block"
                  style={{ backgroundColor: "rgb(244, 37, 37)" }}
                />
              ),
              title: `separador-${i}`,
              ariaLabel: ""
            }
          ])}
          speed={55}
          direction="left"
          logoHeight={28}
          gap={56}
          pauseOnHover
          scaleOnHover
          fadeOut
          fadeOutColor="#0e0e0e"
          ariaLabel="Nuestros programas: Máquina del Éxito, Nitro Branding, Maestría de la Carne"
        />
      </section>

      {/* What is Rey Academy Section */}
      <section className="py-section-padding bg-background" id="nosotros">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-gutter">
          <div className="text-center mb-20">
            <ScrollReveal>
              <span className="font-label-caps tracking-[0.4em] mb-4 block font-bold">
                <ShinyText text="TU NUEVA FORMA DE DIRIGIR UN NEGOCIO" speed={5} color="#8e9192" shineColor="#ffffff" spread={80} />
              </span>
            </ScrollReveal>
            <h2 className="font-headline-lg text-[30px] sm:text-[38px] md:text-headline-lg text-primary font-extrabold uppercase mb-8">
              <ScrollFloat as="span" containerClassName="!m-0 block" scrollStart="center bottom+=40%" scrollEnd="bottom bottom-=30%" stagger={0.022}>
                ¿Qué es Rey Academy?
              </ScrollFloat>
            </h2>
            <ScrollReveal>
              <p className="font-body-lg text-on-surface-variant max-w-3xl mx-auto font-medium">
                Somos la única academia dedicada exclusivamente a dueños de carnicería de toda Latinoamérica.
              </p>
              <p className="font-headline-md text-[20px] text-primary font-extrabold mt-6 max-w-2xl mx-auto">
                No es enseñar a cortar carne, es aprender a ser empresario
              </p>
            </ScrollReveal>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8" style={{ perspective: isDither ? 1000 : undefined }}>
            {WHAT_IS_CARDS.map((card, i) =>
              isDither ? (
                // Entrada 3D — la tarjeta se "abre" hacia el visitante en vez
                // de solo desvanecerse, y el ícono rebota justo después.
                <motion.div
                  key={i}
                  className="h-full"
                  initial={{ opacity: 0, rotateX: -35, y: 24 }}
                  whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.65, delay: (i % 4) * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <SpotlightCard className="h-full !p-8" spotlightColor="rgba(255,255,255,0.10)">
                    <motion.span
                      initial={{ scale: 0.6, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true, amount: 0.4 }}
                      transition={{ type: "spring", stiffness: 300, damping: 12, delay: (i % 4) * 0.08 + 0.25 }}
                      className="material-symbols-outlined text-primary text-5xl mb-6 block"
                    >
                      {card.icon}
                    </motion.span>
                    <h4 className="font-headline-md text-[20px] text-primary font-bold mb-4">
                      {card.title}
                    </h4>
                    <p className="font-body-md text-base text-on-surface-variant opacity-80">
                      {card.description}
                    </p>
                  </SpotlightCard>
                </motion.div>
              ) : (
                <ScrollReveal key={i} className="h-full" end={`start ${0.6 - (i % 4) * 0.03}`}>
                  <SpotlightCard className="h-full !p-8" spotlightColor="rgba(255,255,255,0.10)">
                    <span className="material-symbols-outlined text-primary text-5xl mb-6 block">
                      {card.icon}
                    </span>
                    <h4 className="font-headline-md text-[20px] text-primary font-bold mb-4">
                      {card.title}
                    </h4>
                    <p className="font-body-md text-base text-on-surface-variant opacity-80">
                      {card.description}
                    </p>
                  </SpotlightCard>
                </ScrollReveal>
              )
            )}
          </div>

          <ScrollReveal className="flex justify-center mt-16">
            <motion.a
              href="https://inscripcion.reyacademy.com/nitro_sales_2026-page"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="bg-primary text-background px-10 py-5 font-label-caps text-label-caps font-extrabold tracking-[0.2em] rounded-full cursor-pointer inline-flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.25)] transition-shadow duration-300"
            >
              QUIERO NITRO AHORA
            </motion.a>
          </ScrollReveal>
        </div>
      </section>

      {/* Services Section — textura de rejilla sutil de fondo */}
      <section className="py-section-padding bg-surface-container-lowest relative overflow-hidden" id="servicios">
        {/* Fondo con shader real (Topography, el mismo del hero "fusion" pero
            regrisado) en vez de blobs CSS desenfocados — el blur de un blob
            grande lo aplana todo a un degradé liso e imperceptible; un shader
            de líneas mantiene contraste visible incluso muy tenue. */}
        {isDither && (
          // Máscara en degradé: el shader se apaga solo hacia arriba/abajo del
          // 16% de la sección, así no corta en seco contra las secciones
          // vecinas (que además tienen un tono de fondo levemente distinto).
          <div
            className="absolute inset-0 z-0 pointer-events-none"
            style={{
              maskImage: "linear-gradient(to bottom, transparent, black 16%, black 84%, transparent)",
              WebkitMaskImage: "linear-gradient(to bottom, transparent, black 16%, black 84%, transparent)"
            }}
          >
            <Topography
              lowColor="#161616"
              midColor="#4a4a4a"
              highColor="#ededed"
              speed={0.16}
              morphAmount={2.4}
              bands={2.6}
              thickness={0.009}
              scale={1.2}
              glow={0.5}
              contrast={2.4}
              brightness={0.9}
              grain={true}
              opacity={0.3}
            />
          </div>
        )}
        {/* Rejilla técnica + brasa lateral: da profundidad sin robar atención */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
            maskImage: "radial-gradient(120% 80% at 50% 0%, #000 25%, transparent 75%)",
            WebkitMaskImage: "radial-gradient(120% 80% at 50% 0%, #000 25%, transparent 75%)"
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(70% 50% at 100% 0%, rgba(244,37,37,0.10), transparent 65%)"
          }}
        />
        <div className="relative max-w-container-max mx-auto px-margin-mobile md:px-gutter">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20">
            <div className="max-w-2xl">
              <ScrollReveal>
                <span className="font-label-caps tracking-[0.3em] mb-4 block font-bold">
                  <ShinyText text="PORTAFOLIO" speed={5} color="#8e9192" shineColor="#ffffff" spread={80} />
                </span>
              </ScrollReveal>
              <h2 className="font-headline-lg text-[30px] sm:text-[38px] md:text-headline-lg text-primary font-extrabold uppercase">
                <ScrollFloat as="span" containerClassName="!m-0 block" scrollStart="center bottom+=40%" scrollEnd="bottom bottom-=30%" stagger={0.022}>
                  Nuestros Servicios
                </ScrollFloat>
              </h2>
            </div>
            <ScrollReveal className="font-body-md text-on-surface-variant/80 max-w-sm mt-8 md:mt-0 font-medium">
              Soluciones integrales para cada etapa de crecimiento de tu empresa cárnica.
            </ScrollReveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SERVICES.map((service, i) => (
              <ScrollReveal key={i} className="h-full" end={`start ${0.6 - (i % 3) * 0.04}`}>
                <ServiceCard service={service} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works / Timeline Section */}
      <section className="py-section-padding bg-background relative overflow-hidden">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-gutter">
          <div className="text-center mb-24">
            <ScrollReveal>
              <span className="font-label-caps tracking-[0.4em] mb-4 block font-bold">
                <ShinyText text="PROCESO ESTRATÉGICO" speed={5} color="#8e9192" shineColor="#ffffff" spread={80} />
              </span>
            </ScrollReveal>
            <h2 className="font-headline-lg text-[30px] sm:text-[38px] md:text-headline-lg text-primary font-extrabold uppercase">
              <ScrollFloat as="span" containerClassName="!m-0 block" scrollStart="center bottom+=40%" scrollEnd="bottom bottom-=30%" stagger={0.022}>
                Ruta al Éxito
              </ScrollFloat>
            </h2>
          </div>

          <div className="relative">
            {/* Connecting Horizontal Line in desktop — aligned to the center of the w-16 h-16 step circles */}
            <div className="hidden lg:block absolute top-8 left-0 w-full h-[1px] bg-white/10 z-0" />
            {/* La misma línea, pero de brasa: se dibuja de izquierda a derecha
                al entrar la sección, así el recorrido se lee como un recorrido. */}
            <motion.div
              aria-hidden="true"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
              className="hidden lg:block absolute top-8 left-0 w-full h-[1px] z-0 origin-left"
              style={{
                background:
                  "linear-gradient(90deg, rgba(244,37,37,0) 0%, rgba(244,37,37,0.9) 12%, rgba(244,37,37,0.9) 88%, rgba(244,37,37,0) 100%)",
                boxShadow: "0 0 14px rgba(244,37,37,0.45)"
              }}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-12 relative z-10">
              {TIMELINE_STEPS.map((step, i) => (
                <ScrollReveal
                  key={i}
                  className="flex flex-col items-center text-center group"
                  end={`start ${0.62 - (i % 5) * 0.03}`}
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="w-16 h-16 bg-primary text-background rounded-full flex items-center justify-center font-display-xl text-2xl font-black mb-8 border-[6px] border-background relative z-10 select-none shadow-[0_0_20px_rgba(255,255,255,0.1)] cursor-default"
                  >
                    {step.step}
                  </motion.div>
                  <h4 className="font-headline-md text-[18px] text-primary font-bold mb-2 transition-colors">
                    <ShinyText text={step.title} speed={5} color="#ffffff" shineColor="#f42525" spread={70} delay={i * 0.3} />
                  </h4>
                  <p className="text-base text-on-surface-variant max-w-[180px] mx-auto font-medium">
                    {step.description}
                  </p>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Results Audit Counter Section — halo de luz desde abajo */}
      <section className="py-section-padding bg-surface-container-lowest relative overflow-hidden" id="resultados">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        {isDither && (
          // "Ember Drift": la misma textura de brasa del hero parallax, acá
          // como fondo fijo casi imperceptible — ancla visualmente esta
          // sección oscura con la del hero sin repetir todo el sistema de capas.
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none opacity-[0.35] mix-blend-screen"
            style={{
              backgroundImage: "url('/parallax/ember.webp')",
              backgroundSize: "cover",
              backgroundPosition: "center 30%"
            }}
          />
        )}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(80% 60% at 50% 120%, rgba(244,37,37,0.16), transparent 70%)"
          }}
        />
        <div className="relative max-w-container-max mx-auto px-margin-mobile md:px-gutter">
          <h2 className="font-label-caps text-center tracking-[0.4em] mb-16 font-bold">
            <ShinyText text="RESULTADOS ACADÉMICOS AUDITADOS" speed={6} color="#6b6e6f" shineColor="#f42525" spread={70} />
          </h2>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-14 gap-x-stack-lg">
            {STATS.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6, delay: stat.delay, ease: [0.22, 1, 0.36, 1] }}
                className="text-center relative group"
              >
                {/* Separador vertical entre cifras: se estira al entrar y da
                    ritmo de "tablero de resultados" en vez de 4 bloques sueltos. */}
                {i > 0 && (
                  <motion.span
                    aria-hidden="true"
                    initial={{ scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: stat.delay + 0.2 }}
                    className="hidden lg:block absolute left-0 top-1/2 -translate-y-1/2 w-px h-20 bg-gradient-to-b from-transparent via-white/15 to-transparent origin-center"
                  />
                )}
                {/* El blur se despeja en el mismo tiempo que tardan los dígitos
                    en contar (duration compartida) — simula que el número
                    "llega" a toda velocidad y frena en seco al llegar a su valor. */}
                <motion.div
                  initial={{ filter: "blur(14px)" }}
                  whileInView={{ filter: "blur(0px)" }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 1.1, delay: stat.delay, ease: "easeOut" }}
                  className="font-display-xl text-[36px] sm:text-[48px] md:text-[64px] text-primary mb-2 flex items-center justify-center font-extrabold tracking-tight tabular-nums"
                >
                  {stat.prefix && <span>{stat.prefix}</span>}
                  <CountUp from={0} to={stat.target} duration={1.1} separator="," />
                  {stat.suffix && <span>{stat.suffix}</span>}
                </motion.div>
                {/* Subrayado de brasa que crece bajo cada cifra */}
                <motion.span
                  aria-hidden="true"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, delay: stat.delay + 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="block w-10 h-[2px] mx-auto mb-4 origin-center"
                  style={{ backgroundColor: "rgb(244, 37, 37)", boxShadow: "0 0 12px rgba(244,37,37,0.6)" }}
                />
                <p className="font-label-caps text-[11px] text-on-surface-variant tracking-widest font-bold">
                  {stat.title}
                </p>
                <p className="text-[13px] text-on-surface-variant/40 mt-2 font-medium">
                  {stat.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Video Carousel Section */}
      <section className="py-section-padding bg-surface-container-lowest overflow-hidden">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-gutter">
          <div className="text-center mb-16">
            <ScrollReveal>
              <span className="font-label-caps tracking-[0.4em] mb-4 block font-bold">
                <ShinyText text="VOZ DEL CLIENTE" speed={5} color="#8e9192" shineColor="#ffffff" spread={80} />
              </span>
            </ScrollReveal>
            <h2 className="font-headline-lg text-[30px] sm:text-[38px] md:text-headline-lg text-primary font-extrabold uppercase mb-8">
              <ScrollFloat as="span" containerClassName="!m-0 block" scrollStart="center bottom+=40%" scrollEnd="bottom bottom-=30%" stagger={0.022}>
                Testimonios de Impacto
              </ScrollFloat>
            </h2>
            <ScrollReveal>
              <p className="font-body-lg text-on-surface-variant max-w-2xl mx-auto font-medium">
                Empresarios que confiaron en nuestro método y hoy son referentes en sus mercados locales.
              </p>
            </ScrollReveal>
          </div>

          <ScrollReveal blur={3} y={24}>
            <VideoTestimonialCarousel videos={TESTIMONIAL_VIDEOS} />
          </ScrollReveal>
        </div>
      </section>

      {/* Declaración de marca — la corona ditherizada corre frame a frame con
          el scroll por detrás, y el titular se enciende palabra por palabra. */}
      <StatementScrub
        eyebrow="NUESTRA CONVICCIÓN"
        lead="No enseñamos a cortar carne."
        accent="Construimos imperios rentables."
      />

      {/* Program central cards with 3D Parallax Tilt */}
      <section className="py-section-padding bg-background perspective relative overflow-hidden" id="programas">
        {isDither && (
          // Rayos de luz cayendo desde arriba: da un aire de "escenario" a las
          // tres tarjetas insignia, y es un lenguaje distinto al de las otras
          // secciones (líneas topográficas / plasma) para que ninguna se
          // sienta repetida. Máscara para que no arranque de golpe justo en
          // el borde superior de la sección.
          <div
            className="absolute inset-0 z-0 pointer-events-none opacity-60"
            style={{
              maskImage: "linear-gradient(to bottom, transparent, black 14%, black 85%, transparent)",
              WebkitMaskImage: "linear-gradient(to bottom, transparent, black 14%, black 85%, transparent)"
            }}
          >
            <LightRays
              raysOrigin="top-center"
              raysColor="#ffffff"
              raysSpeed={0.6}
              lightSpread={0.85}
              rayLength={2.2}
              fadeDistance={1.3}
              saturation={0.5}
              followMouse={false}
              mouseInfluence={0}
              noiseAmount={0.05}
              distortion={0.02}
            />
          </div>
        )}
        <div className="relative max-w-container-max mx-auto px-margin-mobile md:px-gutter">
          
          <div className="flex flex-col mb-20 items-center text-center">
            <ScrollReveal>
              <span className="font-label-caps tracking-[0.3em] mb-4 font-bold uppercase block">
                <ShinyText text="NUESTROS PROGRAMAS CENTRALES" speed={5} color="#8e9192" shineColor="#ffffff" spread={80} />
              </span>
            </ScrollReveal>
            <h2 className="font-headline-lg text-[30px] sm:text-[38px] md:text-headline-lg text-primary max-w-3xl font-extrabold uppercase leading-tight">
              <ScrollFloat as="span" containerClassName="!m-0 block" scrollStart="center bottom+=40%" scrollEnd="bottom bottom-=30%" stagger={0.02}>
                Sistemas para el empresario de éxito
              </ScrollFloat>
            </h2>
            <ScrollReveal>
              <p className="font-body-md text-on-surface-variant mt-6 max-w-2xl font-medium">
                Estos son los pilares de nuestro ecosistema educativo, diseñados para llevar tu negocio al siguiente nivel operativo.
              </p>
            </ScrollReveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-8">

            {/* Program 1: Maquina del Exito */}
            <ParallaxCard className="h-full" glowColor="transparent">
            <BorderGlow
              glowColor="0 90 55"
              backgroundColor="rgb(24, 17, 17)"
              borderRadius={32}
              edgeSensitivity={38}
              glowRadius={46}
              glowIntensity={0.85}
              coneSpread={30}
              colors={["#f42525", "#ffffff", "#f42525"]}
              className="group h-full"
            >
              {/* Mismo tratamiento sutil que las otras dos tarjetas — la foto
                  de stock de Unsplash se sentía genérica y desentonaba. */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent z-0 rounded-[32px]" />

              <div className="relative h-full flex flex-col p-8 sm:p-9 lg:p-10 z-10 justify-between min-h-[480px] lg:min-h-[560px]">
                <div className="mb-auto">
                  <motion.span
                    animate={{ opacity: [1, 0.72, 1] }}
                    transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
                    className="bg-primary px-4 py-1.5 font-label-caps text-[10px] font-bold tracking-widest uppercase inline-block"
                    style={{ backgroundColor: "rgb(244, 37, 37)", color: "rgb(255, 255, 255)" }}
                  >
                    EL ESTÁNDAR DE ORO
                  </motion.span>
                  <h3 className="font-display-xl text-[32px] sm:text-[38px] lg:text-[46px] mt-6 sm:mt-8 leading-none font-extrabold uppercase" style={{ color: "rgb(244, 37, 37)" }}>
                    Máquina<br />del Éxito
                  </h3>
                  <p className="font-body-md text-on-surface-variant mt-6 max-w-md font-medium leading-relaxed">
                    El sistema de gestión integral que automatiza tu rentabilidad. Deja de <span className="font-bold">"atender"</span> y empieza a <span className="font-extrabold text-primary">"dirigir"</span>.
                  </p>
                </div>

                <div>
                  <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.4 }}
                    variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
                    className="space-y-5 mb-10"
                  >
                    <motion.div
                      variants={{ hidden: { opacity: 0, x: -16 }, visible: { opacity: 1, x: 0 } }}
                      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      className="flex items-center gap-4"
                    >
                      <span className="w-9 h-9 border border-white/20 flex items-center justify-center text-primary transition-colors font-bold rounded-lg select-none text-sm">01</span>
                      <span className="font-body-md text-on-surface font-semibold">Ingeniería de Costos Pro</span>
                    </motion.div>
                    <motion.div
                      variants={{ hidden: { opacity: 0, x: -16 }, visible: { opacity: 1, x: 0 } }}
                      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      className="flex items-center gap-4"
                    >
                      <span className="w-9 h-9 border border-white/20 flex items-center justify-center text-primary transition-colors font-bold rounded-lg select-none text-sm">02</span>
                      <span className="font-body-md text-on-surface font-semibold">Algoritmos de Inventario Zero</span>
                    </motion.div>
                  </motion.div>

                  <div className="flex items-end justify-between border-t border-white/10 pt-7">
                    <motion.button
                      onClick={() => setActiveBooking(PROGRAM_BOOKINGS.maquina)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-white text-black px-7 py-3.5 font-label-caps text-[12px] font-extrabold rounded-full tracking-widest cursor-pointer shadow-lg hover:shadow-white/5 inline-flex items-center justify-center"
                    >
                      AGENDAR LLAMADA
                    </motion.button>
                  </div>
                </div>
              </div>
            </BorderGlow>
            </ParallaxCard>

            {/* Program 2: Nitro Branding */}
            <ParallaxCard className="h-full" glowColor="transparent">
            <BorderGlow
              glowColor="199 89 50"
              backgroundColor="rgb(2, 6, 23)"
              borderRadius={32}
              edgeSensitivity={38}
              glowRadius={46}
              glowIntensity={0.85}
              coneSpread={30}
              colors={["#0da6f2", "#ffffff", "#0da6f2"]}
              className="group h-full"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent z-0 rounded-[32px]" />

              <div className="relative h-full flex flex-col p-8 sm:p-9 lg:p-10 z-10 justify-between min-h-[480px] lg:min-h-[560px]">
                <div className="mb-auto">
                  <motion.span
                    animate={{ opacity: [1, 0.72, 1] }}
                    transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                    className="border text-white px-4 py-1.5 font-label-caps text-[10px] font-bold tracking-widest uppercase inline-block"
                    style={{ borderColor: "rgb(56, 189, 248)", color: "rgb(56, 189, 248)" }}
                  >
                    ESCALADO EXPONENCIAL
                  </motion.span>
                  {/* "Nitro" a secas — el documento base del producto nunca lo
                      llama "Nitro Branding", solo "Nitro". */}
                  <h3 className="font-display-xl text-[32px] sm:text-[38px] lg:text-[46px] mt-6 sm:mt-8 leading-none font-extrabold uppercase" style={{ color: "rgb(13, 166, 242)" }}>
                    Nitro
                  </h3>
                  <p className="font-body-md text-on-surface-variant mt-6 max-w-md font-medium leading-relaxed" style={{ color: "rgb(241, 245, 249)" }}>
                    Domina el posicionamiento local y digital. Conviértete en el referente de autoridad en tu ciudad.
                  </p>
                </div>

                <div>
                  <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.4 }}
                    variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
                    className="space-y-5 mb-10"
                  >
                    <motion.div
                      variants={{ hidden: { opacity: 0, x: -16 }, visible: { opacity: 1, x: 0 } }}
                      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      className="flex items-center gap-4"
                    >
                      <span className="w-9 h-9 border flex items-center justify-center text-primary transition-colors font-bold rounded-lg select-none text-sm" style={{ borderColor: "rgba(13, 166, 242, 0.4)", color: "rgb(13, 166, 242)" }}>01</span>
                      <span className="font-body-md text-on-surface font-semibold">Embudos de Venta Local</span>
                    </motion.div>
                    <motion.div
                      variants={{ hidden: { opacity: 0, x: -16 }, visible: { opacity: 1, x: 0 } }}
                      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      className="flex items-center gap-4"
                    >
                      <span className="w-9 h-9 border flex items-center justify-center text-primary transition-colors font-bold rounded-lg select-none text-sm" style={{ borderColor: "rgba(13, 166, 242, 0.4)", color: "rgb(13, 166, 242)" }}>02</span>
                      <span className="font-body-md text-on-surface font-semibold">Marketing de Alto Ticket</span>
                    </motion.div>
                  </motion.div>

                  <div className="flex items-end justify-between border-t border-white/10 pt-7">
                    <motion.button
                      onClick={() => setActiveBooking(PROGRAM_BOOKINGS.nitro)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-white text-black px-7 py-3.5 font-label-caps text-[12px] font-extrabold rounded-full tracking-widest cursor-pointer shadow-lg hover:shadow-white/5 inline-flex items-center justify-center"
                    >
                      AGENDAR LLAMADA
                    </motion.button>
                  </div>
                </div>
              </div>
            </BorderGlow>
            </ParallaxCard>

            {/* Program 3: Maestría de la Carne */}
            <ParallaxCard className="h-full md:col-span-2 lg:col-span-1" glowColor="transparent">
            <BorderGlow
              glowColor="44 80 46"
              backgroundColor="rgb(20, 16, 8)"
              borderRadius={32}
              edgeSensitivity={38}
              glowRadius={46}
              glowIntensity={0.85}
              coneSpread={30}
              colors={["#d4a317", "#ffffff", "#d4a317"]}
              className="group h-full"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent z-0 rounded-[32px]" />

              <div className="relative h-full flex flex-col p-8 sm:p-9 lg:p-10 z-10 justify-between min-h-[480px] lg:min-h-[560px]">
                <div className="mb-auto">
                  <motion.span
                    animate={{ opacity: [1, 0.72, 1] }}
                    transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
                    className="border px-4 py-1.5 font-label-caps text-[10px] font-bold tracking-widest uppercase inline-block"
                    style={{ borderColor: "rgb(212, 163, 23)", color: "rgb(212, 163, 23)" }}
                  >
                    EL NIVEL MÁS ALTO
                  </motion.span>
                  <h3 className="font-display-xl text-[32px] sm:text-[38px] lg:text-[46px] mt-6 sm:mt-8 leading-none font-extrabold uppercase" style={{ color: "rgb(212, 163, 23)" }}>
                    Maestría<br />de la Carne
                  </h3>
                  <p className="font-body-md text-on-surface-variant mt-6 max-w-md font-medium leading-relaxed">
                    Consultoría ejecutiva para empresarios consolidados que buscan expansión y crecimiento patrimonial.
                  </p>
                </div>

                <div>
                  <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.4 }}
                    variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
                    className="space-y-5 mb-10"
                  >
                    <motion.div
                      variants={{ hidden: { opacity: 0, x: -16 }, visible: { opacity: 1, x: 0 } }}
                      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      className="flex items-center gap-4"
                    >
                      <span className="w-9 h-9 border flex items-center justify-center transition-colors font-bold rounded-lg select-none text-sm" style={{ borderColor: "rgba(212, 163, 23, 0.4)", color: "rgb(212, 163, 23)" }}>01</span>
                      <span className="font-body-md text-on-surface font-semibold">Consultoría Ejecutiva 1:1</span>
                    </motion.div>
                    <motion.div
                      variants={{ hidden: { opacity: 0, x: -16 }, visible: { opacity: 1, x: 0 } }}
                      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      className="flex items-center gap-4"
                    >
                      <span className="w-9 h-9 border flex items-center justify-center transition-colors font-bold rounded-lg select-none text-sm" style={{ borderColor: "rgba(212, 163, 23, 0.4)", color: "rgb(212, 163, 23)" }}>02</span>
                      <span className="font-body-md text-on-surface font-semibold">Diagnóstico Integral de Empresa</span>
                    </motion.div>
                  </motion.div>

                  <div className="flex items-end justify-between border-t border-white/10 pt-7">
                    <motion.button
                      onClick={() => setActiveBooking(PROGRAM_BOOKINGS.maestria)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-white text-black px-7 py-3.5 font-label-caps text-[12px] font-extrabold rounded-full tracking-widest cursor-pointer shadow-lg hover:shadow-white/5 inline-flex items-center justify-center"
                    >
                      AGENDAR LLAMADA
                    </motion.button>
                  </div>
                </div>
              </div>
            </BorderGlow>
            </ParallaxCard>

          </div>
        </div>
      </section>

      <ScheduleModal product={activeBooking} onClose={() => setActiveBooking(null)} />

      {/* About Us / History Section */}
      <section className="py-section-padding bg-background border-y border-white/5" id="nosotros">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-gutter">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            
            {/* Founder Image Column */}
            <ScrollReveal className="w-full lg:w-[45%]" y={0} scale={0.94} blur={4}>
              <div className="relative rounded-[32px] overflow-hidden aspect-[4/5] shadow-2xl group border border-white/10">
                <motion.img 
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.8 }}
                  alt="Founder of Rey Academy"
                  className="w-full h-full object-cover transition-all duration-500"
                  src="https://assets.cdn.filesafe.space/WDYpjQTiKpK6eUD1aFYZ/media/6a6bb9314cb07d8c3f0a9b5a.png"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
              </div>
            </ScrollReveal>

            {/* Founder Story Column */}
            <ScrollReveal className="w-full lg:w-[55%]">
              <div className="max-w-2xl">
                <div className="relative inline-block pl-6 mb-12">
                  {/* La barra de la izquierda se dibuja de arriba a abajo al
                      entrar, en lugar de aparecer ya puesta. */}
                  <motion.span
                    aria-hidden="true"
                    initial={{ scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    viewport={{ once: true, amount: 0.6 }}
                    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute left-0 top-0 h-full w-1 origin-top"
                    style={{
                      background: "linear-gradient(180deg, #ffffff 0%, #f42525 100%)",
                      boxShadow: "0 0 16px rgba(244,37,37,0.45)"
                    }}
                  />
                  <span className="font-label-caps text-[13px] tracking-[0.4em] font-extrabold uppercase block mb-4">
                    <ShinyText text="Nuestra Historia" speed={5} color="#ffffff" shineColor="#f42525" spread={70} />
                  </span>
                  <h2 className="font-headline-lg text-[30px] sm:text-[38px] md:text-headline-lg text-primary font-extrabold leading-[1.1] mb-0 uppercase">
                    <ScrollFloat as="span" containerClassName="!m-0 block" scrollStart="center bottom+=40%" scrollEnd="bottom bottom-=30%" stagger={0.022}>
                      Sobre Rey Academy
                    </ScrollFloat>
                  </h2>
                </div>

                <div className="space-y-8">
                  <p className="font-body-lg text-on-surface-variant font-medium leading-relaxed">
                    Nuestra historia no comenzó en una oficina, sino detrás de un mostrador. Rey Academy nació de la necesidad real de transformar el esfuerzo físico agotador en inteligencia estratégica. Vivimos de cerca cómo dueños de carnicerías entregaban su vida al negocio sin ver la rentabilidad que merecían, atrapados en la operatividad diaria.
                  </p>
                  <p className="font-body-lg text-on-surface-variant font-medium leading-relaxed">
                    Hoy, esa chispa inicial se ha convertido en el ecosistema de formación más influyente de la industria cárnica en habla hispana. No solo compartimos teoría; entregamos los sistemas, las métricas y la mentalidad necesaria para que el dueño de carnicería deje de ser un autoempleado y se convierta en el CEO de su propio negocio, logrando finalmente el equilibrio entre éxito financiero y calidad de vida familiar.
                  </p>
                  
                  {/* `blockquote` y no `p`: GradientText renderiza `div`s y un
                      `div` dentro de un `p` es HTML inválido (React lo avisa). */}
                  <motion.blockquote
                    initial={isDither ? { opacity: 0, y: 14, filter: "blur(6px)" } : undefined}
                    whileInView={isDither ? { opacity: 1, y: 0, filter: "blur(0px)" } : undefined}
                    viewport={isDither ? { once: true, amount: 0.6 } : undefined}
                    transition={isDither ? { duration: 0.7, ease: [0.22, 1, 0.36, 1] } : undefined}
                    className="font-body-md italic border-l border-white/20 pl-6 leading-relaxed"
                  >
                    <GradientText
                      colors={["#c4c7c8", "#f42525", "#ffffff", "#f42525", "#c4c7c8"]}
                      animationSpeed={6}
                      className="font-medium"
                    >
                      "No enseñamos a cortar carne, enseñamos a construir imperios rentables que funcionen sin que el dueño tenga que estar presente."
                    </GradientText>
                  </motion.blockquote>

                  <div className="pt-12">
                    <motion.a
                      href="#programas"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="group flex items-center gap-4 bg-primary text-background px-10 py-5 font-label-caps text-[14px] font-extrabold tracking-[0.2em] rounded-full shadow-[0_10px_30px_rgba(255,255,255,0.1)] cursor-pointer"
                    >
                      CONOCER MÁS
                      <motion.span
                        variants={{
                          hover: { x: 5 }
                        }}
                        className="material-symbols-outlined"
                      >
                        arrow_forward
                      </motion.span>
                    </motion.a>
                  </div>

                </div>
              </div>
            </ScrollReveal>

          </div>
        </div>
      </section>

      {/* Methodology Section — fondo "Color Bends" monocromático detrás de la
          grilla. En /v2/dither la sección se PINEA (scroll-jack, como el hero
          parallax o la declaración de marca): la pantalla queda fija mientras
          la línea roja recorre las 6 tarjetas, y recién se suelta al terminar. */}
      {isDither ? (
        <section ref={methodSectionRef} className="relative bg-surface-container-lowest h-[280vh] sm:h-[300vh] lg:h-[320vh]">
          <div className="sticky top-0 h-[100svh] w-full overflow-hidden flex flex-col justify-center pt-20">
            {/* Plasma en rojo de marca. Va sobre negro sólido porque Plasma
                renderiza con alpha y, sin ese respaldo, se transparenta el
                gris del fondo de la página en vez de negro puro. La máscara
                (sobre el negro Y el plasma juntos) suaviza el borde superior
                e inferior del viewport pineado, para que el enganche/soltado
                de la sección no se sienta como un corte en seco. */}
            <div
              className="absolute inset-0 z-0 pointer-events-none bg-black"
              style={{
                maskImage: "linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)",
                WebkitMaskImage: "linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)"
              }}
            >
              <Plasma
                color="#f42525"
                speed={0.5}
                direction="forward"
                scale={1.4}
                opacity={0.55}
                mouseInteractive={false}
              />
            </div>
            <div className="relative z-10 max-w-container-max mx-auto px-margin-mobile md:px-gutter w-full">
              <motion.div style={{ opacity: methodHeaderOpacity }} className="text-center mb-6 sm:mb-8 lg:mb-10">
                <span className="font-label-caps tracking-[0.4em] mb-3 block font-bold">
                  <ShinyText text="FILOSOFÍA" speed={5} color="#8e9192" shineColor="#ffffff" spread={80} />
                </span>
                <h2 className="font-headline-lg text-[26px] sm:text-[32px] md:text-[40px] text-primary font-extrabold uppercase">
                  Metodología REY
                </h2>
              </motion.div>

              <MethodologyPath items={METHOD_ITEMS} progress={methodProgress} />
            </div>
          </div>
        </section>
      ) : (
        <section className="relative py-section-padding bg-surface-container-lowest overflow-hidden">
          <MonoBends />
          <div className="relative z-10 max-w-container-max mx-auto px-margin-mobile md:px-gutter">
            <div className="text-center mb-24">
              <ScrollReveal>
                <span className="font-label-caps tracking-[0.4em] mb-4 block font-bold">
                  <ShinyText text="FILOSOFÍA" speed={5} color="#8e9192" shineColor="#ffffff" spread={80} />
                </span>
              </ScrollReveal>
              <h2 className="font-headline-lg text-[30px] sm:text-[38px] md:text-headline-lg text-primary font-extrabold uppercase">
                <ScrollFloat as="span" containerClassName="!m-0 block" scrollStart="center bottom+=40%" scrollEnd="bottom bottom-=30%" stagger={0.022}>
                  Metodología REY
                </ScrollFloat>
              </h2>
            </div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              variants={staggerContainer}
            >
              {METHOD_ITEMS.map((method, i) => (
                <motion.div key={i} variants={revealUp} className="h-full">
                  <SpotlightCard className="group h-full !bg-background !rounded-3xl !p-10" spotlightColor="rgba(255,255,255,0.10)">
                    {/* Índice + barra de brasa que crece al hover: la tarjeta
                        deja de ser un rectángulo con texto y pasa a tener acento. */}
                    <div className="flex items-baseline gap-4 mb-4">
                      <span
                        className="font-display-xl text-[15px] font-extrabold tabular-nums tracking-widest transition-opacity duration-300 opacity-50 group-hover:opacity-100"
                        style={{ color: "rgb(244, 37, 37)" }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h4 className="font-headline-md text-[20px] text-primary font-bold">
                        {method.title}
                      </h4>
                    </div>
                    <span
                      aria-hidden="true"
                      className="block h-[2px] w-8 mb-5 transition-all duration-500 ease-out group-hover:w-20"
                      style={{ backgroundColor: "rgb(244, 37, 37)", boxShadow: "0 0 10px rgba(244,37,37,0.5)" }}
                    />
                    <p className="text-base text-on-surface-variant leading-relaxed">
                      {method.desc}
                    </p>
                  </SpotlightCard>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* Global Community Section */}
      <section className="py-section-padding bg-background overflow-hidden" id="comunidad">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-gutter">
          <div className="flex flex-col lg:flex-row gap-20 items-center">
            
            <div className="w-full lg:w-1/2">
              <ScrollReveal>
                <span className="font-label-caps tracking-[0.4em] mb-4 block font-bold">
                  <ShinyText text="ECOSISTEMA" speed={5} color="#8e9192" shineColor="#ffffff" spread={80} />
                </span>
              </ScrollReveal>
              <h2 className="font-headline-lg text-[30px] sm:text-[38px] md:text-headline-lg text-primary font-extrabold uppercase mb-8">
                <ScrollFloat as="span" containerClassName="!m-0 block" scrollStart="center bottom+=40%" scrollEnd="bottom bottom-=30%" stagger={0.02}>
                  Comunidad Global de Empresarios
                </ScrollFloat>
              </h2>
              {isDither ? (
                // Antes acá decía "más de 15 países" y la lista de abajo tenía
                // "WhatsApp Exclusiva" / "Mensuales" / "VIP" — ninguno de esos
                // tres detalles está en el documento base. Lo que sí está
                // confirmado (Doc. Base + páginas de venta de los productos):
                // 12 meses de acompañamiento, mentoría grupal en vivo con
                // Elbio Prida, y acceso a las masterclasses.
                <ScrollReveal>
                  <p className="font-body-lg text-on-surface-variant mb-12 font-medium">
                    Un año entero de acompañamiento junto a otros dueños de carnicería que están resolviendo los mismos retos que vos.
                  </p>

                  <ul className="space-y-6">
                    {[
                      { icon: "diversity_3", label: "Comunidad y acompañamiento por 12 meses" },
                      { icon: "co_present", label: "Mentoría grupal en vivo con Elbio Prida y expertos" },
                      { icon: "video_stable", label: "Acceso a todas las masterclasses y contenido complementario" }
                    ].map((item, i) => (
                      <AnimatedContent
                        key={item.label}
                        direction="horizontal"
                        distance={40}
                        delay={i * 0.12}
                        duration={0.6}
                        threshold={0.3}
                      >
                        <div className="flex items-center gap-4 group">
                          <span className="material-symbols-outlined text-primary text-2xl transition-colors duration-300 group-hover:text-[rgb(244,37,37)]">
                            {item.icon}
                          </span>
                          <span className="font-body-md font-bold text-lg">{item.label}</span>
                        </div>
                      </AnimatedContent>
                    ))}
                  </ul>
                </ScrollReveal>
              ) : (
                <ScrollReveal>
                <p className="font-body-lg text-on-surface-variant mb-12 font-medium">
                  Accede a una red de contactos invaluable con dueños de negocios en más de 15 países.
                </p>

                <motion.ul
                  className="space-y-6"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.4 }}
                  variants={staggerContainer}
                >
                  {[
                    { icon: "hub", label: "Comunidad de WhatsApp Exclusiva" },
                    { icon: "video_stable", label: "Masterclasses en Vivo Mensuales" },
                    { icon: "handshake", label: "Eventos de Networking VIP" }
                  ].map((item) => (
                    <motion.li
                      key={item.label}
                      variants={revealUp}
                      whileHover={{ x: 6 }}
                      className="flex items-center gap-4 cursor-default group"
                    >
                      {/* El ícono pasa a rojo de marca al acercarse el mouse:
                          micro-recompensa sin mover nada del layout. */}
                      <span className="material-symbols-outlined text-primary text-2xl transition-colors duration-300 group-hover:text-[rgb(244,37,37)]">
                        {item.icon}
                      </span>
                      <span className="font-body-md font-bold text-lg">{item.label}</span>
                    </motion.li>
                  ))}
                </motion.ul>
                </ScrollReveal>
              )}
            </div>

            {isDither ? (
              <ScrollReveal className="w-full lg:w-1/2" y={0} scale={0.95} blur={4}>
                <CommunityPersonalityPanel />
              </ScrollReveal>
            ) : (
              <ScrollReveal className="w-full lg:w-1/2 grid grid-cols-2 gap-4" y={0} scale={0.95} blur={4}>
                <motion.div whileHover={{ scale: 1.03 }} className="h-60 bg-surface-container-low rounded-2xl overflow-hidden border border-white/5">
                  <img src="https://assets.cdn.filesafe.space/WDYpjQTiKpK6eUD1aFYZ/media/6a7350fdac7d7ffc641297ac.jpg" alt="Discord Community" className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" />
                </motion.div>
                <motion.div whileHover={{ scale: 1.03 }} className="h-60 bg-surface-container-low rounded-2xl mt-12 overflow-hidden border border-white/5">
                  <img src="https://assets.cdn.filesafe.space/WDYpjQTiKpK6eUD1aFYZ/media/6a7350fd329b76ca7b55ada4.png" alt="Masterclasses" className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" />
                </motion.div>
                <motion.div whileHover={{ scale: 1.03 }} className="h-60 bg-surface-container-low rounded-2xl -mt-12 overflow-hidden border border-white/5">
                  <img src="https://assets.cdn.filesafe.space/WDYpjQTiKpK6eUD1aFYZ/media/6a7350fded8fb1d23927330c.png" alt="Networking Events" className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" />
                </motion.div>
                <div className="relative h-60 bg-surface-container-low rounded-2xl border border-white/5 overflow-hidden flex flex-col items-center justify-center p-6 text-center">
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        "radial-gradient(90% 70% at 50% 115%, rgba(244,37,37,0.28), transparent 68%)"
                    }}
                  />
                  <motion.span
                    initial={{ filter: "blur(14px)" }}
                    whileInView={{ filter: "blur(0px)" }}
                    viewport={{ once: true, amount: 0.6 }}
                    transition={{ duration: 1.3, ease: "easeOut" }}
                    className="relative font-display-xl text-3xl sm:text-4xl text-white font-extrabold tracking-tight tabular-nums flex items-center"
                  >
                    +<CountUp from={0} to={1500} duration={1.3} separator="," />
                  </motion.span>
                  <motion.span
                    aria-hidden="true"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="relative block w-10 h-[2px] my-4 origin-center"
                    style={{ backgroundColor: "rgb(244, 37, 37)", boxShadow: "0 0 12px rgba(244,37,37,0.6)" }}
                  />
                  <span className="relative font-label-caps text-[11px] text-on-surface-variant tracking-[0.3em] uppercase font-bold">
                    Miembros
                  </span>
                </div>
              </ScrollReveal>
            )}

          </div>
        </div>
      </section>

      {/* FAQ Section — sin fondo animado a propósito: es la sección más densa
          en texto de la página y necesita un respiro visual entre tanta
          sección con shader. */}
      <section className="py-section-padding bg-background relative overflow-hidden">
        <div className="relative z-10 max-w-3xl mx-auto px-margin-mobile">
          <div className="text-center mb-16">
            <ScrollReveal>
              <span className="font-label-caps tracking-[0.4em] mb-4 block font-bold">
                <ShinyText text="PREGUNTAS" speed={5} color="#8e9192" shineColor="#ffffff" spread={80} />
              </span>
            </ScrollReveal>
            <h2 className="font-headline-lg text-[30px] sm:text-[38px] md:text-headline-lg text-primary font-extrabold uppercase">
              <ScrollFloat as="span" containerClassName="!m-0 block" scrollStart="center bottom+=40%" scrollEnd="bottom bottom-=30%" stagger={0.022}>
                Dudas Frecuentes
              </ScrollFloat>
            </h2>
          </div>

          <FaqAccordion stagger={isDither} />
        </div>
      </section>

      {/* Final CTA Section */}
      <section
        ref={ctaContainerRef}
        className="py-section-padding bg-primary text-background relative overflow-hidden"
        id="contacto"
      >
        <ScrollReveal className="max-w-container-max mx-auto px-margin-mobile md:px-gutter relative z-10 text-center" y={40} blur={6}>
          {/* Sección de fondo blanco: el shine va al revés (base oscura, brillo
              rojo de marca), si no el degradado se comería el texto. */}
          {!isDither && (
            <span className="font-label-caps text-[12px] sm:text-[14px] font-extrabold tracking-[0.3em] sm:tracking-[0.5em] mb-8 uppercase inline-flex items-center gap-3 justify-center">
              <motion.span
                animate={{ opacity: [1, 0.25, 1], scale: [1, 0.85, 1] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                className="w-2 h-2 rounded-full inline-block"
                style={{ backgroundColor: "rgb(244, 37, 37)" }}
              />
              <ShinyText
                text="ÚLTIMAS PLAZAS DISPONIBLES"
                speed={4}
                color="#3d3d3d"
                shineColor="#f42525"
                spread={70}
              />
            </span>
          )}
          <h2 className="font-display-xl text-[48px] sm:text-[64px] md:text-[100px] text-background mb-stack-lg leading-[0.85] sm:leading-[0.8] font-extrabold uppercase">
            {isDither ? (
              <SplitText
                text="Empieza tu Libertad"
                tag="span"
                splitType="chars"
                from={{ opacity: 0, y: 40 }}
                to={{ opacity: 1, y: 0 }}
                duration={0.6}
                delay={25}
                ease="power3.out"
                threshold={0.4}
                textAlign="center"
              />
            ) : (
              /* Manrope llega hasta 'wght' 800: el rango 800→900 que había antes
                 se recortaba a 800 y el efecto de proximidad no se veía nunca. */
              <VariableProximity
                label="Empieza tu Libertad"
                containerRef={ctaContainerRef}
                fromFontVariationSettings="'wght' 500"
                toFontVariationSettings="'wght' 800"
                radius={260}
                falloff="gaussian"
              />
            )}
          </h2>
          <p className="font-headline-md text-[20px] sm:text-headline-md text-background/80 mb-12 max-w-3xl mx-auto font-bold uppercase leading-relaxed">
            Únete a la élite de dueños de carnicerías que están redefiniendo el mercado en Latinoamérica.
          </p>
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="bg-background text-primary px-8 sm:px-16 py-5 sm:py-8 font-label-caps text-[13px] sm:text-[18px] font-extrabold tracking-[0.15em] sm:tracking-[0.3em] rounded-full w-full sm:w-auto cursor-pointer shadow-2xl hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] transition-shadow duration-300"
          >
            RESERVAR ENTREVISTA
          </motion.button>
        </ScrollReveal>

        {/* Giant decorative background text — con parallax lento al scrollear:
            se mueve menos que la sección, así el bloque gana profundidad. */}
        <div className="absolute inset-0 opacity-10 pointer-events-none flex items-center justify-center select-none z-0 overflow-hidden">
          <motion.span
            initial={{ y: 60, scale: 1.06 }}
            whileInView={{ y: -40, scale: 1 }}
            viewport={{ amount: 0.1 }}
            transition={{ duration: 1.6, ease: "easeOut" }}
            className="text-[300px] sm:text-[400px] lg:text-[500px] font-extrabold text-background tracking-tighter leading-none"
          >
            REY
          </motion.span>
        </div>
      </section>

      {/* Robust Footer */}
      <footer className="bg-surface-container-lowest border-t border-white/5 pt-24 pb-12">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-gutter">
          {/* El footer era la única zona de la página sin ningún reveal. */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-24"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
          >
            <motion.div variants={revealUp}>
              <div className="font-headline-md text-primary font-black mb-8">REY ACADEMY</div>
              <p className="text-on-surface-variant text-base leading-relaxed mb-8 font-medium">
                Líderes mundiales en la profesionalización del sector cárnico. Transformamos carnicerías en empresas rentables y automatizadas.
              </p>
              <div className="flex gap-4">
                <motion.a whileHover={{ y: -3 }} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-background transition-colors" href="https://www.youtube.com/@ReyAcademyOficial" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                  <span className="material-symbols-outlined text-base">smart_display</span>
                </motion.a>
              </div>
            </motion.div>

            <motion.div variants={revealUp}>
              <h4 className="font-label-caps text-[12px] text-primary font-black tracking-widest mb-8">
                NAVEGACIÓN
              </h4>
              <ul className="space-y-4 text-base text-on-surface-variant font-bold">
                <li><a className="hover:text-primary transition-colors" href="#">Inicio</a></li>
                <li><a className="hover:text-primary transition-colors" href="#nosotros">Nosotros</a></li>
                <li><a className="hover:text-primary transition-colors" href="#servicios">Servicios</a></li>
                <li><a className="hover:text-primary transition-colors" href="#programas">Programas</a></li>
              </ul>
            </motion.div>

            <motion.div variants={revealUp}>
              <h4 className="font-label-caps text-[12px] text-primary font-black tracking-widest mb-8">
                RECURSOS
              </h4>
              <ul className="space-y-4 text-base text-on-surface-variant font-bold">
                <li><a className="hover:text-primary transition-colors" href="#resultados">Resultados</a></li>
                <li><a className="hover:text-primary transition-colors" href="#comunidad">Comunidad</a></li>
                <li><a className="hover:text-primary transition-colors" href="https://www.youtube.com/@ReyAcademyOficial/podcasts" target="_blank" rel="noopener noreferrer">Podcast REY</a></li>
              </ul>
            </motion.div>

            <motion.div variants={revealUp}>
              <h4 className="font-label-caps text-[12px] text-primary font-black tracking-widest mb-8">
                CONTACTO
              </h4>
              <ul className="space-y-4 text-base text-on-surface-variant font-medium">
                <li className="flex items-center gap-3"><span className="material-symbols-outlined text-primary text-base">mail</span> info@mg.reyacademy.com</li>
                <li className="flex items-center gap-3"><span className="material-symbols-outlined text-primary text-base">location_on</span> Global Operations</li>
              </ul>
            </motion.div>
          </motion.div>

          <div className="border-t border-white/5 pt-12 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[10px] text-on-surface-variant font-bold tracking-widest uppercase">
              © 2026 REY ACADEMY. TODOS LOS DERECHOS RESERVADOS.
            </p>
            <div className="flex gap-8 text-[10px] text-on-surface-variant font-bold tracking-widest uppercase">
              <Link className="hover:text-primary transition-colors" to="/terms-and-conditions">Términos y Condiciones</Link>
              <Link className="hover:text-primary transition-colors" to="/privacy-policy">Privacidad</Link>
              <a className="hover:text-primary transition-colors" href="#">Cookies</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
    </ClickSpark>
  );
}
