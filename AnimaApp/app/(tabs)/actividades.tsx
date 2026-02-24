import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Gradients } from '../../constants/theme';
import { useTheme } from '../../hooks/useTheme';
import { ActivityCard, SectionHeader, Mascot } from '../../components/ui';
import { useStore } from '../../store/useStore';
import { ACTIVITY_ROUTES, EXCLUSIVE_ACTIVITIES } from '../../constants/activities';
import { Pressable } from 'react-native';

export default function ActividadesScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const activities = useStore((s) => s.activities);
  const currentPlan = useStore((s) => s.currentPlan);
  const mockLateNight = useStore((s) => s.mockLateNight);

  const isLateNight = React.useMemo(() => {
    if (mockLateNight) return true;
    const hour = new Date().getHours();
    return hour >= 22 || hour < 5;
  }, [mockLateNight]);

  /**
   * FIX: Routing por ID en vez de string matching del título.
   * Antes se usaba activity.title.toLowerCase().includes('...') — si alguien
   * cambiaba un título, la navegación se rompía silenciosamente.
   * Ahora usamos un mapa id → ruta definido en constants/activities.ts.
   */
  const handleActivityPress = (activity: typeof activities[0]) => {
    // Módulo 6: Semáforo de Energía (Balance late-night block)
    if (currentPlan === 'balance' && isLateNight && activity.id !== '1') {
      Alert.alert(
        "Semáforo de Energía 🚦",
        "Has llegado al final del día. Tu mente necesita detenerse y desconectar.\n\nPor tu bienestar clínico, todas las actividades intensas han sido bloqueadas. Solo tienes acceso a la Respiración Guiada."
      );
      return;
    }

    // Check exclusive activities
    const exclusive = EXCLUSIVE_ACTIVITIES[activity.id];
    if (exclusive && !exclusive.plans.includes(currentPlan || '')) {
      Alert.alert("Actividad Exclusiva 🔒", exclusive.message);
      return;
    }

    // Navigate by ID
    const route = ACTIVITY_ROUTES[activity.id];
    if (route) {
      router.push(route as any);
    }
  };

  const sortedActivities = React.useMemo(() => {
    let topPriorityId = '';
    
    switch (currentPlan) {
      case 'ansiedad':
        topPriorityId = '4'; // Conexión 5 Sentidos
        break;
      case 'balance':
        topPriorityId = '6'; // Pomodoro de Paz
        break;
      case 'autocompasion':
        topPriorityId = '9'; // Abrazo de Mariposa (Exclusive)
        break;
      case 'descubrimiento':
        topPriorityId = '7'; // Diario Ciego (Exclusive)
        break;
      case 'renacer':
      case 'depresion':
        topPriorityId = '8'; // Astillero de Victorias (Exclusive)
        break;
      case 'soledad':
        topPriorityId = '10'; // Mensaje en una Botella (Exclusive)
        break;
      case 'inseguridad':
        topPriorityId = '2'; // Diario Estelar
        break;
      default:
        topPriorityId = '1'; // Respiración
        break;
    }

    return [...activities].sort((a, b) => {
      if (a.id === topPriorityId) return -1;
      if (b.id === topPriorityId) return 1;
      return 0;
    });
  }, [activities, currentPlan]);

  const mascotText = React.useMemo(() => {
    switch (currentPlan) {
      case 'ansiedad': return 'Un paso a la vez. Tú tienes el control 🍃';
      case 'soledad': return 'No estás solo en esto. Hagamos algo juntos 🫂';
      case 'inseguridad': return 'Cada pequeño logro cuenta. Tú puedes 🌟';
      default: return 'Elige una actividad y encuentra tu calma interior ✨';
    }
  }, [currentPlan]);

  return (
    <View style={styles.container}>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInUp.duration(400)} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <SectionHeader
            title="Actividades"
            subtitle="Herramientas para tu bienestar emocional"
          />
          {currentPlan === 'balance' && (
            <Pressable 
              onPress={() => useStore.getState().setMockLateNight(!mockLateNight)} 
              style={{ padding: 8, backgroundColor: mockLateNight ? colors.primary : 'transparent', borderRadius: 8 }}
            >
              <Ionicons name="time-outline" size={24} color={mockLateNight ? '#FFF' : colors.textSecondary} />
            </Pressable>
          )}
        </Animated.View>

        {(currentPlan === 'balance' && isLateNight) && (
          <Animated.View entering={FadeInUp.duration(500)} style={styles.semaforoBanner}>
             <Ionicons name="moon" size={24} color="#B39DDB" />
             <View style={{flex: 1}}>
               <Text style={styles.semaforoTitle}>Semáforo en Rojo</Text>
               <Text style={styles.semaforoText}>Es tarde. El acceso a herramientas complejas está bloqueado para proteger tu descanso.</Text>
             </View>
          </Animated.View>
        )}

        {/* Activity Cards — staggered animation */}
        {sortedActivities.map((activity, i) => (
          <ActivityCard
            key={activity.id}
            title={activity.title}
            description={activity.description}
            icon={activity.icon}
            color={activity.color}
            gradient={activity.gradient}
            duration={activity.duration}
            delay={i * 100}
            isRecommended={i === 0}
            onPress={() => handleActivityPress(activity)}
          />
        ))}

        {/* Mascot at bottom */}
        <Animated.View entering={FadeInUp.duration(400).delay(500)} style={styles.mascotSection}>
          <Mascot size={120} variant={(currentPlan === 'balance' && isLateNight) ? "sleeping" : "meditating"} />
          <Text style={[styles.mascotText, { color: colors.textLight }]}>
            {(currentPlan === 'balance' && isLateNight) ? "Es hora de soltar el día. Lumi ya está descansando 🌙" : mascotText}
          </Text>
        </Animated.View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 60 },
  mascotSection: {
    alignItems: 'center', marginTop: 24, gap: 12,
  },
  mascotText: {
    fontSize: 13, textAlign: 'center',
    fontFamily: 'Poppins_400Regular',
  },
  semaforoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(179, 157, 219, 0.15)',
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(179, 157, 219, 0.3)',
  },
  semaforoTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    color: '#B39DDB',
    marginBottom: 4,
  },
  semaforoText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 13,
    color: '#A0AEC0',
    lineHeight: 18,
  },
});
