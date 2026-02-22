import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Colors, Gradients } from '../../constants/theme';
import { useTheme } from '../../hooks/useTheme';
import { ActivityCard, SectionHeader, Mascot } from '../../components/ui';
import { useStore } from '../../store/useStore';

export default function ActividadesScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const activities = useStore((s) => s.activities);
  const currentPlan = useStore((s) => s.currentPlan);

  const handleActivityPress = (activity: typeof activities[0]) => {
    if (activity.title.toLowerCase().includes('respiración')) {
      router.push('/actividades/respiracion');
    } else if (activity.title.toLowerCase().includes('estelar')) {
      router.push('/actividades/gratitud');
    } else if (activity.title.toLowerCase().includes('relajación')) {
      router.push('/actividades/relajacion');
    } else if (activity.title.toLowerCase().includes('sentidos')) {
      router.push('/actividades/grounding');
    } else if (activity.title.toLowerCase().includes('cápsula')) {
      router.push('/actividades/capsula');
    } else if (activity.title.toLowerCase().includes('pomodoro')) {
      router.push('/actividades/pomodoro');
    }
    // Other activities show a placeholder for now
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
      case 'descubrimiento':
        topPriorityId = '5'; // Cápsula de Papel
        break;
      case 'soledad':
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
        <Animated.View entering={FadeInUp.duration(400)}>
          <SectionHeader
            title="Actividades"
            subtitle="Herramientas para tu bienestar emocional"
          />
        </Animated.View>

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
          <Mascot size={90} variant="meditating" />
          <Text style={[styles.mascotText, { color: colors.textLight }]}>
            {mascotText}
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
});
