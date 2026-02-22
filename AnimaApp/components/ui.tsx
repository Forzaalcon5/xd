import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, Pressable, ViewStyle, TextStyle,
  Dimensions, Platform, Image, ImageSourcePropType,
} from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle, withRepeat, withTiming,
  withSpring, withSequence, withDelay, Easing, FadeIn, FadeInUp,
  interpolate, interpolateColor, useAnimatedSensor, SensorType, useAnimatedProps,
  cancelAnimation,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useStore } from '../store/useStore';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle, G } from 'react-native-svg'; // Added for Progress Ring
import { Colors, Shadows, BorderRadius, Gradients, Typography, MoodConfig, MoodType } from '../constants/theme';
import { useTheme } from '../hooks/useTheme';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

// Mascot images (RF-19)
const MASCOT_IMAGES: Record<string, ImageSourcePropType> = {
  // Legacy mappings for backwards compatibility
  happy: require('../assets/images/mascot/saludando.png'),
  greeting: require('../assets/images/mascot/saludando.png'),
  breathing: require('../assets/images/mascot/respirando.png'),
  
  // New Enhanced Mappings
  meditating: require('../assets/images/mascot/lumi-meditating.png'),
  resting: require('../assets/images/mascot/lumi-resting.png'),
  radar: require('../assets/images/mascot/lumi-radar.png'),
  celebrating: require('../assets/images/mascot/lumi-celebrating.png'),
  diary: require('../assets/images/mascot/lumi-diary.png'),
  fire: require('../assets/images/mascot/lumi-fire.png'),
  star: require('../assets/images/mascot/lumi-star .png'), // Keep space in filename based on user file list
  confused: require('../assets/images/mascot/lumi-confused.png'),
  empathetic: require('../assets/images/mascot/lumi-empatico.png'),
  sleeping: require('../assets/images/mascot/Lumi-sleeping.png'),
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
  const { isDark } = useTheme();
  const sensor = useAnimatedSensor(SensorType.GYROSCOPE, { interval: 100 });
  const blob1Anim = useSharedValue(0);
  const blob2Anim = useSharedValue(0);
  const blob3Anim = useSharedValue(0);

  const currentPlan = useStore(s => s.currentPlan);

  const getBlobColors = () => {
    switch(currentPlan) {
      case 'ansiedad': return ['#6FA8DC', '#8A9CD8', '#86BFC6']; 
      case 'soledad':  return ['#A2C4E0', '#B0D2E6', '#BDE0EC']; 
      case 'inseguridad': return ['#9BD1B3', '#9BD1C5', '#A2D19B']; 
      case 'renacer': return ['#D1C49B', '#D1CC9B', '#D1BC9B'];
      case 'autocompasion': return ['#D19EBB', '#D1A39B', '#D19BA8'];
      case 'balance': return ['#9B9CD1', '#A99BD1', '#9BC7D1'];
      case 'descubrimiento': return ['#9BD1AA', '#9BD1BD', '#A3D19B'];
      default: return ['#5A99D4', '#9B8EC4', '#A8E6CF']; 
    }
  };

  const [color1, color2, color3] = getBlobColors();

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
    
    return () => {
      cancelAnimation(blob1Anim);
      cancelAnimation(blob2Anim);
      cancelAnimation(blob3Anim);
    };
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
      <Animated.View style={[styles.auroraBlob, isDark ? styles.blob1Dark : styles.blob1, style1, { backgroundColor: color1 }]} />
      <Animated.View style={[styles.auroraBlob, isDark ? styles.blob2Dark : styles.blob2, style2, { backgroundColor: color2 }]} />
      <Animated.View style={[styles.auroraBlob, isDark ? styles.blob3Dark : styles.blob3, style3, { backgroundColor: color3 }]} />
      <View style={styles.frostOverlay} />
      {/* Stars for Moon Mode */}
      {isDark && <FloatingParticles count={15} />} 
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

// GlassCard updated
export function GlassCard({ children, style, onPress, intensity = 50 }: GlassCardProps) {
  const { colors, isDark } = useTheme(); // NEW
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const handlePressIn = () => { if (onPress) scale.value = withSpring(0.97, { damping: 15, stiffness: 200 }); };
  const handlePressOut = () => { if (onPress) scale.value = withSpring(1, { damping: 15, stiffness: 200 }); };

  const Content = (
    <Animated.View style={[
      styles.glassCard, 
      animStyle, 
      style, 
      { 
        backgroundColor: colors.bgCard, // DYNAMIC
        borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.6)', // Subtle border for dark mode
      }  
    ]}>
      {children}
    </Animated.View>
  );
// ... wrapping logic same ...


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
  gradient?: [string, string];
  duration: string;
  onPress?: () => void;
  delay?: number;
  isRecommended?: boolean;
}

