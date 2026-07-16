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

export interface SuccessCase {
  image: string;
  badge: string;
  name: string;
  company: string;
  quote: string;
  stat: string;
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

export const SUCCESS_CASES: SuccessCase[] = [
  {
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuClP5BNeo6fVCFuIN0fkl51mgW8sLCJW0Wwj44Jojgcw3mloXPIVpuPdxxNJwK-VV81Z8w_ZStDMElqYsY4RgYnmjYAge0SlDD1Zrr3JWeNM40rjApU0YJJm6V71X6rKNUmU8XBaNagnzH-U9dr1883LbyrJ9DfAYZONaPUwkh6Kkjee3iTBHTAQwiuRG6h1AzypWWfhb6x7MGHjXQ78YSxzqiAgzIs2TKLznguFadEg805uwla26PFKZPGT5HLq___nb0b-fq2neE",
    badge: "+240% RENTABILIDAD",
    name: "Roberto Méndez",
    company: "Carnes del Norte, México",
    quote: '"Logramos sistematizar las 3 sucursales y ahora opero solo 4 horas a la semana."',
    stat: "REDUCCIÓN MERMA: 18%",
    delay: 0,
  },
  {
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBokKZnccirXIvfdpd-LBYRpfixJHDq9dQnXxVGfw3MnbFpm2btcLLh4JHjc7EygpSLwuvtNgl2-_Y2Ux-gExcRSHQWxzB2oFlLI5Lr075MgOZhK1_aEHWqwDfXXZHgfRmaupZUyrAhvlRtAEYroctMwNcue-eIrbrMnCD3ZS2qupXpECwfQK9vWanqjmvS7h_KUNHm1zTLpu9GzyZ0JB9jdOyQj4h1dSMOve9_UzPUbR0sK4eRN7G4FYhlRuvMVKAu_HDk3ugcQtA",
    badge: "REDUCCIÓN 0% DEUDA",
    name: "Juan Carlos Paez",
    company: "FrigoPremium, Colombia",
    quote: '"El control de inventario de Rey Academy salvó mi flujo de caja en solo 3 meses."',
    stat: "COSTO REDUCIDO: 12%",
    delay: 0.1,
  },
  {
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBPIT9b3JqVcVhiAIIZhLiObZPTnCI0jIJCTB3hhTuQTiQZ7aVN4KR5vJHmVp7XYyqzeea1qeDyhriGT4AMEbg-22UTMw20m346C-FD37BcpVlAL0UUb928HmUA8rOF5KJc0qvb8OVpYTq8OYtfKggfNMbB-r_A_3Ib07FtcDTXuXfgEtaOgTfXMc2UwHwISm299fTQEP4ppPiJFzxMaW8WO-SVC8RjcuXCJ8nAfiu8COX6nZXaaORs07i9zOAdeeZlJj_nmOFNR5w",
    badge: "15 SUCURSALES",
    name: "Elena Vargas",
    company: "Global Meat, Argentina",
    quote: '"La mentalidad de imperio que enseñan es lo que realmente marca la diferencia."',
    stat: "ESCALADO: 300%",
    delay: 0.2,
  },
];

export const TESTIMONIALS = [
  {
    text: '"No es solo un curso, es un antes y un después en cómo entiendo mi negocio. La planilla de costos maestra es oro puro."',
    author: "Carlos Rivera",
    role: "FUNDADOR, RIVERA MEATS",
    avatar: "",
  },
  {
    text: '"La sistematización de procesos nos permitió abrir dos nuevas sucursales sin duplicar mi carga de trabajo. Excelente inversión."',
    author: "Andrés Gomez",
    role: "DIRECCIÓN, CARNES SUPREMAS",
    avatar: "",
  },
  {
    text: '"Redujimos las mermas a la mitad en menos de 60 días. El retorno de inversión es inmediato e incuestionable."',
    author: "Sandra Peralta",
    role: "GERENTE GENERAL, DISTRIBUIDORA MEAT",
    avatar: "",
  },
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
