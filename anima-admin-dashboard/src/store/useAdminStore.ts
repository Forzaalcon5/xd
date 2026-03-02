import { create } from 'zustand';
import { CLINICAL_ACTIVITIES } from '@/lib/constants';

// ---- Types ----
export interface AnalyticsData {
  weeklyMood: { name: string; muyTriste: number; triste: number; neutral: number; mejor: number; animado: number }[];
  activeRoutes: { name: string; value: number; color: string }[];
  overviewStats: { activeUsers: string; sosSaves: string; dailyActivities: string };
}

export interface ActivityDefinition {
  id: string;
  title: string;
  route: string;
  duration: string;
}

export interface AdminStore {
  // Estado Analítico
  analytics: AnalyticsData | null;
  isLoadingAnalytics: boolean;
  fetchAnalytics: () => Promise<void>;

  // Estado del Catálogo Clínico (CMS)
  activities: ActivityDefinition[];
  addActivity: (activity: Omit<ActivityDefinition, 'id'>) => void;
  deleteActivity: (id: string) => void;
  updateActivity: (id: string, updated: Partial<ActivityDefinition>) => void;
}

// ---- Funcionalidad Simulada para Fronend (Mock Mappers) ----
const mockAnalytics: AnalyticsData = {
  weeklyMood: [
    { name: "Lun", muyTriste: 30, triste: 80, neutral: 240, mejor: 350, animado: 120 },
    { name: "Mar", muyTriste: 25, triste: 95, neutral: 210, mejor: 310, animado: 150 },
    { name: "Mié", muyTriste: 40, triste: 70, neutral: 280, mejor: 390, animado: 180 },
    { name: "Jue", muyTriste: 20, triste: 60, neutral: 250, mejor: 410, animado: 200 },
    { name: "Vie", muyTriste: 15, triste: 50, neutral: 190, mejor: 450, animado: 240 },
    { name: "Sáb", muyTriste: 10, triste: 40, neutral: 150, mejor: 500, animado: 320 },
    { name: "Dom", muyTriste: 18, triste: 45, neutral: 180, mejor: 480, animado: 290 },
  ],
  activeRoutes: [
    { name: "Renacer", value: 340, color: "#4ADE80" },
    { name: "Autocompasión", value: 280, color: "#F472B6" },
    { name: "Balance", value: 450, color: "#60A5FA" },
    { name: "Descubrimiento", value: 390, color: "#FBBF24" },
    { name: "Soledad", value: 210, color: "#A78BFA" },
  ],
  overviewStats: { activeUsers: "12,450", sosSaves: "843", dailyActivities: "5,124" }
};

// ---- Store Principal ----
export const useAdminStore = create<AdminStore>((set) => ({
  // Analytics State
  analytics: null,
  isLoadingAnalytics: false,
  fetchAnalytics: async () => {
    set({ isLoadingAnalytics: true });
    // Simulamos una latencia de red de 1 seg para efecto visual de carga
    await new Promise((resolve) => setTimeout(resolve, 1000));
    set({ analytics: mockAnalytics, isLoadingAnalytics: false });
  },

  // CMS State (Iniciado con los catalogos constantes sincronizados)
  activities: [...CLINICAL_ACTIVITIES],
  
  addActivity: (activityData) => set((state) => ({ 
    activities: [...state.activities, { id: Math.random().toString(36).substring(2, 9), ...activityData }]
  })),

  deleteActivity: (id) => set((state) => ({
    activities: state.activities.filter(a => a.id !== id)
  })),

  updateActivity: (id, updated) => set((state) => ({
    activities: state.activities.map(a => a.id === id ? { ...a, ...updated } : a)
  }))
}));
