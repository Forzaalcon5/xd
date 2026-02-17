import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, Pressable, ViewStyle, TextStyle,
  Dimensions, Platform, Image, ImageSourcePropType,
} from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle, withRepeat, withTiming,
  withSpring, withSequence, withDelay, Easing, FadeIn, FadeInUp,
  interpolate, interpolateColor, useAnimatedSensor, SensorType,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Shadows, BorderRadius, Gradients, Typography, MoodConfig, MoodType } from '../constants/theme';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

// Mascot images (RF-19)
const MASCOT_IMAGES: Record<string, ImageSourcePropType> = {
  happy: require('../assets/images/mascot/saludando.png'),
  greeting: require('../assets/images/mascot/saludando.png'),
  empathetic: require('../assets/images/mascot/empatico.png'),
  breathing: require('../assets/images/mascot/respirando.png'),
  meditating: require('../assets/images/mascot/meditando.png'),
};


// ============================================================
// AURORA ANIMATED BACKGROUND  (RF-22)
// ============================================================
import { SoundService } from '../utils/SoundService';
import * as Haptics from 'expo-haptics';

// ... (imports)

// ============================================================
// AURORA ANIMATED BACKGROUND  (RF-22)
// ============================================================
export const AuroraBackground = React.memo(function AuroraBackground() {
  const sensor = useAnimatedSensor(SensorType.GYROSCOPE, { interval: 100 });
  const blob1Anim = useSharedValue(0);
  const blob2Anim = useSharedValue(0);
  const blob3Anim = useSharedValue(0);

  useEffect(() => {
    blob1Anim.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 4000, easing: Easing.inOut(Easing.ease) })
      ), -1, true
    );
    blob2Anim.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 7000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 7000, easing: Easing.inOut(Easing.ease) })
      ), -1, true
    );
    blob3Anim.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 5000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 5000, easing: Easing.inOut(Easing.ease) })
      ), -1, true
    );
  }, []);

  const style1 = useAnimatedStyle(() => {
    const { x, y } = sensor.sensor.value;
    return {
      transform: [
        { translateX: withSpring(y * 20 + interpolate(blob1Anim.value, [0, 1], [0, 20])) },
        { translateY: withSpring(x * 20 + interpolate(blob1Anim.value, [0, 1], [0, 20])) },
        { scale: interpolate(blob1Anim.value, [0, 1], [1, 1.1]) },
      ],
      opacity: interpolate(blob1Anim.value, [0, 1], [0.8, 0.6]),
    };
  });

  const style2 = useAnimatedStyle(() => {
    const { x, y } = sensor.sensor.value;
    return {
      transform: [
        { translateX: withSpring(y * -15 + interpolate(blob2Anim.value, [0, 1], [0, -20])) },
        { translateY: withSpring(x * -15 + interpolate(blob2Anim.value, [0, 1], [0, 20])) },
        { scale: interpolate(blob2Anim.value, [0, 1], [1, 1.15]) },
      ],
      opacity: interpolate(blob2Anim.value, [0, 1], [0.5, 0.3]),
    };
  });

  const style3 = useAnimatedStyle(() => {
    const { x, y } = sensor.sensor.value;
    return {
      transform: [
        { translateX: withSpring(y * 10) },
        { translateY: withSpring(x * 10 + interpolate(blob3Anim.value, [0, 1], [0, -15])) },
        { scale: interpolate(blob3Anim.value, [0, 1], [0.9, 1.05]) },
      ],
    };
  });

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Animated.View style={[styles.auroraBlob, styles.blob1, style1]} />
      <Animated.View style={[styles.auroraBlob, styles.blob2, style2]} />
      <Animated.View style={[styles.auroraBlob, styles.blob3, style3]} />
      <View style={styles.frostOverlay} />
    </View>
  );
});

// ============================================================
// GLASS CARD  (glassmorphism effect)
// ============================================================
interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  intensity?: number;
}