export function ActivityCard({ title, description, icon, color, gradient, duration, onPress, delay = 0, isRecommended }: ActivityCardProps) {
  const { colors } = useTheme();
  return (
    <Animated.View entering={FadeInUp.duration(400).delay(delay)}>
      <GlassCard onPress={onPress} style={[styles.activityCard, isRecommended && { borderColor: '#FFD700', borderWidth: 1 }] as any}>
        {isRecommended && (
          <View style={{ position: 'absolute', top: -12, right: 12, backgroundColor: '#FFD700', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, zIndex: 10, flexDirection: 'row', alignItems: 'center', gap: 4, shadowColor: '#FFD700', shadowOpacity: 0.5, shadowRadius: 8, elevation: 5 }}>
            <Ionicons name="star" size={12} color="#000" />
            <Text style={{ fontSize: 10, fontFamily: 'Poppins_700Bold', color: '#000', textTransform: 'uppercase' }}>Recomendado</Text>
          </View>
        )}
        {gradient ? (
          <LinearGradient
            colors={gradient}
            style={styles.activityIconWrap}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          >
            <Ionicons name={icon as any} size={24} color="#FFF" />
          </LinearGradient>
        ) : (
          <View style={[styles.activityIconWrap, { backgroundColor: color + '18' }]}>
            <Ionicons name={icon as any} size={24} color={color} />
          </View>
        )}
        <View style={styles.activityContent}>
          <Text style={[styles.activityTitle, { color: colors.textPrimary }]}>{title}</Text>
          <Text style={[styles.activityDesc, { color: colors.textSecondary }]}>{description}</Text>
        </View>
        <View style={styles.activityRight}>
          <Text style={[styles.activityDuration, { color: colors.textLight }]}>{duration}</Text>
          <Ionicons name="chevron-forward" size={18} color={colors.textLight} />
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
  const { colors } = useTheme();
  const config = MoodConfig[mood];
  // Note: config.color is static from MoodConfig, but we might want to map it if we really need dynamic mood colors. 
  // However, `colors.mood...` exists in the theme. Let's try to map it if possible, strictly we'd need to change MoodConfig to return keys, not values.
  // For now, let's keep MoodConfig colors as they are likely bright enough.
  // But the "unselected" border and textLight need to be dynamic.
  
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
            : { backgroundColor: colors.bgCard, borderColor: colors.textLight + '20', borderWidth: 1.5 },
        ]}>
          <Ionicons name={config.icon as any} size={22} color={selected ? config.color : colors.textLight} />
        </View>
        {selected && <View style={[styles.moodDotIndicator, { backgroundColor: config.color }]} />}
      </Animated.View>
      <Text style={[
        styles.moodLabel,
        selected ? { color: config.color, fontWeight: '700' } : { color: colors.textSecondary },
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
  variant?: 'happy' | 'greeting' | 'empathetic' | 'breathing' | 'meditating' | 'resting' | 'radar' | 'celebrating' | 'diary' | 'fire' | 'star' | 'confused' | 'sleeping';
}

const MascotComponent = ({ size = 120, style, variant = 'happy' }: MascotProps) => {
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

    // Breathing animation logic (fixed jump-cuts by removing withSequence inside withRepeat)
    if (variant === 'breathing' || variant === 'meditating') {
      breathScale.value = withRepeat(
        withTiming(1.04, { duration: 3500, easing: Easing.inOut(Easing.sin) }),
        -1, 
        true
      );
    }
    
    return () => {
      cancelAnimation(floatY);
      cancelAnimation(glow);
      cancelAnimation(breathScale);
    };
  }, [variant]);

  const glowStyle = useAnimatedStyle(() => ({
    opacity: interpolate(glow.value, [0, 1], [0.3, 0.6]),
    transform: [{ scale: interpolate(glow.value, [0, 1], [0.9, 1.1]) }],
  }));

  const combinedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: floatY.value },
      { scale: breathScale.value }
    ],
  }));

  const imageSource = MASCOT_IMAGES[variant] || MASCOT_IMAGES.happy;

  // Custom adjustments for variants that have too much transparent padding from AI generation
  const scaleMap: Record<string, { image: number, glow: number }> = {
    happy: { image: 1, glow: 1.3 }, // Original centered graphic
    meditating: { image: 1.45, glow: 1.05 }, // Needs a bit more scale
    star: { image: 1.6, glow: 0.95 }, // Extremely padded graphic
  };

  // Default to 1.35x scale for all new AI-generated variants to offset the padding
  const currentScale = scaleMap[variant] || { image: 1.35, glow: 1.1 };
  const imageScale = currentScale.image;
  const glowMultiplier = currentScale.glow;

  return (
    <Animated.View style={[styles.mascotContainer, { width: size, height: size }, combinedStyle, style]}>
      {/* Glow behind mascot */}
      <Animated.View style={[styles.mascotGlow, { width: size * glowMultiplier, height: size * glowMultiplier }, glowStyle]} />
      {/* Mascot image */}
      <Image
        source={imageSource}
        style={{ width: size, height: size, transform: [{ scale: imageScale }] }}
        resizeMode="contain"
      />
    </Animated.View>
  );
};

