import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import Animated, { 
  useSharedValue, useAnimatedStyle, withRepeat, withTiming, 
  withSequence, Easing, FadeIn 
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Gradients } from '../../constants/theme';
import { ScreenWrapper } from '../../components/ScreenWrapper';
import { JewelButton } from '../../components/ui';

const { width } = Dimensions.get('window');

export default function MeditacionScreen() {
  const router = useRouter();
  
  // Animation values
  const orbScale = useSharedValue(1);
  const orbOpacity = useSharedValue(0.8);
  const ringScale = useSharedValue(1);
  const ringOpacity = useSharedValue(0.5);

  useEffect(() => {
    // Start the loop immediately
    startMeditationLoop();
    
    // Play an intro haptic
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    return () => {
      // Cleanup handled by reanimated ideally
    };
  }, []);

  const [instruction, setInstruction] = React.useState('Enfoca tu atención...');
  
  useEffect(() => {
    startMeditationLoop();
    
    // Mindfulness prompts (Non-rhythmic)
    const prompts = [
      "Solo observa la luz...",
      "Si tu mente se va...",
      "Regresa suavemente aquí.",
      "Sin juzgar tus pensamientos.",
      "Solo respira natural.",
      "Estás aquí y ahora."
    ];
    
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % prompts.length;
      setInstruction(prompts[index]);
      // Very subtle anchor haptic
      Haptics.selectionAsync();
    }, 6000); // Slower 6s changes

    return () => clearInterval(interval);
  }, []);

  const startMeditationLoop = () => {
    // Slower, hypnotic visual (6s cycle)
    const duration = 6000;
    
    orbScale.value = withRepeat(
      withSequence(
        withTiming(1.3, { duration, easing: Easing.inOut(Easing.quad) }),
        withTiming(1, { duration, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );

    orbOpacity.value = withRepeat(
      withSequence(
        withTiming(0.9, { duration }),
        withTiming(0.5, { duration })
      ),
      -1,
      true
    );

    // Ring expands very slowly
    ringScale.value = withRepeat(
      withTiming(1.8, { duration: duration * 1.5, easing: Easing.out(Easing.quad) }),
      -1,
      false
    );
     
    // Ring fades out
    ringOpacity.value = withRepeat(
      withSequence(
        withTiming(0.4, { duration: duration * 0.75 }),
        withTiming(0, { duration: duration * 0.75 })
      ),
      -1,
      false
    );
  };

  const orbStyle = useAnimatedStyle(() => ({
    transform: [{ scale: orbScale.value }],
    opacity: orbOpacity.value,
  }));

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ringScale.value }],
    opacity: ringOpacity.value,
  }));

  return (
    <ScreenWrapper style={styles.container}>
      {/* Dark Dream Background Overlay */}
      <LinearGradient 
        colors={[...Gradients.dreamNight]} 
        style={StyleSheet.absoluteFill} 
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
      />

      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.closeBtn}>
          <Ionicons name="close" size={24} color={Colors.dreamText} />
        </Pressable>
        {/* Empty view for balance */}
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <Animated.View entering={FadeIn.duration(1000)} style={styles.textContainer}>
          <Text key={instruction} style={styles.instruction}>
            {instruction}
          </Text>
          <Text style={styles.subInstruction}>
            Sigue el brillo suavemente
          </Text>
        </Animated.View>

        <View style={styles.orbContainer}>
          {/* Ripple Ring */}
          <Animated.View style={[styles.ring, ringStyle]} />
          
          {/* Shadow Layer */}
          <Animated.View style={[styles.orbShadow, orbStyle]} />

          {/* Gradient Layer */}
          <Animated.View style={[styles.orbMain, orbStyle]}>
            <LinearGradient
              colors={[...Gradients.dreamOrb]}
              style={{ width: 120, height: 120, borderRadius: 60 }}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            />
          </Animated.View>
        </View>

        {/* Bottom space */}
        <View style={{ height: 100 }} />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 60, paddingBottom: 20,
    zIndex: 10,
  },
  closeBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center', // Softer glass
  },
  content: {
    flex: 1, justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 50,
  },
  textContainer: {
    alignItems: 'center', width: '80%',
    marginTop: 40,
    height: 100, 
  },
  instruction: {
    fontSize: 28, fontWeight: '300', color: Colors.dreamText, textAlign: 'center',
    fontFamily: 'Poppins_300Light', marginBottom: 12,
  },
  subInstruction: {
    fontSize: 15, color: Colors.dreamText, textAlign: 'center',
    fontFamily: 'Poppins_400Regular', opacity: 0.5,
  },
  orbContainer: {
    width: 300, height: 300, justifyContent: 'center', alignItems: 'center',
    marginBottom: 40, 
    position: 'relative',
  },
  orbShadow: {
    position: 'absolute',
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: '#C8B6FF',
    shadowColor: "#C8B6FF", shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5, shadowRadius: 60, 
    elevation: 20,
  },
  orbMain: {
    width: 120, height: 120, borderRadius: 60,
    overflow: 'hidden',
    backgroundColor: '#2C2847', // Match dark surface
  },
  ring: {
    position: 'absolute', width: 220, height: 220, borderRadius: 110,
    borderWidth: 1, borderColor: '#A78BFA', opacity: 0.3,
    top: 40, left: 40, 
  },
});
