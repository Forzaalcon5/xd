import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, KeyboardAvoidingView,
  Platform, Pressable, ScrollView, ActivityIndicator,
} from 'react-native';
import Animated, { FadeIn, FadeOut, ZoomIn } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Gradients } from '../../constants/theme';
import { Mascot, AuroraBackground } from '../../components/ui';
import { PremiumButton } from '../../components/ui/PremiumButton';
import { GlassCard } from '../../components/ui/GlassCard';
import { AnimatedEntrance } from '../../components/ui/AnimatedEntrance';
import { ParticlesBackground } from '../../components/ui/ParticlesBackground';
import { useStore } from '../../store/useStore';

export default function LoginScreen() {
  const router = useRouter();
  const login = useStore((s) => s.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) return;
    setLoading(true);
    setTimeout(() => {
      login(email.trim(), email.split('@')[0]);
      setLoading(false);
      router.replace('/(tabs)');
    }, 1500);
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={[...Gradients.loginBg]} style={StyleSheet.absoluteFill} />
      <AuroraBackground />
      <ParticlesBackground count={20} />

      {/* Loading Overlay */}
      {loading && (
        <Animated.View
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(200)}
          style={styles.loadingOverlay}
        >
          <GlassCard style={styles.loadingCard} intensity={80}>
            <View style={{ alignItems: 'center' }}>
              <Mascot size={80} variant="happy" />
              <ActivityIndicator size="small" color={Colors.primary} style={{ marginTop: 12 }} />
              <Text style={styles.loadingText}>Entrando...</Text>
            </View>
          </GlassCard>
        </Animated.View>
      )}

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Mascot */}
          <AnimatedEntrance delay={0} from="top">
            <View style={styles.mascotSection}>
              <Mascot size={140} variant="greeting" />
            </View>
          </AnimatedEntrance>

          {/* Title */}
          <AnimatedEntrance delay={100} from="top">
            <View style={styles.titleSection}>
              <Text style={styles.title}>Bienvenido a Aníma</Text>
              <Text style={styles.subtitle}>Tu compañero emocional</Text>
            </View>
          </AnimatedEntrance>

          {/* Form Card via GlassCard */}
          <AnimatedEntrance delay={200} from="bottom">
            <GlassCard style={styles.formContainer} intensity={40}>
              <View style={styles.formContent}>
                <View style={styles.inputWrap}>
                  <Ionicons name="mail-outline" size={20} color={Colors.textLight} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Correo electrónico"
                    placeholderTextColor={Colors.textLight}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>

                <View style={styles.inputWrap}>
                  <Ionicons name="lock-closed-outline" size={20} color={Colors.textLight} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Contraseña"
                    placeholderTextColor={Colors.textLight}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                  />
                  <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                    <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={Colors.textLight} />
                  </Pressable>
                </View>

                <Pressable style={styles.forgotLink}>
                  <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
                </Pressable>

                <PremiumButton
                  title="Iniciar Sesión"
                  onPress={handleLogin}
                  variant="primary"
                  icon={<Ionicons name="log-in-outline" size={24} color="#FFF" />}
                  style={{ marginTop: 8 }}
                />
              </View>
            </GlassCard>
          </AnimatedEntrance>

          {/* Register link */}
          <AnimatedEntrance delay={400}>
            <View style={styles.registerSection}>
              <Text style={styles.registerText}>¿No tienes cuenta? </Text>
              <Pressable onPress={() => router.push('/(auth)/register')}>
                <Text style={styles.registerLink}>Crear Cuenta</Text>
              </Pressable>
            </View>
          </AnimatedEntrance>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {
    flexGrow: 1, justifyContent: 'center',
    paddingHorizontal: 24, paddingVertical: 40,
  },
  // Loading Overlay
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(232,244,253,0.6)',
    justifyContent: 'center', alignItems: 'center',
    zIndex: 100,
  },
  loadingCard: {
    padding: 32,
    borderRadius: 28,
  },
  loadingText: {
    marginTop: 10, fontSize: 15, color: Colors.textSecondary,
    fontFamily: 'Poppins_600SemiBold',
  },
  mascotSection: {
    alignItems: 'center', marginBottom: 20,
  },
  titleSection: {
    alignItems: 'center', marginBottom: 32,
  },
  title: {
    fontSize: 28, fontWeight: '700', color: Colors.textPrimary,
    fontFamily: 'Poppins_700Bold',
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16, color: Colors.textLight, marginTop: 4,
    fontFamily: 'Poppins_400Regular',
  },
  formContainer: {
    borderRadius: 28,
  },
  formContent: {
    padding: 24,
    gap: 16,
  },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.8)', // Higher opacity for visibility without blur
    borderRadius: 16, paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: { marginRight: 12 },
  input: {
    flex: 1, height: '100%', fontSize: 15, color: Colors.textPrimary,
    fontFamily: 'Poppins_400Regular',
  },
  eyeBtn: { padding: 4 },
  forgotLink: { alignSelf: 'flex-end', marginBottom: 8 },
  forgotText: {
    fontSize: 13, color: Colors.primary, fontFamily: 'Poppins_500Medium',
  },
  registerSection: {
    flexDirection: 'row', justifyContent: 'center',
    marginTop: 32,
  },
  registerText: { fontSize: 14, color: Colors.textSecondary },
  registerLink: {
    fontSize: 14, color: Colors.primary, fontWeight: '600',
    fontFamily: 'Poppins_600SemiBold',
  },
});
