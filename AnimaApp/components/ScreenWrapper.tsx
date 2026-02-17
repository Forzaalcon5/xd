import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AuroraBackground } from './ui';
import { AuroraBackgroundDark } from './AuroraBackgroundDark'; // NEW
import { Gradients } from '../constants/theme';
import { useTheme } from '../hooks/useTheme';

interface ScreenWrapperProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function ScreenWrapper({ children, style }: ScreenWrapperProps) {
  const { isDark } = useTheme();
  
  return (
    <View style={[styles.container, style]}>
      <LinearGradient 
        colors={[...((isDark) ? Gradients.dreamNight : Gradients.primary)]} 
        style={StyleSheet.absoluteFill} 
      />
      {/* Light Mode Aurora */}
      {!isDark && <AuroraBackground />}
      
      {/* Dark Mode Aurora (Lunar Mode) */}
      {isDark && <AuroraBackgroundDark />}
      
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
