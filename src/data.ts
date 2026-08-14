export interface ServiceItem {
  icon: string;
  title: string;
  description: string;
  delay: number;
}

export interface TimelineStep {
  step: string;
  title: string;
  description: string;
  delay: number;
}

export interface FaqItem {
  question: string;
  answer: string;
  delay: number;
}

export interface ProgramBooking {
  id: string;
  productName: string;
  badgeText: string;
  accentColor: string;
  accentColorSoft: string;
  /**
   * URL del widget de Calendario de GHL para este producto.
   * Reemplazar el valor "REEMPLAZAR_..." por la URL real que entrega GHL
   * al crear el Calendario del producto (botón "Embed" del Calendario).
   */
  calendarEmbedUrl: string;
}

export const PROGRAM_BOOKINGS: Record<string, ProgramBooking> = {
  maquina: {
    id: "maquina",
    productName: "Máquina del Éxito",
    badgeText: "EL ESTÁNDAR DE ORO",
    accentColor: "rgb(244, 37, 37)",
    accentColorSoft: "rgba(244, 37, 37, 0.12)",
    calendarEmbedUrl: "https://api.leadconnectorhq.com/widget/booking/CXb9wHmO8xOUYguLfgUr",
  },
  nitro: {
    id: "nitro",
    productName: "Nitro Branding",
    badgeText: "ESCALADO EXPONENCIAL",
    accentColor: "rgb(13, 166, 242)",
    accentColorSoft: "rgba(13, 166, 242, 0.12)",
    calendarEmbedUrl: "https://api.leadconnectorhq.com/widget/booking/vwwzN527uPPA70U0y3GC",
  },
  maestria: {
    id: "maestria",
    productName: "Maestría de la Carne",
    badgeText: "EL NIVEL MÁS ALTO",
    accentColor: "rgb(212, 163, 23)",
    accentColorSoft: "rgba(212, 163, 23, 0.12)",
    calendarEmbedUrl: "https://api.leadconnectorhq.com/widget/booking/xQKcGWQi18lXyRiFkgRM",
  },
};

export const NAV_LINKS = [
  { label: "INICIO", href: "#" },
  { label: "NOSOTROS", href: "#nosotros" },
  { label: "SERVICIOS", href: "#servicios" },
  { label: "PROGRAMAS", href: "#programas" },
  { label: "RESULTADOS", href: "#resultados" },
  { label: "COMUNIDAD", href: "#comunidad" },
  { label: "CONTACTO", href: "#contacto" },
];

export const PARTNERS = [
  "CARNES ELITE",
  "MEAT MASTER PRO",
  "GLOBAL BEEF SOLUTIONS",
  "PRIME CUTS ACADEMY",
  "RED MEAT DISTRIBUTORS",
  "LA BOUTIQUE DE LA CARNE",
];

export const WHAT_IS_CARDS = [
  {
    icon: "school",
    title: "Formación empresarial",
    description: "Diseñada integralmente para trabajar mente, alma y cuerpo de tu empresa.",
    delay: 0,
  },
  {
    icon: "settings_suggest",
    title: "Sistemas comprobados",
    description: "Funcionan como base de todo negocio a nivel internacional.",
    delay: 0.1,
  },
  {
    icon: "psychology",
    title: "Acompañamiento personalizado",
    description: "Seguimiento 1:1 por expertos en cada sistema empresarial.",
    delay: 0.2,
  },
  {
    icon: "groups",
    title: "Comunidad de empresarios",
    description: "Grandes mentes haciendo networking.",
    delay: 0.3,
  },
];

