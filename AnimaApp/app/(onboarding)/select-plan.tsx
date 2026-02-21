import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Dimensions, Modal, Image } from 'react-native';
import Animated, { FadeInUp, FadeIn, ZoomIn, FadeInRight } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Gradients } from '../../constants/theme';
import { GlassCard, Mascot, JewelButton, FloatingParticles } from '../../components/ui';
import { useStore } from '../../store/useStore';
import { useTheme } from '../../hooks/useTheme';
import { EMOTIONAL_ROUTES, CLINICAL_DISCLAIMER, EmotionalRouteId } from '../../constants/clinicalContent';
import { ScreenWrapper } from '../../components/ScreenWrapper';

const { width: SCREEN_W } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_W * 0.75;
const CARD_HEIGHT = CARD_WIDTH * (16 / 9); // Native 9:16 Portrait Aspect Ratio

export default function SelectPlanScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const setPlan = useStore((s) => s.setPlan);
  const userName = useStore((s) => s.userName);
  const recommendedPlan = useStore((s) => s.recommendedPlan);
  
  // Default to recommended plan if it exists
  const [selectedId, setSelectedId] = useState<EmotionalRouteId | null>(recommendedPlan as EmotionalRouteId | null);
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  const handleConfirm = () => {
    if (selectedId) {
      setPlan(selectedId);
      router.replace('/(tabs)');
    }
  };

  const selectedRoute = EMOTIONAL_ROUTES.find(r => r.id === selectedId);
  const recommendedRouteEntity = EMOTIONAL_ROUTES.find(r => r.id === recommendedPlan);

  // Dynamic sorting to surface the recommended route as the first card in the carousel
  const displayRoutes = [...EMOTIONAL_ROUTES].sort((a, b) => {
    if (a.id === recommendedPlan) return -1;
    if (b.id === recommendedPlan) return 1;
    return 0;
  });

  return (
    <ScreenWrapper style={styles.container}>
      {/* Background Gradient */}
      <LinearGradient
        colors={['#050505', '#0A0F24']}
        style={StyleSheet.absoluteFillObject}
      />
      <FloatingParticles count={15} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <Animated.View entering={FadeInUp.duration(600)} style={styles.header}>
          <Mascot size={80} variant="greeting" />
          <Text style={[styles.title, { color: '#FFFFFF' }]}>
            {recommendedRouteEntity ? `Te sugerimos:\n${recommendedRouteEntity.title}` : `Hola, ${userName || 'amigo'} ✨`}
          </Text>
          <Text style={[styles.subtitle, { color: 'rgba(255,255,255,0.7)' }]}>
            {recommendedPlan 
              ? 'Puedes aceptar esta ruta o explorar las demás deslizando.' 
              : 'Explora las rutas deslizando y elige la que más resuene contigo.'}
          </Text>
        </Animated.View>

        {/* Carousel Gallery */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.carouselContainer}
          snapToInterval={CARD_WIDTH + 16}
          decelerationRate="fast"
          snapToAlignment="center"
        >
          {displayRoutes.map((route, index) => {
            const isSelected = selectedId === route.id;
            return (
              <Animated.View key={route.id} entering={FadeInRight.duration(500).delay(100 + index * 100)}>
                <Pressable onPress={() => setSelectedId(route.id)}>
                  <GlassCard style={{
                    ...styles.card, 
                    ...(isSelected ? { borderColor: route.color, borderWidth: 3 } : { borderColor: 'rgba(255,255,255,0.05)', borderWidth: 1 })
                  }}>
                    
                    {/* Fused full-cover image */}
                    <Image source={route.image} style={StyleSheet.absoluteFillObject} resizeMode="cover" />
                    
                    {/* Artistic gradient fade */}
                    <LinearGradient
                      colors={['transparent', 'rgba(0,0,0,0.5)', 'rgba(0,0,0,0.95)']}
                      style={StyleSheet.absoluteFillObject}
                    />

                    {/* Recommended Badge */}
                    {recommendedPlan === route.id && (
                      <Animated.View entering={FadeInUp.delay(300)} style={styles.recommendedBadge}>
                        <Text style={styles.recommendedBadgeText}>✨ Recomendado para ti</Text>
                      </Animated.View>
                    )}

                    {/* Card Content Floating */}
                    <View style={styles.cardContent}>
                      <View style={[styles.iconWrap, { backgroundColor: route.color + '40' }]}>
                        <Ionicons name={route.icon as any} size={22} color={route.color} />
                      </View>
                      <Text style={styles.cardTitle}>{route.title}</Text>
                      <Text style={styles.cardSubtitle}>{route.subtitle}</Text>
                    </View>
                    
                    {/* Selection Checkmark */}
                    {isSelected && (
                      <Animated.View entering={ZoomIn.duration(300)} style={styles.checkIcon}>
                        <View style={styles.checkIconBg}>
                          <Ionicons name="checkmark-circle" size={26} color={route.color} />
                        </View>
                      </Animated.View>
                    )}
                  </GlassCard>
                </Pressable>
              </Animated.View>
            );
          })}
        </ScrollView>

        {/* Disclaimer SOS Button */}
        <Animated.View entering={FadeIn.duration(800).delay(600)} style={styles.disclaimerContainer}>
          <Pressable style={styles.sosButton} onPress={() => setShowDisclaimer(true)}>
            <Ionicons name="warning-outline" size={16} color={colors.textLight} />
            <Text style={[styles.sosText, { color: colors.textLight }]}>Información Importante (SOS)</Text>
          </Pressable>
        </Animated.View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Floating Confirm Button */}
      {selectedId && (
        <Animated.View entering={FadeInUp.duration(400)} style={styles.confirmWrap}>
          <JewelButton 
            title={`Comenzar ruta ${selectedRoute?.title.replace('Ruta ', '')}`}
            onPress={handleConfirm}
            colors={selectedRoute ? [selectedRoute.color, selectedRoute.color + 'DD'] : undefined}
          />
        </Animated.View>
      )}

      {/* Disclaimer Modal */}
      <Modal visible={showDisclaimer} transparent animationType="fade" onRequestClose={() => setShowDisclaimer(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.bgCard }]}>
            <View style={[styles.modalIconWrap, { backgroundColor: 'rgba(239,68,68,0.1)' }]}>
              <Ionicons name="warning" size={32} color="#EF4444" />
            </View>
            <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>{CLINICAL_DISCLAIMER.title}</Text>
            <Text style={[styles.modalText, { color: colors.textSecondary }]}>{CLINICAL_DISCLAIMER.content}</Text>
            <JewelButton title="Entendido" onPress={() => setShowDisclaimer(false)} style={{ marginTop: 24, width: '100%' }} />
          </View>
        </View>
      </Modal>

    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingTop: 60, paddingBottom: 40 },
  header: { alignItems: 'center', marginBottom: 24, paddingHorizontal: 24 },
  title: {
    fontSize: 26, fontWeight: '700', fontFamily: 'Poppins_700Bold',
    marginTop: 12, textAlign: 'center',
  },
  subtitle: {
    fontSize: 14, fontFamily: 'Poppins_400Regular',
    marginTop: 8, textAlign: 'center', lineHeight: 22,
    paddingHorizontal: 10,
  },
  
  carouselContainer: {
    paddingHorizontal: (SCREEN_W - CARD_WIDTH) / 2, // Center the snap 
    gap: 16,
    paddingVertical: 10, 
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    padding: 0,
    overflow: 'hidden',
    borderRadius: 36, // Extra soft corners for gallery art
    backgroundColor: '#0F172A',
  },
  cardContent: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    padding: 24,
  },
  iconWrap: {
    width: 44, height: 44, borderRadius: 14,
    justifyContent: 'center', alignItems: 'center', marginBottom: 16,
  },
  cardTitle: {
    fontSize: 22, fontWeight: '700', fontFamily: 'Poppins_700Bold', color: '#FFFFFF',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14, fontWeight: '600', fontFamily: 'Poppins_600SemiBold', color: '#E2E8F0', marginBottom: 8,
  },
  cardDesc: {
    fontSize: 13, fontFamily: 'Poppins_400Regular', lineHeight: 20, color: '#CBD5E1',
  },
  checkIcon: {
    position: 'absolute', top: 20, right: 20,
  },
  checkIconBg: {
    backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: 16, padding: 2,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8,
  },
  disclaimerContainer: {
    marginTop: 32, alignItems: 'center', paddingHorizontal: 24,
  },
  sosButton: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingVertical: 8, paddingHorizontal: 16,
    backgroundColor: 'rgba(0,0,0,0.03)', borderRadius: 20,
  },
  sosText: {
    fontSize: 12, fontFamily: 'Poppins_500Medium',
  },
  confirmWrap: {
    position: 'absolute', bottom: 40, left: 24, right: 24,
  },
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', 
    justifyContent: 'center', alignItems: 'center', padding: 24,
  },
  modalContent: {
    width: '100%', borderRadius: 32, padding: 32, alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 10,
  },
  modalIconWrap: {
    width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center', marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20, fontWeight: '700', fontFamily: 'Poppins_700Bold', marginBottom: 12, textAlign: 'center',
  },
  modalText: {
    fontSize: 14, fontFamily: 'Poppins_400Regular', textAlign: 'center', lineHeight: 22,
  },
  recommendedBadge: {
    position: 'absolute', top: 16, left: 16,
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)',
  },
  recommendedBadgeText: {
    color: '#FFF', fontFamily: 'Poppins_600SemiBold', fontSize: 13,
  }
});