export function GlassCard({ children, style, onPress, intensity = 50 }: GlassCardProps) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const handlePressIn = () => { if (onPress) scale.value = withSpring(0.97, { damping: 15, stiffness: 200 }); };
  const handlePressOut = () => { if (onPress) scale.value = withSpring(1, { damping: 15, stiffness: 200 }); };

  const Content = (
    <Animated.View style={[
      styles.glassCard, 
      animStyle, 
      style, 
      { backgroundColor: 'rgba(255, 255, 255, 0.85)', overflow: 'hidden', padding: 16 }
    ]}>
      {children}
    </Animated.View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          SoundService.play('click');
          onPress();
        }}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        {Content}
      </Pressable>
    );
  }
  return Content;
}

// ============================================================
// JEWEL BUTTON  (premium gradient button)
// ============================================================
interface JewelButtonProps {
  title: string;
  onPress: () => void;
  icon?: string;
  colors?: readonly [string, string, ...string[]];
  style?: ViewStyle;
  disabled?: boolean;
}

export function JewelButton({ title, onPress, icon, colors, style, disabled }: JewelButtonProps) {
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      onPress={() => {
        if (!disabled) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          SoundService.play('click');
        }
        onPress();
      }}
      onPressIn={() => { scale.value = withSpring(0.95, { damping: 15 }); }}
      onPressOut={() => { scale.value = withSpring(1, { damping: 15 }); }}
      disabled={disabled}
      style={{ opacity: disabled ? 0.6 : 1 }}
    >
      <Animated.View style={animStyle}>
        <LinearGradient
          colors={(colors as [string, string, ...string[]]) || [...Gradients.jewel]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.jewelButton, style]}
        >
          {icon && <Ionicons name={icon as any} size={20} color="#FFF" style={{ marginRight: 8 }} />}
          <Text style={styles.jewelButtonText}>{title}</Text>
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}

// ============================================================
// ACTIVITY CARD  (for activity list screen)
// ============================================================
interface ActivityCardProps {
  title: string;
  description: string;
  icon: string;
  color: string;
  duration: string;
  onPress?: () => void;
  delay?: number;
}

export function ActivityCard({ title, description, icon, color, duration, onPress, delay = 0 }: ActivityCardProps) {
  return (
    <Animated.View entering={FadeInUp.duration(400).delay(delay)}>
      <GlassCard onPress={onPress} style={styles.activityCard}>
        <View style={[styles.activityIconWrap, { backgroundColor: color + '18' }]}>
          <Ionicons name={icon as any} size={24} color={color} />
        </View>
        <View style={styles.activityContent}>
          <Text style={styles.activityTitle}>{title}</Text>
          <Text style={styles.activityDesc}>{description}</Text>
        </View>
        <View style={styles.activityRight}>
          <Text style={styles.activityDuration}>{duration}</Text>
          <Ionicons name="chevron-forward" size={18} color={Colors.textLight} />
        </View>
      </GlassCard>
    </Animated.View>
  );
}

// ============================================================
// MOOD BUTTON  (RF-20 — styled vector icons, not generic emojis)
// ============================================================
interface MoodButtonProps {
  mood: MoodType;
  selected: boolean;
  onPress: () => void;
}

export function MoodButton({ mood, selected, onPress }: MoodButtonProps) {
  const config = MoodConfig[mood];
  const scale = useSharedValue(selected ? 1.15 : 1);
  scale.value = withSpring(selected ? 1.15 : 1, { damping: 12, stiffness: 150 });

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable onPress={() => {
      SoundService.play('click');
      onPress();
    }} style={styles.moodButtonWrap}>
      <Animated.View style={[styles.moodButton, animStyle]}>
        <View style={[
          styles.moodIconCircle,
          selected
            ? { backgroundColor: config.color + '18', borderColor: config.color, borderWidth: 2 }
            : { backgroundColor: 'rgba(255,255,255,0.8)', borderColor: 'rgba(0,0,0,0.06)', borderWidth: 1.5 },
        ]}>
          <Ionicons name={config.icon as any} size={22} color={selected ? config.color : Colors.textLight} />
        </View>
        {selected && <View style={[styles.moodDotIndicator, { backgroundColor: config.color }]} />}
      </Animated.View>
      <Text style={[
        styles.moodLabel,
        selected && { color: config.color, fontWeight: '700' },
      ]}>{config.label}</Text>
    </Pressable>
  );
}