export const SERVICES: ServiceItem[] = [
  {
    icon: "laptop_mac",
    title: "Academia Online",
    description: "Formación asincrónica integral disponible las 24 horas del día. Accedés a más de 150 lecciones grabadas en full HD, organizadas por módulos —Fundamentos, Talento, Ventas, Rentabilidad y Producto— para avanzar a tu ritmo sin depender de un horario fijo ni quedarte afuera si un día no llegás a una sesión en vivo.",
    delay: 0,
  },
  {
    icon: "model_training",
    title: "Mentorías empresariales",
    description: "Sesiones grupales enfocadas en resolver tus dudas reales, junto a Elbio Prida y expertos en asesoramiento empresarial, administrativo, de talento y de ventas. El foco es ejecución: claridad, dirección y soluciones concretas para tu carnicería, no teoría general.",
    delay: 0.1,
  },
  {
    icon: "query_stats",
    title: "Consultorías",
    description: "Análisis profundo de tu modelo de negocio, sus procesos y rentabilidad. Detectamos con precisión dónde se te está yendo la plata —mermas, costos invisibles, errores operativos— y te entregamos un diagnóstico claro con los cuellos de botella que más te frenan hoy.",
    delay: 0.2,
  },
  {
    icon: "bolt",
    title: "Programas intensivos",
    description: "Inmersiones de alto impacto pensadas para instalar sistemas de números, operación y equipo en semanas, no en años, y así multiplicar tu rentabilidad sin sumar más horas de trabajo al mostrador.",
    delay: 0.3,
  },
  {
    icon: "event_available",
    title: "Eventos",
    description: "Seminarios presenciales tácticos en las principales ciudades donde está nuestra comunidad. Espacios de networking real con otros dueños de carnicerías de la región, donde se comparten estrategias, proveedores y soluciones a los mismos desafíos del día a día.",
    delay: 0.4,
  },
  {
    icon: "diversity_3",
    title: "Comunidad Privada",
    description: "Círculo de confianza para intercambio de proveedores y estrategias, con acompañamiento sostenido para que no implementes solo. Resolvés dudas, compartís avances y te rodeás de empresarios que entienden lo que es vivir del negocio cárnico.",
    delay: 0.5,
  },
];

export const TIMELINE_STEPS: TimelineStep[] = [
  {
    step: "01",
    title: "Diagnóstico",
    description: "Evaluación 360° de tu situación actual.",
    delay: 0,
  },
  {
    step: "02",
    title: "Plan Maestro",
    description: "Hoja de ruta personalizada de mermas y costos.",
    delay: 0.1,
  },
  {
    step: "03",
    title: "Capacitación",
    description: "Transferencia de conocimientos técnicos.",
    delay: 0.2,
  },
  {
    step: "04",
    title: "Implementación",
    description: "Puesta en marcha de sistemas operativos.",
    delay: 0.3,
  },
  {
    step: "05",
    title: "Escalado",
    description: "Expansión de márgenes y automatización.",
    delay: 0.4,
  },
];

export const STATS = [
  { target: 1200, suffix: "+", title: "MENTORÍAS EXITOSAS", desc: "Enfoque en rentabilidad neta", delay: 0.1 },
  { target: 12, suffix: "M", prefix: "$", title: "AHORRO EN MERMAS", desc: "Capital recuperado para reinversión", delay: 0.2 },
  { target: 150, suffix: "%", title: "ROI PROMEDIO", desc: "Retorno sobre inversión educativa", delay: 0.3 },
  { target: 10, suffix: "+", title: "PAÍSES IMPACTADOS", desc: "Dominio del mercado LATAM", delay: 0.4 },
];

export const TESTIMONIAL_VIDEOS: string[] = [
  "https://assets.cdn.filesafe.space/WDYpjQTiKpK6eUD1aFYZ/media/6a6cf39aee7c9fa58ab1a2cd.mp4",
  "https://assets.cdn.filesafe.space/WDYpjQTiKpK6eUD1aFYZ/media/6a6cf39aee7c9fa58ab1a2de.mp4",
  "https://assets.cdn.filesafe.space/WDYpjQTiKpK6eUD1aFYZ/media/6a6cf39a3e7f0eb554c0f758.mp4",
  "https://assets.cdn.filesafe.space/WDYpjQTiKpK6eUD1aFYZ/media/6a6cf39a2dd240068d2fbe93.mp4",
  "https://assets.cdn.filesafe.space/WDYpjQTiKpK6eUD1aFYZ/media/6a6cf439497cd89d244451bc.mp4",
  "https://assets.cdn.filesafe.space/WDYpjQTiKpK6eUD1aFYZ/media/6a6cf39a5c1fd3e905932062.mp4",
  "https://assets.cdn.filesafe.space/WDYpjQTiKpK6eUD1aFYZ/media/6a6cf46832db2dd157e79ea4.mp4",
  "https://assets.cdn.filesafe.space/WDYpjQTiKpK6eUD1aFYZ/media/6a6cf39aee7c9fa58ab1a2bc.mp4",
  "https://assets.cdn.filesafe.space/WDYpjQTiKpK6eUD1aFYZ/media/6a6cf472497cd89d24448164.mp4",
  "https://assets.cdn.filesafe.space/WDYpjQTiKpK6eUD1aFYZ/media/6a6cf4653e7f0eb554c28b14.mp4",
  "https://assets.cdn.filesafe.space/WDYpjQTiKpK6eUD1aFYZ/media/6a6cf4bb188345b27eef4d08.mp4",
  "https://assets.cdn.filesafe.space/WDYpjQTiKpK6eUD1aFYZ/media/6a6cf4c35c1fd3e90594a25d.mp4",
  "https://assets.cdn.filesafe.space/WDYpjQTiKpK6eUD1aFYZ/media/6a6cf52dcf81b06f052aeb21.mp4",
];

