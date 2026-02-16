import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TextInput, KeyboardAvoidingView,
  Platform, Pressable, ScrollView, ActivityIndicator, Dimensions,
} from 'react-native';
import Animated, {
  FadeInUp, FadeIn, FadeOut, ZoomIn, FadeInDown,
  useSharedValue, useAnimatedStyle, withRepeat, withTiming,
  withSequence, Easing, interpolate,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Gradients } from '../../constants/theme';
import { JewelButton, Mascot, FloatingParticles } from '../../components/ui';
import { useStore } from '../../store/useStore';

const { width: SCREEN_W } = Dimensions.get('window');

// Animated decorative orb
function FloatingOrb({ delay, color, size, top, left }: {
  delay: number; color: string; size: number; top: number; left: number;
}) {
  const anim = useSharedValue(0);
  useEffect(() => {
    anim.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 3000 + delay, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 3000 + delay, easing: Easing.inOut(Easing.ease) }),
      ), -1, true
    );
  }, []);

  const orbStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(anim.value, [0, 1], [0, -15]) },
      { scale: interpolate(anim.value, [0, 1], [1, 1.15]) },
    ],
    opacity: interpolate(anim.value, [0, 0.5, 1], [0.3, 0.5, 0.3]),
  }));

  return (
    <Animated.View style={[{
      position: 'absolute', top, left,
      width: size, height: size, borderRadius: size / 2,
      backgroundColor: color,
    }, orbStyle]} />
  );
}

