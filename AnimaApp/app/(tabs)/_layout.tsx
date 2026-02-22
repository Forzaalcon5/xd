import React from 'react';
import { Tabs } from 'expo-router';
import { View, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/theme';
import { useTheme } from '../../hooks/useTheme';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { AdaptiveSOSButton } from '../../components/AdaptiveSOS';

function TabIcon({ name, color, focused, size }: {
  name: string; color: string; focused: boolean; size: number;
}) {
  const scale = useSharedValue(focused ? 1.18 : 1);
  const translateY = useSharedValue(focused ? -2 : 0);

  React.useEffect(() => {
    scale.value = withSpring(focused ? 1.2 : 1, { damping: 12 });
    translateY.value = withSpring(focused ? -4 : 0, { damping: 12 });
  }, [focused]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateY: translateY.value }],
  }));

  const indicatorStyle = useAnimatedStyle(() => ({
    opacity: withSpring(focused ? 1 : 0),
    transform: [{ scale: withSpring(focused ? 1 : 0) }],
  }));

  return (
    <View style={styles.iconContainer}>
      <Animated.View style={[styles.tabIconWrap, animStyle]}>
        <Ionicons name={name as any} size={size || 24} color={color} />
      </Animated.View>
      <Animated.View style={[styles.activeDot, { backgroundColor: color }, indicatorStyle]} />
    </View>
  );
}

export default function TabsLayout() {
  const { colors, isDark } = useTheme(); // NEW

  return (
    <>
      <Tabs
        screenOptions={{
          sceneStyle: { backgroundColor: 'transparent' },
          headerShown: false,
          tabBarActiveTintColor: isDark ? Colors.primary : Colors.primary, // Keep primary or adjust for dark
        tabBarInactiveTintColor: isDark ? colors.textLight : Colors.textLight,
        tabBarStyle: {
          position: 'absolute',
          bottom: 24, // Floating from bottom
          left: 24,
          right: 24,
          height: 72,
          borderRadius: 40,
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          ...styles.shadow,
        },
        tabBarBackground: () => (
          <View style={{
            flex: 1,
            borderRadius: 40,
            overflow: 'hidden',
            // DYNAMIC BACKGROUND: Use bgCard (which is now solid #2C2847 in dark mode)
            backgroundColor: colors.bgCard, 
            ...styles.shadow, 
          }} />
        ),
        tabBarShowLabel: false,
        tabBarItemStyle: {
          height: 72,
          justifyContent: 'center',
          alignItems: 'center',
          paddingVertical: 0,
          paddingTop: 12, 
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name={focused ? 'home' : 'home-outline'} color={color} focused={focused} size={28} />
          ),
        }}
      />
      <Tabs.Screen
        name="actividades"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name={focused ? 'sparkles' : 'sparkles-outline'} color={color} focused={focused} size={28} />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name={focused ? 'chatbubbles' : 'chatbubbles-outline'} color={color} focused={focused} size={28} />
          ),
        }}
      />
      <Tabs.Screen
        name="registro"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name={focused ? 'journal' : 'journal-outline'} color={color} focused={focused} size={28} />
          ),
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name={focused ? 'person' : 'person-outline'} color={color} focused={focused} size={28} />
          ),
        }}
      />
    </Tabs>
    <AdaptiveSOSButton />
    </>
  );
}

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#5B9BD5',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: 50,
  },
  tabIconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    position: 'absolute',
    bottom: -10, // Adjusted for larger size
  },
});