// ============================================================
// MASCOT COMPONENT  (RF-19 — with floating animation)
// ============================================================
interface MascotProps {
  size?: number;
  style?: ViewStyle;
  variant?: 'happy' | 'greeting' | 'empathetic' | 'breathing' | 'meditating';
}

export function Mascot({ size = 120, style, variant = 'happy' }: MascotProps) {
  const floatY = useSharedValue(0);
  const glow = useSharedValue(0);
  const breathScale = useSharedValue(1);

  useEffect(() => {
    // Floating animation
    floatY.value = withRepeat(
      withSequence(
        withTiming(-8, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(8, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      ),
      -1, true
    );
    
    // Glow animation
    glow.value = withRepeat(
      withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
      -1, true
    );

    // Breathing animation logic
    if (variant === 'breathing' || variant === 'meditating') {
      breathScale.value = withRepeat(
        withSequence(
          withTiming(1.08, { duration: 4000, easing: Easing.inOut(Easing.ease) }), // Inhale
          withTiming(1, { duration: 4000, easing: Easing.out(Easing.ease) })       // Exhale
        ),
        -1, true
      );
    }
  }, [variant]);

  const floatStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatY.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: interpolate(glow.value, [0, 1], [0.3, 0.6]),
    transform: [{ scale: interpolate(glow.value, [0, 1], [0.9, 1.1]) }],
  }));

  const breathStyle = useAnimatedStyle(() => ({
    transform: [{ scale: breathScale.value }],
  }));

  const imageSource = MASCOT_IMAGES[variant] || MASCOT_IMAGES.happy;

  return (
    <Animated.View style={[styles.mascotContainer, { width: size, height: size }, floatStyle, breathStyle, style]}>
      {/* Glow behind mascot */}
      <Animated.View style={[styles.mascotGlow, { width: size * 1.3, height: size * 1.3 }, glowStyle]} />
      {/* Mascot image */}
      <Image
        source={imageSource}
        style={{ width: size, height: size }}
        resizeMode="contain"
      />
    </Animated.View>
  );
}

import AsyncStorage from '@react-native-async-storage/async-storage';

// ============================================================
// FLOATING PARTICLES  (RF-21 — subtle energy particles)
// ============================================================
interface FloatingParticlesProps {
  count?: number;
  persistenceKey?: string; // New prop for saving positions
}

export function FloatingParticles({ count = 6, persistenceKey }: FloatingParticlesProps) {
  const [positions, setPositions] = useState<{ x: number; y: number }[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!persistenceKey) {
      // Fallback for non-persistent usage (e.g. Login)
      // Generate random once to avoid re-renders, or just let Particle handle it (legacy)
      setPositions(Array.from({ length: count }).map((_, i) => ({
        x: 20 + (i * (SCREEN_W - 40)) / count, // Linear X
        y: 200 + Math.random() * 200,          // Band Y
      })));
      setLoaded(true);
      return;
    }

    const loadPositions = async () => {
      try {
        const stored = await AsyncStorage.getItem(persistenceKey);
        if (stored) {
          setPositions(JSON.parse(stored));
        } else {
          // New random positions dispersed across the WHOLE screen
          const newPositions = Array.from({ length: count }).map(() => ({
            x: Math.random() * (SCREEN_W - 40) + 20,
            y: Math.random() * (SCREEN_H - 100) + 50, // Full height scatter
          }));
          setPositions(newPositions);
          await AsyncStorage.setItem(persistenceKey, JSON.stringify(newPositions));
        }
      } catch (e) {
        console.warn('Failed to load particle positions', e);
      } finally {
        setLoaded(true);
      }
    };

    loadPositions();
  }, [persistenceKey, count]);

  if (!loaded) return null; // Prevent flash

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {positions.map((pos, i) => (
        <Particle 
          key={i} 
          index={i} 
          initialX={pos.x} 
          initialY={pos.y} 
        />
      ))}
    </View>
  );
}