export default function RegisterScreen() {
  const router = useRouter();
  const login = useStore((s) => s.login);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleRegister = () => {
    if (!name.trim() || !email.trim() || !password.trim()) return;
    setLoading(true);
    setTimeout(() => {
      login(email.trim(), name.trim());
      setLoading(false);
      router.replace('/(tabs)');
    }, 1800);
  };

  const isFormValid = name.trim().length > 0 && email.trim().length > 0 && password.trim().length >= 1;

  // Password strength indicator
  const getPasswordStrength = () => {
    if (password.length === 0) return { level: 0, label: '', color: '' };
    if (password.length < 4) return { level: 1, label: 'Débil', color: '#E53E3E' };
    if (password.length < 6) return { level: 2, label: 'Media', color: Colors.accent };
    return { level: 3, label: 'Fuerte', color: Colors.mint };
  };
  const pwStrength = getPasswordStrength();

  return (
    <View style={styles.container}>
      {/* Premium gradient background */}
      <LinearGradient
        colors={['#E8F0FE', '#F3E8FF', '#FFF0F3', '#E8F4FD']}
        locations={[0, 0.3, 0.6, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Decorative floating orbs */}
      <FloatingOrb delay={0} color="rgba(91,155,213,0.12)" size={120} top={60} left={-30} />
      <FloatingOrb delay={500} color="rgba(155,142,196,0.10)" size={100} top={140} left={SCREEN_W - 60} />
      <FloatingOrb delay={1000} color="rgba(168,230,207,0.12)" size={80} top={SCREEN_W * 0.8} left={20} />
      <FloatingOrb delay={800} color="rgba(247,201,126,0.10)" size={60} top={SCREEN_W * 0.5} left={SCREEN_W - 40} />

      <FloatingParticles count={5} />

      {/* Loading Overlay */}
      {loading && (
        <Animated.View
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(200)}
          style={styles.loadingOverlay}
        >
          <Animated.View entering={ZoomIn.springify().damping(12)} style={styles.loadingCard}>
            <Mascot size={90} variant="happy" />
            <View style={styles.loadingDots}>
              <ActivityIndicator size="small" color={Colors.primary} />
            </View>
            <Text style={styles.loadingTitle}>¡Bienvenido/a, {name}!</Text>
            <Text style={styles.loadingSubtext}>Preparando tu espacio seguro...</Text>
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
          {/* Back button */}
          <Animated.View entering={FadeIn.duration(300)} style={styles.backRow}>
            <Pressable onPress={() => router.back()} style={styles.backBtn}>
              <Ionicons name="arrow-back" size={20} color={Colors.textPrimary} />
            </Pressable>
          </Animated.View>

          {/* Mascot */}
          <Animated.View entering={FadeIn.duration(700)} style={styles.mascotSection}>
            <Mascot size={110} variant="happy" />
          </Animated.View>

          {/* Title */}
          <Animated.View entering={FadeInUp.duration(400).delay(200)} style={styles.titleSection}>
            <Text style={styles.title}>Crea tu cuenta</Text>
            <Text style={styles.subtitle}>
              Tu espacio seguro para crecer emocionalmente 💙
            </Text>
          </Animated.View>

          {/* Benefits strip */}
          <Animated.View entering={FadeInUp.duration(400).delay(300)} style={styles.benefitsStrip}>
            {[
              { icon: 'shield-checkmark', label: 'Seguro', color: Colors.primary },
              { icon: 'heart-circle', label: 'Privado', color: '#E56B8A' },
              { icon: 'flash', label: 'Gratis', color: Colors.accent },
            ].map((b, i) => (
              <View key={i} style={styles.benefitItem}>
                <Ionicons name={b.icon as any} size={18} color={b.color} />
                <Text style={[styles.benefitText, { color: b.color }]}>{b.label}</Text>
              </View>
            ))}
          </Animated.View>

          {/* Form Card */}
          <Animated.View entering={FadeInUp.duration(500).delay(400)} style={styles.formCard}>
            {/* Decorative top gradient line */}
            <LinearGradient
              colors={[Colors.primary, Colors.secondary, Colors.mint]}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={styles.formTopLine}
            />

            {/* Name Input */}
            <View style={[
              styles.inputWrap,
              focusedField === 'name' && styles.inputFocused,
            ]}>
              <View style={[styles.inputIconWrap, { backgroundColor: Colors.primary + '12' }]}>
                <Ionicons name="person-outline" size={18} color={Colors.primary} />
              </View>
              <TextInput
                style={styles.input}
                placeholder="¿Cómo te llamas?"
                placeholderTextColor={Colors.textLight}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                onFocus={() => setFocusedField('name')}
                onBlur={() => setFocusedField(null)}
              />
              {name.length > 0 && (
                <Ionicons name="checkmark-circle" size={20} color={Colors.mint} />
              )}
            </View>

            {/* Email Input */}
            <View style={[
              styles.inputWrap,
              focusedField === 'email' && styles.inputFocused,
            ]}>
              <View style={[styles.inputIconWrap, { backgroundColor: Colors.secondary + '12' }]}>
                <Ionicons name="mail-outline" size={18} color={Colors.secondary} />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Correo electrónico"
                placeholderTextColor={Colors.textLight}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
              />
              {email.includes('@') && email.includes('.') && (
                <Ionicons name="checkmark-circle" size={20} color={Colors.mint} />
              )}
            </View>

            {/* Password Input */}
            <View>
              <View style={[
                styles.inputWrap,
                focusedField === 'password' && styles.inputFocused,
              ]}>
                <View style={[styles.inputIconWrap, { backgroundColor: Colors.mint + '18' }]}>
                  <Ionicons name="lock-closed-outline" size={18} color={Colors.mint} />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Contraseña"
                  placeholderTextColor={Colors.textLight}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                />
                <Pressable onPress={() => setShowPassword(!showPassword)} style={{ padding: 4 }}>
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={Colors.textLight}
                  />
                </Pressable>
              </View>

              {/* Password Strength Bar */}
              {password.length > 0 && (
                <Animated.View entering={FadeIn.duration(200)} style={styles.strengthRow}>
                  <View style={styles.strengthTrack}>
                    {[1, 2, 3].map((level) => (
                      <View
                        key={level}
                        style={[
                          styles.strengthSegment,
                          { backgroundColor: pwStrength.level >= level ? pwStrength.color : 'rgba(0,0,0,0.06)' },
                        ]}
                      />
                    ))}
                  </View>
                  <Text style={[styles.strengthLabel, { color: pwStrength.color }]}>
                    {pwStrength.label}
                  </Text>
                </Animated.View>
              )}
            </View>

            {/* Register button */}
            <JewelButton
              title="Crear mi cuenta"
              onPress={handleRegister}
              disabled={loading || !isFormValid}
              icon="sparkles-outline"
              style={{ marginTop: 4 }}
            />
          </Animated.View>

          {/* Privacy note */}
          <Animated.View entering={FadeInUp.duration(400).delay(500)} style={styles.privacyWrap}>
            <Ionicons name="shield-checkmark-outline" size={14} color={Colors.textLight} />
            <Text style={styles.privacyText}>
              Tus datos están seguros. No compartimos tu información.
            </Text>
          </Animated.View>

          {/* Login link */}
          <Animated.View entering={FadeInUp.duration(400).delay(600)} style={styles.loginSection}>
            <Text style={styles.loginText}>¿Ya tienes cuenta? </Text>
            <Pressable onPress={() => router.back()}>
              <Text style={styles.loginLink}>Iniciar Sesión</Text>
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
    flexGrow: 1,
    paddingHorizontal: 24, paddingTop: 50, paddingBottom: 32,
  },
  // Back
  backRow: { marginBottom: 4 },
  backBtn: {
    width: 38, height: 38, borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.85)',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(0,0,0,0.04)',
  },
  // Loading
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(232,240,254,0.9)',
    justifyContent: 'center', alignItems: 'center',
    zIndex: 100,
  },
  loadingCard: {
    backgroundColor: '#FFF',
    borderRadius: 32, paddingVertical: 36, paddingHorizontal: 40,
    alignItems: 'center',
    shadowColor: '#5B9BD5',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 32,
    elevation: 10,
  },
  loadingDots: { marginTop: 16 },
  loadingTitle: {
    marginTop: 14, fontSize: 18, fontWeight: '700', color: Colors.textPrimary,
    fontFamily: 'Poppins_700Bold',
  },
  loadingSubtext: {
    marginTop: 4, fontSize: 13, color: Colors.textLight,
    fontFamily: 'Poppins_400Regular',
  },
  // Mascot
  mascotSection: { alignItems: 'center', marginBottom: 12 },
  // Title
  titleSection: { alignItems: 'center', marginBottom: 16 },
  title: {
    fontSize: 28, fontWeight: '700', color: Colors.textPrimary,
    fontFamily: 'Poppins_700Bold', letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14, color: Colors.textSecondary, marginTop: 6,
    fontFamily: 'Poppins_400Regular', textAlign: 'center', lineHeight: 22,
  },
  // Benefits strip
  benefitsStrip: {
    flexDirection: 'row', justifyContent: 'center', gap: 20,
    marginBottom: 24,
  },
  benefitItem: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(255,255,255,0.8)',
    paddingVertical: 6, paddingHorizontal: 12,
    borderRadius: 20,
  },
  benefitText: {
    fontSize: 12, fontWeight: '600', fontFamily: 'Poppins_600SemiBold',
  },
  // Form
  formCard: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 28, padding: 24,
    gap: 14, overflow: 'hidden',
    shadowColor: '#5B9BD5',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 28,
    elevation: 8,
  },
  formTopLine: {
    position: 'absolute', top: 0, left: 0, right: 0,
    height: 3, borderTopLeftRadius: 28, borderTopRightRadius: 28,
  },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: 'rgba(0,0,0,0.02)',
    borderRadius: 16, paddingHorizontal: 12, paddingVertical: 2,
    borderWidth: 1.5, borderColor: 'rgba(0,0,0,0.04)',
  },
  inputFocused: {
    borderColor: Colors.primary + '40',
    backgroundColor: Colors.primary + '04',
  },
  inputIconWrap: {
    width: 34, height: 34, borderRadius: 10,
    justifyContent: 'center', alignItems: 'center',
  },
  input: {
    flex: 1, height: 50, fontSize: 14, color: Colors.textPrimary,
    fontFamily: 'Poppins_400Regular',
  },
  // Password strength
  strengthRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    marginTop: 8, paddingHorizontal: 4,
  },
  strengthTrack: {
    flexDirection: 'row', gap: 4, flex: 1,
  },
  strengthSegment: {
    flex: 1, height: 3, borderRadius: 2,
  },
  strengthLabel: {
    fontSize: 11, fontWeight: '600', fontFamily: 'Poppins_600SemiBold',
  },
  // Privacy
  privacyWrap: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, marginTop: 20,
  },
  privacyText: {
    fontSize: 11, color: Colors.textLight, fontFamily: 'Poppins_400Regular',
  },
  // Login link
  loginSection: {
    flexDirection: 'row', justifyContent: 'center',
    marginTop: 16,
  },
  loginText: { fontSize: 14, color: Colors.textSecondary },
  loginLink: {
    fontSize: 14, color: Colors.primary, fontWeight: '600',
    fontFamily: 'Poppins_600SemiBold',
  },
});
