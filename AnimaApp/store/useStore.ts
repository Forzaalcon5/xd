import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SoundService } from '../utils/SoundService';

export type MoodType = 'animado' | 'mejor' | 'neutral' | 'triste' | 'muy_triste';

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export interface MoodEntry {
  id: string;
  mood: MoodType;
  date: string;
  label: string;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  gradient?: [string, string];
  duration: string;
}

export interface JournalEntry {
  id: string;
  text: string;
  x: number;   // Random X offset (-40 to +40)
  y: number;   // Random Y offset (-30 to +30)
  date: string;
}

interface AppState {
  // Auth
  isAuthenticated: boolean;
  userName: string;
  userEmail: string;
  showSplash: boolean;
  
  // Plan (Emotional Route)
  currentPlan: string | null;
  
  // Mood
  currentMood: MoodType | null;
  moodHistory: MoodEntry[];
  weeklyMoodData: number[];
  
  // Chat
  messages: ChatMessage[];
  isTyping: boolean;
  
  // Journal (Gratitude)
  journalEntries: JournalEntry[];
  
  // Activities
  activities: Activity[];
  recentActivities: { title: string; time: string; detail: string; icon?: string; color?: string }[];
  
  // Actions
  login: (email: string, name: string) => void;
  updateUser: (name: string) => void;
  logout: () => void;
  hideSplash: () => void;
  setPlan: (planId: string) => void;
  setMood: (mood: MoodType) => void;
  saveMoodEntry: () => void;
  sendMessage: (text: string) => void;
  addJournalEntry: (entry: JournalEntry) => void;
  removeJournalEntry: (id: string) => void;
  updateJournalEntry: (id: string, text: string) => void;
}

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
  hola: [
    '¡Hola! ¿Cómo te sientes hoy? Estoy aquí para acompañarte. 😊',
    '¡Hola! Qué bueno verte. ¿En qué puedo ayudarte hoy?',
  ],
};

