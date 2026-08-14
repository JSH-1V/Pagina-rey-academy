import { Link } from "react-router-dom";
import { LegalLayout, LegalBlock } from "../components/LegalLayout";

const blocks: LegalBlock[] = [
  { type: "h2", text: "1. Identificación y aceptación" },
  {
    type: "p",
    content:
      'Los presentes Términos y Condiciones (los "Términos") regulan el acceso y uso del sitio web de REY ACADEMY, de las páginas de registro y venta, de la plataforma educativa y de los programas, mentorías, eventos y recursos ofrecidos por REY ACADEMY (en adelante, "REY Academy", "la Academia" o "nosotros").',
  },
  {
    type: "p",
    content: "Titular y prestador del servicio: REY ACADEMY, cuyo correo electrónico de contacto es info@mg.reyacademy.com.",
  },
  {
    type: "p",
    content:
      "El acceso al sitio, el registro en cualquiera de nuestros formularios, la descarga de recursos, la participación en nuestros eventos o la contratación de cualquiera de nuestros programas implica la aceptación plena y sin reservas de estos Términos. Si no estás de acuerdo con ellos, te pedimos que no utilices nuestros servicios.",
  },

  { type: "h2", text: "2. Definiciones" },
  {
    type: "ul",
    items: [
      "Usuario: toda persona que accede al sitio web o a los canales de REY Academy, se registre o no.",
      "Estudiante: usuario que ha contratado un Programa y accede a su contenido.",
      "Programa: cualquier producto formativo de REY Academy (curso, formación, mentoría, membresía, acompañamiento o programa de implementación), con el alcance descrito en su oferta comercial.",
      "Oferta comercial: la página de venta, propuesta o documento donde se detallan el contenido, precio, duración, bonos y condiciones específicas de cada Programa.",
      "Contenido: videos, clases, textos, plantillas, materiales descargables, herramientas, metodologías, marcas y demás recursos titularidad de REY Academy.",
      "Plataforma: el entorno digital donde se aloja el Contenido y se gestiona el acceso del Estudiante.",
    ],
  },

  { type: "h2", text: "3. Objeto y alcance del servicio" },
  {
    type: "p",
    content:
      "REY Academy es una academia digital especializada en formación para la industria cárnica, con foco en charcutería artesanal rentable y en la profesionalización de carnicerías, frigoríficos, supermercados y emprendimientos gastronómicos.",
  },
  {
    type: "p",
    content:
      "El servicio consiste en la provisión de formación, materiales, acompañamiento y, según el Programa, comunidad y sesiones en vivo, en los términos concretos de cada oferta comercial. Ante cualquier discrepancia entre estos Términos y la oferta comercial de un Programa concreto, prevalecerá lo indicado en la oferta comercial respecto de contenido, precio, duración y bonos; estos Términos regirán en todo lo demás.",
  },
  {
    type: "p",
    content:
      "Nuestros Programas tienen naturaleza formativa y de acompañamiento empresarial. No constituyen asesoramiento legal, contable, fiscal, sanitario ni financiero personalizado, ni sustituyen la consulta con profesionales habilitados en dichas materias ni el cumplimiento de la normativa bromatológica, sanitaria y comercial aplicable a la actividad del Estudiante.",
  },

  { type: "h2", text: "4. Requisitos para contratar" },
  {
    type: "p",
    content:
      "Nuestros Programas están dirigidos exclusivamente a personas mayores de 18 años con capacidad legal para contratar. Al contratar, el Usuario declara cumplir estos requisitos y que la información proporcionada es veraz, exacta y actualizada.",
  },
  {
    type: "p",
    content:
      "REY Academy podrá rechazar o cancelar registros con información falsa, incompleta o que incumpla estos Términos.",
  },

  { type: "h2", text: "5. Registro, cuenta y credenciales" },
  {
    type: "p",
    content:
      "El acceso a los Programas se realiza mediante una cuenta personal, individual e intransferible. El Estudiante es responsable de la custodia de sus credenciales y de toda actividad realizada bajo ellas.",
  },
  {
    type: "p",
    content:
      "El uso compartido de credenciales, la cesión del acceso a terceros o la detección de accesos simultáneos incompatibles con un uso individual se considerará incumplimiento grave, y facultará a REY Academy a suspender o revocar el acceso conforme a la sección 18, sin derecho a reembolso y sin perjuicio de las obligaciones de pago pendientes.",
  },
  { type: "p", content: "El Estudiante debe notificarnos de inmediato cualquier uso no autorizado de su cuenta." },

  { type: "h2", text: "6. Recursos gratuitos, webinars, maratones y eventos" },
  {
    type: "p",
    content:
      "REY Academy ofrece recursos gratuitos (guías, clases, diagnósticos) y eventos en vivo (webinars, maratones, clases abiertas) cuyo acceso puede requerir registro previo.",
  },
  {
    type: "ul",
    items: [
      "Al registrarte en un recurso gratuito o evento aceptas recibir las comunicaciones vinculadas a ese evento y a las promociones asociadas, pudiendo darte de baja en cualquier momento.",
      "Los eventos pueden ser grabados y reutilizados posteriormente como material formativo o promocional, en los términos de nuestra Política de Privacidad.",
      "REY Academy podrá reprogramar, modificar o cancelar un evento gratuito por razones organizativas o técnicas, comunicándolo por los canales de registro.",
      "Los bonos, descuentos y condiciones especiales anunciados durante un evento tienen la vigencia expresamente indicada y no son acumulables salvo indicación en contrario.",
    ],
  },

  { type: "h2", text: "7. Precios, impuestos y proceso de compra" },
  {
    type: "p",
    content:
      "Los precios de cada Programa son los indicados en su oferta comercial al momento de la compra, en la moneda allí señalada. REY Academy podrá modificar sus precios en cualquier momento; las modificaciones no afectarán a las contrataciones ya perfeccionadas.",
  },
  {
    type: "ul",
    items: [
      "Salvo indicación expresa, los precios no incluyen los impuestos, comisiones bancarias, cargos por conversión de moneda o retenciones que pudieran aplicarse según el país y el medio de pago del Estudiante, que serán a su cargo.",
      "La contratación se perfecciona con la confirmación del pago y el envío de los datos de acceso al correo registrado.",
      "Es responsabilidad del Estudiante proporcionar un correo electrónico válido y revisar las carpetas de correo no deseado.",
    ],
  },

  { type: "h2", text: "8. Medios de pago y pago en cuotas" },
  {
    type: "p",
    content:
      "Los pagos se procesan a través de pasarelas y procesadores externos. REY Academy no almacena números completos de tarjetas ni credenciales bancarias.",
  },
  {
    type: "p",
    content:
      "Cuando un Programa se contrate mediante plan de pago en cuotas, dicho plan se regirá por el Acuerdo de Inscripción, Servicio y Pago en Cuotas que el Estudiante suscribe de forma separada, el cual forma parte integrante de la relación contractual. En caso de contradicción entre aquel acuerdo y estos Términos respecto del plan de pagos, prevalecerá el Acuerdo de Inscripción.",
  },
  {
    type: "ul",
    items: [
      "La inscripción en un plan de cuotas constituye un compromiso por el valor total del Programa y no un pago mensual cancelable a voluntad.",
      "El atraso en el pago faculta a REY Academy a suspender el acceso hasta la regularización, aplicar los intereses moratorios pactados y exigir el saldo pendiente, conforme al Acuerdo de Inscripción.",
      "La suspensión del acceso por falta de pago no extingue la obligación de abonar el saldo adeudado.",
    ],
  },

  { type: "h2", text: "9. Derecho de revocación y política de reembolso" },
  {
    type: "p",
    content:
      "Cuando la normativa de defensa del consumidor aplicable reconozca al Estudiante un derecho de revocación o arrepentimiento por contratación a distancia, este podrá ejercerlo dentro del plazo legal que dicha normativa establezca desde la contratación, comunicándolo por escrito a info@mg.reyacademy.com.",
  },
  {
    type: "p",
    content:
      "El Estudiante reconoce que los Programas consisten en contenido digital de acceso inmediato. En consecuencia, y en la medida en que la normativa aplicable lo permita, una vez entregado el acceso y comenzado el consumo del Contenido, el derecho de revocación podrá verse limitado o extinguido conforme a las excepciones legalmente previstas para contenidos digitales.",
  },
  {
    type: "p",
    content:
      "Fuera del plazo legal de revocación, y salvo que la oferta comercial de un Programa concreto establezca una garantía de satisfacción específica, los importes abonados no son reembolsables. Las garantías comerciales que REY Academy ofrezca voluntariamente se regirán por las condiciones publicadas en la oferta correspondiente.",
  },
  {
    type: "p",
    content:
      "En ningún caso se considerará causa de reembolso la falta de uso del acceso, la falta de tiempo del Estudiante, el desinterés sobrevenido en el contenido ni la ausencia de los resultados esperados, conforme a la sección 15.",
  },

  { type: "h2", text: "10. Acceso al programa, vigencia y actualizaciones" },
  {
    type: "p",
    content:
      "El acceso al Contenido tendrá la vigencia indicada en la oferta comercial de cada Programa, contada desde la fecha de inscripción o desde la entrega del acceso, según se especifique.",
  },
  {
    type: "ul",
    items: [
      "REY Academy podrá actualizar, mejorar o reorganizar el Contenido para mantener su calidad y vigencia, sin que ello altere las obligaciones de pago del Estudiante ni suponga incumplimiento.",
      "REY Academy podrá sustituir a expertos, ponentes o dinamizadores, y ajustar fechas y formatos de las sesiones en vivo, procurando mantener el valor equivalente del Programa.",
      "Vencido el período de acceso, REY Academy no garantiza la disponibilidad del Contenido, salvo que la oferta comercial establezca acceso de por vida, en cuyo caso se entenderá referido a la vida útil comercial del Programa y de la Plataforma.",
    ],
  },

  { type: "h2", text: "11. Licencia de uso y propiedad intelectual" },
  {
    type: "p",
    content:
      "Todo el Contenido es propiedad exclusiva de REY Academy o de sus legítimos titulares y está protegido por la normativa de propiedad intelectual e industrial aplicable.",
  },
  {
    type: "p",
    content:
      "La contratación de un Programa otorga al Estudiante una licencia de uso personal, individual, intransferible, no exclusiva y revocable, limitada a la duración del acceso y a fines de su propia formación y de la aplicación en su propio negocio. En ningún caso implica la transmisión de la propiedad del Contenido ni de derecho alguno de explotación.",
  },
  { type: "p", content: "Queda expresamente prohibido:" },
  {
    type: "ul",
    items: [
      "Copiar, reproducir, descargar para redistribuir o almacenar el Contenido fuera de la Plataforma autorizada.",
      "Compartir, ceder, prestar, alquilar o revender el acceso, las credenciales o los materiales, sea de forma gratuita u onerosa.",
      "Grabar, capturar pantalla, retransmitir o difundir las clases y sesiones, en vivo o grabadas.",
      "Crear obras derivadas, cursos, formaciones o materiales basados en el Contenido o en la metodología de REY Academy.",
      "Utilizar el Contenido, la metodología o las herramientas para prestar servicios de formación o consultoría a terceros.",
      "Emplear el Contenido para entrenar, alimentar o desarrollar modelos o sistemas de inteligencia artificial.",
    ],
  },
  {
    type: "p",
    content:
      "El incumplimiento de esta sección faculta a REY Academy a terminar el acceso de forma inmediata, sin reembolso y sin perjuicio del saldo pendiente, así como a reclamar los daños y perjuicios ocasionados y a ejercer las acciones legales que correspondan.",
  },

  { type: "h2", text: "12. Uso aceptable y conducta del usuario" },
  {
    type: "p",
    content:
      "El Usuario se compromete a utilizar el sitio, la Plataforma y los canales de REY Academy de forma diligente, lícita y respetuosa. Queda prohibido:",
  },
  {
    type: "ul",
    items: [
      "Realizar conductas ofensivas, discriminatorias, acosadoras o difamatorias hacia el equipo, los expertos u otros estudiantes.",
      "Promocionar productos, servicios o negocios propios o de terceros dentro de la comunidad o los canales de la Academia, sin autorización expresa.",
      "Contactar a otros estudiantes con fines comerciales ajenos al Programa.",
      "Introducir código malicioso, intentar acceder a áreas restringidas o alterar el funcionamiento de la Plataforma.",
      "Suplantar la identidad de terceros o falsear su condición profesional.",
    ],
  },
  {
    type: "p",
    content: "REY Academy podrá moderar, suspender o expulsar de la comunidad y del Programa, sin reembolso, a quien incumpla estas reglas.",
  },

  { type: "h2", text: "13. Comunidad, sesiones en vivo y canales de mensajería" },
  {
    type: "p",
    content:
      "Determinados Programas incluyen acceso a comunidades, grupos de mensajería y sesiones en vivo. Al participar, el Estudiante acepta que:",
  },
  {
    type: "ul",
    items: [
      "Las sesiones pueden ser grabadas y reutilizadas conforme a la Política de Privacidad; si activa cámara, micrófono o participa en el chat, su intervención podrá quedar registrada.",
      "La información compartida por otros participantes sobre sus negocios es confidencial y no podrá divulgarse fuera de la comunidad.",
      "Las respuestas de expertos en sesiones grupales tienen carácter general y no constituyen consultoría personalizada, salvo en los Programas que expresamente la incluyan.",
      "REY Academy podrá modificar el calendario de las sesiones y no garantiza la asistencia de un experto determinado a una sesión concreta.",
    ],
  },
  {
    type: "p",
    content:
      "Las sesiones individuales que un Programa incluya, cuando el Estudiante no se presente o cancele sin antelación razonable, se considerarán consumidas sin derecho a reposición, salvo causa justificada acreditada.",
  },

  { type: "h2", text: "14. Certificados y acreditaciones" },
  {
    type: "p",
    content:
      "REY Academy podrá emitir certificados de finalización a los Estudiantes que cumplan los requisitos de cada Programa (finalización del contenido, entregas o evaluaciones, cuando corresponda) y se encuentren al día en sus obligaciones de pago.",
  },
  {
    type: "p",
    content:
      "Salvo que la oferta comercial de un Programa lo indique expresamente y detalle la institución emisora, los certificados de REY Academy acreditan la realización de una formación privada y no constituyen un título oficial, habilitación profesional ni acreditación estatal.",
  },
  {
    type: "p",
    content:
      "Cuando un Programa cuente con aval, respaldo o certificación de una institución educativa u organismo externo, ello se especificará en la oferta comercial, junto con el alcance real de dicha credencial y los requisitos para obtenerla. La emisión requerirá compartir con la institución los datos necesarios, conforme a la Política de Privacidad.",
  },

  { type: "h2", text: "15. Ausencia de garantía de resultados" },
  {
    type: "p",
    content:
      "REY Academy no garantiza resultados específicos en términos de facturación, ventas, rentabilidad, crecimiento, ahorro de costos, empleo ni cualquier otro indicador comercial o financiero.",
  },
  {
    type: "p",
    content:
      "El Estudiante reconoce y acepta que los resultados de cualquier formación empresarial dependen de múltiples factores ajenos al control de la Academia, entre ellos: la implementación efectiva y la constancia del propio Estudiante, la situación previa y la estructura de su negocio, su capital de trabajo, su equipo, la ubicación y las condiciones del mercado, la normativa aplicable a su actividad y factores macroeconómicos.",
  },
  {
    type: "p",
    content:
      "En consecuencia, no se admitirán retenciones de pago, solicitudes de reembolso ni reclamaciones fundadas en expectativas de resultados no alcanzados.",
  },
  {
    type: "p",
    content:
      "El Contenido tiene finalidad formativa y no constituye asesoramiento profesional individualizado en materia legal, contable, fiscal, sanitaria, bromatológica o financiera.",
  },

  { type: "h2", text: "16. Testimonios y casos de éxito" },
  {
    type: "p",
    content:
      "Los testimonios, casos de éxito, cifras y resultados que REY Academy difunde en sus materiales corresponden a experiencias individuales y verificadas de estudiantes concretos, en circunstancias particulares de negocio, mercado y esfuerzo.",
  },
  {
    type: "p",
    content:
      "Dichos resultados son ilustrativos y no representan un resultado típico, promedio ni garantizado, ni deben interpretarse como una promesa de que otro estudiante obtendrá resultados iguales o similares.",
  },
  {
    type: "p",
    content: "La publicación de testimonios se realiza con la autorización previa de sus protagonistas, en los términos de la Política de Privacidad.",
  },

  { type: "h2", text: "17. Disponibilidad del servicio y fuerza mayor" },
  {
    type: "p",
    content:
      "REY Academy procurará mantener la Plataforma disponible de forma continua, pero no garantiza la ausencia de interrupciones derivadas de mantenimiento, incidencias técnicas o fallos de proveedores externos.",
  },
  {
    type: "p",
    content:
      "Ninguna de las partes será responsable por el incumplimiento de sus obligaciones cuando obedezca a causas de fuerza mayor o caso fortuito, entendidas como hechos ajenos a su control razonable, imprevisibles o inevitables, incluidos desastres naturales, conflictos, restricciones gubernamentales, bancarias o cambiarias, cortes generalizados de servicios, fallas mayores de plataformas de terceros y situaciones sanitarias excepcionales. La obligación afectada se suspenderá mientras dure la causa, informando a la otra parte a la mayor brevedad.",
  },
  {
    type: "p",
    content:
      "Si REY Academy debiera discontinuar definitivamente un Programa en curso por causas que le resulten imputables, ofrecerá al Estudiante el acceso a un Programa equivalente o el reembolso proporcional de la parte no prestada, a elección del Estudiante.",
  },

  { type: "h2", text: "18. Suspensión y terminación" },
  {
    type: "p",
    content:
      "REY Academy podrá suspender o terminar el acceso del Estudiante, sin derecho a reembolso y sin perjuicio del cobro del saldo pendiente, en los siguientes casos:",
  },
  {
    type: "ul",
    items: [
      "Impago de las cuotas pactadas, conforme al Acuerdo de Inscripción.",
      "Incumplimiento de las secciones 5 (cuenta y credenciales), 11 (propiedad intelectual) o 12 (uso aceptable).",
      "Conducta que perjudique gravemente a la comunidad, al equipo o a la reputación de la Academia.",
      "Suministro de información falsa en el proceso de contratación.",
    ],
  },
  {
    type: "p",
    content:
      "Salvo en supuestos de gravedad o de reiteración, REY Academy notificará el incumplimiento y otorgará un plazo razonable para su subsanación antes de proceder a la terminación.",
  },
  {
    type: "p",
    content: "El Estudiante podrá cerrar su cuenta en cualquier momento, sin que ello extinga las obligaciones de pago pendientes de un Programa contratado.",
  },

  { type: "h2", text: "19. Limitación de responsabilidad" },
  {
    type: "p",
    content:
      "En la máxima medida permitida por la normativa aplicable, y sin perjuicio de los derechos irrenunciables que la legislación de defensa del consumidor reconozca al Estudiante:",
  },
  {
    type: "ul",
    items: [
      "REY Academy no responderá por daños indirectos, lucro cesante, pérdida de oportunidades comerciales o pérdida de datos derivados del uso o la imposibilidad de uso del servicio.",
      "La responsabilidad total de REY Academy frente al Estudiante, por cualquier concepto, se limitará al importe efectivamente abonado por este en los doce (12) meses anteriores al hecho que motive la reclamación.",
      "REY Academy no responde por las decisiones empresariales que el Estudiante adopte a partir de la formación recibida, ni por el cumplimiento de la normativa aplicable a su propia actividad.",
      "REY Academy no responde por los contenidos, servicios o prácticas de sitios y plataformas de terceros enlazados o utilizados en la prestación del servicio.",
    ],
  },
  {
    type: "p",
    content: "Ninguna disposición de estos Términos excluye la responsabilidad por dolo o por los supuestos en que la ley no admita limitación.",
  },

  { type: "h2", text: "20. Protección de datos personales" },
  {
    type: "p",
    content: (
      <>
        El tratamiento de los datos personales de Usuarios y Estudiantes se rige por la{" "}
        <Link to="/privacy-policy" className="text-primary underline underline-offset-2 hover:opacity-80">
          Política de Privacidad de REY Academy
        </Link>
        , que forma parte integrante de estos Términos y que el Usuario declara conocer y aceptar.
      </>
    ),
  },
  {
    type: "p",
    content:
      "En particular, el Usuario reconoce que REY Academy podrá comunicarse con él por correo electrónico, WhatsApp y otros canales digitales con fines operativos y comerciales, pudiendo darse de baja en cualquier momento.",
  },

  { type: "h2", text: "21. Modificaciones de los Términos" },
  {
    type: "p",
    content:
      "REY Academy podrá modificar estos Términos para adaptarlos a cambios normativos, técnicos u operativos. La versión vigente estará siempre publicada en el sitio web, con indicación de su fecha de última actualización.",
  },
  {
    type: "p",
    content:
      "Las modificaciones no afectarán a los Programas ya contratados, que se regirán por los Términos vigentes en el momento de la contratación, salvo que la nueva versión resulte más favorable al Estudiante o venga impuesta por una norma imperativa.",
  },

  { type: "h2", text: "22. Cesión" },
  { type: "p", content: "El Estudiante no podrá ceder su posición contractual, su cuenta ni su acceso al Programa." },
  {
    type: "p",
    content:
      "REY Academy podrá ceder o transferir su posición contractual a cualquier sociedad de su grupo empresarial o como consecuencia de una reestructuración corporativa, fusión, adquisición o transmisión de activos, bastando notificación al Estudiante y sin que ello altere las condiciones económicas ni el alcance del servicio contratado.",
  },

  { type: "h2", text: "23. Independencia de las cláusulas" },
  {
    type: "p",
    content:
      "Si alguna disposición de estos Términos fuera declarada nula, inválida o inexigible por una autoridad competente, dicha disposición se tendrá por no puesta o se reducirá al alcance máximo permitido, permaneciendo el resto plenamente vigente.",
  },

  { type: "h2", text: "24. Reclamaciones, ley aplicable y jurisdicción" },
  {
    type: "p",
    content:
      "Antes de iniciar cualquier acción, invitamos al Estudiante a comunicarse con nosotros en info@mg.reyacademy.com para procurar una solución de buena fe. Atenderemos las reclamaciones en el plazo que resulte razonable conforme a la normativa aplicable.",
  },
  {
    type: "p",
    content:
      "Estos Términos se rigen por la normativa aplicable al prestador del servicio. Para toda controversia, las partes procurarán someterse a los tribunales y organismos competentes conforme a dicha normativa.",
  },
  {
    type: "p",
    content:
      "Lo anterior se entiende sin perjuicio de las normas imperativas de protección al consumidor del país de residencia habitual del Estudiante, que resultarán aplicables cuando la ley así lo disponga, incluida la posibilidad de acudir a los organismos de defensa del consumidor competentes.",
  },

  { type: "h2", text: "25. Contacto" },
  { type: "p", content: "Para cualquier consulta relacionada con estos Términos o con los Programas de REY Academy:" },
  { type: "ul", items: ["Correo electrónico: info@mg.reyacademy.com"] },
];

export default function TermsConditions() {
  return (
    <LegalLayout
      title="Términos y Condiciones de Uso y Contratación"
      updated="30 de julio de 2026"
      blocks={blocks}
    />
  );
}
