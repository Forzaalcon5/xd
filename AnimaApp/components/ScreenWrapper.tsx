import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AuroraBackground } from './ui';
import { Gradients } from '../constants/theme';

interface ScreenWrapperProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function ScreenWrapper({ children, style }: ScreenWrapperProps) {
  return (
    <View style={[styles.container, style]}>
      <LinearGradient colors={[...Gradients.primary]} style={StyleSheet.absoluteFill} />
      <AuroraBackground />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
