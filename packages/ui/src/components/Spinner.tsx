import React from 'react';
import { ActivityIndicator, View, type ViewStyle } from 'react-native';
import { cn } from '../theme/utils';

interface SpinnerProps {
  size?: 'small' | 'large';
  color?: string;
  fullScreen?: boolean;
  style?: ViewStyle;
}

export function Spinner({
  size = 'small',
  color = '#FFD447',
  fullScreen = false,
  style,
}: SpinnerProps) {
  if (fullScreen) {
    return (
      <View
        className="flex-1 items-center justify-center bg-background"
        style={style}
      >
        <ActivityIndicator size={size} color={color} />
      </View>
    );
  }

  return <ActivityIndicator size={size} color={color} style={style} />;
}