function getBotResponse(userMessage: string): string {
  const lower = userMessage.toLowerCase();
  if (lower.includes('hola') || lower.includes('hey')) {
    const responses = BOT_RESPONSES.hola;
    return responses[Math.floor(Math.random() * responses.length)];
  }
  if (lower.includes('ansios') || lower.includes('nervios') || lower.includes('estres')) {
    const responses = BOT_RESPONSES.ansiedad;
    return responses[Math.floor(Math.random() * responses.length)];
  }
  if (lower.includes('triste') || lower.includes('mal') || lower.includes('llorar')) {
    const responses = BOT_RESPONSES.triste;
    return responses[Math.floor(Math.random() * responses.length)];
  }
  if (lower.includes('bien') || lower.includes('feliz') || lower.includes('genial')) {
    const responses = BOT_RESPONSES.bien;
    return responses[Math.floor(Math.random() * responses.length)];
  }
  const responses = BOT_RESPONSES.default;
  return responses[Math.floor(Math.random() * responses.length)];
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Auth
      isAuthenticated: false,
      userName: '',
      userEmail: '',
      showSplash: true,
      
      // Plan
      currentPlan: null,
      
      // Mood
      currentMood: null,
      moodHistory: [
        { id: '1', mood: 'neutral', date: 'Ayer', label: 'Neutral' },
        { id: '2', mood: 'mejor', date: 'Anteayer', label: 'Mejor' },
        { id: '3', mood: 'animado', date: 'Hace 3 días', label: 'Animado' },
      ],
      weeklyMoodData: [3, 4, 3, 2, 4, 3, 5],
      
      // Chat
      messages: [],
      isTyping: false,
      
      // Journal (Gratitude)
      journalEntries: [],
      
      // Activities
      activities: [
        { id: '1', title: 'Respiración Guiada', description: 'Respira y relaja tu mente.', icon: 'water-outline', color: '#87CEEB', gradient: ['#89F7FE', '#66A6FF'], duration: '5 min' },
        { id: '2', title: 'Diario Estelar', description: 'Escribe cosas positivas del día.', icon: 'journal-outline', color: '#FFD93D', gradient: ['#FFD200', '#F7971E'], duration: '10 min' },
        { id: '3', title: 'Relajación Progresiva', description: 'Libera la tensión de tu cuerpo.', icon: 'leaf-outline', color: '#C4B7EB', gradient: ['#E0C3FC', '#8EC5FC'], duration: '8 min' },
        { id: '4', title: 'Meditación Breve', description: 'Encuentra calma en minutos.', icon: 'sparkles-outline', color: '#A8E6CF', gradient: ['#D4FC79', '#96E6A1'], duration: '5 min' },
      ],
      recentActivities: [
        { title: 'Respiración Guiada', time: 'Hoy • 5 min', detail: 'Relajaste', icon: 'water-outline', color: '#87CEEB' },
      ],
      
      // Actions
      login: (email, name) => set({ isAuthenticated: true, userEmail: email, userName: name || 'Usuario' }),
      updateUser: (name) => set({ userName: name }),
      logout: () => {
        SoundService.stopAmbient();
        set({ isAuthenticated: false, userName: '', userEmail: '', messages: [], currentPlan: null });
      },
      hideSplash: () => set({ showSplash: false }),
      setPlan: (planId) => set({ currentPlan: planId }),
      setMood: (mood) => set({ currentMood: mood }),
      saveMoodEntry: () => {
        const { currentMood, moodHistory } = get();
        if (!currentMood) return;
        const labels: Record<MoodType, string> = {
          animado: 'Animado', mejor: 'Mejor', neutral: 'Neutral',
          triste: 'Triste', muy_triste: 'Muy Triste',
        };
        const newEntry: MoodEntry = {
          id: Date.now().toString(),
          mood: currentMood,
          date: 'Hoy',
          label: labels[currentMood],
        };

        // Calculate score (1-5)
        const scores: Record<MoodType, number> = {
          animado: 5, mejor: 4, neutral: 3, triste: 2, muy_triste: 1,
        };
        const score = scores[currentMood];
        
        // Update weekly data: remove first, add new at end (FIFO for chart)
        const newWeekly = [...get().weeklyMoodData.slice(1), score];

        set({ 
          moodHistory: [newEntry, ...moodHistory], 
          currentMood: null,
          weeklyMoodData: newWeekly,
        });
      },
      sendMessage: (text) => {
        const { messages } = get();
        const userMsg: ChatMessage = {
          id: Date.now().toString(),
          text,
          sender: 'user',
          timestamp: new Date(),
        };
        set({ messages: [...messages, userMsg], isTyping: true });
        
        setTimeout(() => {
          const botMsg: ChatMessage = {
            id: (Date.now() + 1).toString(),
            text: getBotResponse(text),
            sender: 'bot',
            timestamp: new Date(),
          };
          set((state) => ({
            messages: [...state.messages, botMsg],
            isTyping: false,
          }));
        }, 1500 + Math.random() * 1000);
      },
      addJournalEntry: (entry) => {
        set((state) => ({
          journalEntries: [...state.journalEntries, entry],
        }));
      },
      removeJournalEntry: (id) => {
        set((state) => ({
          journalEntries: state.journalEntries.filter((e) => e.id !== id),
        }));
      },
      updateJournalEntry: (id, text) => {
        set((state) => ({
          journalEntries: state.journalEntries.map((e) =>
            e.id === id ? { ...e, text } : e
          ),
        }));
      },
    }),
    {
      name: 'anima-app-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist user data, not transient UI state
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        userName: state.userName,
        userEmail: state.userEmail,
        currentPlan: state.currentPlan,
        moodHistory: state.moodHistory,
        weeklyMoodData: state.weeklyMoodData,
        messages: state.messages,
        journalEntries: state.journalEntries,
        recentActivities: state.recentActivities,
      }),
    }
  )
);
