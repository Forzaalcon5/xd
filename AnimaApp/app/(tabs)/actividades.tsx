import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Colors, Gradients } from '../../constants/theme';
import { useTheme } from '../../hooks/useTheme';
import { ActivityCard, SectionHeader, Mascot } from '../../components/ui';
import { ScreenWrapper } from '../../components/ScreenWrapper';
import { useStore } from '../../store/useStore';

export default function ActividadesScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const activities = useStore((s) => s.activities);

  const handleActivityPress = (activity: typeof activities[0]) => {
    if (activity.title.toLowerCase().includes('respiración')) {
      router.push('/actividades/respiracion');
    } else if (activity.title.toLowerCase().includes('estelar')) {
      router.push('/actividades/gratitud');
    } else if (activity.title.toLowerCase().includes('relajación')) {
      router.push('/actividades/relajacion');
    } else if (activity.title.toLowerCase().includes('sentidos')) {
      router.push('/actividades/grounding');
    }
    // Other activities show a placeholder for now
  };

  return (
    <ScreenWrapper style={styles.container}>

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
        {activities.map((activity, i) => (
          <ActivityCard
            key={activity.id}
            title={activity.title}
            description={activity.description}
            icon={activity.icon}
            color={activity.color}
            gradient={activity.gradient}
            duration={activity.duration}
            delay={i * 100}
            onPress={() => handleActivityPress(activity)}
          />
        ))}

        {/* Mascot at bottom */}
        <Animated.View entering={FadeInUp.duration(400).delay(500)} style={styles.mascotSection}>
          <Mascot size={90} variant="breathing" />
          <Text style={[styles.mascotText, { color: colors.textLight }]}>
            Elige una actividad y encuentra tu calma interior ✨
          </Text>
        </Animated.View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </ScreenWrapper>
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