function Particle({ index, initialX, initialY }: { index: number; initialX?: number; initialY?: number }) {
  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    const delay = index * 500;
    const duration = 4000 + Math.random() * 3000;
    translateY.value = withDelay(delay, withRepeat(
      withTiming(-60 - Math.random() * 40, { duration, easing: Easing.inOut(Easing.ease) }),
      -1, true
    ));
    translateX.value = withDelay(delay, withRepeat(
      withTiming(20 - Math.random() * 40, { duration: duration * 0.7, easing: Easing.inOut(Easing.ease) }),
      -1, true
    ));
    opacity.value = withDelay(delay, withRepeat(
      withSequence(
        withTiming(0.6, { duration: duration * 0.3 }),
        withTiming(0, { duration: duration * 0.7 }),
      ),
      -1
    ));
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { translateX: translateX.value }],
    opacity: opacity.value,
  }));

  // Use props if available, otherwise fallback (though now parent handles it mostly)
  const left = initialX ?? (20 + (index * (SCREEN_W - 40)) / 6);
  const top = initialY ?? (200 + Math.random() * 200);
  const size = 4 + Math.random() * 4;
  const particleColors = [Colors.primary, Colors.mint, Colors.secondary, Colors.accent];

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          left, top,
          width: size, height: size, borderRadius: size / 2,
          backgroundColor: particleColors[index % particleColors.length],
        },
        style,
      ]}
    />
  );
}

// ============================================================
// SECTION HEADER
// ============================================================
interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  style?: ViewStyle;
}

export function SectionHeader({ title, subtitle, style }: SectionHeaderProps) {
  return (
    <View style={[{ marginBottom: 16 }, style]}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {subtitle && <Text style={styles.sectionSubtitle}>{subtitle}</Text>}
    </View>
  );
}

// ============================================================
// FEATURE BUTTON  (for home dashboard quick access)
// ============================================================
interface FeatureButtonProps {
  title: string;
  icon: string;
  color: string;
  onPress?: () => void;
}

// FeatureButton
export function FeatureButton({ title, icon, color, onPress }: FeatureButtonProps) {
  return (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        SoundService.play('click');
        onPress && onPress();
      }}
      style={styles.featureBtn}
    >
      <View style={[styles.featureIconWrap, { backgroundColor: color + '15' }]}>
        <Ionicons name={icon as any} size={24} color={color} />
      </View>
      <Text style={styles.featureBtnText}>{title}</Text>
    </Pressable>
  );
}

// ============================================================
// CHAT BUBBLE
// ============================================================
interface ChatBubbleProps {
  text: string;
  isUser: boolean;
  showAvatar?: boolean;
}

export function ChatBubble({ text, isUser, showAvatar }: ChatBubbleProps) {
  return (
    <View style={[styles.bubbleRow, isUser && styles.bubbleRowUser]}>
      {!isUser && showAvatar && (
        <LinearGradient colors={[...Gradients.jewel]} style={styles.bubbleAvatar}>
          <Ionicons name="happy-outline" size={16} color="#FFF" />
        </LinearGradient>
      )}
      <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleBot]}>
        <Text style={[styles.bubbleText, isUser && { color: '#FFF' }]}>{text}</Text>
      </View>
    </View>
  );
}

// ============================================================
// TYPING INDICATOR  (animated dots)
// ============================================================
export function TypingIndicator() {
  const dot1 = useSharedValue(0);
  const dot2 = useSharedValue(0);
  const dot3 = useSharedValue(0);

  useEffect(() => {
    dot1.value = withRepeat(withSequence(withTiming(-4, { duration: 300 }), withTiming(0, { duration: 300 })), -1);
    dot2.value = withDelay(150, withRepeat(withSequence(withTiming(-4, { duration: 300 }), withTiming(0, { duration: 300 })), -1));
    dot3.value = withDelay(300, withRepeat(withSequence(withTiming(-4, { duration: 300 }), withTiming(0, { duration: 300 })), -1));
  }, []);

  const d1 = useAnimatedStyle(() => ({ transform: [{ translateY: dot1.value }] }));
  const d2 = useAnimatedStyle(() => ({ transform: [{ translateY: dot2.value }] }));
  const d3 = useAnimatedStyle(() => ({ transform: [{ translateY: dot3.value }] }));

  return (
    <View style={[styles.bubbleRow]}>
      <LinearGradient colors={[...Gradients.jewel]} style={styles.bubbleAvatar}>
        <Ionicons name="happy-outline" size={16} color="#FFF" />
      </LinearGradient>
      <View style={[styles.bubble, styles.bubbleBot, { flexDirection: 'row', gap: 4, paddingVertical: 14 }]}>
        <Animated.View style={[styles.typingDot, d1]} />
        <Animated.View style={[styles.typingDot, d2]} />
        <Animated.View style={[styles.typingDot, d3]} />
      </View>
    </View>
  );
}

