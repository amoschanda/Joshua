import React, { useCallback, useRef } from 'react';
import { View, Text, Dimensions, type ViewStyle } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { cn } from '../theme/utils';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const MAX_TRANSLATE_Y = -SCREEN_HEIGHT + 100;

interface BottomSheetProps {
  children: React.ReactNode;
  snapPoints?: number[];
  initialSnap?: number;
  onClose?: () => void;
  className?: string;
  style?: ViewStyle;
}

export function BottomSheet({
  children,
  snapPoints = [0.5, 0.9],
  initialSnap = 0,
  onClose,
  className,
  style,
}: BottomSheetProps) {
  const translateY = useSharedValue(0);
  const context = useRef({ y: 0 });

  const scrollTo = useCallback((destination: number) => {
    'worklet';
    translateY.value = withSpring(destination, { damping: 50 });
  }, []);

  const gesture = Gesture.Pan()
    .onStart(() => {
      context.current = { y: translateY.value };
    })
    .onUpdate((event) => {
      translateY.value = event.translationY + context.current.y;
      translateY.value = Math.max(translateY.value, MAX_TRANSLATE_Y);
    })
    .onEnd(() => {
      if (translateY.value > -SCREEN_HEIGHT / 3) {
        scrollTo(0);
        if (onClose) runOnJS(onClose)();
      } else if (translateY.value > -SCREEN_HEIGHT / 1.5) {
        scrollTo(-SCREEN_HEIGHT * snapPoints[0]);
      } else {
        scrollTo(MAX_TRANSLATE_Y);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        className={cn(
          'absolute w-full bg-surface rounded-t-3xl',
          className
        )}
        style={[
          {
            height: SCREEN_HEIGHT,
            top: SCREEN_HEIGHT,
          },
          animatedStyle,
          style,
        ]}
      >
        <View className="items-center py-3">
          <View className="w-12 h-1.5 bg-muted/50 rounded-full" />
        </View>
        {children}
      </Animated.View>
    </GestureDetector>
  );
}
