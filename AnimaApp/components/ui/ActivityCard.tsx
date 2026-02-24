/**
 * ActivityCard — Tarjeta para la lista de actividades con animación staggered.
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { Colors, BorderRadius } from '../../constants/theme';
import { GlassCard } from './GlassCard';

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
          <View style={styles.recommendedBadge}>
            <Ionicons name="star" size={12} color="#000" />
            <Text style={styles.recommendedText}>Recomendado</Text>
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

const styles = StyleSheet.create({
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 10,
  },
  recommendedBadge: {
    position: 'absolute', top: -12, right: 12,
    backgroundColor: '#FFD700', paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 12, zIndex: 10, flexDirection: 'row', alignItems: 'center', gap: 4,
    shadowColor: '#FFD700', shadowOpacity: 0.5, shadowRadius: 8, elevation: 5,
  },
  recommendedText: {
    fontSize: 10, fontFamily: 'Poppins_700Bold', color: '#000', textTransform: 'uppercase',
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
});
