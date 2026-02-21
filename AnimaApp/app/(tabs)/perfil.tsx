import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert, Modal, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Gradients, MoodConfig, Shadows } from '../../constants/theme';
import { GlassCard, SectionHeader, Mascot, JewelButton } from '../../components/ui';
import { ScreenWrapper } from '../../components/ScreenWrapper';
import { useStore, MoodType } from '../../store/useStore';
import { useTheme } from '../../hooks/useTheme';
import { SoundService } from '../../utils/SoundService'; 

export default function PerfilScreen() {
  const router = useRouter();
  const userName = useStore((s) => s.userName);
  const userEmail = useStore((s) => s.userEmail);
  const moodHistory = useStore((s) => s.moodHistory);
  const logout = useStore((s) => s.logout);
  const updateUser = useStore((s) => s.updateUser);

  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState('');

  const handleLogout = () => {
    Alert.alert('Cerrar Sesión', '¿Seguro que quieres salir?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Salir', style: 'destructive',
        onPress: async () => {
          await SoundService.unloadAll(); 
          logout();
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  const openEditModal = () => {
    setNewName(userName || '');
    setIsEditing(true);
  };

  const { toggleTheme, isDark, colors } = useTheme();

  const handleSaveProfile = () => {
    if (newName.trim()) {
      updateUser(newName.trim());
      setIsEditing(false);
      Alert.alert('¡Perfil Actualizado!', 'Tu nombre ha sido guardado correctamente.');
    }
  };

  const settingsItems = [
    { icon: 'notifications-outline', label: 'Notificaciones', color: colors.primary, type: 'toggle', action: () => {} },
    { icon: 'moon-outline', label: 'Modo Lunar', color: colors.secondary, type: 'toggle', action: toggleTheme },
    { icon: 'shield-checkmark-outline', label: 'Privacidad y Datos', color: colors.mint, type: 'link' },
    { icon: 'heart-outline', label: 'Invitar amigos', color: colors.accent, type: 'link' },
    { icon: 'help-buoy-outline', label: 'Ayuda y Soporte', color: colors.textLight, type: 'link' },
  ];

  return (
    <ScreenWrapper style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header - Premium Glow */}
        <Animated.View entering={FadeInDown.duration(600)} style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
             <View style={styles.avatarGlow} />
             <LinearGradient colors={['#FFF', '#F0F6FF']} style={styles.avatarBorder}>
                <LinearGradient 
                  colors={[Colors.primary, Colors.secondary]} 
                  style={styles.avatarFill}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.avatarLetter}>
                    {(userName || 'U').charAt(0).toUpperCase()}
                  </Text>
                </LinearGradient>
             </LinearGradient>
             <Pressable style={styles.editBadge} onPress={openEditModal}>
                <Ionicons name="pencil" size={14} color="#FFF" />
             </Pressable>
          </View>
          
          <View style={{ gap: 4, alignItems: 'center' }}>
            <Text style={[styles.userName, { color: colors.textPrimary }]}>{userName || 'Usuario'}</Text>
            <Text style={[styles.userEmail, { color: colors.textSecondary }]}>{userEmail || 'email@example.com'}</Text>
          </View>

          <Pressable 
            style={[
              styles.editProfileBtn, 
              { 
                backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', 
                borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' 
              }
            ]} 
            onPress={openEditModal}
          >
            <Text style={[styles.editProfileText, { color: colors.textSecondary }]}>Editar Perfil</Text>
          </Pressable>
        </Animated.View>

        {/* Settings Section */}
        <Animated.View entering={FadeInUp.duration(500).delay(300)}>
          <SectionHeader title="Configuraciones" />
          <GlassCard style={styles.settingsCard}>
            {settingsItems.map((item, i) => (
              <Pressable 
                key={i} 
                onPress={item.action}
                style={({ pressed }) => [
                  styles.settingsItem, 
                  i < settingsItems.length - 1 && [styles.settingsBorder, { borderBottomColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' }],
                  pressed && { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)' }
                ]}
              >
                <View style={[styles.settingsIconWrap, { backgroundColor: item.color + '10' }]}>
                  <Ionicons name={item.icon as any} size={20} color={item.color} />
                </View>
                <Text style={[styles.settingsLabel, { color: colors.textPrimary }]}>{item.label}</Text>
                
                {item.type === 'toggle' ? (
                   <View style={[styles.toggleTrack, { 
                     backgroundColor: (item.label === 'Modo Lunar' && isDark) ? Colors.primary : (isDark ? 'rgba(255,255,255,0.1)' : '#E2E8F0') 
                   }]}>
                      <View style={[styles.toggleThumb, { 
                        left: (item.label === 'Modo Lunar' && isDark) ? 22 : 2 
                      }]} />
                   </View>
                ) : (
                  <Ionicons name="chevron-forward" size={16} color={colors.textLight} />
                )}
              </Pressable>
            ))}
          </GlassCard>
        </Animated.View>

        {/* Logout Button */}
        <Animated.View entering={FadeInUp.duration(500).delay(400)} style={{ marginTop: 24 }}>
          <Pressable 
            onPress={handleLogout} 
            style={({ pressed }) => [
              styles.logoutBtn,
              pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] }
            ]}
          >
            <LinearGradient
              colors={['rgba(229,62,62,0.05)', 'rgba(229,62,62,0.1)']}
              style={StyleSheet.absoluteFill}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            />
            <Ionicons name="log-out-outline" size={20} color="#E53E3E" />
            <Text style={styles.logoutText}>Cerrar Sesión</Text>
          </Pressable>
        </Animated.View>

        {/* Footer info */}
        <View style={styles.footerSection}>
          <Mascot size={60} variant="happy" />
          <Text style={[styles.versionText, { color: colors.textLight }]}>Aníma v1.0.2 • Build 2026</Text>
        </View>

        <View style={{ height: 110 }} />
      </ScrollView>

      <Modal
        visible={isEditing}
        transparent
        animationType="fade"
        onRequestClose={() => setIsEditing(false)}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={[styles.modalContent, { backgroundColor: colors.bgCard }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Editar Perfil</Text>
              <Pressable onPress={() => setIsEditing(false)}>
                <Ionicons name="close" size={24} color={colors.textLight} />
              </Pressable>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Nombre de usuario</Text>
              <TextInput
                style={[
                  styles.input, 
                  { 
                    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#F7FAFC',
                    color: colors.textPrimary,
                    borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'
                  }
                ]}
                value={newName}
                onChangeText={setNewName}
                placeholder="Tu nombre"
                autoFocus
                placeholderTextColor={colors.textLight}
              />
            </View>

            <JewelButton 
              title="Guardar Cambios" 
              onPress={handleSaveProfile}
              style={{ marginTop: 20 }}
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
  profileHeader: {
    alignItems: 'center', marginBottom: 32, gap: 12,
  },
  avatarContainer: {
    marginBottom: 8, position: 'relative',
  },
  avatarGlow: {
    position: 'absolute', width: 100, height: 100, borderRadius: 50,
    backgroundColor: Colors.primary, opacity: 0.15,
    transform: [{ scale: 1.2 }], top: 0, left: 0,
  },
  avatarBorder: {
    width: 100, height: 100, borderRadius: 50,
    padding: 3, ...Shadows.medium,
  },
  avatarFill: {
    flex: 1, borderRadius: 50, justifyContent: 'center', alignItems: 'center',
  },
  avatarLetter: {
    fontSize: 40, fontWeight: '700', color: '#FFF', fontFamily: 'Poppins_700Bold',
  },
  editBadge: {
    position: 'absolute', bottom: 0, right: 0,
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: Colors.primary, borderWidth: 2, borderColor: '#FFF',
    justifyContent: 'center', alignItems: 'center',
    shadowColor: "#000", shadowOffset: {width:0, height:2}, shadowOpacity:0.2, shadowRadius:4, elevation:4
  },
  userName: {
    fontSize: 24, fontWeight: '700', color: Colors.textPrimary,
    fontFamily: 'Poppins_700Bold',
  },
  userEmail: {
    fontSize: 14, color: Colors.textLight, fontFamily: 'Poppins_400Regular',
  },
  editProfileBtn: {
    paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.03)', borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)',
  },
  editProfileText: {
    fontSize: 12, fontWeight: '600', color: Colors.textSecondary, fontFamily: 'Poppins_600SemiBold',
  },
  settingsCard: { padding: 0, overflow: 'hidden' },
  settingsItem: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    paddingVertical: 16, paddingHorizontal: 20,
  },
  settingsBorder: {
    borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.04)',
  },
  settingsIconWrap: {
    width: 38, height: 38, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center',
  },
  settingsLabel: {
    flex: 1, fontSize: 15, color: Colors.textPrimary,
    fontFamily: 'Poppins_500Medium',
  },
  toggleTrack: {
    width: 44, height: 24, borderRadius: 12, justifyContent: 'center',
  },
  toggleThumb: {
    position: 'absolute', width: 20, height: 20, borderRadius: 10,
    backgroundColor: '#FFF', shadowColor: "#000", shadowOffset: {width:0,height:1}, shadowOpacity:0.2, shadowRadius:2, elevation:2
  },
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, paddingVertical: 16, borderRadius: 20, overflow: 'hidden',
    borderWidth: 1, borderColor: 'rgba(229,62,62,0.15)',
  },
  logoutText: {
    fontSize: 15, fontWeight: '600', color: '#E53E3E', fontFamily: 'Poppins_600SemiBold',
  },
  footerSection: {
    alignItems: 'center', marginTop: 32, gap: 8, opacity: 0.7,
  },
  versionText: {
    fontSize: 12, color: Colors.textLight, fontFamily: 'Poppins_400Regular',
  },
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 30, borderTopRightRadius: 30,
    padding: 24, paddingBottom: 50,
    ...Shadows.large,
  },
  modalHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20, fontWeight: '700', color: Colors.textPrimary, fontFamily: 'Poppins_700Bold',
  },
  inputGroup: { gap: 8, marginBottom: 10 },
  inputLabel: {
    fontSize: 14, color: Colors.textSecondary, fontFamily: 'Poppins_500Medium',
  },
  input: {
    backgroundColor: '#F7FAFC',
    borderRadius: 16, padding: 16,
    fontSize: 16, color: Colors.textPrimary, fontFamily: 'Poppins_400Regular',
    borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)',
  },
});
