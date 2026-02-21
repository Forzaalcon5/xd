import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from '../../hooks/useTheme';

interface GlassCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function GlassCard({ children, style }: GlassCardProps) {
  const { isDark, colors } = useTheme();
  return (
    <View style={[
      styles.container, 
      { 
        backgroundColor: isDark ? 'rgba(15,23,42,0.4)' : 'rgba(255, 255, 255, 0.85)',
        borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'transparent',
        borderWidth: isDark ? 1 : 0
      },
      style
    ]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    overflow: 'hidden',
    // Background color dynamically handled above
    shadowColor: '#5B9BD5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
    padding: 0,
  },
});
