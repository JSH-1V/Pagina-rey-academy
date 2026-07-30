import { LegalLayout, LegalBlock } from "../components/LegalLayout";

const blocks: LegalBlock[] = [
  { type: "h2", text: "1. Responsable del tratamiento" },
  {
    type: "p",
    content:
      'La presente Política de Privacidad describe cómo REY ACADEMY (en adelante, "REY Academy", "nosotros" o "la Academia") recopila, utiliza, conserva, comparte y protege los datos personales de las personas que interactúan con nuestros sitios web, formularios, páginas de registro, plataformas educativas, canales de mensajería, eventos digitales y campañas publicitarias.',
  },
  {
    type: "p",
    content:
      "Responsable del tratamiento: REY ACADEMY, cuyo correo electrónico de contacto en materia de privacidad es contacto@reyacademy.com.",
  },
  {
    type: "p",
    content:
      "REY Academy es una academia digital especializada en formación para la industria cárnica, con foco en charcutería artesanal rentable. Nuestros programas están dirigidos a profesionales y empresarios del sector: dueños de carnicerías, frigoríficos, supermercados y emprendimientos gastronómicos.",
  },

  { type: "h2", text: "2. Alcance y aceptación" },
  {
    type: "p",
    content:
      "Esta Política aplica a todos los datos personales que tratamos en el marco de nuestras actividades formativas, comerciales y de comunicación, con independencia del canal por el que se hayan obtenido.",
  },
  {
    type: "p",
    content:
      "Al registrarte en nuestros formularios, descargar nuestros recursos, inscribirte en nuestros programas, participar en nuestros eventos o comunicarte con nosotros, declaras haber leído y comprendido esta Política. Cuando la normativa aplicable lo exija, solicitaremos tu consentimiento expreso de forma separada e inequívoca.",
  },

  { type: "h2", text: "3. Datos personales que recopilamos" },
  { type: "h3", text: "3.1. Datos de identificación y contacto" },
  {
    type: "ul",
    items: [
      "Nombre y apellido.",
      "Correo electrónico.",
      "Número de teléfono y/o número de WhatsApp.",
      "País y ciudad de residencia.",
    ],
  },
  { type: "h3", text: "3.2. Datos profesionales y del negocio" },
  {
    type: "ul",
    items: [
      "Tipo de negocio o actividad: carnicería, frigorífico, supermercado, emprendimiento gastronómico u otra actividad del sector.",
      "Rol dentro del negocio (por ejemplo, propietario, encargado o empleado).",
      "Intereses dentro de la industria cárnica y necesidades formativas manifestadas.",
      "Información sobre el estado o los desafíos del negocio que nos compartas voluntariamente en formularios, encuestas o diagnósticos.",
    ],
  },
  { type: "h3", text: "3.3. Datos de relación con la Academia" },
  {
    type: "ul",
    items: [
      "Historial de compras y programas contratados.",
      "Participación en eventos, webinars, maratones y clases en vivo o grabadas.",
      "Descarga de recursos gratuitos y materiales formativos.",
      "Progreso formativo y certificados emitidos.",
      "Consultas, solicitudes de soporte y comunicaciones mantenidas con nuestro equipo.",
    ],
  },
  { type: "h3", text: "3.4. Datos de facturación y pago" },
  {
    type: "ul",
    items: [
      "Datos necesarios para la facturación y el cumplimiento de obligaciones fiscales.",
      "Información sobre el estado de los pagos y planes en cuotas, cuando corresponda.",
    ],
  },
  {
    type: "p",
    content:
      "No almacenamos números completos de tarjetas de crédito o débito ni credenciales bancarias. Los pagos se procesan a través de pasarelas de pago externas que aplican sus propios estándares de seguridad.",
  },
  { type: "h3", text: "3.5. Datos de navegación e interacción" },
  {
    type: "ul",
    items: [
      "Interacciones con nuestras campañas de marketing, anuncios y correos electrónicos (aperturas, clics, conversiones).",
      "Datos obtenidos mediante cookies y herramientas analíticas: dirección IP, identificadores de dispositivo, páginas visitadas, tiempo de permanencia y origen del tráfico.",
      "Respuestas a encuestas, cuestionarios y diagnósticos.",
    ],
  },
  { type: "h3", text: "3.6. Datos que no solicitamos" },
  {
    type: "p",
    content:
      "No solicitamos datos sensibles (por ejemplo, salud, origen étnico, opiniones políticas, religión o afiliación sindical). Te pedimos que no nos envíes este tipo de información. Si nos la proporcionas de forma espontánea, no la utilizaremos y procederemos a eliminarla.",
  },

  { type: "h2", text: "4. Cómo obtenemos tus datos" },
  { type: "p", content: "Obtenemos tus datos personales, principalmente, de las siguientes fuentes:" },
  {
    type: "ul",
    items: [
      "Formularios de registro, páginas de captura (landing pages) y páginas de venta.",
      "Descarga de recursos gratuitos y materiales formativos (lead magnets).",
      "Inscripción y participación en webinars, maratones, clases en vivo y lanzamientos.",
      "Comunicaciones que nos envías por correo electrónico, WhatsApp, formularios de contacto o redes sociales.",
      "Procesos de compra, contratación y facturación de nuestros programas.",
      "Uso de nuestra plataforma educativa y del área de estudiantes.",
      "Encuestas, diagnósticos y cuestionarios que completes voluntariamente.",
      "Cookies y tecnologías similares en nuestros sitios web.",
      "Plataformas publicitarias, cuando te registras a través de un anuncio o formulario alojado en ellas.",
    ],
  },

  { type: "h2", text: "5. Finalidades del tratamiento" },
  { type: "p", content: "Tratamos tus datos personales para las siguientes finalidades:" },
  { type: "h3", text: "5.1. Prestación del servicio formativo" },
  {
    type: "ul",
    items: [
      "Gestionar tu registro, tu cuenta y tu acceso a los programas contratados.",
      "Impartir la formación, dar seguimiento a tu progreso y brindarte soporte.",
      "Emitir y validar certificados y acreditaciones.",
      "Gestionar pagos, planes en cuotas, facturación y cobranzas.",
    ],
  },
  { type: "h3", text: "5.2. Comunicación y comercialización" },
  {
    type: "ul",
    items: [
      "Enviarte información sobre nuestros programas, lanzamientos, eventos, promociones y contenidos formativos.",
      "Comunicarnos contigo por correo electrónico, WhatsApp, SMS o redes sociales con fines operativos, informativos o comerciales.",
      "Realizar seguimiento comercial de las consultas y solicitudes que nos manifiestes.",
      "Invitarte a webinars, maratones, clases y eventos de la industria.",
    ],
  },
  { type: "h3", text: "5.3. Personalización, análisis y mejora" },
  {
    type: "ul",
    items: [
      "Segmentar audiencias y personalizar los contenidos y las comunicaciones que recibes, según tu tipo de negocio e intereses.",
      "Ejecutar campañas de publicidad y remarketing en plataformas de terceros.",
      "Medir el desempeño de nuestras campañas, contenidos y programas.",
      "Mejorar nuestros productos formativos, nuestros sitios y la experiencia de usuario.",
    ],
  },
  { type: "h3", text: "5.4. Cumplimiento legal" },
  {
    type: "ul",
    items: [
      "Cumplir obligaciones legales, fiscales, contables y de facturación.",
      "Atender requerimientos de autoridades competentes.",
      "Acreditar el consentimiento otorgado y la ejecución de los servicios contratados.",
    ],
  },

  { type: "h2", text: "6. Base legal del tratamiento" },
  { type: "p", content: "Tratamos tus datos personales sobre alguna de las siguientes bases:" },
  {
    type: "ul",
    items: [
      "Tu consentimiento, otorgado al registrarte, suscribirte a nuestras comunicaciones, descargar recursos o contactarnos.",
      "La ejecución de un contrato o de una relación precontractual en la que eres parte, cuando contratas o solicitas información sobre nuestros programas.",
      "El cumplimiento de obligaciones legales que nos resultan aplicables, en particular en materia fiscal y contable.",
      "Nuestro interés legítimo en mejorar nuestros servicios, prevenir fraudes y comunicarnos con clientes y usuarios sobre productos análogos a los ya contratados, siempre de forma proporcionada y respetando tus derechos.",
    ],
  },
  {
    type: "p",
    content:
      "Cuando el tratamiento se base en tu consentimiento, podrás revocarlo en cualquier momento, sin que ello afecte la licitud del tratamiento realizado con anterioridad.",
  },

  { type: "h2", text: "7. Consentimiento y su revocación" },
  {
    type: "p",
    content:
      "Solicitamos tu consentimiento de forma libre, específica, informada e inequívoca, mediante casillas de verificación no premarcadas u otras acciones afirmativas equivalentes. Distinguimos, cuando corresponde, entre el consentimiento necesario para prestarte el servicio y el consentimiento para recibir comunicaciones comerciales.",
  },
  {
    type: "p",
    content:
      'Puedes revocar tu consentimiento en cualquier momento escribiéndonos a contacto@reyacademy.com, utilizando el enlace de baja incluido en nuestros correos electrónicos o respondiendo con la palabra "BAJA" en nuestros canales de mensajería. La revocación se hará efectiva en un plazo razonable y no afectará a las comunicaciones estrictamente necesarias para la ejecución de un programa que tengas contratado.',
  },

  { type: "h2", text: "8. Comunicaciones por WhatsApp y otros canales de mensajería" },
  {
    type: "p",
    content:
      "WhatsApp es uno de nuestros canales principales de comunicación. Al facilitarnos tu número de teléfono y aceptar esta Política, autorizas que nos comuniquemos contigo por WhatsApp, SMS o canales equivalentes, con fines operativos (acceso a clases, recordatorios, soporte) y comerciales (invitaciones, promociones y seguimiento).",
  },
  {
    type: "ul",
    items: [
      "Podemos incorporarte a grupos, listas de difusión o comunidades vinculadas a un evento o programa concreto, de las que podrás salir en cualquier momento.",
      "Las conversaciones pueden ser revisadas internamente por nuestro equipo con fines de atención, seguimiento comercial y control de calidad.",
      "Podemos utilizar herramientas de automatización de mensajería y asistentes conversacionales para gestionar la atención inicial; siempre podrás solicitar la intervención de una persona de nuestro equipo.",
      "No compartiremos tu número ni tu historial de conversaciones con terceros ajenos a la prestación del servicio sin tu consentimiento expreso.",
      'Puedes solicitar la baja de estas comunicaciones en cualquier momento respondiendo "BAJA" o escribiéndonos al correo de privacidad.',
    ],
  },
  {
    type: "p",
    content:
      "WhatsApp es un servicio operado por un tercero, que trata los datos conforme a sus propias políticas y sobre las que REY Academy no tiene control.",
  },

  { type: "h2", text: "9. Cookies y tecnologías similares" },
  {
    type: "p",
    content:
      "Nuestros sitios web utilizan cookies y tecnologías similares (píxeles, etiquetas y almacenamiento local) para:",
  },
  {
    type: "ul",
    items: [
      "Permitir el funcionamiento básico del sitio y recordar tus preferencias.",
      "Medir el tráfico y el comportamiento de navegación mediante herramientas analíticas.",
      "Medir la conversión de nuestras campañas publicitarias.",
      "Mostrarte publicidad y contenidos relevantes en plataformas de terceros (remarketing).",
    ],
  },
  {
    type: "p",
    content:
      "Puedes configurar tu navegador para rechazar cookies o eliminar las existentes. Ten en cuenta que, si desactivas determinadas cookies, algunas funciones del sitio podrían no operar correctamente. Cuando la normativa aplicable lo exija, solicitaremos tu consentimiento previo para las cookies que no sean estrictamente necesarias, a través de un mecanismo de gestión de preferencias.",
  },

  { type: "h2", text: "10. Analítica, publicidad, remarketing y segmentación" },
  {
    type: "p",
    content:
      "Utilizamos herramientas de analítica y plataformas publicitarias para comprender el rendimiento de nuestros contenidos y campañas, y para dirigir nuestra publicidad a las personas que probablemente encuentren valor en nuestra formación.",
  },
  {
    type: "ul",
    items: [
      "Podemos crear segmentos de audiencia a partir de tu tipo de negocio, tus intereses declarados y tu interacción con nuestros contenidos.",
      "Podemos mostrarte anuncios en redes sociales y otras plataformas, incluidas campañas de remarketing dirigidas a personas que ya visitaron nuestros sitios o interactuaron con nuestros contenidos.",
      "Podemos compartir identificadores cifrados con plataformas publicitarias para crear audiencias personalizadas o similares, conforme a las condiciones de dichas plataformas.",
    ],
  },
  {
    type: "p",
    content:
      "Puedes oponerte a este tratamiento escribiéndonos al correo de privacidad y ajustando la configuración publicitaria de las plataformas correspondientes.",
  },

  { type: "h2", text: "11. Segmentación automatizada y priorización de contactos" },
  {
    type: "p",
    content:
      "Con el fin de organizar nuestra atención y enviarte comunicaciones pertinentes, podemos aplicar criterios automatizados que clasifican y priorizan los contactos según su nivel de interacción con nuestros contenidos (por ejemplo, si abriste un correo, participaste en una clase o completaste un formulario).",
  },
  {
    type: "p",
    content:
      "Esta clasificación tiene como única finalidad ordenar el seguimiento y adaptar el contenido de nuestras comunicaciones. No produce efectos jurídicos sobre ti ni te afecta significativamente de modo similar, y no determina por sí sola el acceso a nuestros programas, que permanece abierto a cualquier persona interesada. Puedes solicitar información sobre esta clasificación o su revisión por parte de una persona de nuestro equipo escribiéndonos al correo de privacidad.",
  },

  { type: "h2", text: "12. Webinars, maratones, clases en vivo y grabaciones" },
  {
    type: "p",
    content:
      "Nuestras clases, webinars y maratones pueden ser grabados con fines formativos, de mejora de la calidad y de difusión posterior. Al participar, ten en cuenta que:",
  },
  {
    type: "ul",
    items: [
      "Si activas tu cámara, tu micrófono o participas en el chat, tu imagen, voz o mensajes podrán quedar registrados en la grabación.",
      "Registramos tu asistencia y tu nivel de participación con fines de seguimiento formativo y comercial.",
      "Las grabaciones pueden reutilizarse como material formativo o promocional; en tal caso, procuraremos limitar la exposición de datos de los participantes.",
      "Si no deseas aparecer en una grabación, puedes participar sin activar cámara ni micrófono, o solicitarnos la eliminación de tu intervención escribiéndonos al correo de privacidad.",
    ],
  },

  { type: "h2", text: "13. Testimonios, casos de éxito e imagen" },
  {
    type: "p",
    content:
      "Podemos solicitar tu testimonio sobre tu experiencia con nuestros programas. La publicación de testimonios, casos de éxito, nombre, imagen, voz o datos de tu negocio con fines promocionales requiere tu autorización previa y específica, que podrás revocar en cualquier momento.",
  },
  {
    type: "p",
    content:
      "La revocación surtirá efecto hacia el futuro y no obliga a retirar materiales ya distribuidos por terceros o soportes fuera de nuestro control, aunque retiraremos el contenido de nuestros canales propios en un plazo razonable.",
  },

  { type: "h2", text: "14. Certificados y acreditaciones" },
  {
    type: "p",
    content:
      "Cuando obtengas un certificado o acreditación emitido por REY Academy, trataremos los datos necesarios para su emisión, verificación y registro (nombre completo, documento de identidad cuando corresponda, programa cursado y fecha de finalización).",
  },
  {
    type: "p",
    content:
      "Si un programa cuenta con el respaldo, aval o certificación de una institución educativa u organismo externo, será necesario compartir con dicha institución los datos indispensables para la emisión y validación de la credencial. En esos casos te informaremos previamente de la identidad de la institución y de los datos que serán comunicados.",
  },

  { type: "h2", text: "15. Pasarelas de pago y datos de facturación" },
  {
    type: "p",
    content:
      "Los pagos se procesan a través de pasarelas y procesadores externos que actúan como responsables o encargados independientes según el caso. REY Academy no almacena números completos de tarjetas ni credenciales bancarias.",
  },
  {
    type: "p",
    content:
      "Conservamos únicamente la información necesaria para acreditar la operación, gestionar planes en cuotas, emitir comprobantes y cumplir nuestras obligaciones fiscales y contables.",
  },

  { type: "h2", text: "16. Proveedores, encargados del tratamiento y comunicación de datos" },
  {
    type: "p",
    content:
      "No vendemos ni alquilamos tus datos personales. Podemos comunicarlos, en la medida estrictamente necesaria, a las siguientes categorías de destinatarios:",
  },
  {
    type: "ul",
    items: [
      "Proveedores de CRM y automatización de marketing, para la gestión de contactos y comunicaciones.",
      "Plataformas de correo electrónico y de mensajería, para el envío de nuestras comunicaciones.",
      "Plataformas de transmisión y videoconferencia, para la realización de clases y eventos en vivo.",
      "Plataformas educativas y de alojamiento de contenidos, para darte acceso a los programas.",
      "Pasarelas y procesadores de pago, para gestionar cobros y facturación.",
      "Proveedores de analítica y de publicidad digital, para medir y difundir nuestras campañas.",
      "Proveedores de infraestructura tecnológica, alojamiento y almacenamiento en la nube.",
      "Asesores contables, fiscales y legales, sujetos a deber de secreto profesional.",
      "Autoridades competentes, cuando exista una obligación legal de comunicarlos.",
    ],
  },
  {
    type: "p",
    content:
      "Con nuestros proveedores mantenemos relaciones contractuales que les obligan a tratar los datos únicamente conforme a nuestras instrucciones, a aplicar medidas de seguridad adecuadas y a guardar confidencialidad.",
  },
  {
    type: "p",
    content:
      "Asimismo, podemos comunicar datos a otras sociedades de nuestro grupo empresarial con fines de administración interna, gestión de la relación con estudiantes y prestación de servicios compartidos, aplicando en todo caso las garantías previstas en esta Política.",
  },

  { type: "h2", text: "17. Transferencias internacionales de datos" },
  {
    type: "p",
    content:
      "REY Academy opera principalmente en Latinoamérica, pero puede atender a usuarios de otros países. Nuestros proveedores tecnológicos pueden estar ubicados o almacenar información en jurisdicciones distintas a la de tu residencia, incluidos los Estados Unidos de América y países de la Unión Europea.",
  },
  {
    type: "p",
    content:
      "Cuando realizamos una transferencia internacional, adoptamos las garantías razonables y exigibles conforme a la normativa aplicable, tales como cláusulas contractuales que impongan al destinatario un nivel de protección adecuado, compromisos de confidencialidad y medidas técnicas de seguridad.",
  },
  {
    type: "p",
    content:
      "Al aceptar esta Política y contratar nuestros servicios, entiendes que la prestación del servicio requiere el uso de proveedores internacionales en los términos aquí descritos.",
  },

  { type: "h2", text: "18. Conservación de los datos" },
  {
    type: "p",
    content:
      "Conservamos tus datos personales durante el tiempo necesario para cumplir las finalidades descritas y, posteriormente, durante los plazos exigidos por la normativa aplicable. Como criterio general:",
  },
  {
    type: "ul",
    items: [
      "Datos de estudiantes y clientes: durante la vigencia de la relación y, después, durante el plazo de prescripción de las acciones legales y de las obligaciones fiscales y contables que resulten aplicables.",
      "Datos de personas registradas que no llegaron a contratar: mientras se mantenga tu consentimiento y no solicites la baja.",
      "Certificados y registros académicos: durante el plazo necesario para poder acreditar su validez.",
      "Datos de navegación y cookies: conforme a los plazos indicados en nuestra configuración de cookies.",
    ],
  },
  {
    type: "p",
    content:
      "Cumplidos dichos plazos, los datos serán eliminados de forma segura o anonimizados de modo que no sea posible reidentificarte.",
  },

  { type: "h2", text: "19. Seguridad de la información" },
  {
    type: "p",
    content:
      "Aplicamos medidas técnicas, administrativas y organizativas razonables para proteger tus datos personales frente a accesos no autorizados, pérdida, alteración, divulgación indebida o tratamiento ilícito. Entre otras:",
  },
  {
    type: "ul",
    items: [
      "Control de accesos basado en el principio de necesidad de conocer, con credenciales individuales.",
      "Uso de proveedores y plataformas que aplican cifrado en tránsito y en reposo.",
      "Procesamiento de pagos a través de pasarelas externas que cumplen estándares de seguridad reconocidos.",
      "Compromisos de confidencialidad suscritos por nuestro personal y colaboradores.",
      "Restricciones sobre la descarga, copia o exportación de bases de datos fuera de los sistemas autorizados.",
      "Revisión periódica de accesos y retirada de permisos cuando finaliza una colaboración.",
    ],
  },
  {
    type: "p",
    content:
      "Ningún sistema es absolutamente infalible. En caso de producirse un incidente de seguridad que afecte significativamente a tus datos personales, adoptaremos las medidas correctivas necesarias y te informaremos, así como a las autoridades competentes, cuando la normativa aplicable lo exija.",
  },

  { type: "h2", text: "20. Confidencialidad" },
  {
    type: "p",
    content:
      "Toda la información que nos suministres será tratada bajo estrictos criterios de confidencialidad y utilizada únicamente para las finalidades autorizadas en esta Política o expresamente consentidas por ti.",
  },
  {
    type: "p",
    content:
      "REY Academy se obliga a guardar secreto profesional respecto de los datos personales tratados, obligación que subsistirá aun después de finalizada la relación con el titular de los datos. Nuestro personal, colaboradores, contratistas y proveedores están sujetos a obligaciones contractuales de confidencialidad de alcance equivalente, y su acceso a la información se limita a lo estrictamente necesario para el desempeño de sus funciones.",
  },
  {
    type: "p",
    content:
      "Queda expresamente prohibida la utilización de la información de nuestros estudiantes, usuarios y contactos para fines distintos de los previstos en esta Política, así como su cesión, comercialización o divulgación a terceros no autorizados. El incumplimiento de estas obligaciones por parte de nuestro personal o colaboradores se considera una falta grave y da lugar a las acciones contractuales y legales que correspondan.",
  },

  { type: "h2", text: "21. Tus derechos" },
  { type: "p", content: "Como titular de los datos, puedes ejercer los siguientes derechos:" },
  {
    type: "ul",
    items: [
      "Acceso: conocer qué datos personales tuyos tratamos y con qué finalidad.",
      "Rectificación: solicitar la corrección de datos inexactos o incompletos.",
      "Supresión o eliminación: pedir que eliminemos tus datos cuando ya no sean necesarios o cuando retires tu consentimiento, salvo que debamos conservarlos por una obligación legal.",
      "Oposición: oponerte a determinados tratamientos, en particular al envío de comunicaciones comerciales y a la publicidad personalizada.",
      "Limitación: solicitar que restrinjamos el tratamiento de tus datos en determinados supuestos.",
      "Portabilidad: recibir los datos que nos hayas facilitado en un formato estructurado y de uso común, cuando la normativa aplicable lo reconozca.",
      "Revocación del consentimiento: retirar en cualquier momento el consentimiento otorgado, sin efectos retroactivos.",
    ],
  },
  { type: "h3", text: "21.1. Cómo ejercer tus derechos" },
  {
    type: "p",
    content:
      "Escríbenos a contacto@reyacademy.com indicando tu nombre completo, el correo electrónico asociado a tu registro y el derecho que deseas ejercer. Podremos solicitarte información adicional para verificar tu identidad, con la única finalidad de proteger tus propios datos.",
  },
  {
    type: "p",
    content:
      "Responderemos a tu solicitud en el plazo que establezca la normativa aplicable a tu caso. El ejercicio de estos derechos es gratuito.",
  },
  { type: "h3", text: "21.2. Reclamaciones" },
  {
    type: "p",
    content:
      "Si consideras que no hemos atendido adecuadamente tu solicitud, tienes derecho a presentar una reclamación ante la autoridad de control competente en materia de protección de datos de tu país de residencia.",
  },

  { type: "h2", text: "22. Usuarios de determinadas jurisdicciones" },
  {
    type: "p",
    content:
      "REY Academy dirige su actividad principalmente a usuarios de Latinoamérica. No obstante, si resides en una jurisdicción con normativa específica de protección de datos, podrás ejercer los derechos adicionales que dicha normativa te reconozca, escribiéndonos al correo de privacidad.",
  },
  {
    type: "p",
    content:
      "En particular, si resides en el Espacio Económico Europeo o en el Estado de California, tu normativa local puede reconocerte derechos adicionales, tales como el derecho a no ser objeto de discriminación por el ejercicio de tus derechos o el derecho a oponerte a determinadas comunicaciones de datos. Atenderemos dichas solicitudes conforme a la normativa que resulte aplicable.",
  },

  { type: "h2", text: "23. Menores de edad" },
  {
    type: "p",
    content:
      "Nuestros programas y servicios están dirigidos exclusivamente a personas mayores de 18 años, dado su carácter profesional y empresarial. No recopilamos de forma consciente datos de menores de edad.",
  },
  {
    type: "p",
    content:
      "Si detectamos que hemos recabado datos de una persona menor de edad sin la autorización correspondiente, procederemos a su eliminación de forma inmediata. Si eres madre, padre o tutor y consideras que un menor nos ha facilitado sus datos, escríbenos al correo de privacidad.",
  },

  { type: "h2", text: "24. Enlaces a sitios de terceros" },
  {
    type: "p",
    content:
      "Nuestros sitios y comunicaciones pueden contener enlaces a sitios web, plataformas o redes sociales de terceros. REY Academy no es responsable de las prácticas de privacidad ni de los contenidos de dichos sitios. Te recomendamos revisar sus políticas antes de facilitarles información personal.",
  },

  { type: "h2", text: "25. Cambios en esta Política" },
  {
    type: "p",
    content:
      "Podemos modificar esta Política para adaptarla a cambios normativos, operativos o tecnológicos. La versión vigente estará siempre disponible en nuestro sitio web, con indicación de su fecha de última actualización.",
  },
  {
    type: "p",
    content:
      "Cuando los cambios sean sustanciales y afecten al modo en que tratamos tus datos, te lo comunicaremos por un medio adecuado y, cuando la normativa lo exija, solicitaremos nuevamente tu consentimiento.",
  },

  { type: "h2", text: "26. Contacto" },
  {
    type: "p",
    content:
      "Para cualquier consulta, comentario o solicitud relacionada con esta Política de Privacidad o con el tratamiento de tus datos personales:",
  },
  { type: "ul", items: ["Correo electrónico: contacto@reyacademy.com"] },

  { type: "h2", text: "27. Legislación aplicable" },
  {
    type: "p",
    content:
      "Esta Política se rige por la normativa de protección de datos personales aplicable en la jurisdicción del responsable del tratamiento y, en lo que corresponda, por la normativa del país de residencia del titular de los datos.",
  },
  {
    type: "p",
    content:
      "Su redacción sigue estándares internacionalmente reconocidos en materia de privacidad y protección de datos, sin que ello suponga una declaración de cumplimiento de un régimen normativo específico distinto del aplicable al responsable.",
  },
];

export default function PrivacyPolicy() {
  return (
    <LegalLayout
      title="Política de Privacidad y Protección de Datos Personales"
      updated="30 de julio de 2026"
      blocks={blocks}
    />
  );
}
