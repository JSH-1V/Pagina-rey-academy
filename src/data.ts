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

export interface ResourceItem {
  icon: string;
  title: string;
  description: string;
  delay: number;
}

export const NAV_LINKS = [
  { label: "INICIO", href: "#" },
  { label: "NOSOTROS", href: "#nosotros" },
  { label: "SERVICIOS", href: "#servicios" },
  { label: "PROGRAMAS", href: "#programas" },
  { label: "RESULTADOS", href: "#resultados" },
  { label: "COMUNIDAD", href: "#comunidad" },
  { label: "RECURSOS", href: "#recursos" },
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
    description: "Formación asincrónica integral disponible las 24 horas del día.",
    delay: 0,
  },
  {
    icon: "model_training",
    title: "Mentorías empresariales",
    description: "Sesiones estratégicas enfocadas en responder tus dudas.",
    delay: 0.1,
  },
  {
    icon: "query_stats",
    title: "Consultorías",
    description: "Análisis profundo de tu modelo de negocio, sus procesos y rentabilidad.",
    delay: 0.2,
  },
  {
    icon: "bolt",
    title: "Programas intensivos",
    description: "Inmersiones de alto impacto para acelerar resultados.",
    delay: 0.3,
  },
  {
    icon: "event_available",
    title: "Eventos",
    description: "Seminarios presenciales tácticos en las principales ciudades donde está nuestra comunidad.",
    delay: 0.4,
  },
  {
    icon: "diversity_3",
    title: "Comunidad Privada",
    description: "Círculo de confianza para intercambio de proveedores y estrategias.",
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
  { target: 7500, suffix: "+", title: "MENTORÍAS EXITOSAS", desc: "Enfoque en rentabilidad neta", delay: 0.1 },
  { target: 12, suffix: "M", prefix: "$", title: "AHORRO EN MERMAS", desc: "Capital recuperado para reinversión", delay: 0.2 },
  { target: 350, suffix: "%", title: "ROI PROMEDIO", desc: "Retorno sobre inversión educativa", delay: 0.3 },
  { target: 15, suffix: "+", title: "PAÍSES IMPACTADOS", desc: "Dominio del mercado LATAM", delay: 0.4 },
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

export const FREE_RESOURCES: ResourceItem[] = [
  {
    icon: "article",
    title: "Blog",
    description: "Artículos de gestión.",
    delay: 0,
  },
  {
    icon: "podcasts",
    title: "Podcast",
    description: "Charlas con líderes.",
    delay: 0.1,
  },
  {
    icon: "smart_display",
    title: "YouTube",
    description: "Tips técnicos.",
    delay: 0.2,
  },
  {
    icon: "auto_stories",
    title: "Guías",
    description: "PDFs de descarga.",
    delay: 0.3,
  },
  {
    icon: "table_chart",
    title: "Plantillas",
    description: "Excels operativos.",
    delay: 0.4,
  },
];

export const FAQS: FaqItem[] = [
  {
    question: "¿Necesito experiencia previa en gestión?",
    answer: "No. Nuestros programas están diseñados para llevarte desde las bases hasta el nivel experto, sin importar si vienes de un entorno operativo o administrativo.",
    delay: 0,
  },
  {
    question: "¿Cuánto dura la formación?",
    answer: "La duración varía según el programa. La Academia Online es de acceso vitalicio, mientras que las Mentorías suelen tener una duración de 3 a 6 meses.",
    delay: 0.1,
  },
  {
    question: "¿Hay garantía de resultados?",
    answer: "Garantizamos que si aplicas el sistema al pie de la letra, verás una mejora inmediata en tus márgenes operativos. Contamos con políticas específicas de satisfacción.",
    delay: 0.2,
  },
];
