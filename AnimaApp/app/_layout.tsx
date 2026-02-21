import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts, Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins';
import * as SplashScreen from 'expo-splash-screen';
import SplashScreenComponent from '../components/SplashScreen';
import { useStore } from '../store/useStore';

// Prevent native splash from auto-hiding (font loading)
SplashScreen.preventAutoHideAsync().catch(() => {});

import { ThemeProvider } from '../context/ThemeContext';

function AppLayout() {
  const [showSplash, setShowSplash] = useState(true);
  const isAuthenticated = useStore((s) => s.isAuthenticated);
  const currentPlan = useStore((s) => s.currentPlan);

  // Load premium fonts
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded]);

  useEffect(() => {
    if (!showSplash) {
      if (!isAuthenticated) {
        router.replace('/(auth)/login');
      } else if (!currentPlan) {
        router.replace('/(onboarding)/select-plan');
      } else {
        router.replace('/(tabs)');
      }
    }
  }, [showSplash, isAuthenticated, currentPlan]);

  // Wait for fonts to load before anything
  if (!fontsLoaded) {
    return null;
  }

  if (showSplash) {
    return (
      <View style={StyleSheet.absoluteFill}>
        <StatusBar style="dark" />
        <SplashScreenComponent onFinish={() => setShowSplash(false)} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="dark" />
      <Stack screenOptions={{
        headerShown: false,
        animation: 'fade',
        contentStyle: { backgroundColor: 'transparent' },
      }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(onboarding)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="actividades/respiracion"
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="actividades/gratitud"
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      </Stack>
    </GestureHandlerRootView>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AppLayout />
    </ThemeProvider>
  );
}
