import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  FadeInDown,
  FadeInUp,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Gradients, Shadows } from '../../constants/theme';
import { AuroraBackground } from '../../components/ui';

const mascotImage = require('../../assets/images/mascot/respirando.png');

const PHASES = [
  { label: 'Inhala', duration: 4000, color: '#A8E6CF', icon: 'arrow-up' as const },
  { label: 'Sostén', duration: 4000, color: '#8BB8E8', icon: 'pause' as const },
  { label: 'Exhala', duration: 4000, color: '#9B8EC4', icon: 'arrow-down' as const },
  { label: 'Sostén', duration: 4000, color: '#F3B4C4', icon: 'pause' as const },
];

export default function RespiracionScreen() {
  const [isActive, setIsActive] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const mascotScale = useSharedValue(0.85);
  const mascotOpacity = useSharedValue(0.6);
  const ringScale = useSharedValue(1);

  useEffect(() => {
    if (!isActive) return;

    const phase = PHASES[phaseIndex];

    if (phaseIndex === 0) {
      // Inhale — expand
      mascotScale.value = withTiming(1.1, { duration: phase.duration, easing: Easing.inOut(Easing.ease) });
      mascotOpacity.value = withTiming(1, { duration: phase.duration });
      ringScale.value = withTiming(1.3, { duration: phase.duration, easing: Easing.inOut(Easing.ease) });
    } else if (phaseIndex === 2) {
      // Exhale — contract
      mascotScale.value = withTiming(0.85, { duration: phase.duration, easing: Easing.inOut(Easing.ease) });
      mascotOpacity.value = withTiming(0.6, { duration: phase.duration });
      ringScale.value = withTiming(1, { duration: phase.duration, easing: Easing.inOut(Easing.ease) });
    }

    const timer = setTimeout(() => {
      setPhaseIndex((prev) => (prev + 1) % PHASES.length);
    }, phase.duration);

    return () => clearTimeout(timer);
  }, [isActive, phaseIndex]);

  const mascotAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: mascotScale.value }],
    opacity: mascotOpacity.value,
  }));

  const ringAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ringScale.value }],
  }));

  const toggleExercise = () => {
    if (isActive) {
      setIsActive(false);
      setPhaseIndex(0);
      mascotScale.value = withTiming(0.85, { duration: 500 });
      mascotOpacity.value = withTiming(0.6, { duration: 500 });
      ringScale.value = withTiming(1, { duration: 500 });
    } else {
      setIsActive(true);
      setPhaseIndex(0);
    }
  };

  const currentPhase = PHASES[phaseIndex];

  return (
    <View style={styles.container}>
      <LinearGradient colors={[...Gradients.primary]} style={StyleSheet.absoluteFill} />
      <AuroraBackground />

      {/* Header */}
      <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <View style={styles.backBtnInner}>
            <Ionicons name="arrow-back" size={20} color={Colors.textPrimary} />
          </View>
        </Pressable>
        <Text style={styles.title}>Respiración Guiada</Text>
        <View style={{ width: 40 }} />
      </Animated.View>

      {/* Instruction Text */}
      <Animated.View entering={FadeInDown.duration(400).delay(100)} style={styles.instructionWrap}>
        <Text style={styles.instructionText}>
          Respira junto a Aníma. Sigue el ritmo visual para relajarte. 🍃
        </Text>
      </Animated.View>

      {/* Mascot Breathing Circle */}
      <View style={styles.circleContainer}>
        {/* Outer ring that expands/contracts */}
        <Animated.View style={[styles.outerRing, { borderColor: currentPhase.color + '30' }, ringAnimStyle]} />
        <Animated.View style={[styles.middleRing, { borderColor: currentPhase.color + '18' }, ringAnimStyle]} />

        {/* Mascot that breathes */}
        <Animated.View style={[styles.mascotWrap, mascotAnimStyle]}>
          <Image source={mascotImage} style={styles.mascotImage} resizeMode="contain" />
        </Animated.View>

        {/* Phase label below mascot — only when active */}
        {isActive && (
          <View style={[styles.phaseChip, { backgroundColor: currentPhase.color + '20' }]}>  
            <Ionicons name={currentPhase.icon as any} size={16} color={currentPhase.color} />
            <Text style={[styles.phaseText, { color: currentPhase.color }]}>
              {currentPhase.label}
            </Text>
          </View>
        )}
      </View>

      {/* Start/Stop Button */}
      <Animated.View entering={FadeInUp.duration(400).delay(200)} style={styles.controls}>
        <Pressable onPress={toggleExercise} style={styles.controlBtn}>
          <LinearGradient
            colors={isActive ? ['#E53E3E', '#C53030'] : [...Gradients.jewel]}
            style={styles.controlGradient}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          >
            <Ionicons name={isActive ? 'stop' : 'play'} size={22} color="#FFF" />
            <Text style={styles.controlText}>{isActive ? 'Detener' : 'Comenzar'}</Text>
          </LinearGradient>
        </Pressable>
      </Animated.View>

      <View style={{ height: 40 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: 55, paddingHorizontal: 20, paddingBottom: 12,
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  backBtnInner: {
    width: 36, height: 36, borderRadius: 12, backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center', alignItems: 'center', borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  title: {
    fontSize: 18, fontWeight: '700', color: Colors.textPrimary, fontFamily: 'Poppins_700Bold',
  },
  instructionWrap: {
    paddingHorizontal: 40, marginBottom: 10,
  },
  instructionText: {
    textAlign: 'center', fontSize: 14, color: Colors.textSecondary,
    fontFamily: 'Poppins_400Regular', lineHeight: 22,
  },
  circleContainer: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
  },
  outerRing: {
    position: 'absolute',
    width: 260, height: 260, borderRadius: 130,
    borderWidth: 2,
  },
  middleRing: {
    position: 'absolute',
    width: 300, height: 300, borderRadius: 150,
    borderWidth: 1,
  },
  mascotWrap: {
    alignItems: 'center', justifyContent: 'center',
  },
  mascotImage: {
    width: 180, height: 180,
  },
  phaseChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: 20, marginTop: 24,
  },
  phaseText: {
    fontSize: 15, fontWeight: '600', fontFamily: 'Poppins_600SemiBold',
  },
  controls: { paddingHorizontal: 24, gap: 12 },
  controlBtn: { borderRadius: 28, overflow: 'hidden' },
  controlGradient: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, paddingVertical: 16, borderRadius: 28,
  },
  controlText: {
    color: '#FFF', fontSize: 16, fontWeight: '700', fontFamily: 'Poppins_600SemiBold',
  },
});