export const Mascot = React.memo(MascotComponent);

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
    
    return () => {
      cancelAnimation(translateY);
      cancelAnimation(translateX);
      cancelAnimation(opacity);
    };
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
  const { colors } = useTheme();
  return (
    <View style={[{ marginBottom: 16 }, style]}>
      <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>{title}</Text>
      {subtitle && <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>{subtitle}</Text>}
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
  const { colors } = useTheme();
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
      <Text style={[styles.featureBtnText, { color: colors.textPrimary }]}>{title}</Text>
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
  const { colors, isDark } = useTheme(); // NEW

  return (
    <View style={[styles.bubbleRow, isUser && styles.bubbleRowUser]}>
      {!isUser && showAvatar && (
        <LinearGradient colors={[...Gradients.jewel]} style={styles.bubbleAvatar}>
          <Ionicons name="happy-outline" size={16} color="#FFF" />
        </LinearGradient>
      )}
      <View style={[
        styles.bubble,
        isUser ? styles.bubbleUser : styles.bubbleBot,
        // DYNAMIC OVERRIDES
        isUser ? { backgroundColor: colors.primary } : { 
          backgroundColor: isDark ? colors.bgCard : 'rgba(255,255,255,0.9)',
          borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' 
        }
      ]}>
        <Text style={[
          styles.bubbleText, 
          isUser ? { color: '#FFF' } : { color: colors.textPrimary }
        ]}>{text}</Text>
      </View>
    </View>
  );
}

// ============================================================
// TYPING INDICATOR  (animated dots)
// ============================================================
export function TypingIndicator() {
  const { colors, isDark } = useTheme(); // NEW
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
      <View style={[
        styles.bubble, 
        styles.bubbleBot, 
        { 
          flexDirection: 'row', gap: 4, paddingVertical: 14,
          backgroundColor: isDark ? colors.bgCard : 'rgba(255,255,255,0.9)', // DYNAMIC matches bot bubble
          borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'
        }
      ]}>
        <Animated.View style={[styles.typingDot, d1, { backgroundColor: colors.textLight }]} />
        <Animated.View style={[styles.typingDot, d2, { backgroundColor: colors.textLight }]} />
        <Animated.View style={[styles.typingDot, d3, { backgroundColor: colors.textLight }]} />
      </View>
    </View>
  );
}

// ============================================================
// WEEKLY PROGRESS RING (RF-18)
// ============================================================
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface WeeklyProgressRingProps {
  data: number[];
  size?: number;
  strokeWidth?: number;
}

export function WeeklyProgressRing({ data, size = 160, strokeWidth = 12 }: WeeklyProgressRingProps) {
  const { colors } = useTheme(); // NEW
  // Calculate average score (assuming max 5)
  const total = data.reduce((acc, val) => acc + val, 0);
  const average = total / (data.length || 1);
  const progress = Math.min(average / 5, 1); // Normalize 0-1

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  
  const animatedProgress = useSharedValue(0);

  useEffect(() => {
    animatedProgress.value = withTiming(progress, { duration: 1500, easing: Easing.out(Easing.exp) });
  }, [progress]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - animatedProgress.value),
  }));

  const scoreText = Math.round(progress * 100);

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', marginVertical: 16 }}>
      <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
        <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Background Track */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={colors.primary + '20'} // DYNAMIC
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress Circle */}
          <AnimatedCircle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={colors.primary} // DYNAMIC
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeLinecap="round"
            rotation="-90"
            origin={`${size / 2}, ${size / 2}`}
            animatedProps={animatedProps}
          />
        </Svg>
        
        {/* Inner Content */}
        <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
           <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 4 }}>
              <Animated.Text 
                entering={FadeInUp.delay(500)}
                style={{ fontSize: 32, fontWeight: '700', color: colors.textPrimary, fontFamily: 'Poppins_700Bold' }} // DYNAMIC
              >
                {scoreText}%
              </Animated.Text>
              <Animated.Text 
                entering={FadeInUp.delay(600)}
                style={{ fontSize: 12, color: colors.textLight, fontFamily: 'Poppins_400Regular' }} // DYNAMIC
              >
                Bienestar Semanal
              </Animated.Text>
           </View>
        </View>
      </View>
    </View>
  );
}

