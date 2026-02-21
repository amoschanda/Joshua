import React from 'react';
import { View, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { cn } from '../theme/utils';

interface ScreenContainerProps {
  children: React.ReactNode;
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
  padding?: boolean;
  className?: string;
  style?: ViewStyle;
}

export function ScreenContainer({
  children,
  edges = ['top'],
  padding = true,
  className,
  style,
}: ScreenContainerProps) {
  const insets = useSafeAreaInsets();

  const paddingStyle = {
    paddingTop: edges.includes('top') ? insets.top : 0,
    paddingBottom: edges.includes('bottom') ? insets.bottom : 0,
    paddingLeft: edges.includes('left') ? insets.left : 0,
    paddingRight: edges.includes('right') ? insets.right : 0,
  };

  return (
    <View
      className={cn('flex-1 bg-background', padding && 'px-4', className)}
      style={[paddingStyle, style]}
    >
      {children}
    </View>
  );
}
