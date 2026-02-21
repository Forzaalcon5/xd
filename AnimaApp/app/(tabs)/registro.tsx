import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, Pressable, Modal, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import Animated, { FadeInUp, FadeIn } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Gradients, MoodConfig } from '../../constants/theme';
import { GlassCard, SectionHeader, Mascot, FloatingParticles, JewelButton } from '../../components/ui';
import { ScreenWrapper } from '../../components/ScreenWrapper';
import { useTheme } from '../../hooks/useTheme';
import { useStore, MoodType } from '../../store/useStore';

const { width: SCREEN_W } = Dimensions.get('window');

// Mini mood bar chart component
function MoodMiniChart({ history }: { history: any[] }) {
  const { colors } = useTheme();
  const last7 = history.slice(-7);
  const moodLevels: Record<string, number> = {
    'animado': 5, 'mejor': 4, 'neutral': 3, 'triste': 2, 'muy_triste': 1,
  };

  return (
    <View style={styles.chartContainer}>
      {last7.map((entry, i) => {
        const config = MoodConfig[entry.mood as MoodType];
        const level = moodLevels[entry.mood] || 3;
        const height = (level / 5) * 48;
        return (
          <View key={entry.id} style={styles.chartBarWrap}>
            <View style={[styles.chartBar, { height, backgroundColor: config?.color || '#B8C4D0' }]}>
              <View style={[styles.chartBarGlow, { backgroundColor: config?.color + '30' }]} />
            </View>
            <Text style={[styles.chartBarLabel, { color: colors.textLight }]}>
              {entry.date?.split('/')[0] || ''}
            </Text>
          </View>
        );
      })}

      {/* Fill remaining slots if less than 7 */}
      {Array.from({ length: Math.max(0, 7 - last7.length) }).map((_, i) => (
        <View key={`empty-${i}`} style={styles.chartBarWrap}>
          <View style={[styles.chartBar, { height: 8, backgroundColor: 'rgba(0,0,0,0.04)' }]} />
          <Text style={[styles.chartBarLabel, { color: colors.textLight }]}>—</Text>
        </View>
      ))}
    </View>
  );
}

// Streak calculator
function getStreak(history: any[]): number {
  if (history.length === 0) return 0;
  // Count consecutive days with entries (simplified)
  return Math.min(history.length, 30);
}

