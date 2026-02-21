import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Modal } from 'react-native';
import Animated, { FadeInUp, FadeIn } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Gradients, MoodConfig, DAILY_AFFIRMATIONS } from '../../constants/theme';
import {
  GlassCard, MoodButton, JewelButton,
  Mascot, SectionHeader, FeatureButton, FloatingParticles, AmbientButton, WeeklyProgressRing,
} from '../../components/ui';
import { ScreenWrapper } from '../../components/ScreenWrapper';
import { useTheme } from '../../hooks/useTheme';
import { useStore, MoodType } from '../../store/useStore';
import { EMOTIONAL_ROUTES } from '../../constants/clinicalContent';

export default function HomeScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const userName = useStore((s) => s.userName);
  const currentMood = useStore((s) => s.currentMood);
  const setMood = useStore((s) => s.setMood);
  const saveMoodEntry = useStore((s) => s.saveMoodEntry);
  const recentActivities = useStore((s) => s.recentActivities);
  const weeklyMoodData = useStore((s) => s.weeklyMoodData);
  const currentPlan = useStore((s) => s.currentPlan);
  const activeRoute = EMOTIONAL_ROUTES.find(r => r.id === currentPlan);
  const [showNotifications, setShowNotifications] = useState(false);

  const notificationsMock = [
    { id: '1', title: '¡Bienvenido a Anima!', desc: 'Nos alegra tenerte aquí. Recuerda revisar tu plan diario.', time: 'Hace 2h' },
    { id: '2', title: 'Tiempo de Pausa', desc: 'Tomarse 5 minutos para respirar ayuda mucho.', time: 'Hace 5h' },
  ];

  // RF-17: Dynamic greeting based on time of day
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  }, []);

  // RF-16: Daily affirmation (Now route-specific)
  const affirmation = useMemo(() => {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    const quoteArray = activeRoute?.dailyQuotes || DAILY_AFFIRMATIONS;
    return quoteArray[dayOfYear % quoteArray.length];
  }, [activeRoute]);

  const moods: MoodType[] = ['animado', 'mejor', 'neutral', 'triste', 'muy_triste'];

  return (
    <ScreenWrapper style={styles.container}>
      <FloatingParticles count={6} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with greeting (RF-17) */}
        <Animated.View entering={FadeInUp.duration(400)} style={styles.header}>
          <View style={{ flex: 1, paddingRight: 16 }}>
            <Text style={[styles.greeting, { color: colors.textPrimary }]} numberOfLines={1} adjustsFontSizeToFit>
              {greeting}, {userName || 'amigo/a'} 👋
            </Text>
            <Text style={[styles.subtitle, { color: colors.textLight }]}>¿En qué quieres trabajar hoy?</Text>
          </View>
          <View style={{ alignItems: 'center', gap: 4 }}>
            <Pressable 
              style={[styles.notifBtn, { backgroundColor: colors.bgCard, borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' }]}
              onPress={() => setShowNotifications(true)}
            >
              <View style={styles.notifDot} />
              <Ionicons name="notifications-outline" size={22} color={colors.textPrimary} />
            </Pressable>
            <AmbientButton />
          </View>
        </Animated.View>

        {/* Mascot (RF-19) */}
        <Animated.View entering={FadeIn.duration(600).delay(200)} style={styles.mascotSection}>
          <Mascot size={130} variant="greeting" />
        </Animated.View>

        {/* Feature buttons (quick access) */}
        <Animated.View entering={FadeInUp.duration(400).delay(300)} style={styles.featureRow}>
          <FeatureButton title="Gratitud" icon="star-outline" color="#FCD34D" onPress={() => router.push('/actividades/gratitud')} />
          <FeatureButton title="Actividades" icon="sparkles-outline" color={Colors.secondary} onPress={() => router.push('/(tabs)/actividades')} />
          <FeatureButton title="Chat" icon="chatbubbles-outline" color={Colors.mint} onPress={() => router.push('/(tabs)/chat')} />
        </Animated.View>

        {/* Daily Affirmation (RF-16) & Active Route */}
        <Animated.View entering={FadeInUp.duration(400).delay(400)}>
          <SectionHeader 
            title={activeRoute ? `Tu ruta: ${activeRoute.title}` : "Frase del día"} 
            subtitle="Tu inspiración diaria ✨" 
          />
          <GlassCard style={styles.affirmationCard}>
            <View style={styles.affirmationIconWrap}>
              <Ionicons name="sparkles" size={16} color={colors.accent} />
            </View>
            <Text style={[styles.affirmationText, { color: colors.textSecondary }]}>{affirmation}</Text>
          </GlassCard>
        </Animated.View>

        {/* Mood Selector Card (RF-11, RF-20) */}
        <Animated.View entering={FadeInUp.duration(400).delay(500)}>
          <SectionHeader title="¿Cómo te sientes?" subtitle="Selecciona tu estado de ánimo" />
          <GlassCard style={styles.moodCard}>
            <View style={styles.moodRow}>
              {moods.map((m) => (
                <MoodButton key={m} mood={m} selected={currentMood === m} onPress={() => setMood(m)} />
              ))}
            </View>
            <JewelButton
              title="Registrar estado de ánimo"
              onPress={saveMoodEntry}
              disabled={!currentMood}
              style={{ marginTop: 16 }}
            />
          </GlassCard>
        </Animated.View>

        {/* Recent Activities */}
        <Animated.View entering={FadeInUp.duration(400).delay(600)}>
          <SectionHeader title="Actividades recientes" />
          {recentActivities.length > 0 ? (
            recentActivities.slice(0, 3).map((act, i) => (
              <GlassCard key={i} style={styles.recentCard}>
                <View style={[styles.recentIcon, { backgroundColor: (act.color || colors.primary) + '15' }]}>
                  <Ionicons name={(act.icon || 'time-outline') as any} size={20} color={act.color || colors.primary} />
                </View>
                <View style={{ flex: 1, gap: 2 }}>
                  <Text style={[styles.recentTitle, { color: colors.textPrimary }]}>{act.title}</Text>
                  <Text style={[styles.recentTime, { color: colors.textLight }]}>{act.time}</Text>
                </View>
                <Text style={styles.recentDetail}>{act.detail}</Text>
              </GlassCard>
            ))
          ) : (
            <GlassCard style={{ alignItems: 'center', paddingVertical: 20, gap: 6 }}>
              <Ionicons name="time-outline" size={28} color={colors.textLight} />
              <Text style={{ color: colors.textLight, fontSize: 13 }}>Sin actividades recientes</Text>
            </GlassCard>
          )}
        </Animated.View>

        {/* Weekly Wellness Ring (RF-18) */}
        <Animated.View entering={FadeInUp.duration(400).delay(600)}>
          <SectionHeader title="Bienestar Semanal" />
          <GlassCard style={{ alignItems: 'center', paddingVertical: 20 }}>
             <WeeklyProgressRing data={weeklyMoodData} />
             <Text style={{ textAlign: 'center', marginTop: 12, color: colors.textLight, fontSize: 13, maxWidth: 200 }}>
               Tu balance emocional de los últimos 7 días.
             </Text>
          </GlassCard>
        </Animated.View>
        
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Notifications Modal */}
      <Modal visible={showNotifications} transparent animationType="fade" onRequestClose={() => setShowNotifications(false)}>
        <View style={styles.modalOverlay}>
          <Animated.View entering={FadeInUp.duration(300)} style={[styles.modalContent, { backgroundColor: colors.bgCard }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Notificaciones</Text>
              <Pressable onPress={() => setShowNotifications(false)} style={styles.closeBtn}>
                <Ionicons name="close" size={24} color={colors.textLight} />
              </Pressable>
            </View>

            <ScrollView style={styles.notifList} showsVerticalScrollIndicator={false}>
              {notificationsMock.map((notif, index) => (
                <View key={notif.id} style={[styles.notifItem, index < notificationsMock.length - 1 && { borderBottomWidth: 1, borderBottomColor: 'rgba(150,150,150,0.1)' }]}>
                  <View style={[styles.notifIconWrap, { backgroundColor: Colors.mint + '20' }]}>
                    <Ionicons name="notifications" size={20} color={Colors.mint} />
                  </View>
                  <View style={styles.notifTextWrap}>
                    <Text style={[styles.notifItemTitle, { color: colors.textPrimary }]}>{notif.title}</Text>
                    <Text style={[styles.notifItemDesc, { color: colors.textSecondary }]}>{notif.desc}</Text>
                    <Text style={[styles.notifItemTime, { color: colors.textLight }]}>{notif.time}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </Animated.View>
        </View>
      </Modal>

    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 60 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 16,
  },
  greeting: {
    fontSize: 24, fontWeight: '700', color: Colors.textPrimary,
    fontFamily: 'Poppins_700Bold',
  },
  subtitle: {
    fontSize: 14, color: Colors.textLight, marginTop: 2,
    fontFamily: 'Poppins_400Regular',
  },
  notifBtn: {
    width: 42, height: 42, borderRadius: 21,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1,
    shadowColor: '#5B9BD5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  notifDot: {
    position: 'absolute', top: 10, right: 11,
    width: 6, height: 6, borderRadius: 3,
    backgroundColor: Colors.accent,
    zIndex: 1,
  },
  mascotSection: {
    alignItems: 'center', marginVertical: 16,
  },
  featureRow: {
    flexDirection: 'row', justifyContent: 'space-around',
    marginBottom: 24,
  },
  affirmationCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    marginBottom: 24,
    borderLeftWidth: 3,
    borderLeftColor: Colors.accent,
  },
  affirmationIconWrap: {
    width: 32, height: 32, borderRadius: 10,
    backgroundColor: Colors.accent + '15',
    justifyContent: 'center', alignItems: 'center',
  },
  affirmationText: {
    flex: 1, fontSize: 13, color: Colors.textSecondary,
    fontFamily: 'Poppins_400Regular', fontStyle: 'italic',
    lineHeight: 20,
  },
  moodCard: { marginBottom: 24 },
  moodRow: {
    flexDirection: 'row', justifyContent: 'space-around',
  },
  recentCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8,
  },
  recentIcon: {
    width: 40, height: 40, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center',
  },
  recentTitle: {
    fontSize: 14, fontWeight: '600', color: Colors.textPrimary,
    fontFamily: 'Poppins_600SemiBold',
  },
  recentTime: { fontSize: 11, color: Colors.textLight },
  recentDetail: { fontSize: 12, color: Colors.mint, fontWeight: '500' },
  
  // Modal Styles
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center', alignItems: 'center', padding: 20,
  },
  modalContent: {
    width: '100%', maxHeight: '80%', borderRadius: 24, padding: 24, paddingBottom: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20, fontWeight: '700', fontFamily: 'Poppins_700Bold',
  },
  closeBtn: {
    padding: 4,
  },
  notifList: {
    maxHeight: 400,
  },
  notifItem: {
    flexDirection: 'row', gap: 16, paddingVertical: 16,
  },
  notifIconWrap: {
    width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center',
  },
  notifTextWrap: {
    flex: 1,
  },
  notifItemTitle: {
    fontSize: 15, fontWeight: '600', fontFamily: 'Poppins_600SemiBold', marginBottom: 4,
  },
  notifItemDesc: {
    fontSize: 13, fontFamily: 'Poppins_400Regular', lineHeight: 20, marginBottom: 6,
  },
  notifItemTime: {
    fontSize: 11, fontFamily: 'Poppins_400Regular',
  },
});