// ============================================================
// WEEKLY CHART  (SVG-style mood graph)
// ============================================================
interface WeeklyChartProps {
  data: number[];
  height?: number;
}

export function WeeklyChart({ data, height = 120 }: WeeklyChartProps) {
  const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  const maxVal = Math.max(...data, 1);

  return (
    <View style={[styles.chartContainer, { height }]}>
      <View style={styles.chartRow}>
        {data.map((val, i) => (
          <View key={i} style={styles.chartBarWrap}>
            <View style={styles.chartBarTrack}>
              <Animated.View entering={FadeIn.delay(i * 80).duration(400)}>
                <LinearGradient
                  colors={[...Gradients.jewel]}
                  style={[styles.chartBarFill, { height: `${(val / maxVal) * 100}%` as any }]}
                />
              </Animated.View>
            </View>
            <Text style={styles.chartBarLabel}>{days[i]}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

// ============================================================
// AMBIENT SOUND BUTTON (Kawaii)
// ============================================================
export function AmbientButton() {
  const [mode, setMode] = useState< 'off' | 'rain' | 'ocean' | 'fire' | 'birds' >('off');
  
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    SoundService.play('click');

    setMode((prev) => {
      let next: typeof mode = 'off';
      if (prev === 'off') next = 'rain';
      else if (prev === 'rain') next = 'ocean';
      else if (prev === 'ocean') next = 'fire';
      else if (prev === 'fire') next = 'birds';
      else next = 'off';

      if (next === 'off') SoundService.stopAmbient();
      else SoundService.playAmbient(next);
      
      return next;
    });
  };

  const config = {
    off: { icon: 'musical-notes-outline', color: Colors.textLight, label: 'Sonidos' },
    rain: { icon: 'rainy', color: '#60A5FA', label: 'Lluvia' },
    ocean: { icon: 'water', color: '#3B82F6', label: 'Océano' },
    fire: { icon: 'flame', color: '#F97316', label: 'Fuego' },
    birds: { icon: 'leaf', color: '#10B981', label: 'Aves' },
  };

  const current = config[mode];

  return (
    <Pressable onPress={handlePress} style={styles.ambientBtn}>
      <Animated.View 
        style={[
          styles.ambientIconWrap, 
          { backgroundColor: mode === 'off' ? 'rgba(0,0,0,0.05)' : current.color + '20' }
        ]}
        entering={FadeIn}
        key={mode} // Re-animate on change
      >
        <Ionicons name={current.icon as any} size={20} color={mode === 'off' ? Colors.textLight : current.color} />
      </Animated.View>
      <Animated.Text 
        style={[
          styles.ambientLabel, 
          { color: mode === 'off' ? Colors.textLight : current.color }
        ]}
        key={mode + 'text'}
        entering={FadeIn.duration(300)}
      >
        {current.label}
      </Animated.Text>
    </Pressable>
  );
}

// ============================================================
// STYLES
// ============================================================
const styles = StyleSheet.create({
  // Aurora
  auroraBlob: {
    position: 'absolute',
    borderRadius: 200,
  },
  frostOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.05)', // Subtle frost
    // backdropFilter not supported natively on mobile, need blur view or just opacity
  },
  blob1: {
    width: 300, height: 300,
    backgroundColor: 'rgba(91,155,213,0.12)',
    top: -50, right: -80,
  },
  blob2: {
    width: 250, height: 250,
    backgroundColor: 'rgba(155,142,196,0.10)',
    top: 200, left: -60,
  },
  blob3: {
    width: 220, height: 220,
    backgroundColor: 'rgba(168,230,207,0.10)',
    bottom: 80, right: -40,
  },

  // GlassCard
  glassCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: BorderRadius.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
    ...Shadows.small,
  },

  // JewelButton
  jewelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: BorderRadius.full,
    ...Shadows.glow,
  },
  jewelButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins_600SemiBold',
  },

  // ActivityCard
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 10,
  },
  activityIconWrap: {
    width: 48, height: 48,
    borderRadius: BorderRadius.medium,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityContent: { flex: 1, gap: 2 },
  activityTitle: {
    fontSize: 15, fontWeight: '600', color: Colors.textPrimary,
    fontFamily: 'Poppins_600SemiBold',
  },
  activityDesc: {
    fontSize: 12, color: Colors.textLight,
  },
  activityRight: { alignItems: 'flex-end', gap: 4 },
  activityDuration: {
    fontSize: 11, color: Colors.textLight, fontFamily: 'Poppins_500Medium',
  },

  // MoodButton (RF-20 — styled icons)
  moodButtonWrap: { alignItems: 'center', gap: 6 },
  moodButton: {
    width: 52, height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moodIconCircle: {
    width: 48, height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moodDotIndicator: {
    position: 'absolute',
    bottom: -2,
    width: 6, height: 6, borderRadius: 3,
  },
  moodLabel: {
    fontSize: 10, color: Colors.textLight,
    fontFamily: 'Poppins_500Medium',
  },

  // Mascot
  mascotContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  mascotGlow: {
    position: 'absolute',
    borderRadius: 200,
    backgroundColor: 'rgba(91,155,213,0.12)',
  },
  mascotBody: {
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.glow,
  },

  // SectionHeader
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
    fontFamily: 'Poppins_700Bold',
  },
  sectionSubtitle: {
    fontSize: 13,
    color: Colors.textLight,
    marginTop: 2,
    fontFamily: 'Poppins_400Regular',
  },

  // FeatureButton
  featureBtn: {
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  featureIconWrap: {
    width: 56, height: 56,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureBtnText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontFamily: 'Poppins_600SemiBold',
    textAlign: 'center',
  },

  // Chat
  bubbleRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 12,
    gap: 8,
  },
  bubbleRowUser: { flexDirection: 'row-reverse' },
  bubbleAvatar: {
    width: 30, height: 30, borderRadius: 15,
    justifyContent: 'center', alignItems: 'center',
  },
  bubble: {
    maxWidth: '75%',
    borderRadius: BorderRadius.large,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  bubbleUser: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 4,
  },
  bubbleBot: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
  },
  bubbleText: {
    fontSize: 14,
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  typingDot: {
    width: 7, height: 7, borderRadius: 3.5,
    backgroundColor: Colors.textLight,
  },

  // WeeklyChart
  chartContainer: { marginVertical: 8 },
  chartRow: {
    flexDirection: 'row', justifyContent: 'space-around',
    alignItems: 'flex-end', flex: 1,
  },
  chartBarWrap: { alignItems: 'center', gap: 6, flex: 1 },
  chartBarTrack: {
    width: 20, height: 90,
    backgroundColor: 'rgba(91,155,213,0.06)',
    borderRadius: 10,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  chartBarFill: {
    width: '100%',
    borderRadius: 10,
  },
  chartBarLabel: {
    fontSize: 11, color: Colors.textLight,
    fontFamily: 'Poppins_500Medium',
  },

  // Ambient Button
  ambientBtn: {
    alignItems: 'center', gap: 6, marginVertical: 12,
  },
  ambientIconWrap: {
    width: 48, height: 48, borderRadius: 24,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)',
  },
  ambientLabel: {
    fontSize: 11, fontWeight: '600', fontFamily: 'Poppins_600SemiBold',
  },
});