export default function RegistroScreen() {
  const { colors, isDark } = useTheme();
  const moodHistory = useStore((s) => s.moodHistory);
  const journalEntries = useStore((s) => s.journalEntries) ?? [];
  const recentActivities = useStore((s) => s.recentActivities);
  const setMood = useStore((s) => s.setMood);
  const saveMoodEntry = useStore((s) => s.saveMoodEntry);
  const streak = getStreak(moodHistory);
  const isEmpty = moodHistory.length === 0 && journalEntries.length === 0;

  const [showLogModal, setShowLogModal] = useState(false);
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [journalNote, setJournalNote] = useState('');

  const handleSaveLog = () => {
    if (selectedMood) {
      setMood(selectedMood);
      saveMoodEntry(journalNote.trim() || undefined);
      setShowLogModal(false);
      setJournalNote('');
      setSelectedMood(null);
    }
  };

  // Get most frequent mood
  const getMostFrequentMood = () => {
    if (moodHistory.length === 0) return null;
    const counts: Record<string, number> = {};
    moodHistory.forEach(e => { counts[e.mood] = (counts[e.mood] || 0) + 1; });
    const topMood = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
    return topMood ? topMood[0] as MoodType : null;
  };
  const dominantMood = getMostFrequentMood();

  return (
    <ScreenWrapper style={styles.container}>
      <FloatingParticles count={12} persistenceKey="journal_stars_pos_v2" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View entering={FadeInUp.duration(400)} style={styles.headerRow}>
          <View>
            <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Mi Registro</Text>
            <Text style={[styles.headerSubtitle, { color: colors.textLight }]}>Tu viaje emocional</Text>
          </View>
          {streak > 0 && (
            <View style={styles.streakBadge}>
              <Ionicons name="flame" size={16} color="#F97316" />
              <Text style={styles.streakText}>{streak}</Text>
            </View>
          )}
        </Animated.View>

        {/* Summary Stats Row */}
        <Animated.View entering={FadeInUp.duration(400).delay(100)} style={styles.statsRow}>
          <View style={styles.statCard}>
            <LinearGradient
              colors={[Colors.primary + '15', Colors.primary + '05']}
              style={styles.statGradient}
            >
              <View style={[styles.statIconWrap, { backgroundColor: Colors.primary + '18' }]}>
                <Ionicons name="heart" size={18} color={colors.primary} />
              </View>
              <Text style={[styles.statNumber, { color: colors.textPrimary }]}>{moodHistory.length}</Text>
              <Text style={[styles.statLabel, { color: colors.textLight }]}>Estados</Text>
            </LinearGradient>
          </View>

          <View style={styles.statCard}>
            <LinearGradient
              colors={['rgba(252,211,77,0.15)', 'rgba(252,211,77,0.03)']}
              style={styles.statGradient}
            >
              <View style={[styles.statIconWrap, { backgroundColor: 'rgba(252,211,77,0.18)' }]}>
                <Ionicons name="star" size={18} color="#FCD34D" />
              </View>
              <Text style={[styles.statNumber, { color: colors.textPrimary }]}>{journalEntries.length}</Text>
              <Text style={[styles.statLabel, { color: colors.textLight }]}>Gratitudes</Text>
            </LinearGradient>
          </View>

          <View style={styles.statCard}>
            <LinearGradient
              colors={[Colors.mint + '20', Colors.mint + '05']}
              style={styles.statGradient}
            >
              <View style={[styles.statIconWrap, { backgroundColor: colors.mint + '20' }]}>
                <Ionicons name="sparkles" size={18} color={colors.mint} />
              </View>
              <Text style={[styles.statNumber, { color: colors.textPrimary }]}>{recentActivities.length}</Text>
              <Text style={[styles.statLabel, { color: colors.textLight }]}>Actividades</Text>
            </LinearGradient>
          </View>
        </Animated.View>

        {/* Mood Chart — only when there's data */}
        {moodHistory.length > 0 && (
          <Animated.View entering={FadeInUp.duration(400).delay(200)}>
            <GlassCard style={styles.chartCard}>
              <View style={styles.chartHeader}>
                <Text style={[styles.chartTitle, { color: colors.textPrimary }]}>Últimos 7 registros</Text>
                {dominantMood && (
                  <View style={styles.dominantBadge}>
                    <Ionicons
                      name={MoodConfig[dominantMood]?.icon as any || 'ellipse'}
                      size={14}
                      color={MoodConfig[dominantMood]?.color}
                    />
                    <Text style={[styles.dominantText, { color: MoodConfig[dominantMood]?.color }]}>
                      {MoodConfig[dominantMood]?.label}
                    </Text>
                  </View>
                )}
              </View>
              <MoodMiniChart history={moodHistory} />
            </GlassCard>
          </Animated.View>
        )}

        {/* Timeline Header */}
        <Animated.View entering={FadeInUp.duration(400).delay(300)}>
          <SectionHeader title="Línea de tiempo" subtitle="Tus registros más recientes" />
        </Animated.View>

        {/* Timeline or Empty State */}
        {!isEmpty ? (
          <Animated.View entering={FadeInUp.duration(400).delay(400)}>
            {moodHistory.slice(0, 15).map((entry, i) => {
              const config = MoodConfig[entry.mood as MoodType];
              const isLast = i === Math.min(moodHistory.length, 15) - 1;
              return (
                <View key={entry.id} style={styles.timelineItem}>
                  {/* Timeline spine */}
                  <View style={styles.timelineSpine}>
                    <View style={[styles.timelineDot, { backgroundColor: config?.color || '#B8C4D0' }]}>
                      <View style={[styles.timelineDotInner, { backgroundColor: config?.color || '#B8C4D0' }]} />
                    </View>
                    {!isLast && <View style={styles.timelineConnector} />}
                  </View>

                  {/* Card */}
                  <GlassCard style={styles.timelineCard}>
                    <View style={styles.timelineRow}>
                      <View style={[styles.timelineMoodIcon, { backgroundColor: (config?.color || '#B8C4D0') + '15' }]}>
                        <Ionicons
                          name={(config?.icon || 'ellipse') as any}
                          size={18}
                          color={config?.color || Colors.textLight}
                        />
                      </View>
                      <View style={{ flex: 1, gap: 2 }}>
                        <Text style={[styles.timelineLabel, { color: colors.textPrimary }]}>{entry.label}</Text>
                        <Text style={[styles.timelineDate, { color: colors.textLight }]}>{new Date(entry.date).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' })}</Text>
                        {!!entry.note && (
                          <Text style={[styles.timelineNote, { color: colors.textSecondary }]}>{entry.note}</Text>
                        )}
                      </View>
                      <View style={[styles.timelineMoodTag, { backgroundColor: (config?.color || '#B8C4D0') + '12' }]}>
                        <Text style={[styles.timelineMoodTagText, { color: config?.color }]}>
                          {config?.label}
                        </Text>
                      </View>
                    </View>
                  </GlassCard>
                </View>
              );
            })}
          </Animated.View>
        ) : (
          <Animated.View entering={FadeIn.duration(600).delay(400)}>
            <GlassCard style={styles.emptyCard}>
              <Mascot size={100} variant="greeting" />
              <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>¡Comienza tu viaje!</Text>
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                Registra cómo te sientes cada día y descubre patrones en tu bienestar emocional.
              </Text>
              <View style={styles.emptySteps}>
                {[
                  { icon: 'heart-outline', text: 'Registra tu ánimo' },
                  { icon: 'star-outline', text: 'Escribe gratitudes' },
                  { icon: 'trending-up-outline', text: 'Observa tu progreso' },
                ].map((step, i) => (
                  <View key={i} style={styles.emptyStep}>
                    <View style={[styles.emptyStepNum, { backgroundColor: colors.primary + '15' }]}>
                      <Text style={[styles.emptyStepNumText, { color: colors.primary }]}>{i + 1}</Text>
                    </View>
                    <Ionicons name={step.icon as any} size={16} color={colors.primary} />
                    <Text style={[styles.emptyStepText, { color: colors.textSecondary }]}>{step.text}</Text>
                  </View>
                ))}
              </View>
            </GlassCard>
          </Animated.View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Floating Action Button */}
      <Animated.View entering={FadeInUp.duration(400).delay(500)} style={styles.fabContainer}>
        <Pressable 
          style={({ pressed }) => [styles.fab, pressed && { opacity: 0.8, transform: [{ scale: 0.95 }] }]}
          onPress={() => setShowLogModal(true)}
        >
          <LinearGradient colors={[Colors.primary, Colors.secondary]} style={styles.fabGradient}>
            <Ionicons name="add" size={32} color="#FFF" />
          </LinearGradient>
        </Pressable>
      </Animated.View>

      {/* Log Your Day Modal */}
      <Modal visible={showLogModal} transparent animationType="slide" onRequestClose={() => setShowLogModal(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.bgCard }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>¿Cómo te sientes hoy?</Text>
              <Pressable onPress={() => setShowLogModal(false)}>
                <Ionicons name="close" size={24} color={colors.textLight} />
              </Pressable>
            </View>

            {/* Mood Selector Grid */}
            <View style={styles.moodGrid}>
              {(Object.keys(MoodConfig) as MoodType[]).map((moodKey) => {
                const isSelected = selectedMood === moodKey;
                const config = MoodConfig[moodKey];
                return (
                  <Pressable 
                    key={moodKey} 
                    style={[styles.moodBox, isSelected && { backgroundColor: config.color + '20', borderColor: config.color }]}
                    onPress={() => setSelectedMood(moodKey)}
                  >
                    <Ionicons name={(config.icon || 'ellipse') as any} size={28} color={config.color} />
                    <Text style={[styles.moodLabel, { color: colors.textSecondary }, isSelected && { color: config.color, fontWeight: '600' }]}>{config.label}</Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Note Input */}
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Reflexión del día (opcional)</Text>
            <TextInput
              style={[
                styles.input, 
                { 
                  backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#F7FAFC',
                  color: colors.textPrimary,
                  borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'
                }
              ]}
              placeholder="¿Qué hizo que te sintieras así hoy?"
              placeholderTextColor={colors.textLight}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              value={journalNote}
              onChangeText={setJournalNote}
            />

            <JewelButton 
              title="Guardar Registro" 
              onPress={handleSaveLog} 
              style={{ marginTop: 24, opacity: selectedMood ? 1 : 0.5 }}
              disabled={!selectedMood}
            />
          </View>
        </KeyboardAvoidingView>
      </Modal>

    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 60 },

  // Header
  headerRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 26, fontWeight: '700', color: Colors.textPrimary,
    fontFamily: 'Poppins_700Bold', letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 13, color: Colors.textLight, marginTop: 2,
    fontFamily: 'Poppins_400Regular',
  },
  streakBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(249,115,22,0.1)',
    paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 20,
  },
  streakText: {
    fontSize: 14, fontWeight: '700', color: '#F97316',
    fontFamily: 'Poppins_700Bold',
  },

  // Stats
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  statCard: {
    flex: 1, borderRadius: 20, overflow: 'hidden',
  },
  statGradient: {
    alignItems: 'center', gap: 6, paddingVertical: 16, paddingHorizontal: 8,
    borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.5)',
  },
  statIconWrap: {
    width: 36, height: 36, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center',
  },
  statNumber: {
    fontSize: 22, fontWeight: '700', color: Colors.textPrimary,
    fontFamily: 'Poppins_700Bold',
  },
  statLabel: { fontSize: 10, color: Colors.textLight, fontFamily: 'Poppins_500Medium' },

  // Chart
  chartCard: { marginBottom: 20, paddingVertical: 16 },
  chartHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 16, paddingHorizontal: 4,
  },
  chartTitle: {
    fontSize: 14, fontWeight: '600', color: Colors.textPrimary,
    fontFamily: 'Poppins_600SemiBold',
  },
  dominantBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  dominantText: {
    fontSize: 11, fontWeight: '600', fontFamily: 'Poppins_600SemiBold',
  },
  chartContainer: {
    flexDirection: 'row', alignItems: 'flex-end',
    justifyContent: 'space-between', height: 60, paddingHorizontal: 4,
  },
  chartBarWrap: { alignItems: 'center', flex: 1, gap: 4 },
  chartBar: {
    width: 20, borderRadius: 6, minHeight: 6,
    overflow: 'hidden',
  },
  chartBarGlow: {
    position: 'absolute', top: 0, left: 0, right: 0, height: '50%',
    borderRadius: 6,
  },
  chartBarLabel: { fontSize: 9, color: Colors.textLight },

  // Timeline
  timelineItem: { flexDirection: 'row', marginBottom: 0 },
  timelineSpine: { width: 28, alignItems: 'center', paddingTop: 16 },
  timelineDot: {
    width: 12, height: 12, borderRadius: 6, zIndex: 1,
    justifyContent: 'center', alignItems: 'center',
  },
  timelineDotInner: {
    width: 5, height: 5, borderRadius: 3,
    opacity: 0.5,
  },
  timelineConnector: {
    width: 2, flex: 1, backgroundColor: 'rgba(0,0,0,0.05)', marginTop: -1,
  },
  timelineCard: { flex: 1, marginLeft: 8, marginBottom: 8 },
  timelineRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  timelineMoodIcon: {
    width: 36, height: 36, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center',
  },
  timelineLabel: {
    fontSize: 14, fontWeight: '600', color: Colors.textPrimary,
    fontFamily: 'Poppins_600SemiBold',
  },
  timelineDate: { fontSize: 11, color: Colors.textLight },
  timelineMoodTag: {
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10,
  },
  timelineMoodTagText: {
    fontSize: 10, fontWeight: '600', fontFamily: 'Poppins_600SemiBold',
  },

  // Empty state
  emptyCard: { alignItems: 'center', paddingVertical: 32, gap: 12 },
  emptyTitle: {
    fontSize: 20, fontWeight: '700', color: Colors.textPrimary,
    fontFamily: 'Poppins_700Bold',
  },
  emptyText: {
    fontSize: 14, color: Colors.textSecondary, textAlign: 'center',
    paddingHorizontal: 16, lineHeight: 22,
    fontFamily: 'Poppins_400Regular',
  },
  emptySteps: {
    marginTop: 12, gap: 12, width: '100%', paddingHorizontal: 8,
  },
  emptyStep: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: 'rgba(91,155,213,0.05)',
    paddingVertical: 12, paddingHorizontal: 16, borderRadius: 14,
  },
  emptyStepNum: {
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: Colors.primary + '15',
    justifyContent: 'center', alignItems: 'center',
  },
  emptyStepNumText: {
    fontSize: 11, fontWeight: '700', color: Colors.primary,
    fontFamily: 'Poppins_700Bold',
  },
  emptyStepText: {
    fontSize: 13, color: Colors.textSecondary,
    fontFamily: 'Poppins_500Medium',
  },
  timelineNote: {
    fontSize: 12, marginTop: 4, fontFamily: 'Poppins_400Regular', fontStyle: 'italic', lineHeight: 18,
  },

  // FAB
  fabContainer: {
    position: 'absolute', bottom: 24, right: 24,
    shadowColor: Colors.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 8,
  },
  fab: {
    width: 60, height: 60, borderRadius: 30, overflow: 'hidden',
  },
  fabGradient: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
  },

  // Modal
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 32, borderTopRightRadius: 32,
    padding: 24, paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20, fontWeight: '700', fontFamily: 'Poppins_700Bold',
  },
  moodGrid: {
    flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 24, gap: 10,
  },
  moodBox: {
    width: '30%', aspectRatio: 1, borderRadius: 16,
    borderWidth: 2, borderColor: 'transparent',
    justifyContent: 'center', alignItems: 'center', gap: 8,
    backgroundColor: 'rgba(150,150,150,0.05)',
  },
  moodLabel: {
    fontSize: 12, fontFamily: 'Poppins_500Medium',
  },
  inputLabel: {
    fontSize: 14, fontFamily: 'Poppins_500Medium', marginBottom: 8,
  },
  input: {
    borderRadius: 16, padding: 16, fontSize: 15,
    borderWidth: 1, minHeight: 100,
    fontFamily: 'Poppins_400Regular',
  },
});
