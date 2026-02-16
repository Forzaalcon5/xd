import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, KeyboardAvoidingView,
  Platform, Pressable, ScrollView, ActivityIndicator,
} from 'react-native';
import Animated, { FadeInUp, FadeIn, FadeOut, ZoomIn } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Gradients, Shadows } from '../../constants/theme';
import { JewelButton, Mascot, AuroraBackground, FloatingParticles } from '../../components/ui';
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
      <FloatingParticles count={4} />

      {/* Loading Overlay */}
      {loading && (
        <Animated.View
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(200)}
          style={styles.loadingOverlay}
        >
          <Animated.View entering={ZoomIn.duration(300)} style={styles.loadingCard}>
            <Mascot size={80} variant="happy" />
            <ActivityIndicator size="small" color={Colors.primary} style={{ marginTop: 12 }} />
            <Text style={styles.loadingText}>Entrando...</Text>
          </Animated.View>
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
          <Animated.View entering={FadeIn.duration(600)} style={styles.mascotSection}>
            <Mascot size={140} variant="greeting" />
          </Animated.View>

          {/* Title */}
          <Animated.View entering={FadeInUp.duration(400).delay(200)} style={styles.titleSection}>
            <Text style={styles.title}>Bienvenido a Aníma</Text>
            <Text style={styles.subtitle}>Tu compañero emocional</Text>
          </Animated.View>

          {/* Form Card */}
          <Animated.View entering={FadeInUp.duration(400).delay(400)} style={styles.formCard}>
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

            <JewelButton
              title="Iniciar Sesión"
              onPress={handleLogin}
              disabled={loading || !email.trim() || !password.trim()}
              icon="log-in-outline"
            />
          </Animated.View>

          {/* Register link */}
          <Animated.View entering={FadeInUp.duration(400).delay(600)} style={styles.registerSection}>
            <Text style={styles.registerText}>¿No tienes cuenta? </Text>
            <Pressable onPress={() => router.push('/(auth)/register')}>
              <Text style={styles.registerLink}>Crear Cuenta</Text>
            </Pressable>
          </Animated.View>
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
    backgroundColor: 'rgba(232,244,253,0.85)',
    justifyContent: 'center', alignItems: 'center',
    zIndex: 100,
  },
  loadingCard: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 28, padding: 32,
    alignItems: 'center',
    shadowColor: '#5B9BD5',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 8,
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
    fontSize: 26, fontWeight: '700', color: Colors.textPrimary,
    fontFamily: 'Poppins_700Bold',
  },
  subtitle: {
    fontSize: 14, color: Colors.textLight, marginTop: 4,
    fontFamily: 'Poppins_400Regular',
  },
  formCard: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 28, padding: 28,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.7)',
    gap: 16,
    shadowColor: '#5B9BD5',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 6,
  },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(91,155,213,0.04)',
    borderRadius: 16, paddingHorizontal: 16,
    borderWidth: 1.5, borderColor: 'rgba(91,155,213,0.08)',
  },
  inputIcon: { marginRight: 12 },
  input: {
    flex: 1, height: 50, fontSize: 14, color: Colors.textPrimary,
    fontFamily: 'Poppins_400Regular',
  },
  eyeBtn: { padding: 4 },
  forgotLink: { alignSelf: 'flex-end' },
  forgotText: {
    fontSize: 13, color: Colors.primary, fontFamily: 'Poppins_500Medium',
  },
  registerSection: {
    flexDirection: 'row', justifyContent: 'center',
    marginTop: 24,
  },
  registerText: { fontSize: 14, color: Colors.textSecondary },
  registerLink: {
    fontSize: 14, color: Colors.primary, fontWeight: '600',
    fontFamily: 'Poppins_600SemiBold',
  },
});
