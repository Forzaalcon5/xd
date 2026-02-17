import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  withDelay, // ADDED
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { Colors } from '../constants/theme';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

// LUNAR MODE CONFIG (Sutil, Atmospheric, Relaxing)
// "Aurora emocional nocturna"
const BLOB_OPACITY = 0.12; // Slightly higher than 5% to be visible against dark bg
const DURATION_BASE = 25000; // 25s cycle for ultra slow movement

const STAR_COUNT = 40; // Increased density

// SHOOTING STAR COMPONENT
const ShootingStar = React.memo(() => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0);
  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    const triggerShootingStar = () => {
      // Random delay between 15s and 45s
      const nextDelay = Math.random() * 30000 + 15000;
      
      setTimeout(() => {
        // Reset position
        const startX = Math.random() * screenWidth;
        const startY = Math.random() * (SCREEN_H * 0.4); // Top 40%
        translateX.value = startX;
        translateY.value = startY;
        opacity.value = 0;

        // Animate
        // 1. Fade in quickly
        opacity.value = withTiming(1, { duration: 100 });
        // 2. Move diagonally
        translateX.value = withTiming(startX - 200, { duration: 1000, easing: Easing.out(Easing.quad) });
        translateY.value = withTiming(startY + 200, { duration: 1000, easing: Easing.out(Easing.quad) });
        // 3. Fade out at end
        opacity.value = withDelay(600, withTiming(0, { duration: 400 }));

        // Loop
        triggerShootingStar();
      }, nextDelay);
    };

    triggerShootingStar();
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: '-45deg' },
      { scaleX: 5 }, // Stretch to look like a streak
    ],
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          width: 25,
          height: 2,
          backgroundColor: '#FFF',
          borderRadius: 1,
          top: 0,
          left: 0,
          // Removed expensive shadows
        },
        style,
      ]}
    />
  );
});

const Star = React.memo(({ delay, size, top, left }: { delay: number; size: number; top: number; left: number }) => {
  const opacity = useSharedValue(0);
  
  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(0.4, { duration: 2000, easing: Easing.inOut(Easing.quad) }), // Fade in
          withTiming(0.1, { duration: 2500, easing: Easing.inOut(Easing.quad) }), // Fade out (twinkle)
          withTiming(0.5, { duration: 3000, easing: Easing.inOut(Easing.quad) }), // Back up
          withTiming(0, { duration: 2000, easing: Easing.inOut(Easing.quad) })   // Fade out complete
        ),
        -1,
        true
      )
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: interpolate(opacity.value, [0, 0.5], [0.5, 1.2]) }],
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          top,
          left,
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: '#FFF',
          // Removed expensive shadows causing lag
        },
        style,
      ]}
    />
  );
});

export const AuroraBackgroundDark = React.memo(function AuroraBackgroundDark() {
  const blob1Anim = useSharedValue(0); 
  const blob2Anim = useSharedValue(0); 
  const blob3Anim = useSharedValue(0); 
  
  // Generate random stars once
  const stars = React.useMemo(() => {
    return Array.from({ length: STAR_COUNT }).map((_, i) => ({
      id: i,
      top: Math.random() * SCREEN_H,
      left: Math.random() * SCREEN_W,
      size: Math.random() * 2 + 1, // Tiny stars 1-3px
      delay: Math.random() * 5000,
    }));
  }, []);

  useEffect(() => {
    // Blob 1: Vertical float + subtle scale
    blob1Anim.value = withRepeat(
      withSequence(
        withTiming(1, { duration: DURATION_BASE, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: DURATION_BASE * 1.2, easing: Easing.inOut(Easing.quad) })
      ), -1, true
    );

    // Blob 2: Lateral float + subtle scale
    blob2Anim.value = withRepeat(
      withSequence(
        withTiming(1, { duration: DURATION_BASE * 1.5, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: DURATION_BASE * 1.3, easing: Easing.inOut(Easing.quad) })
      ), -1, true
    );

    // Blob 3: Breathing
    blob3Anim.value = withRepeat(
      withSequence(
        withTiming(1, { duration: DURATION_BASE * 0.8, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: DURATION_BASE, easing: Easing.inOut(Easing.quad) })
      ), -1, true
    );
  }, []);

  const style1 = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(blob1Anim.value, [0, 1], [0, 80]) }, 
      { translateX: interpolate(blob1Anim.value, [0, 1], [0, 30]) },
      { scale: interpolate(blob1Anim.value, [0, 1], [1, 1.2]) },
    ],
    opacity: interpolate(blob1Anim.value, [0, 1], [BLOB_OPACITY, BLOB_OPACITY * 0.7]),
  }));

  const style2 = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(blob2Anim.value, [0, 1], [0, -60]) },
      { translateX: interpolate(blob2Anim.value, [0, 1], [0, -40]) }, 
      { scale: interpolate(blob2Anim.value, [0, 1], [1, 1.3]) },
    ],
    opacity: interpolate(blob2Anim.value, [0, 1], [BLOB_OPACITY * 0.8, BLOB_OPACITY]),
  }));

  const style3 = useAnimatedStyle(() => ({
    transform: [
      { scale: interpolate(blob3Anim.value, [0, 1], [0.8, 1.1]) }, 
      { translateY: interpolate(blob3Anim.value, [0, 1], [0, 20]) },
    ],
    opacity: interpolate(blob3Anim.value, [0, 1], [BLOB_OPACITY * 0.6, BLOB_OPACITY * 0.9]),
  }));

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
       {/* Stars Layer - Fixed in background but twinkling */}
       {stars.map((star) => (
        <Star key={star.id} {...star} />
      ))}
      
      {/* Shooting Star - Occasional */}
      <ShootingStar />

      {/* Blob 1: Blue/Primary (Top Left) */}
      <Animated.View style={[styles.blobBase, styles.blob1, style1]} />
      
      {/* Blob 2: Lavender/Secondary (Bottom Right) */}
      <Animated.View style={[styles.blobBase, styles.blob2, style2]} />
      
      {/* Blob 3: Subtle Warmth/Accent (Center/Top) */}
      <Animated.View style={[styles.blobBase, styles.blob3, style3]} />
      
      <View style={styles.vignette} />
    </View>
  );
});

const styles = StyleSheet.create({
  blobBase: {
    position: 'absolute',
    borderRadius: 999, // Max rounded
  },
  blob1: {
    width: SCREEN_W * 1.2,
    height: SCREEN_W * 1.2,
    backgroundColor: '#5B9BD5', // Blue
    top: -SCREEN_W * 0.4,
    left: -SCREEN_W * 0.3,
  },
  blob2: {
    width: SCREEN_W * 1.1,
    height: SCREEN_W * 1.1,
    backgroundColor: '#9B8EC4', // Lavender
    bottom: -SCREEN_W * 0.3,
    right: -SCREEN_W * 0.2,
  },
  blob3: {
    width: SCREEN_W * 0.8,
    height: SCREEN_W * 0.8,
    backgroundColor: '#A8E6CF', // Mint (or F7C97E for gold if preferred, stick to cool tones per request)
    top: SCREEN_H * 0.3,
    left: SCREEN_W * 0.1,
  },
  vignette: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    // In a real implementation we might use a radial gradient SVG here for vignette
    // For now, pure transparency to let specific blobs shine.
  }
});