export const FAQS: FaqItem[] = [
  {
    question: "Mi carnicería es distinta / en mi país la cosa está complicada. ¿Igual me sirve?",
    answer: "Sí. Los sistemas se adaptan a cualquier ciudad y a cualquier economía, porque el problema de fondo (falta de orden y de números claros) es el mismo en todos lados. No importa el tamaño de tu local ni cómo esté el mercado.",
    delay: 0,
  },
  {
    question: "¿Cómo empiezo en Rey Academy?",
    answer: "La puerta de entrada es contactarnos o esperar a uno de nuestros eventos gratuitos como Maratón del Carnicero, un curso gratuito de 5 días donde conocés los 5 sistemas para transformar tu carnicería en una máquina de rentabilidad y tiempo. Es sin costo y es el mejor primer paso para ver cómo trabajamos.",
    delay: 0.05,
  },
  {
    question: "¿Qué programas ofrece Rey Academy?",
    answer: "Tenemos un camino completo según el momento de cada negocio: desde el Maratón gratuito para empezar, hasta programas de implementación de sistemas, formación del equipo y mentoría para dueños que quieren escalar. La idea es acompañarte en cada etapa, no venderte una sola cosa y desaparecer.",
    delay: 0.1,
  },
  {
    question: "¿Es todo teoría o se aplica de verdad?",
    answer: 'Se aplica. El enfoque de Rey Academy es implementación, no información para juntar en el celular. Trabajamos con plantillas listas para usar, sesiones en vivo y correcciones sobre tu negocio real, para que avances semana a semana y no te quedes solo con "entender".',
    delay: 0.15,
  },
  {
    question: "No soy bueno con los números ni con la tecnología. ¿Voy a poder?",
    answer: "Sí. Todo está pensado para el dueño que está en el mostrador, no para un contador ni un experto en computación. Las herramientas son simples: cargás los datos y ves cuánto ganás y dónde se te va la plata.",
    delay: 0.2,
  },
  {
    question: "No tengo tiempo. ¿Cómo hago?",
    answer: "Los programas están armados para dueños ocupados. El contenido queda grabado y lo ves a tu ritmo, sin fechas fijas. Si un día no podés estar en una sesión en vivo, no te quedás afuera.",
    delay: 0.25,
  },
  {
    question: "¿Es todo online? ¿Desde qué países puedo participar?",
    answer: "Es 100% online. Podés participar desde cualquier país de Latinoamérica, desde la computadora o el celular. Solo necesitás internet.",
    delay: 0.3,
  },
  {
    question: "¿Voy a estar solo o hay acompañamiento?",
    answer: "No estás solo. Rey Academy tiene mentorías en vivo y una comunidad activa de carniceros de toda la región. Compartís con gente que tiene tus mismos desafíos y avanzás acompañado.",
    delay: 0.35,
  },
  {
    question: "¿Por qué debería confiar en Rey Academy?",
    answer: "Porque Elbio da la cara con su nombre, hace sesiones en vivo y trabaja exclusivamente con el mundo carnicero. Hay testimonios reales de dueños que ordenaron sus números, mejoraron su rentabilidad y dejaron de depender de estar en todo.",
    delay: 0.4,
  },
  {
    question: "Tengo una duda puntual. ¿Con quién hablo?",
    answer: "Escribinos por WhatsApp y alguien del equipo te responde para ver tu caso. No es una charla de venta: es entender en qué momento está tu carnicería y qué paso te conviene dar.",
    delay: 0.45,
  },
];
