/**
 * ConnectionRadarCard — Widget de checklist de autocuidado basado en la ruta activa.
 * MicroChallengeCard — Tarjeta de micro-reto diario.
 */
import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle, withSpring, FadeInUp,
  interpolateColor, useAnimatedProps,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../hooks/useTheme';
import { useStore } from '../../store/useStore';
import { EMOTIONAL_ROUTES, MicroReto } from '../../constants/clinicalContent';
import { Colors } from '../../constants/theme';

// ============================================================
// CONNECTION RADAR CARD
// ============================================================
type SelfCareTask = {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  completed: boolean;
};

export function ConnectionRadarCard() {
  const { colors, isDark } = useTheme();
  const currentPlan = useStore((s) => s.currentPlan);
  
  const initialTasks = useMemo(() => {
    const route = EMOTIONAL_ROUTES.find(r => r.id === currentPlan) || EMOTIONAL_ROUTES[0];
    return route.citasContigoMismo.map(cita => ({
      ...cita,
      icon: cita.icon as keyof typeof Ionicons.glyphMap,
      completed: false
    }));
  }, [currentPlan]);

  const [tasks, setTasks] = useState<SelfCareTask[]>(initialTasks);

  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  const completedCount = tasks.filter(t => t.completed).length;
  const progressPercent = tasks.length > 0 ? completedCount / tasks.length : 0;
  
  const animatedProgress = useSharedValue(0);

  useEffect(() => {
    animatedProgress.value = withSpring(progressPercent, { damping: 12, stiffness: 90 });
    
    if (progressPercent === 1) {
      setTimeout(() => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }, 400);
    }
  }, [progressPercent]);

  const toggleTask = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const progressBarStyle = useAnimatedStyle(() => {
    const clampedProgress = Math.max(0, Math.min(1, animatedProgress.value));
    return {
      width: `${clampedProgress * 100}%`,
      backgroundColor: interpolateColor(
        clampedProgress,
        [0, 0.5, 1],
        ['#EF4444', '#FCD34D', '#4ADE80']
      ),
    };
  });

  return (
    <Animated.View entering={FadeInUp.duration(400).delay(200)}>
      <View style={[styles.radarContainer, { 
        backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
        borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'
      }]}>
        <View style={styles.radarEnergyRow}>
          <Text style={[styles.radarEnergyLabel, { color: colors.textPrimary }]}>Energía Propia</Text>
          <Text style={[styles.radarEnergyValue, { color: colors.textSecondary }]}>{Math.round(progressPercent * 100)}%</Text>
        </View>
        <View style={[styles.radarTrack, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}>
          <Animated.View style={[styles.radarBar, progressBarStyle]} />
        </View>

        {tasks.map((task, index) => {
          const isLast = index === tasks.length - 1;
          return (
            <Pressable 
              key={task.id} 
              onPress={() => toggleTask(task.id)}
              style={({ pressed }) => [
                styles.radarTaskRow,
                !isLast && { borderBottomColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' },
                isLast && { borderBottomWidth: 0, paddingBottom: 0 },
                pressed && { opacity: 0.7 }
              ]}
            >
              <View style={[
                styles.radarCheckbox, 
                { borderColor: task.completed ? '#4ADE80' : colors.textLight },
                task.completed && { backgroundColor: '#4ADE80' }
              ]}>
                {task.completed && <Ionicons name="checkmark" size={14} color="#FFF" />}
              </View>
              
              <View style={[styles.radarIconWrap, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }]}>
                <Ionicons name={task.icon} size={16} color={task.completed ? colors.textLight : colors.primary} />
              </View>
              
              <Text style={[
                styles.radarTaskTitle, 
                { color: task.completed ? colors.textLight : colors.textPrimary },
                task.completed && { textDecorationLine: 'line-through' }
              ]}>
                {task.title}
              </Text>
            </Pressable>
          );
        })}

      </View>
    </Animated.View>
  );
}

