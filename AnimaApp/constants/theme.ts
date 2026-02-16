// Aníma App — Design System Tokens
// Calming, premium palette based on mockups and RNF-07

export const Colors = {
  // Core
  primary: '#5B9BD5',      // Sky blue — buttons, accents
  primaryLight: '#87CEEB',  // Light sky — highlights
  secondary: '#9B8EC4',     // Lavender — secondary accents
  accent: '#F7C97E',        // Warm gold — warm accent
  peach: '#FFDAB9',         // Peach — emotional warmth
  mint: '#A8E6CF',          // Mint — success, calm

  // Backgrounds
  bgPrimary: '#E8F4FD',     // Very light blue — main bg
  bgSecondary: '#F0F6FF',   // Lighter blue
  bgCard: 'rgba(255,255,255,0.85)',  // Glass card
  bgCardSolid: '#FFFFFF',

  // Text
  textPrimary: '#2D3748',   // Dark slate
  textSecondary: '#4A5568', // Medium gray
  textLight: '#A0AEC0',     // Light gray
  textOnPrimary: '#FFFFFF',

  // Semantic
  success: '#A8E6CF',
  warning: '#FCD34D',
  error: '#FC8181',
  info: '#87CEEB',

  // Mood Colors
  moodAnimado: '#A8E6CF',
  moodMejor: '#87CEEB',
  moodNeutral: '#FCD34D',
  moodTriste: '#C4B7EB',
  moodMuyTriste: '#FC8181',
};

export const Gradients = {
  primary: ['#E8F4FD', '#F0F6FF', '#FFFFFF'] as const,
  jewel: ['#5B9BD5', '#7EC8B8'] as const,
  warmSunset: ['#F7C97E', '#FFDAB9'] as const,
  lavender: ['#C4B7EB', '#9B8EC4'] as const,
  aurora: ['rgba(91,155,213,0.15)', 'rgba(155,142,196,0.08)', 'rgba(168,230,207,0.1)'] as const,
  loginBg: ['#E8F4FD', '#D5E8F7', '#C4DCF0'] as const,
  splash: ['#D5E8F7', '#E8F4FD', '#F0F6FF'] as const,
};

export const Shadows = {
  small: {
    shadowColor: '#5B9BD5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  medium: {
    shadowColor: '#5B9BD5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 4,
  },
  large: {
    shadowColor: '#5B9BD5',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
  },
  glow: {
    shadowColor: '#5B9BD5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
};

export const BorderRadius = {
  small: 8,
  medium: 12,
  large: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
};

export const Typography = {
  h1: { fontSize: 28, fontWeight: '700' as const, fontFamily: 'Poppins_700Bold' },
  h2: { fontSize: 22, fontWeight: '600' as const, fontFamily: 'Poppins_600SemiBold' },
  h3: { fontSize: 18, fontWeight: '600' as const, fontFamily: 'Poppins_600SemiBold' },
  body: { fontSize: 15, fontWeight: '400' as const, fontFamily: 'Poppins_400Regular' },
  bodyMedium: { fontSize: 15, fontWeight: '500' as const, fontFamily: 'Poppins_500Medium' },
  caption: { fontSize: 12, fontWeight: '400' as const, fontFamily: 'Poppins_400Regular' },
  button: { fontSize: 16, fontWeight: '600' as const, fontFamily: 'Poppins_600SemiBold' },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export type MoodType = 'animado' | 'mejor' | 'neutral' | 'triste' | 'muy_triste';

export const MoodConfig: Record<MoodType, {
  emoji: string;
  label: string;
  color: string;
  icon: string;
}> = {
  animado: { emoji: '😊', label: 'Animado', color: Colors.moodAnimado, icon: 'sunny-outline' },
  mejor: { emoji: '🙂', label: 'Mejor', color: Colors.moodMejor, icon: 'partly-sunny-outline' },
  neutral: { emoji: '😐', label: 'Neutral', color: Colors.moodNeutral, icon: 'cloud-outline' },
  triste: { emoji: '😔', label: 'Triste', color: Colors.moodTriste, icon: 'rainy-outline' },
  muy_triste: { emoji: '😢', label: 'Muy Triste', color: Colors.moodMuyTriste, icon: 'thunderstorm-outline' },
};

// Daily affirmations (RF-16)
export const DAILY_AFFIRMATIONS = [
  'Cada día es una nueva oportunidad para crecer y florecer. 🌱',
  'Eres más fuerte de lo que crees y más valiente de lo que imaginas. 💪',
  'Mereces paz, amor y toda la belleza que la vida ofrece. 🌸',
  'Tus emociones son válidas. Está bien sentir lo que sientes. 💙',
  'Hoy eliges ser amable contigo mismo/a. ✨',
  'Cada paso cuenta, por pequeño que parezca. 🦋',
  'Tu bienestar importa. Tómate un momento para respirar. 🍃',
];
