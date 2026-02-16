import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Gradients, MoodConfig } from '../../constants/theme';
import { GlassCard, SectionHeader, Mascot } from '../../components/ui';
import { ScreenWrapper } from '../../components/ScreenWrapper';
import { useStore, MoodType } from '../../store/useStore';

export default function PerfilScreen() {
  const router = useRouter();
  const userName = useStore((s) => s.userName);
  const userEmail = useStore((s) => s.userEmail);
  const moodHistory = useStore((s) => s.moodHistory);
  const logout = useStore((s) => s.logout);

  // Calculate most frequent mood
  const moodCounts: Record<string, number> = {};
  moodHistory.forEach((e) => {
    moodCounts[e.mood] = (moodCounts[e.mood] || 0) + 1;
  });
  const topMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0];
  const topMoodConfig = topMood ? MoodConfig[topMood[0] as MoodType] : null;

  const handleLogout = () => {
    Alert.alert('Cerrar Sesión', '¿Seguro que quieres salir?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Salir', style: 'destructive',
        onPress: () => {
          logout();
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  const settingsItems = [
    { icon: 'notifications-outline', label: 'Notificaciones', color: Colors.primary },
    { icon: 'shield-outline', label: 'Privacidad', color: Colors.secondary },
    { icon: 'color-palette-outline', label: 'Apariencia', color: Colors.accent },
    { icon: 'help-circle-outline', label: 'Ayuda', color: Colors.mint },
    { icon: 'information-circle-outline', label: 'Sobre Aníma', color: Colors.textLight },
  ];

  return (
    <ScreenWrapper style={styles.container}>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <Animated.View entering={FadeInUp.duration(400)} style={styles.profileHeader}>
          <LinearGradient colors={[...Gradients.jewel]} style={styles.avatarCircle}>
            <Text style={styles.avatarLetter}>
              {(userName || 'U').charAt(0).toUpperCase()}
            </Text>
          </LinearGradient>
          <Text style={styles.userName}>{userName || 'Usuario'}</Text>
          <Text style={styles.userEmail}>{userEmail || 'email@example.com'}</Text>
        </Animated.View>

        {/* Stats */}
        <Animated.View entering={FadeInUp.duration(400).delay(100)} style={styles.statsRow}>
          <GlassCard style={styles.statCard}>
            <Text style={styles.statNumber}>{moodHistory.length}</Text>
            <Text style={styles.statLabel}>Registros</Text>
          </GlassCard>
          <GlassCard style={styles.statCard}>
            <Text style={styles.statNumber}>{topMoodConfig?.emoji || '—'}</Text>
            <Text style={styles.statLabel}>Ánimo frecuente</Text>
          </GlassCard>
          <GlassCard style={styles.statCard}>
            <Text style={styles.statNumber}>{Math.min(moodHistory.length, 7)}</Text>
            <Text style={styles.statLabel}>Racha días</Text>
          </GlassCard>
        </Animated.View>

        {/* Settings */}
        <Animated.View entering={FadeInUp.duration(400).delay(200)}>
          <SectionHeader title="Configuración" />
          <GlassCard style={styles.settingsCard}>
            {settingsItems.map((item, i) => (
              <Pressable key={i} style={[styles.settingsItem, i < settingsItems.length - 1 && styles.settingsBorder]}>
                <View style={[styles.settingsIconWrap, { backgroundColor: item.color + '12' }]}>
                  <Ionicons name={item.icon as any} size={20} color={item.color} />
                </View>
                <Text style={styles.settingsLabel}>{item.label}</Text>
                <Ionicons name="chevron-forward" size={18} color={Colors.textLight} />
              </Pressable>
            ))}
          </GlassCard>
        </Animated.View>

        {/* Logout */}
        <Animated.View entering={FadeInUp.duration(400).delay(300)}>
          <Pressable onPress={handleLogout} style={styles.logoutBtn}>
            <Ionicons name="log-out-outline" size={20} color="#E53E3E" />
            <Text style={styles.logoutText}>Cerrar Sesión</Text>
          </Pressable>
        </Animated.View>

        {/* Mascot */}
        <View style={styles.mascotSection}>
          <Mascot size={70} variant="happy" />
          <Text style={styles.versionText}>Aníma v1.0.0</Text>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 60 },
  profileHeader: {
    alignItems: 'center', marginBottom: 24,
  },
  avatarCircle: {
    width: 80, height: 80, borderRadius: 40,
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 12,
  },
  avatarLetter: {
    fontSize: 32, fontWeight: '700', color: '#FFF',
    fontFamily: 'Poppins_700Bold',
  },
  userName: {
    fontSize: 22, fontWeight: '700', color: Colors.textPrimary,
    fontFamily: 'Poppins_700Bold',
  },
  userEmail: {
    fontSize: 13, color: Colors.textLight, marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row', gap: 10, marginBottom: 24,
  },
  statCard: {
    flex: 1, alignItems: 'center', gap: 4, paddingVertical: 14,
  },
  statNumber: {
    fontSize: 22, fontWeight: '700', color: Colors.textPrimary,
    fontFamily: 'Poppins_700Bold',
  },
  statLabel: {
    fontSize: 11, color: Colors.textLight, fontFamily: 'Poppins_500Medium',
    textAlign: 'center',
  },
  settingsCard: { padding: 0, overflow: 'hidden', marginBottom: 24 },
  settingsItem: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingVertical: 14, paddingHorizontal: 16,
  },
  settingsBorder: {
    borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.04)',
  },
  settingsIconWrap: {
    width: 36, height: 36, borderRadius: 10,
    justifyContent: 'center', alignItems: 'center',
  },
  settingsLabel: {
    flex: 1, fontSize: 14, color: Colors.textPrimary,
    fontFamily: 'Poppins_500Medium',
  },
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, paddingVertical: 14,
    backgroundColor: 'rgba(229,62,62,0.06)',
    borderRadius: 16, borderWidth: 1, borderColor: 'rgba(229,62,62,0.12)',
  },
  logoutText: {
    fontSize: 15, fontWeight: '600', color: '#E53E3E',
    fontFamily: 'Poppins_600SemiBold',
  },
  mascotSection: {
    alignItems: 'center', marginTop: 24, gap: 8,
  },
  versionText: {
    fontSize: 12, color: Colors.textLight,
  },
});
