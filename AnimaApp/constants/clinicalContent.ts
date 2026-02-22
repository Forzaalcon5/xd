export type EmotionalRouteId = 'renacer' | 'autocompasion' | 'balance' | 'descubrimiento' | 'soledad';

export interface EmotionalRoute {
  id: EmotionalRouteId;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  color: string;
  focusArea: string;
  strategies: string[];
  microRetos: MicroReto[];
  dailyQuotes: string[];
  image: any;
}

export interface MicroReto {
  id: string;
  title: string;
  action: string;
  duration: string;
  icon: string;
}

export const EMOTIONAL_ROUTES: EmotionalRoute[] = [
  {
    id: 'renacer',
    title: 'Ruta del Renacer',
    subtitle: 'Ánimo bajo y desmotivación',
    description: 'Un enfoque estructurado para reactivarte paso a paso, diseñado para salir de estados depresivos leves o inmovilidad.',
    icon: 'sunny-outline',
    color: '#FCD34D', // Amber/Yellow
    image: require('../assets/images/renacer.jpeg'),
    focusArea: 'Activación Conductual',
    strategies: [
      'Aceptar la emoción sin juzgarla',
      'Establecer límites (evitar contacto impulsivo)',
      'Reescribir la narrativa de los hechos',
      'Mantener rutina mínima (sueño, comida, movimiento)',
      'Activación conductual: actuar primero, la motivación llegará después',
    ],
    microRetos: [
      { id: 'ren1', title: 'Movimiento Mínimo', action: 'Ponte de pie, estira los brazos hacia el techo por 10 segundos y vuelve a sentarte.', duration: '< 1 min', icon: 'body-outline' },
      { id: 'ren2', title: 'Hidratación', action: 'Sirve y bebe un vaso largo de agua fría.', duration: '1 min', icon: 'water-outline' },
      { id: 'ren3', title: 'Cambio de Aire', action: 'Abre la ventana más cercana y respira el aire de afuera por 30 segundos.', duration: '< 1 min', icon: 'leaf-outline' },
    ],
    dailyQuotes: [
      'Hoy no necesitas tener ganas para empezar, solo dar el primer paso. 🌱',
      'Tu bienestar básico es innegociable hoy: come, duerme, muévete un poco. 💧',
      'Esta emoción es temporal. Permítete sentirla sin que te defina. 🌧️',
      'Cambia tu historia: esto no es un final, es una reconfiguración de tu vida. 📖',
      'Hiciste lo mejor que pudiste con las herramientas que tenías.',
      'El descanso de hoy es la energía de mañana. No te apresures. 🛋️',
      'La motivación llegará después de la acción. Empieza en pequeño. 🚶‍♂️',
    ],
  },
  {
    id: 'autocompasion',
    title: 'Ruta de Autocompasión',
    subtitle: 'Sensación de rechazo o aislamiento',
    description: 'Un espacio para normalizar el rechazo, trabajar la exposición gradual y tratarte a ti mismo como a un amigo.',
    icon: 'heart-half-outline',
    color: '#F472B6', // Pink
    image: require('../assets/images/Autocompasion.jpeg'),
    focusArea: 'Regulación de Vergüenza y Rechazo',
    strategies: [
      'Normalizar el rechazo como algo universal',
      'Exposición gradual a situaciones sociales',
      'Autocompasión activa y diálogo interno amable',
      'Contactar al menos a una persona de apoyo',
    ],
    microRetos: [
      { id: 'aut1', title: 'Abrazo Mariposa', action: 'Cruza tus brazos sobre el pecho y date unos golpecitos suaves en los hombros mientras respiras.', duration: '1 min', icon: 'heart-outline' },
      { id: 'aut2', title: 'Mensaje de Apoyo', action: 'Escríbete a ti mismo(a) en tus notas: "Hice lo mejor que pude hoy, y está bien".', duration: '< 1 min', icon: 'pencil-outline' },
      { id: 'aut3', title: 'Contacto Ligero', action: 'Envíale un meme o un video gracioso a un amigo, sin esperar respuesta inmediata.', duration: '2 min', icon: 'paper-plane-outline' },
    ],
    dailyQuotes: [
      'El rechazo es una experiencia humana universal, no dice nada de tu valor personal. ❤️',
      'Háblate hoy como le hablarías a tu mejor amigo(a). Eres suficiente. 🫂',
      'Una mala interacción no borra todas tus cualidades maravillosas.',
      'Avanzar poco a poco sigue siendo avanzar. Hoy da una pequeña interacción de prueba. 🐢',
      'Tu vulnerabilidad es valentía. No tengas miedo de buscar apoyo si lo necesitas.',
      'Estás a salvo, y aunque algunos no conecten, hay quienes te valoran inmensamente. 🌟',
      'La autocompasión es tu superpoder. Sé gentil con tus heridas invisibles. 🩹'
    ],
  },
  {
    id: 'balance',
    title: 'Ruta de Balance',
    subtitle: 'Burnout y estrés constante',
    description: 'Identificaremos límites, reduciremos la sobrecarga y aprenderemos a decir "no" sin culpa para prevenir o salir del burnout.',
    icon: 'scale-outline',
    color: '#34D399', // Emerald/Green
    image: require('../assets/images/Balance.jpeg'),
    focusArea: 'Prevención de Burnout y Límites',
    strategies: [
      'Pausas activas cada 90 minutos',
      'Revisar y hacer valer límites (horarios laborales/académicos)',
      'Conversaciones claras sobre la carga mental',
      'Reducir tiempo en redes sociales para evitar comparaciones',
    ],
    microRetos: [
      { id: 'bal1', title: 'Desconexión Express', action: 'Apaga la pantalla de tu teléfono o computadora, cierra los ojos y cuenta hasta 60.', duration: '1 min', icon: 'power-outline' },
      { id: 'bal2', title: 'Estiramiento de Cuello', action: 'Gira suavemente el cuello de lado a lado para liberar la tensión acumulada.', duration: '< 1 min', icon: 'fitness-outline' },
      { id: 'bal3', title: 'Anotar un Límite', action: 'Escribe en un papel algo a lo que necesites decir "No" esta semana.', duration: '2 min', icon: 'hand-left-outline' },
    ],
    dailyQuotes: [
      'Tus límites son la valla de seguridad alrededor de tu paz mental. 🚧',
      'Pausa. Respira. Desconéctate. El trabajo seguirá ahí mañana. ☕',
      'El agotamiento no es medalla de honor. Descansar es ser productivo a largo plazo. 🔋',
      'Compárate únicamente con quién eras ayer. El mundo de las redes sociales es solo un escenario.',
      'Ese "síndrome del impostor" nos pasa a todos. Tú mereces estar ahí. 🏆',
      'Aprender a decir "no" es decirte "sí" a tu estabilidad. 🛑',
      'Toma un vaso de agua, estira los hombros, cierra los ojos 60 segundos. 🌿'
    ],
  },
  {
    id: 'descubrimiento',
    title: 'Ruta del Descubrimiento',
    subtitle: 'Dudas sobre el futuro',
    description: 'Aceptaremos el misterio del "no sé", reduciremos la presión social y exploraremos áreas de curiosidad sin juicios.',
    icon: 'compass-outline',
    color: '#60A5FA', // Blue
    image: require('../assets/images/Descubrimiento.jpeg'),
    focusArea: 'Tolerancia a lo incierto y Exploración',
    strategies: [
      'Explorar en vez de decidir de inmediato',
      'Diario de intereses: registrar curiosidades',
      'Diferenciar entre culpa útil e inservible',
      'Analizar qué faltó estructuradamente (tiempo, método, apoyo)',
    ],
    microRetos: [
      { id: 'des1', title: 'Curiosidad Aleatoria', action: 'Busca en Google una palabra al azar o un tema que no conozcas y lee el primer párrafo.', duration: '3 min', icon: 'search-outline' },
      { id: 'des2', title: 'Pausa Reflexiva', action: 'Mira a tu alrededor y encuentra 3 objetos de color verde. Nómbralos en voz alta.', duration: '< 1 min', icon: 'eye-outline' },
      { id: 'des3', title: 'Diario Flash', action: 'Anota en tu teléfono una pregunta que tengas sobre tu futuro sin intentar responderla.', duration: '1 min', icon: 'book-outline' },
    ],
    dailyQuotes: [
      'No necesitas el mapa entero, solo saber cuál es el siguiente paso. 🗺️',
      'Tu curiosidad es una brújula; escríbela hoy. ¿Qué atrapó tu atención? 📖',
      'Un tropiezo no es fracaso, es recolección de datos valiosos para tu siguiente intento. 🔬',
      'Explorar significa que no tienes que decidir el resto de tu vida en las próximas 24 horas. ⏳',
      'La culpa solo es útil si te mueve a reparar; suéltala si solo te paraliza. 🎈',
      'Todos caminamos en la niebla alguna vez. Tómate tu tiempo para que aclare. 🌫️',
      'Tus habilidades y pasiones siguen ahí, solo esperan ser redescrubiertas y pulidas.',
    ]
  },
  {
    id: 'soledad',
    title: 'Ruta de la Soledad',
    subtitle: 'Sensación de aislamiento',
    description: 'Aprenderemos a diferenciar entre estar solo y sentirse solo, fomentando la reconexión gradual empezando por uno mismo.',
    icon: 'planet-outline',
    color: '#818CF8', // Soft Indigo / Cosmic Purple
    image: require('../assets/images/Soledad.jpeg'),
    focusArea: 'Valores Sociales y Reestructuración',
    strategies: [
      'Identificar la diferencia entre aislamiento y soledad',
      'Contactar a alguien, aunque sea con un mensaje corto',
      'Programar tiempo de calidad a solas (autocuidado activo)',
      'Buscar espacios comunitarios sin presión de interactuar',
    ],
    microRetos: [
      { id: 'sol1', title: 'Conexión Sutil', action: 'Envíale un emoji (solo uno, como 👻 o 👽) a alguien con quien no hablas hace tiempo.', duration: '< 1 min', icon: 'chatbubble-outline' },
      { id: 'sol2', title: 'Acompañamiento Sonoro', action: 'Pon tu canción favorita de fondo mientras haces otra actividad.', duration: '5 min', icon: 'musical-notes-outline' },
      { id: 'sol3', title: 'Presencia de Mundo', action: 'Asómate por 1 minuto a ver pasar gente o autos. No estás solo en el planeta.', duration: '1 min', icon: 'planet-outline' },
    ],
    dailyQuotes: [
      'Tu valía no se mide por la cantidad de mensajes en tu teléfono hoy. 🌌',
      'Sentirse solo es una tormenta pasajera, no una sentencia permanente. ☔',
      'Aprende a ser tu propio refugio protector antes de buscarlo afuera. 🏕️',
      'Un pequeño mensaje a un conocido es un paso gigante contra el aislamiento. 📱',
      'Estar a solas puede ser el regalo más hermoso si te tratas con compasión. 🎁',
      'No estás roto(a) por sentir que no encajas a veces. Eres humano. ❤️‍🩹',
      'Hoy, ve a una cafetería o parque y déjate acompañar por la presencia del mundo. ☕',
    ]
  },
];

export const CLINICAL_DISCLAIMER = {
  title: 'Importante: Cuándo buscar apoyo 🚨',
  content: 'Si el ánimo bajo persiste por más de 2 semanas, interfiere significativamente en tu vida diaria, o existen pensamientos de autolesión, es indispensable buscar apoyo profesional con un psicólogo o psiquiatra. No estás solo.',
};
