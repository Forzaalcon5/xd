/**
 * ChatEngine — Motor de respuestas del chatbot.
 *
 * ¿POR QUÉ se extrajo del store?
 * El store (Zustand) debe ser un CONTENEDOR de estado, no un motor de reglas.
 * Mezclar lógica de negocio (respuestas del bot, parsing de keywords) con
 * estado global viola el Principio de Responsabilidad Única:
 *   - Si quieres cambiar las respuestas del bot, tocas un archivo de 300+ líneas
 *   - Si quieres testear el bot, tienes que mockear todo el store
 *   - Si quieres usar IA real después, tienes que refactorizar el store completo
 *
 * MEJORA: Ahora la lógica está aislada y es fácil de:
 *   - Testear unitariamente (input → output puro)
 *   - Reemplazar por una API real sin tocar el store
 *   - Extender con más keywords/respuestas sin riesgo
 */

const BOT_RESPONSES: Record<string, string[]> = {
  default: [
    'Entiendo cómo te sientes. ¿Quieres contarme más sobre eso?',
    'Gracias por compartir. Estoy aquí para escucharte. 💙',
    'Eso es muy válido. ¿Cómo te gustaría sentirte?',
    'Te escucho. Recuerda que cada emoción tiene su propósito. 🌱',
  ],
  ansiedad: [
    'Siento que te sientas así. ¿Quieres intentarlo con un ejercicio de respiración?',
    'La ansiedad puede ser abrumadora. Respira lento: inhala profundamente por la nariz... ahora exhala despacio por la boca...',
  ],
  triste: [
    'Lamento que te sientas triste. Recuerda que está bien sentirse así. 💙',
    'La tristeza es una emoción válida. ¿Qué tal si escribimos en tu Diario Estelar?',
  ],
  bien: [
    '¡Me alegra saber eso! 😊 ¿Qué te ha hecho sentir bien hoy?',
    '¡Qué bueno! Aprovechemos esta energía positiva. ¿Te gustaría hacer una actividad?',
  ],
  inseguridad: [
    'Entiendo ese sentimiento, pero quiero que sepas que eres más capaz de lo que crees. 🌟',
    'Dudar es humano, pero no dejes que las dudas definan tu camino. Has llegado hasta aquí por algo.',
    'Algo bueno de ti: buscas ayuda cuando la necesitas. Eso requiere valentía. 💪',
  ],
  hola: [
    '¡Hola! ¿Cómo te sientes hoy? Estoy aquí para acompañarte. 😊',
    '¡Hola! Qué bueno verte. ¿En qué puedo ayudarte hoy?',
  ],
};

/**
 * Keyword-to-category mapping.
 * Fácil de extender: solo agrega un nuevo entry al array.
 */
const KEYWORD_MAP: { keywords: string[]; category: string }[] = [
  { keywords: ['hola', 'hey', 'buenas'], category: 'hola' },
  { keywords: ['ansios', 'nervios', 'estres', 'pánico', 'miedo', 'opresión', 'pecho', 'pensar', 'respirar'], category: 'ansiedad' },
  { keywords: ['triste', 'mal', 'llorar', 'solo', 'sola', 'deprim', 'compañía', 'hablar'], category: 'triste' },
  { keywords: ['bien', 'feliz', 'genial', 'contento', 'alegr'], category: 'bien' },
  { keywords: ['fallar', 'suficiente', 'dudo', 'dudando', 'recuérdame', 'no soy', 'incapaz'], category: 'inseguridad' },
];

function pickRandom(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Genera una respuesta del bot basada en el mensaje del usuario.
 * Pura función sin side effects — ideal para testing.
 */
export function getBotResponse(userMessage: string): string {
  const lower = userMessage.toLowerCase();

  for (const { keywords, category } of KEYWORD_MAP) {
    if (keywords.some(kw => lower.includes(kw))) {
      return pickRandom(BOT_RESPONSES[category]);
    }
  }

  return pickRandom(BOT_RESPONSES.default);
}
