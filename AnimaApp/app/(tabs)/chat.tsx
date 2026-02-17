import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput, Pressable,
  KeyboardAvoidingView, Platform, Image,
} from 'react-native';
import Animated, { FadeInUp, FadeIn } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Gradients } from '../../constants/theme';
import { useTheme } from '../../hooks/useTheme';
import { ChatBubble, TypingIndicator, GlassCard, Mascot } from '../../components/ui';
import { ScreenWrapper } from '../../components/ScreenWrapper';
import { useStore } from '../../store/useStore';

const mascotAvatar = require('../../assets/images/mascot/empatico.png');

const QUICK_REPLIES = [
  'Me siento ansioso/a 😟',
  'Estoy bien hoy 😊',
  'Necesito hablar 💙',
  'Quiero relajarme 🍃',
];

export default function ChatScreen() {
  const { colors, isDark } = useTheme(); // NEW
  const messages = useStore((s) => s.messages);
  const isTyping = useStore((s) => s.isTyping);
  const sendMessage = useStore((s) => s.sendMessage);
  const [input, setInput] = useState('');
  const scrollRef = useRef<ScrollView>(null);

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    sendMessage(text);
    setInput('');
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 2000);
  };

  const handleQuickReply = (text: string) => {
    sendMessage(text);
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 2000);
  };

  return (
    <ScreenWrapper style={styles.container}>

      {/* Header */}
      <View style={[styles.header, { borderBottomColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' }]}>
        <View style={styles.headerAvatarWrap}>
          <Image source={mascotAvatar} style={styles.headerAvatar} resizeMode="contain" />
          {/* Online indicator dot */}
          <View style={styles.onlineDot} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Aníma</Text>
          <Text style={[styles.headerStatus, { color: colors.textLight }]}>
            {isTyping ? 'Escribiendo...' : 'Tu compañero emocional'}
          </Text>
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          ref={scrollRef}
          style={styles.messages}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
        >
          {/* Welcome state */}
          {messages.length === 0 && (
            <Animated.View entering={FadeIn.duration(600)} style={styles.welcomeSection}>
              <Mascot size={100} variant="empathetic" />
              <Text style={[styles.welcomeTitle, { color: colors.textPrimary }]}>¡Hola! Soy Aníma 💙</Text>
              <Text style={[styles.welcomeText, { color: colors.textSecondary }]}>
                Estoy aquí para acompañarte. Puedes contarme cómo te sientes o elegir una opción rápida.
              </Text>

              {/* Quick Reply Chips */}
              <View style={styles.quickReplies}>
                {QUICK_REPLIES.map((text, i) => (
                  <Animated.View key={i} entering={FadeInUp.delay(300 + i * 100).duration(300)}>
                    <Pressable 
                      style={[
                        styles.quickChip, 
                        { 
                          backgroundColor: isDark ? 'rgba(115,174,227,0.15)' : 'rgba(91,155,213,0.08)',
                          borderColor: isDark ? 'rgba(115,174,227,0.2)' : 'rgba(91,155,213,0.15)'
                        }
                      ]} 
                      onPress={() => handleQuickReply(text)}
                    >
                      <Text style={[styles.quickChipText, { color: colors.info }]}>{text}</Text>
                    </Pressable>
                  </Animated.View>
                ))}
              </View>
            </Animated.View>
          )}

          {/* Messages */}
          {messages.map((msg, i) => (
            <Animated.View key={msg.id} entering={FadeInUp.duration(300).delay(50)}>
              <ChatBubble
                text={msg.text}
                isUser={msg.sender === 'user'}
                showAvatar={msg.sender === 'bot' && (i === 0 || messages[i - 1]?.sender !== 'bot')}
              />
            </Animated.View>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <Animated.View entering={FadeIn.duration(200)}>
              <TypingIndicator />
            </Animated.View>
          )}

          <View style={{ height: 20 }} />
        </ScrollView>

        {/* Input Bar */}
        <View style={[
          styles.inputBar, 
          { 
            backgroundColor: colors.bgCard, // DYNAMIC
            borderTopColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' 
          }
        ]}>
          <TextInput
            style={[
              styles.input, 
              { 
                backgroundColor: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.03)',
                color: colors.textPrimary 
              }
            ]}
            placeholder="Escribe cómo te sientes..."
            placeholderTextColor={colors.textLight}
            value={input}
            onChangeText={setInput}
            onSubmitEditing={handleSend}
            returnKeyType="send"
            multiline
          />
          <Pressable onPress={handleSend} style={styles.sendBtn}>
            <LinearGradient colors={[...Gradients.jewel]} style={styles.sendGradient}>
              <Ionicons name="send" size={18} color="#FFF" />
            </LinearGradient>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 20, paddingTop: 56, paddingBottom: 12,
    borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.04)',
  },
  headerAvatarWrap: {
    position: 'relative',
  },
  headerAvatar: {
    width: 44, height: 44, borderRadius: 22,
  },
  onlineDot: {
    position: 'absolute', bottom: 0, right: 0,
    width: 10, height: 10, borderRadius: 5,
    backgroundColor: '#4ADE80',
    borderWidth: 2, borderColor: '#FFF',
  },
  headerTitle: {
    fontSize: 17, fontWeight: '700', color: Colors.textPrimary,
    fontFamily: 'Poppins_700Bold',
  },
  headerStatus: {
    fontSize: 12, color: Colors.textLight,
  },
  messages: { flex: 1 },
  messagesContent: { paddingHorizontal: 16, paddingTop: 16 },
  welcomeSection: {
    alignItems: 'center', paddingVertical: 32, gap: 12,
  },
  welcomeTitle: {
    fontSize: 20, fontWeight: '700', color: Colors.textPrimary,
    fontFamily: 'Poppins_700Bold',
  },
  welcomeText: {
    fontSize: 14, color: Colors.textSecondary, textAlign: 'center',
    lineHeight: 22, paddingHorizontal: 20,
  },
  quickReplies: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 8,
    justifyContent: 'center', marginTop: 8,
  },
  quickChip: {
    backgroundColor: 'rgba(91,155,213,0.08)',
    borderRadius: 20, paddingVertical: 10, paddingHorizontal: 16,
    borderWidth: 1, borderColor: 'rgba(91,155,213,0.15)',
  },
  quickChipText: {
    fontSize: 13, color: Colors.primary,
    fontFamily: 'Poppins_600SemiBold',
  },
  inputBar: {
    flexDirection: 'row', alignItems: 'flex-end', gap: 10,
    paddingHorizontal: 16, paddingVertical: 12,
    // Lift above floating tab bar (bottom: 24, height: 72 -> ~100px)
    marginBottom: Platform.OS === 'ios' ? 120 : 100,
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.04)',
    borderRadius: 24, // Make it floating too
    marginHorizontal: 16, // Inset from sides
  },
  input: {
    flex: 1, minHeight: 40, maxHeight: 100,
    backgroundColor: 'rgba(0,0,0,0.03)',
    borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10,
    fontSize: 14, color: Colors.textPrimary,
  },
  sendBtn: {},
  sendGradient: {
    width: 40, height: 40, borderRadius: 20,
    justifyContent: 'center', alignItems: 'center',
  },
});
