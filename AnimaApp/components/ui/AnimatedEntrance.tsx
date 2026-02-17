import React from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';
import { MotiView } from 'moti';

interface AnimatedEntranceProps {
  children: React.ReactNode;
  index?: number;
  delay?: number;
  style?: StyleProp<ViewStyle>;
  from?: 'bottom' | 'top' | 'left' | 'right';
}

export function AnimatedEntrance({ children, index = 0, delay = 100, style, from = 'bottom' }: AnimatedEntranceProps) {
  const getFromTransform = () => {
    switch (from) {
      case 'bottom': return { translateY: 50 };
      case 'top': return { translateY: -50 };
      case 'left': return { translateX: -50 };
      case 'right': return { translateX: 50 };
    }
  };

  return (
    <MotiView
      from={{ opacity: 0, ...getFromTransform() }}
      animate={{ opacity: 1, translateY: 0, translateX: 0 }}
      transition={{
        type: 'spring',
        delay: index * delay,
        damping: 20,
        stiffness: 100,
      }}
      style={style}
    >
      {children}
    </MotiView>
  );
}
