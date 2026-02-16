import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  Dimensions,
  LayoutChangeEvent,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  Easing,
  FadeIn,
  FadeInDown,
  FadeInUp,
  interpolate,
} from 'react-native-reanimated';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Colors, Shadows } from '../../constants/theme';
import { GlassCard, JewelButton, AuroraBackground } from '../../components/ui';
import { useStore, JournalEntry } from '../../store/useStore';

// ============ Draggable Star Component ============
interface FloatingStarProps {
  entry: JournalEntry;
  index: number;
  containerWidth: number;
  containerHeight: number;
  onLongPress: (entry: JournalEntry) => void;
}

function FloatingStar({ entry, index, containerWidth, containerHeight, onLongPress }: FloatingStarProps) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const contextX = useSharedValue(0);
  const contextY = useSharedValue(0);
  const scale = useSharedValue(0);
  const labelOpacity = useSharedValue(0);
  const rotation = useSharedValue(0);
  const glowOpacity = useSharedValue(0.4);

  useEffect(() => {
    scale.value = withDelay(
      index * 100,
      withSpring(1, { damping: 8, stiffness: 100, mass: 0.8 })
    );
    rotation.value = withRepeat(
      withSequence(
        withTiming(10, { duration: 2500, easing: Easing.inOut(Easing.ease) }),
        withTiming(-10, { duration: 2500, easing: Easing.inOut(Easing.ease) }),
      ),
      -1, true
    );
    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.7, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.3, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
      ),
      -1, true
    );
  }, []);

  const clampX = containerWidth ? containerWidth / 2 - 30 : 100;
  const clampY = containerHeight ? containerHeight / 2 - 30 : 100;

  const panGesture = Gesture.Pan()
    .onStart(() => {
      contextX.value = translateX.value;
      contextY.value = translateY.value;
    })
    .onUpdate((event) => {
      translateX.value = Math.max(-clampX, Math.min(clampX, contextX.value + event.translationX));
      translateY.value = Math.max(-clampY, Math.min(clampY, contextY.value + event.translationY));
    })
    .onEnd(() => {
      translateX.value = withSpring(translateX.value, { damping: 20 });
      translateY.value = withSpring(translateY.value, { damping: 20 });
    });

  const tapGesture = Gesture.Tap()
    .onEnd(() => {
      if (labelOpacity.value > 0.5) {
        labelOpacity.value = withTiming(0, { duration: 200 });
      } else {
        labelOpacity.value = withTiming(1, { duration: 200 });
        labelOpacity.value = withDelay(3000, withTiming(0, { duration: 300 }));
      }
    });

  const composedGesture = Gesture.Race(panGesture, tapGesture);

  const animatedStarStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: entry.x + translateX.value },
      { translateY: entry.y + translateY.value },
      { scale: scale.value },
      { rotate: `${rotation.value}deg` },
    ],
  }));

  const glowAnimStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  const labelAnimStyle = useAnimatedStyle(() => ({
    opacity: labelOpacity.value,
    transform: [{ scale: interpolate(labelOpacity.value, [0, 1], [0.8, 1]) }],
  }));

  return (
    <GestureDetector gesture={composedGesture}>
      <Animated.View style={[styles.starContainer, animatedStarStyle]}>
        <Animated.View style={[styles.starGlow, glowAnimStyle]} />
        <Pressable
          onLongPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            onLongPress(entry);
          }}
          onPressIn={() => { scale.value = withSpring(1.2); }}
          onPressOut={() => { scale.value = withSpring(1); }}
          delayLongPress={500}
          style={styles.starIcon}
        >
          <Ionicons name="star" size={22} color="#FCD34D" />
        </Pressable>
        <Animated.View style={[styles.starLabel, labelAnimStyle]}>
          <Text style={styles.starLabelText} numberOfLines={2}>
            {entry.text}
          </Text>
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
}