// ============================================================
// MICRO-CHALLENGE CARD
// ============================================================
export function MicroChallengeCard() {
  const { colors, isDark } = useTheme();
  const currentPlan = useStore((s) => s.currentPlan);
  const [completed, setCompleted] = useState(false);
  
  const todaysChallenge = useMemo(() => {
    const route = EMOTIONAL_ROUTES.find(r => r.id === currentPlan) || EMOTIONAL_ROUTES[0];
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    return route.microRetos[dayOfYear % route.microRetos.length];
  }, [currentPlan]);

  const routeColor = EMOTIONAL_ROUTES.find(r => r.id === currentPlan)?.color || colors.primary;

  const handleComplete = () => {
    if (completed) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setCompleted(true);
  };

  if (!todaysChallenge) return null;

  return (
    <Animated.View entering={FadeInUp.duration(400).delay(200)}>
      <View style={[styles.mcContainer, { 
        backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
        borderColor: completed ? routeColor : (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)')
      }]}>
        <View style={[styles.mcIconBox, { backgroundColor: routeColor + (completed ? '30' : '15') }]}>
          <Ionicons name={todaysChallenge.icon as any} size={22} color={routeColor} />
        </View>

        <View style={styles.mcContent}>
          <Text style={[styles.mcTitle, { color: completed ? routeColor : colors.textPrimary }]}>
            {completed ? '¡Reto Completado!' : todaysChallenge.title}
          </Text>
          <Text style={[styles.mcDesc, { color: colors.textSecondary }]}>
            {todaysChallenge.action}
          </Text>
          {!completed && (
            <View style={styles.mcMetaRow}>
              <Ionicons name="time-outline" size={14} color={colors.textLight} />
              <Text style={[styles.mcDuration, { color: colors.textLight }]}>{todaysChallenge.duration}</Text>
            </View>
          )}
        </View>

        <Pressable 
          onPress={handleComplete} 
          style={[styles.mcCheckBtn, { 
            borderColor: completed ? routeColor : colors.textLight,
            backgroundColor: completed ? routeColor : 'transparent'
          }]}
        >
          <Ionicons name="checkmark" size={18} color={completed ? '#FFF' : 'transparent'} />
        </Pressable>

      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  // ConnectionRadarCard
  radarContainer: {
    padding: 16, borderRadius: 20, marginBottom: 24,
    borderWidth: 1,
  },
  radarEnergyRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 8,
  },
  radarEnergyLabel: {
    fontSize: 14, fontFamily: 'Poppins_600SemiBold',
  },
  radarEnergyValue: {
    fontSize: 12, fontFamily: 'Poppins_500Medium',
  },
  radarTrack: {
    height: 8, borderRadius: 4, overflow: 'hidden', marginBottom: 16,
  },
  radarBar: {
    height: '100%', borderRadius: 4,
  },
  radarTaskRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  radarCheckbox: {
    width: 22, height: 22, borderRadius: 11,
    borderWidth: 2, justifyContent: 'center', alignItems: 'center',
    marginRight: 12,
  },
  radarIconWrap: {
    width: 32, height: 32, borderRadius: 8,
    justifyContent: 'center', alignItems: 'center', marginRight: 10,
  },
  radarTaskTitle: {
    flex: 1, fontSize: 13, fontFamily: 'Poppins_400Regular',
  },
  // MicroChallengeCard
  mcContainer: {
    padding: 16, borderRadius: 20, marginBottom: 24,
    borderWidth: 1, 
    flexDirection: 'row', alignItems: 'center', gap: 14,
  },
  mcIconBox: {
    width: 46, height: 46, borderRadius: 23,
    justifyContent: 'center', alignItems: 'center',
  },
  mcContent: { flex: 1 },
  mcTitle: {
    fontSize: 14, fontWeight: '700', fontFamily: 'Poppins_700Bold',
  },
  mcDesc: {
    fontSize: 13, fontFamily: 'Poppins_400Regular', marginTop: 2,
  },
  mcMetaRow: {
    flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6,
  },
  mcDuration: {
    fontSize: 11, fontFamily: 'Poppins_500Medium',
  },
  mcCheckBtn: {
    width: 32, height: 32, borderRadius: 16,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 2,
  },
});
