import React from 'react';
import { View, type ViewStyle } from 'react-native';
import { cn } from '../theme/utils';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'outlined' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
  style?: ViewStyle;
  testID?: string;
}

export function Card({
  children,
  variant = 'default',
  padding = 'md',
  className,
  style,
  testID,
}: CardProps) {
  const variantStyles = {
    default: 'bg-surface',
    outlined: 'bg-transparent border border-surface',
    elevated: 'bg-surface shadow-lg',
  };
  
  const paddingStyles = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  return (
    <View
      testID={testID}
      className={cn(
        'rounded-xl',
        variantStyles[variant],
        paddingStyles[padding],
        className
      )}
      style={style}
    >
      {children}
    </View>
  );
}