// ============ Entry Detail Modal ============
interface EntryModalProps {
  visible: boolean;
  entry: JournalEntry | null;
  onClose: () => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, text: string) => void;
}

function EntryDetailModal({ visible, entry, onClose, onDelete, onUpdate }: EntryModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    if (entry) {
      setEditText(entry.text);
      setIsEditing(false);
    }
  }, [entry]);

  if (!entry) return null;

  const handleSave = () => {
    if (editText.trim()) {
      onUpdate(entry.id, editText.trim());
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    onDelete(entry.id);
    onClose();
  };

  const formattedDate = (() => {
    try {
      const d = new Date(entry.date);
      return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch {
      return '';
    }
  })();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalCenter}
        >
          <Pressable style={styles.modalCard} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalHeader}>
              <View style={styles.modalStarIcon}>
                <Ionicons name="star" size={24} color="#FCD34D" />
              </View>
              <Text style={styles.modalDate}>{formattedDate}</Text>
            </View>

            {isEditing ? (
              <TextInput
                autoFocus
                multiline
                value={editText}
                onChangeText={setEditText}
                style={styles.modalEditInput}
                textAlignVertical="top"
                placeholder="Escribe algo..."
                placeholderTextColor={Colors.textLight}
              />
            ) : (
              <Text style={styles.modalText}>{entry.text}</Text>
            )}

            <View style={styles.modalActions}>
              {isEditing ? (
                <>
                  <Pressable
                    onPress={() => { setIsEditing(false); setEditText(entry.text); }}
                    style={styles.modalActionBtn}
                  >
                    <Ionicons name="close-outline" size={20} color={Colors.textSecondary} />
                    <Text style={styles.modalActionText}>Cancelar</Text>
                  </Pressable>
                  <Pressable
                    onPress={handleSave}
                    style={[styles.modalActionBtn, styles.modalSaveBtn]}
                  >
                    <Ionicons name="checkmark-outline" size={20} color="#FFF" />
                    <Text style={[styles.modalActionText, { color: '#FFF' }]}>Guardar</Text>
                  </Pressable>
                </>
              ) : (
                <>
                  <Pressable onPress={() => setIsEditing(true)} style={styles.modalActionBtn}>
                    <Ionicons name="pencil-outline" size={20} color={Colors.primary} />
                    <Text style={[styles.modalActionText, { color: Colors.primary }]}>Editar</Text>
                  </Pressable>
                  <Pressable onPress={handleDelete} style={[styles.modalActionBtn, styles.modalDeleteBtn]}>
                    <Ionicons name="trash-outline" size={20} color="#E53E3E" />
                    <Text style={[styles.modalActionText, { color: '#E53E3E' }]}>Eliminar</Text>
                  </Pressable>
                </>
              )}
            </View>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}

