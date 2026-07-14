/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  NAV_LINKS, 
  PARTNERS, 
  WHAT_IS_CARDS, 
  SERVICES, 
  TIMELINE_STEPS, 
  STATS, 
  SUCCESS_CASES, 
  TESTIMONIALS, 
  FREE_RESOURCES 
} from "./data";
import { AnimatedCounter } from "./components/AnimatedCounter";
import { FaqAccordion } from "./components/FaqAccordion";
import { ParallaxCard } from "./components/ParallaxCard";

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

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

  // Handle testimonial sliding
  const nextTestimonial = () => {
    setActiveTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const prevTestimonial = () => {
    setActiveTestimonial((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  // Reveal animation presets
  const revealUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6, ease: [0.2, 1, 0.3, 1] } 
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const fadeScale = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: [0.2, 1, 0.3, 1] }
    }
  };

  return (
    <div className="bg-background text-on-surface font-sans overflow-x-hidden selection:bg-white selection:text-black">
      
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

      {/* Hero Section */}
      <header className="relative min-h-[95vh] flex flex-col items-center justify-center text-center px-margin-mobile overflow-hidden pt-24">
        <div className="absolute inset-0 z-0">
          <motion.div 
            initial={{ scale: 1.15, opacity: 0 }}
            animate={{ scale: 1.0, opacity: 0.3 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="w-full h-full bg-cover bg-center grayscale" 
            style={{ backgroundImage: 'url("https://assets.cdn.filesafe.space/WDYpjQTiKpK6eUD1aFYZ/media/69c410cf76c882d79a3cd538.webp")' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50" />
        </div>

        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="relative z-10 max-w-[1200px] mx-auto flex flex-col items-center"
        >
          <motion.h1 
            variants={revealUp}
            className="font-display-xl text-[40px] sm:text-[56px] md:text-[68px] lg:text-display-xl text-primary mb-stack-lg leading-[1.05] sm:leading-[0.95] font-extrabold uppercase text-white break-words"
          >
            Domina el Mercado <br />
            <span className="text-white font-extrabold">Multiplica tu ROI</span>
          </motion.h1>

          <motion.p 
            variants={revealUp}
            className="font-body-lg text-[16px] sm:text-body-lg text-on-surface-variant max-w-2xl mx-auto mb-10 sm:mb-12 font-medium"
          >
            La formación académica definitiva para dueños de carnicerías que buscan libertad operativa y resultados financieros extraordinarios.
          </motion.p>

          <motion.div 
            variants={revealUp}
            className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center w-full sm:w-auto px-4 sm:px-0"
          >
            <motion.a
              href="https://plataforma.reyacademy.com/login"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="bg-primary text-background px-8 sm:px-12 py-5 sm:py-6 font-label-caps text-label-caps font-extrabold tracking-[0.2em] rounded-full w-full sm:w-auto shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(255,255,255,0.25)] transition-shadow duration-300 cursor-pointer inline-flex items-center justify-center"
              id="hero-btn-empezar"
            >
              EMPEZAR AHORA
            </motion.a>
            <motion.button 
              whileHover={{ scale: 1.05, bg: "rgba(255,255,255,0.1)" }}
              whileTap={{ scale: 0.95 }}
              className="bg-transparent border border-white/40 text-primary px-8 sm:px-12 py-5 sm:py-6 font-label-caps text-label-caps font-extrabold tracking-[0.2em] rounded-full w-full sm:w-auto cursor-pointer"
              id="hero-btn-tour"
            >
              TOUR ACADEMIA
            </motion.button>
          </motion.div>
        </motion.div>
      </header>

      {/* Partner Marquee */}
      <section className="py-12 bg-surface-container-lowest border-y border-white/5 overflow-hidden">
        <div className="marquee-container">
          <div className="marquee-content flex gap-24 items-center">
            {PARTNERS.concat(PARTNERS).map((partner, index) => (
              <span 
                key={index} 
                className="text-on-surface-variant/40 font-black text-2xl tracking-tighter uppercase italic select-none"
              >
                {partner}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* What is Rey Academy Section */}
      <section className="py-section-padding bg-background" id="nosotros">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-gutter">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={revealUp}
            className="text-center mb-20"
          >
            <span className="font-label-caps text-primary tracking-[0.4em] mb-4 block font-bold">INSTITUCIONAL</span>
            <h2 className="font-headline-lg text-[30px] sm:text-[38px] md:text-headline-lg text-primary font-extrabold uppercase mb-8">
              ¿Qué es Rey Academy?
            </h2>
            <p className="font-body-lg text-on-surface-variant max-w-3xl mx-auto font-medium">
              El epicentro de transformación empresarial para el sector cárnico en el mundo hispano.
            </p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {WHAT_IS_CARDS.map((card, i) => (
              <motion.div
                key={i}
                variants={revealUp}
                whileHover={{ y: -8, borderColor: "rgba(255,255,255,0.2)" }}
                className="p-8 bg-surface-container-low rounded-xl border border-white/5 transition-all duration-300"
              >
                <span className="material-symbols-outlined text-primary text-5xl mb-6">
                  {card.icon}
                </span>
                <h4 className="font-headline-md text-[20px] text-primary font-bold mb-4">
                  {card.title}
                </h4>
                <p className="font-body-md text-base text-on-surface-variant opacity-80">
                  {card.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-section-padding bg-surface-container-lowest" id="servicios">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-gutter">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={revealUp}
              className="max-w-2xl"
            >
              <span className="font-label-caps text-primary tracking-[0.3em] mb-4 block font-bold">PORTAFOLIO</span>
              <h2 className="font-headline-lg text-[30px] sm:text-[38px] md:text-headline-lg text-primary font-extrabold uppercase">
                Nuestros Servicios
              </h2>
            </motion.div>
            <motion.p 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={revealUp}
              className="font-body-md text-on-surface-variant/80 max-w-sm mt-8 md:mt-0 font-medium"
            >
              Soluciones integrales para cada etapa de crecimiento de tu empresa cárnica.
            </motion.p>
          </div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {SERVICES.map((service, i) => (
              <motion.div
                key={i}
                variants={revealUp}
                whileHover={{ y: -8, borderColor: "rgba(255,255,255,0.25)" }}
                className="group p-10 bg-background rounded-[32px] border border-white/5 transition-all duration-300 flex flex-col justify-between h-full"
              >
                <div>
                  <motion.span 
                    whileHover={{ rotate: 5, scale: 1.1 }}
                    className="material-symbols-outlined text-primary text-4xl mb-8 block w-fit"
                  >
                    {service.icon}
                  </motion.span>
                  <h3 className="font-headline-md text-primary font-bold mb-4">
                    {service.title}
                  </h3>
                  <p className="font-body-md text-on-surface-variant mb-8 leading-relaxed">
                    {service.description}
                  </p>
                </div>
                <motion.button 
                  whileHover={{ gap: "16px", x: 4 }}
                  className="text-primary font-label-caps text-[12px] flex items-center gap-2 font-bold tracking-widest cursor-pointer w-fit"
                >
                  CONOCER MÁS 
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How it Works / Timeline Section */}
      <section className="py-section-padding bg-background relative overflow-hidden">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-gutter">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={revealUp}
            className="text-center mb-24"
          >
            <span className="font-label-caps text-primary tracking-[0.4em] mb-4 block font-bold">PROCESO ESTRATÉGICO</span>
            <h2 class="font-headline-lg text-[30px] sm:text-[38px] md:text-headline-lg text-primary font-extrabold uppercase">
              Ruta al Éxito
            </h2>
          </motion.div>

          <div className="relative">
            {/* Connecting Horizontal Line in desktop */}
            <div className="hidden lg:block absolute top-1/2 left-0 w-full h-[1px] bg-white/10 -translate-y-1/2 z-0" />
            
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-12 relative z-10"
            >
              {TIMELINE_STEPS.map((step, i) => (
                <motion.div 
                  key={i}
                  variants={revealUp}
                  className="flex flex-col items-center text-center group"
                >
                  <motion.div 
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="w-16 h-16 bg-primary text-background rounded-full flex items-center justify-center font-display-xl text-2xl font-black mb-8 border-[6px] border-background relative z-10 select-none shadow-[0_0_20px_rgba(255,255,255,0.1)] cursor-default"
                  >
                    {step.step}
                  </motion.div>
                  <h4 className="font-headline-md text-[18px] text-primary font-bold mb-2 group-hover:text-white transition-colors">
                    {step.title}
                  </h4>
                  <p className="text-base text-on-surface-variant max-w-[180px] mx-auto font-medium">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Results Audit Counter Section */}
      <section className="py-section-padding bg-surface-container-lowest relative overflow-hidden" id="resultados">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-gutter">
          <h2 className="font-label-caps text-center text-on-surface-variant tracking-[0.4em] mb-16 font-bold opacity-60">
            RESULTADOS ACADÉMICOS AUDITADOS
          </h2>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-stack-lg">
            {STATS.map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: stat.delay }}
                className="text-center"
              >
                <div className="font-display-xl text-[36px] sm:text-[48px] md:text-[64px] text-primary mb-2 flex items-center justify-center font-extrabold tracking-tight">
                  <AnimatedCounter value={stat.target} prefix={stat.prefix} suffix={stat.suffix} />
                </div>
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

      {/* Success Cases Section */}
      <section className="py-section-padding bg-background">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-gutter">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={revealUp}
            className="text-center mb-20"
          >
            <span className="font-label-caps text-primary tracking-[0.4em] mb-4 block font-bold">CASOS DE ÉXITO</span>
            <h2 className="font-headline-lg text-[30px] sm:text-[38px] md:text-headline-lg text-primary font-extrabold uppercase">
              Historias de Transformación
            </h2>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {SUCCESS_CASES.map((success, i) => (
              <motion.div
                key={i}
                variants={revealUp}
                whileHover={{ y: -8, borderColor: "rgba(255,255,255,0.2)" }}
                className="bg-surface-container-low rounded-3xl overflow-hidden border border-white/5 transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  <div className="h-64 bg-surface-container-highest relative overflow-hidden">
                    <motion.img 
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      alt={success.name}
                      className="w-full h-full object-cover opacity-80 transition-all duration-500"
                      src={success.image}
                    />
                    <div className="absolute bottom-4 left-4 bg-primary/90 text-background px-4 py-1.5 rounded-full font-label-caps text-[10px] font-black shadow-lg">
                      {success.badge}
                    </div>
                  </div>
                  <div className="p-8">
                    <h4 className="font-headline-md text-[22px] text-primary font-bold mb-1">
                      {success.name}
                    </h4>
                    <p className="text-sm text-on-surface-variant/60 mb-6 font-bold tracking-widest uppercase">
                      {success.company}
                    </p>
                    <p className="font-body-md text-base text-on-surface-variant mb-6 italic leading-relaxed">
                      {success.quote}
                    </p>
                  </div>
                </div>
                <div className="px-8 pb-8">
                  <div className="flex justify-between items-center border-t border-white/5 pt-6">
                    <span className="font-label-caps text-[10px] text-primary font-bold tracking-wider">
                      {success.stat}
                    </span>
                    <span className="material-symbols-outlined text-primary text-xl" title="Auditado y Verificado">
                      verified
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Slider Section */}
      <section className="py-section-padding bg-surface-container-lowest">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-gutter">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={revealUp}
              className="flex flex-col h-full justify-between"
            >
              <div>
                <span className="font-label-caps text-primary tracking-[0.4em] mb-4 block font-bold">VOZ DEL CLIENTE</span>
                <h2 className="font-headline-lg text-[30px] sm:text-[38px] md:text-headline-lg text-primary font-extrabold uppercase mb-8">
                  Testimonios de Impacto
                </h2>
                <p className="font-body-lg text-on-surface-variant mb-12 max-w-md font-medium">
                  Empresarios que confiaron en nuestro método y hoy son referentes en sus mercados locales.
                </p>
              </div>
              
              {/* Slider controls */}
              <div className="flex gap-4">
                <motion.button 
                  whileHover={{ scale: 1.1, bg: "rgba(255,255,255,0.08)" }}
                  whileTap={{ scale: 0.9 }}
                  onClick={prevTestimonial}
                  className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center cursor-pointer text-primary transition-colors hover:border-white/20 select-none"
                  aria-label="Previous testimonial"
                >
                  <span className="material-symbols-outlined">arrow_back</span>
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.1, bg: "rgba(255,255,255,0.08)" }}
                  whileTap={{ scale: 0.9 }}
                  onClick={nextTestimonial}
                  className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center cursor-pointer text-primary transition-colors hover:border-white/20 select-none"
                  aria-label="Next testimonial"
                >
                  <span className="material-symbols-outlined">arrow_forward</span>
                </motion.button>
              </div>
            </motion.div>

            {/* Slide container */}
            <div className="relative h-72 sm:h-64 flex items-center">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={activeTestimonial}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4, ease: [0.2, 1, 0.3, 1] }}
                  className="w-full p-10 bg-background rounded-[32px] border border-white/5 flex flex-col justify-between h-full"
                >
                  <div>
                    <div className="flex gap-1 mb-6">
                      {[...Array(5)].map((_, starIdx) => (
                        <span key={starIdx} className="material-symbols-outlined text-status-success text-[18px]">
                          star
                        </span>
                      ))}
                    </div>
                    <p className="font-body-lg text-on-surface text-base sm:text-lg mb-8 italic leading-relaxed">
                      {TESTIMONIALS[activeTestimonial].text}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-surface-container-high overflow-hidden flex items-center justify-center border border-white/10 select-none">
                      <span className="material-symbols-outlined text-primary/55">person</span>
                    </div>
                    <div>
                      <h5 className="font-bold text-primary text-sm sm:text-base">
                        {TESTIMONIALS[activeTestimonial].author}
                      </h5>
                      <p className="text-[11px] sm:text-xs text-on-surface-variant font-bold tracking-widest uppercase">
                        {TESTIMONIALS[activeTestimonial].role}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

          </div>
        </div>
      </section>

      {/* Program central cards with 3D Parallax Tilt */}
      <section className="py-section-padding bg-background perspective" id="programas">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-gutter">
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={revealUp}
            className="flex flex-col mb-20 items-center text-center"
          >
            <span className="font-label-caps text-primary tracking-[0.3em] mb-4 font-bold uppercase">
              NUESTROS PROGRAMAS CENTRALES
            </span>
            <h2 className="font-headline-lg text-[30px] sm:text-[38px] md:text-headline-lg text-primary max-w-3xl font-extrabold uppercase leading-tight">
              Sistemas para el empresario de éxito
            </h2>
            <p className="font-body-md text-on-surface-variant mt-6 max-w-2xl font-medium">
              Estos son los pilares de nuestro ecosistema educativo, diseñados para llevar tu negocio al siguiente nivel operativo.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Program 1: Maquina del Exito */}
            <ParallaxCard 
              className="group bg-surface-container-low rounded-[32px] overflow-hidden border transition-shadow duration-300"
              style={{ 
                backgroundColor: "rgb(24, 17, 17)", 
                borderColor: "rgba(244, 37, 37, 0.25)" 
              }}
              glowColor="rgba(244, 37, 37, 0.45)"
            >
              <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-700 bg-[url('https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&q=80&w=1200')] bg-cover z-0" />
              
              <div className="relative h-full flex flex-col p-8 sm:p-10 lg:p-12 z-10 justify-between min-h-[500px] lg:min-h-[600px]">
                <div className="mb-auto">
                  <span className="bg-primary px-4 py-1.5 font-label-caps text-[10px] font-bold tracking-widest uppercase inline-block" style={{ backgroundColor: "rgb(244, 37, 37)", color: "rgb(255, 255, 255)" }}>
                    EL ESTÁNDAR DE ORO
                  </span>
                  <h3 className="font-display-xl text-[36px] sm:text-[48px] lg:text-[64px] mt-6 sm:mt-8 leading-none font-extrabold uppercase" style={{ color: "rgb(244, 37, 37)" }}>
                    Máquina<br />del Éxito
                  </h3>
                  <p className="font-body-lg text-on-surface-variant mt-8 max-w-md font-medium leading-relaxed">
                    El sistema de gestión integral que automatiza tu rentabilidad. Deja de <span className="font-bold">"atender"</span> y empieza a <span className="font-extrabold text-primary">"dirigir"</span>.
                  </p>
                </div>

                <div>
                  <div className="space-y-6 mb-12">
                    <div className="flex items-center gap-4">
                      <span className="w-10 h-10 border border-white/20 flex items-center justify-center text-primary transition-colors font-bold rounded-lg select-none">01</span>
                      <span className="font-body-md text-on-surface font-semibold">Ingeniería de Costos Pro</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="w-10 h-10 border border-white/20 flex items-center justify-center text-primary transition-colors font-bold rounded-lg select-none">02</span>
                      <span className="font-body-md text-on-surface font-semibold">Algoritmos de Inventario Zero</span>
                    </div>
                  </div>

                  <div className="flex items-end justify-between border-t border-white/10 pt-8">
                    <motion.a
                      href="https://maquina.reyacademy.com/maquina-del-exito-292448"
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-white text-black px-8 py-4 font-label-caps font-extrabold rounded-full tracking-widest cursor-pointer shadow-lg hover:shadow-white/5 inline-flex items-center justify-center"
                    >
                      POSTULAR AHORA
                    </motion.a>
                  </div>
                </div>
              </div>
            </ParallaxCard>

            {/* Program 2: Nitro Branding */}
            <ParallaxCard 
              className="group bg-surface-container-low rounded-[32px] overflow-hidden border transition-shadow duration-300"
              style={{ 
                backgroundColor: "rgb(2, 6, 23)", 
                borderColor: "rgba(13, 166, 242, 0.25)" 
              }}
              glowColor="rgba(13, 166, 242, 0.45)"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent z-0" />
              
              <div className="relative h-full flex flex-col p-8 sm:p-10 lg:p-12 z-10 justify-between min-h-[500px] lg:min-h-[600px]">
                <div className="mb-auto">
                  <span className="border text-white px-4 py-1.5 font-label-caps text-[10px] font-bold tracking-widest uppercase inline-block" style={{ borderColor: "rgb(56, 189, 248)", color: "rgb(56, 189, 248)" }}>
                    ESCALADO EXPONENCIAL
                  </span>
                  <h3 className="font-display-xl text-[36px] sm:text-[48px] lg:text-[64px] mt-6 sm:mt-8 leading-none font-extrabold uppercase" style={{ color: "rgb(13, 166, 242)" }}>
                    Nitro <br />Branding
                  </h3>
                  <p className="font-body-lg text-on-surface-variant mt-8 max-w-md font-medium leading-relaxed" style={{ color: "rgb(241, 245, 249)" }}>
                    Domina el posicionamiento local y digital. Conviértete en el referente de autoridad en tu ciudad.
                  </p>
                </div>

                <div>
                  <div className="space-y-6 mb-12">
                    <div className="flex items-center gap-4">
                      <span className="w-10 h-10 border flex items-center justify-center text-primary transition-colors font-bold rounded-lg select-none" style={{ borderColor: "rgba(13, 166, 242, 0.4)", color: "rgb(13, 166, 242)" }}>01</span>
                      <span className="font-body-md text-on-surface font-semibold">Embudos de Venta Local</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="w-10 h-10 border flex items-center justify-center text-primary transition-colors font-bold rounded-lg select-none" style={{ borderColor: "rgba(13, 166, 242, 0.4)", color: "rgb(13, 166, 242)" }}>02</span>
                      <span className="font-body-md text-on-surface font-semibold">Marketing de Alto Ticket</span>
                    </div>
                  </div>

                  <div className="flex items-end justify-between border-t border-white/10 pt-8">
                    <motion.a
                      href="https://inscripcion.reyacademy.com/nitro_sales_2026-page"
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-white text-black px-8 py-4 font-label-caps font-extrabold rounded-full tracking-widest cursor-pointer shadow-lg hover:shadow-white/5 inline-flex items-center justify-center"
                    >
                      POSTULAR AHORA
                    </motion.a>
                  </div>
                </div>
              </div>
            </ParallaxCard>

          </div>
        </div>
      </section>

      {/* About Us / History Section */}
      <section className="py-section-padding bg-background border-y border-white/5" id="nosotros">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-gutter">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            
            {/* Founder Image Column */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.2, 1, 0.3, 1] }}
              className="w-full lg:w-[45%]"
            >
              <div className="relative rounded-[32px] overflow-hidden aspect-[4/5] shadow-2xl group border border-white/10">
                <motion.img 
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.8 }}
                  alt="Founder of Rey Academy" 
                  className="w-full h-full object-cover grayscale transition-all duration-500 hover:grayscale-0" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAVlIBYYxjn9sUnG7eGwEp6vhpgn8NM04P1_stNgic3sZN4rJrEEt99bQUJsSuqSnXNKL3WJkl1KFO0Dz2f0bmxjG0ohGOxyhw4o-2iyVdhLOlVj8o6ETGMi_v2dzEnVzR5q_KKDIbu_pe71aVN5yoA3VArLd3cHjCHQVlhT59TYdPIP_1L4lelWQwFSkJPiM_eTgFEAKpFQ4gOSpHrIDglVEpykw-BNv6gq6ow-XSSlTx3x1mTNLXTMp_tKeSsZ1gDBABImiGjHEs"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
              </div>
            </motion.div>

            {/* Founder Story Column */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={revealUp}
              className="w-full lg:w-[55%]"
            >
              <div className="max-w-2xl">
                <div className="inline-block border-l-4 border-primary pl-6 mb-12">
                  <span className="font-label-caps text-primary text-[13px] tracking-[0.4em] font-extrabold uppercase block mb-4">
                    Nuestra Historia
                  </span>
                  <h2 className="font-headline-lg text-[30px] sm:text-[38px] md:text-headline-lg text-primary font-extrabold leading-[1.1] mb-0 uppercase">
                    Sobre Rey Academy
                  </h2>
                </div>

                <div className="space-y-8">
                  <p className="font-body-lg text-on-surface-variant font-medium leading-relaxed">
                    Nuestra historia no comenzó en una oficina, sino detrás de un mostrador. Rey Academy nació de la necesidad real de transformar el esfuerzo físico agotador en inteligencia estratégica. Durante décadas, vimos cómo dueños de carnicerías entregaban su vida al negocio sin ver la rentabilidad que merecían, atrapados en la operatividad diaria.
                  </p>
                  <p className="font-body-lg text-on-surface-variant font-medium leading-relaxed">
                    Hoy, esa chispa inicial se ha convertido en el ecosistema de formación más influyente de la industria cárnica en habla hispana. No solo compartimos teoría; entregamos los sistemas, las métricas y la mentalidad necesaria para que el carnicero deje de ser un autoempleado y se convierta en el CEO de su propio imperio alimentario, logrando finalmente el equilibrio entre éxito financiero y calidad de vida familiar.
                  </p>
                  
                  <p className="font-body-md text-on-surface-variant/85 italic border-l border-white/20 pl-6 leading-relaxed">
                    "No enseñamos a cortar carne, enseñamos a construir imperios rentables que funcionen sin que el dueño tenga que estar presente."
                  </p>

                  <div className="space-y-6 pt-4 border-t border-white/5">
                    <div className="flex items-start sm:items-center gap-6">
                      <span className="font-display-xl text-2xl text-primary font-black w-16 block flex-shrink-0">2010</span>
                      <p className="text-sm sm:text-base text-on-surface-variant font-medium">Fundación del primer centro de capacitación técnico-familiar.</p>
                    </div>
                    <div className="flex items-start sm:items-center gap-6">
                      <span className="font-display-xl text-2xl text-primary font-black w-16 block flex-shrink-0">2018</span>
                      <p className="text-sm sm:text-base text-on-surface-variant font-medium">Lanzamiento de la plataforma digital para todo Latinoamérica.</p>
                    </div>
                    <div className="flex items-start sm:items-center gap-6">
                      <span className="font-display-xl text-2xl text-primary font-black w-16 block flex-shrink-0">2023</span>
                      <p className="text-sm sm:text-base text-on-surface-variant font-medium">Consolidación como la autoridad #1 en gestión cárnica empresarial.</p>
                    </div>
                  </div>

                  <div className="pt-12">
                    <motion.button 
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
                    </motion.button>
                  </div>

                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Methodology Section */}
      <section className="py-section-padding bg-surface-container-lowest">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-gutter">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={revealUp}
            className="text-center mb-24"
          >
            <span className="font-label-caps text-primary tracking-[0.4em] mb-4 block font-bold">FILOSOFÍA</span>
            <h2 className="font-headline-lg text-[30px] sm:text-[38px] md:text-headline-lg text-primary font-extrabold uppercase">
              Metodología REY
            </h2>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {[
              { title: "Aprender Haciendo", desc: "No somos teóricos. Cada lección se basa en la práctica real del mostrador." },
              { title: "Implementación Inmediata", desc: "Lo que aprendes hoy lo aplicas mañana para ver resultados en caja." },
              { title: "Acompañamiento", desc: "Nunca caminas solo; nuestro equipo de soporte está siempre disponible." },
              { title: "Medición", desc: "Lo que no se mide no se mejora. Auditoría constante de KPIS." },
              { title: "Automatización", desc: "Creamos sistemas que trabajan para ti, no al revés." },
              { title: "Escalabilidad", desc: "Diseñado para crecer de una carnicería de barrio a un imperio." }
            ].map((method, i) => (
              <motion.div
                key={i}
                variants={revealUp}
                whileHover={{ y: -6, borderColor: "rgba(255,255,255,0.2)" }}
                className="p-10 bg-background rounded-3xl border border-white/5 transition-all duration-300"
              >
                <h4 className="font-headline-md text-[20px] text-primary font-bold mb-4">
                  {method.title}
                </h4>
                <p className="text-base text-on-surface-variant leading-relaxed">
                  {method.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Global Community Section */}
      <section className="py-section-padding bg-background overflow-hidden" id="comunidad">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-gutter">
          <div className="flex flex-col lg:flex-row gap-20 items-center">
            
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={revealUp}
              className="w-full lg:w-1/2"
            >
              <span className="font-label-caps text-primary tracking-[0.4em] mb-4 block font-bold">ECOSISTEMA</span>
              <h2 className="font-headline-lg text-[30px] sm:text-[38px] md:text-headline-lg text-primary font-extrabold uppercase mb-8">
                Comunidad Global de Empresarios
              </h2>
              <p className="font-body-lg text-on-surface-variant mb-12 font-medium">
                Accede a una red de contactos invaluable con dueños de negocios en más de 15 países.
              </p>
              
              <ul className="space-y-6">
                <motion.li whileHover={{ x: 6 }} className="flex items-center gap-4 cursor-default">
                  <span className="material-symbols-outlined text-primary text-2xl">hub</span>
                  <span className="font-body-md font-bold text-lg">Canal de Discord Exclusivo</span>
                </motion.li>
                <motion.li whileHover={{ x: 6 }} className="flex items-center gap-4 cursor-default">
                  <span className="material-symbols-outlined text-primary text-2xl">video_stable</span>
                  <span className="font-body-md font-bold text-lg">Masterclasses en Vivo Mensuales</span>
                </motion.li>
                <motion.li whileHover={{ x: 6 }} className="flex items-center gap-4 cursor-default">
                  <span className="material-symbols-outlined text-primary text-2xl">handshake</span>
                  <span className="font-body-md font-bold text-lg">Eventos de Networking VIP</span>
                </motion.li>
              </ul>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.2, 1, 0.3, 1] }}
              className="w-full lg:w-1/2 grid grid-cols-2 gap-4"
            >
              <motion.div whileHover={{ scale: 1.03 }} className="h-60 bg-surface-container-low rounded-2xl overflow-hidden border border-white/5">
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBNO0mN-_B1-jQHjdPHlBSJsoA-6c9Ahx9V02SvF1ANYNqhLUpWrP69JdmDRc8v0XEw8D5BPrJrFYc0N3oyKfE7DqeLskpgLfuJnkuR9yCEPa7qk4rwnFo_63uYzRQWRFUTYMaDG-ncHFnmCk34Vc5wNq4jd5r8SVOfNgJSd-6h7DcKenOz3mwNQyWoXvMc_RRJC6vLxrQELLxE3YGqvyuZglFxgFGHy6lcjAAWv_ynuX2-wOlO14XpClvu5Vg7oRtbqaBkdnEk3UE" alt="Discord Community" className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" />
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} className="h-60 bg-surface-container-low rounded-2xl mt-12 overflow-hidden border border-white/5">
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDAKEh7ateFVN64Tek4cBR0hMAzwHgGyagNSoCx-jcDkQzFmFW3btkqVyC7kgmrstsv8aweaGV8gGeoyjdOrn0vKIvZ7dtSPD5yJkx1w0q09VeWDFgHz32BHwp3Uzz4xX8L6sgRpfMMYYPb5_9VR5rc55Yf664GbfGtLejmdiIWU7wPyHuOoCQrpRqA_vRm86w53tZdWRFsglRDnpjetOgZNpaJAjY_Gv_dRXGnJG_m0AZ6MyGgDhzHIfpB7Q2CBqCXZ-RUQ6ycj-Y" alt="Masterclasses" className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" />
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} className="h-60 bg-surface-container-low rounded-2xl -mt-12 overflow-hidden border border-white/5">
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAXloRUE0MjZoxwkYr6zGqTj2VRWywFPaodB0EVE88bpNcEBWeYZNNrfhVBSPQduY9v2DUMUJuOQ7a-APoJqfV-xBQHk2oNaX4AsfJdyDciaRg4XTKV_6_7mIc4HJLtsx5jMuZ9koageWZX09yJ0k0l0wy6hYFJcVG-uG9PV9GBViKgfoBIc9K_mSQBvd0xszMzxCEUfDMxtFdfpPD43jamST34ruCUC2fWDJOM1k4VegL9D9BcHjiujdBxZGw9QSM-wKCZYtHi-nU" alt="Networking Events" className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" />
              </motion.div>
              <div className="h-60 bg-surface-container-low rounded-2xl border border-white/5 flex items-center justify-center p-6 text-center">
                <span className="font-display-xl text-xl sm:text-2xl text-white font-extrabold uppercase tracking-widest opacity-60">
                  +1,500 <br />Miembros
                </span>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Free Resources Section */}
      <section className="py-section-padding bg-surface-container-lowest" id="recursos">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-gutter">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={revealUp}
            className="text-center mb-20"
          >
            <span className="font-label-caps text-primary tracking-[0.4em] mb-4 block font-bold">BIBLIOTECA</span>
            <h2 className="font-headline-lg text-[30px] sm:text-[38px] md:text-headline-lg text-primary font-extrabold uppercase">
              Recursos Gratuitos
            </h2>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
          >
            {FREE_RESOURCES.map((res, i) => (
              <motion.div
                key={i}
                variants={revealUp}
                whileHover={{ y: -8, borderColor: "rgba(255,255,255,0.2)", bg: "rgba(255,255,255,0.01)" }}
                className="bg-background p-8 rounded-2xl border border-white/5 transition-all duration-300 flex flex-col items-start"
              >
                <span className="material-symbols-outlined text-primary text-3xl mb-6">
                  {res.icon}
                </span>
                <h5 className="font-bold text-base mb-2 text-white">
                  {res.title}
                </h5>
                <p className="text-sm text-on-surface-variant font-medium">
                  {res.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-section-padding bg-background">
        <div className="max-w-3xl mx-auto px-margin-mobile">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={revealUp}
            className="text-center mb-16"
          >
            <span className="font-label-caps text-primary tracking-[0.4em] mb-4 block font-bold">PREGUNTAS</span>
            <h2 className="font-headline-lg text-[30px] sm:text-[38px] md:text-headline-lg text-primary font-extrabold uppercase">
              Dudas Frecuentes
            </h2>
          </motion.div>

          <FaqAccordion />
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-section-padding bg-primary text-background relative overflow-hidden" id="contacto">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-container-max mx-auto px-margin-mobile md:px-gutter relative z-10 text-center"
        >
          <span className="font-label-caps text-[12px] sm:text-[14px] font-extrabold tracking-[0.3em] sm:tracking-[0.5em] mb-8 block opacity-80 uppercase">
            ÚLTIMAS PLAZAS DISPONIBLES
          </span>
          <h2 className="font-display-xl text-[48px] sm:text-[64px] md:text-[100px] text-background mb-stack-lg leading-[0.85] sm:leading-[0.8] font-extrabold uppercase">
            Empieza tu <br />Libertad
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
        </motion.div>
        
        {/* Giant decorative background text */}
        <div className="absolute inset-0 opacity-10 pointer-events-none flex items-center justify-center select-none z-0">
          <span className="text-[300px] sm:text-[400px] lg:text-[500px] font-extrabold text-background tracking-tighter">
            REY
          </span>
        </div>
      </section>

      {/* Robust Footer */}
      <footer className="bg-surface-container-lowest border-t border-white/5 pt-24 pb-12">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-gutter">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-24">
            <div>
              <div className="font-headline-md text-primary font-black mb-8">REY ACADEMY</div>
              <p className="text-on-surface-variant text-base leading-relaxed mb-8 font-medium">
                Líderes mundiales en la profesionalización del sector cárnico. Transformamos carnicerías en empresas rentables y automatizadas.
              </p>
              <div className="flex gap-4">
                <motion.a whileHover={{ y: -3 }} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-background transition-colors" href="#">
                  <span className="material-symbols-outlined text-base">share</span>
                </motion.a>
                <motion.a whileHover={{ y: -3 }} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-background transition-colors" href="#">
                  <span className="material-symbols-outlined text-base">play_arrow</span>
                </motion.a>
                <motion.a whileHover={{ y: -3 }} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-background transition-colors" href="#">
                  <span className="material-symbols-outlined text-base">alternate_email</span>
                </motion.a>
              </div>
            </div>

            <div>
              <h4 className="font-label-caps text-[12px] text-primary font-black tracking-widest mb-8">
                NAVEGACIÓN
              </h4>
              <ul className="space-y-4 text-base text-on-surface-variant font-bold">
                <li><a className="hover:text-primary transition-colors" href="#">Inicio</a></li>
                <li><a className="hover:text-primary transition-colors" href="#nosotros">Nosotros</a></li>
                <li><a className="hover:text-primary transition-colors" href="#servicios">Servicios</a></li>
                <li><a className="hover:text-primary transition-colors" href="#programas">Programas</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-label-caps text-[12px] text-primary font-black tracking-widest mb-8">
                RECURSOS
              </h4>
              <ul className="space-y-4 text-base text-on-surface-variant font-bold">
                <li><a className="hover:text-primary transition-colors" href="#resultados">Resultados</a></li>
                <li><a className="hover:text-primary transition-colors" href="#comunidad">Comunidad</a></li>
                <li><a className="hover:text-primary transition-colors" href="#recursos">Blog Académico</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Podcast REY</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-label-caps text-[12px] text-primary font-black tracking-widest mb-8">
                CONTACTO
              </h4>
              <ul className="space-y-4 text-base text-on-surface-variant font-medium">
                <li className="flex items-center gap-3"><span className="material-symbols-outlined text-primary text-base">mail</span> contacto@reyacademy.com</li>
                <li className="flex items-center gap-3"><span class="material-symbols-outlined text-primary text-base">call</span> +1 (555) 902-1234</li>
                <li className="flex items-center gap-3"><span className="material-symbols-outlined text-primary text-base">location_on</span> Global Operations</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/5 pt-12 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[10px] text-on-surface-variant font-bold tracking-widest uppercase">
              © 2026 REY ACADEMY. TODOS LOS DERECHOS RESERVADOS.
            </p>
            <div className="flex gap-8 text-[10px] text-on-surface-variant font-bold tracking-widest uppercase">
              <a className="hover:text-primary transition-colors" href="#">Términos y Condiciones</a>
              <a className="hover:text-primary transition-colors" href="#">Privacidad</a>
              <a className="hover:text-primary transition-colors" href="#">Cookies</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