// Legacy Chart (kept for reference if needed, but not exported as main)
export function WeeklyChartOld({ data }: { data: number[] }) {
   return null; 
}

// ============================================================
// AMBIENT SOUND BUTTON (Kawaii)
// ============================================================
export function AmbientButton() {
  const { colors } = useTheme(); // NEW
  const [mode, setMode] = useState< 'off' | 'rain' | 'ocean' | 'fire' | 'birds' >('off');
  
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    SoundService.play('click');

    // Calculate next mode based on current mode
    let next: typeof mode = 'off';
    if (mode === 'off') next = 'rain';
    else if (mode === 'rain') next = 'ocean';
    else if (mode === 'ocean') next = 'fire';
    else if (mode === 'fire') next = 'birds';
    else next = 'off';

    // Update State
    setMode(next);

    // Call Service (Logic is now robust inside Service)
    if (next === 'off') SoundService.stopAmbient();
    else SoundService.playAmbient(next);
  };

  const config = {
    off: { icon: 'musical-notes-outline', color: colors.textLight, label: 'Sonidos' }, // DYNAMIC
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
        <Ionicons name={current.icon as any} size={20} color={mode === 'off' ? colors.textLight : current.color} /> 
      </Animated.View>
      <Animated.Text 
        style={[
          styles.ambientLabel, 
          { color: mode === 'off' ? colors.textLight : current.color }
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
  blob1Dark: {
    width: 300, height: 300,
    backgroundColor: 'rgba(167,139,250,0.15)',
    top: -50, right: -80,
  },
  blob2Dark: {
    width: 250, height: 250,
    backgroundColor: 'rgba(91,155,213,0.15)',
    top: 200, left: -60,
  },
  blob3Dark: {
    width: 220, height: 220,
    backgroundColor: 'rgba(200,182,255,0.10)',
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

// ============================================================
// RADAR DE CONEXIÓN (Checklist widget)
// ============================================================
import { EMOTIONAL_ROUTES, MicroReto } from '../constants/clinicalContent';

type SelfCareTask = {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  completed: boolean;
};

export function ConnectionRadarCard() {
  const { colors, isDark } = useTheme();
  const currentPlan = useStore((s) => s.currentPlan);
  
  const initialTasks = React.useMemo(() => {
    const route = EMOTIONAL_ROUTES.find(r => r.id === currentPlan) || EMOTIONAL_ROUTES[0];
    return route.citasContigoMismo.map(cita => ({
      ...cita,
      icon: cita.icon as keyof typeof Ionicons.glyphMap,
      completed: false
    }));
  }, [currentPlan]);

  const [tasks, setTasks] = useState<SelfCareTask[]>(initialTasks);

  React.useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  const completedCount = tasks.filter(t => t.completed).length;
  const progressPercent = tasks.length > 0 ? completedCount / tasks.length : 0;
  
  const animatedProgress = useSharedValue(0);

  React.useEffect(() => {
    animatedProgress.value = withSpring(progressPercent, { damping: 12, stiffness: 90 });
    
    // Confetti effect when perfectly completed
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
        ['#EF4444', '#FCD34D', '#4ADE80'] // Red -> Yellow -> Green
      ),
    };
  });

  return (
    <Animated.View entering={FadeInUp.duration(400).delay(200)}>
      <View style={[styles.radarContainer, { 
        backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
        borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'
      }]}>
        
        {/* Progress Display */}
        <View style={styles.radarEnergyRow}>
          <Text style={[styles.radarEnergyLabel, { color: colors.textPrimary }]}>Energía Propia</Text>
          <Text style={[styles.radarEnergyValue, { color: colors.textSecondary }]}>{Math.round(progressPercent * 100)}%</Text>
        </View>
        <View style={[styles.radarTrack, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}>
          <Animated.View style={[styles.radarBar, progressBarStyle]} />
        </View>

        {/* Tasks */}
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
// MICRO-CHALLENGE CARD (Actionable routes)
// ============================================================
export function MicroChallengeCard() {
  const { colors, isDark } = useTheme();
  const currentPlan = useStore((s) => s.currentPlan);
  const [completed, setCompleted] = React.useState(false);
  
  // Pick a stable random daily challenge based on route
  const todaysChallenge = React.useMemo(() => {
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