// ============ Main Screen ============
export default function GratitudeJournalScreen() {
  const journalEntries = useStore((s) => s.journalEntries) ?? [];
  const addJournalEntry = useStore((s) => s.addJournalEntry);
  const removeJournalEntry = useStore((s) => s.removeJournalEntry);
  const updateJournalEntry = useStore((s) => s.updateJournalEntry);
  const [showInput, setShowInput] = useState(false);
  const [inputText, setInputText] = useState('');
  const [skySize, setSkySize] = useState({ width: 0, height: 0 });
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleAddItem = () => {
    if (!inputText.trim()) return;
    const newItem: JournalEntry = {
      id: Date.now().toString(),
      text: inputText.trim(),
      x: Math.random() * 80 - 40,
      y: Math.random() * 60 - 30,
      date: new Date().toISOString(),
    };
    addJournalEntry(newItem);
    setInputText('');
    setShowInput(false);
  };

  const handleLongPress = (entry: JournalEntry) => {
    setSelectedEntry(entry);
    setModalVisible(true);
  };

  const handleSkyLayout = (e: LayoutChangeEvent) => {
    setSkySize({ width: e.nativeEvent.layout.width, height: e.nativeEvent.layout.height });
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <LinearGradient colors={['#E8F4FD', '#F0F6FF', '#FFFFFF']} style={StyleSheet.absoluteFill} />
      <AuroraBackground />

      <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <View style={styles.backBtnInner}>
            <Ionicons name="arrow-back" size={20} color={Colors.textPrimary} />
          </View>
        </Pressable>
        <Text style={styles.title}>Diario de Gratitud</Text>
        <View style={{ width: 40 }} />
      </Animated.View>

      <Animated.View
        entering={FadeIn.duration(600).delay(200)}
        style={styles.skyContainer}
        onLayout={handleSkyLayout}
      >
        <LinearGradient
          colors={['rgba(91, 155, 213, 0.06)', 'rgba(168, 230, 207, 0.06)']}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        />
        <View style={styles.cornerDecor1}>
          <Ionicons name="sparkles-outline" size={16} color="rgba(91, 155, 213, 0.15)" />
        </View>
        <View style={styles.cornerDecor2}>
          <Ionicons name="sparkles-outline" size={14} color="rgba(168, 230, 207, 0.15)" />
        </View>

        {journalEntries.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="star-outline" size={40} color="rgba(91, 155, 213, 0.2)" />
            <Text style={styles.emptyStateTitle}>Tu cielo de gratitud está vacío...</Text>
            <Text style={styles.emptyStateSubtitle}>
              Agrega lo que te hace sentir agradecido y llena tu cielo de estrellas ✨
            </Text>
          </View>
        )}

        {journalEntries.map((entry, idx) => (
          <FloatingStar
            key={entry.id} entry={entry} index={idx}
            containerWidth={skySize.width} containerHeight={skySize.height}
            onLongPress={handleLongPress}
          />
        ))}
      </Animated.View>

      <Animated.View entering={FadeInUp.duration(400).delay(400)} style={styles.inputArea}>
        {!showInput ? (
          <JewelButton title="Crear nueva estrella" icon="star-outline" onPress={() => setShowInput(true)} />
        ) : (
          <Animated.View entering={FadeInUp.duration(300)}>
            <GlassCard style={styles.inputCard}>
              <Text style={styles.inputLabel}>¿Por qué estás agradecido hoy?</Text>
              <TextInput
                autoFocus multiline value={inputText} onChangeText={setInputText}
                placeholder="Ej: Un café caliente, la sonrisa de un amigo..."
                placeholderTextColor={Colors.textLight} style={styles.textInput} textAlignVertical="top"
              />
              <View style={styles.inputButtons}>
                <Pressable onPress={() => { setShowInput(false); setInputText(''); }} style={styles.cancelBtn}>
                  <Text style={styles.cancelBtnText}>Cancelar</Text>
                </Pressable>
                <View style={{ flex: 1 }}>
                  <JewelButton title="Enviar" icon="sparkles-outline" onPress={handleAddItem} disabled={!inputText.trim()} />
                </View>
              </View>
            </GlassCard>
          </Animated.View>
        )}
      </Animated.View>

      <View style={{ height: 20 }} />

      <EntryDetailModal
        visible={modalVisible} entry={selectedEntry}
        onClose={() => setModalVisible(false)}
        onDelete={(id) => removeJournalEntry(id)}
        onUpdate={(id, text) => updateJournalEntry(id, text)}
      />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: 55, paddingHorizontal: 20, paddingBottom: 16,
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  backBtnInner: {
    width: 36, height: 36, borderRadius: 12, backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center', alignItems: 'center', borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)', shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  title: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary, fontFamily: 'Poppins_700Bold' },
  skyContainer: {
    flex: 1, marginHorizontal: 20, marginBottom: 16, borderRadius: 24,
    borderWidth: 2, borderColor: 'rgba(91, 155, 213, 0.2)', borderStyle: 'dashed',
    overflow: 'hidden', justifyContent: 'center', alignItems: 'center',
  },
  cornerDecor1: { position: 'absolute', top: 12, right: 12, opacity: 0.6 },
  cornerDecor2: { position: 'absolute', bottom: 12, left: 12, opacity: 0.6 },
  emptyState: { alignItems: 'center', paddingHorizontal: 40, gap: 8 },
  emptyStateTitle: {
    fontSize: 15, color: Colors.textLight, fontStyle: 'italic',
    textAlign: 'center', fontFamily: 'Poppins_500Medium',
  },
  emptyStateSubtitle: { fontSize: 13, color: Colors.textLight, textAlign: 'center', opacity: 0.6 },
  starContainer: { position: 'absolute', alignItems: 'center', gap: 4, zIndex: 10 },
  starGlow: {
    position: 'absolute', width: 50, height: 50, borderRadius: 25,
    backgroundColor: 'rgba(252, 211, 77, 0.25)', top: -10,
  },
  starIcon: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(252, 211, 77, 0.25)',
    justifyContent: 'center', alignItems: 'center', borderWidth: 1,
    borderColor: 'rgba(252, 211, 77, 0.3)', shadowColor: '#FCD34D',
    shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.4, shadowRadius: 12, elevation: 4,
  },
  starLabel: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)', paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: 10, maxWidth: 140, borderWidth: 1, borderColor: 'rgba(0, 0, 0, 0.06)',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06,
    shadowRadius: 6, elevation: 2,
  },
  starLabelText: { fontSize: 12, fontWeight: '500', color: Colors.textPrimary, textAlign: 'center' },
  inputArea: { paddingHorizontal: 20, paddingBottom: 10 },
  inputCard: { padding: 16, gap: 12 },
  inputLabel: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary, fontFamily: 'Poppins_600SemiBold' },
  textInput: {
    backgroundColor: 'rgba(91, 155, 213, 0.06)', borderRadius: 14, padding: 14,
    fontSize: 15, color: Colors.textPrimary, height: 90, borderWidth: 1,
    borderColor: 'rgba(91, 155, 213, 0.15)',
  },
  inputButtons: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  cancelBtn: {
    flex: 1, paddingVertical: 14, borderRadius: 16, borderWidth: 1.5,
    borderColor: Colors.primary, alignItems: 'center', justifyContent: 'center',
  },
  cancelBtnText: { color: Colors.primary, fontSize: 15, fontWeight: '600' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.4)', justifyContent: 'center', alignItems: 'center' },
  modalCenter: { width: '100%', alignItems: 'center' },
  modalCard: {
    width: '85%', maxWidth: 360, backgroundColor: '#FFF', borderRadius: 24, padding: 24, gap: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.15,
    shadowRadius: 24, elevation: 10,
  },
  modalHeader: { alignItems: 'center', gap: 8 },
  modalStarIcon: {
    width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgba(252, 211, 77, 0.2)',
    justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(252, 211, 77, 0.3)',
  },
  modalDate: { fontSize: 12, color: Colors.textLight },
  modalText: { fontSize: 16, color: Colors.textPrimary, lineHeight: 24, textAlign: 'center', fontFamily: 'Poppins_500Medium' },
  modalEditInput: {
    backgroundColor: 'rgba(91, 155, 213, 0.06)', borderRadius: 14, padding: 14,
    fontSize: 15, color: Colors.textPrimary, minHeight: 80, borderWidth: 1,
    borderColor: 'rgba(91, 155, 213, 0.15)',
  },
  modalActions: { flexDirection: 'row', gap: 10 },
  modalActionBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, paddingVertical: 12, borderRadius: 14, backgroundColor: 'rgba(91, 155, 213, 0.08)',
  },
  modalActionText: { fontSize: 14, fontWeight: '600' },
  modalSaveBtn: { backgroundColor: Colors.primary },
  modalDeleteBtn: { backgroundColor: 'rgba(229, 62, 62, 0.08)' },
});
