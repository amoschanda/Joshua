import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, type ViewStyle } from 'react-native';
import { cn } from '../theme/utils';

interface ButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  testID?: string;
}

export function Button({
  children,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  testID,
}: ButtonProps) {
  const baseStyles = 'rounded-xl items-center justify-center flex-row';
  
  const variantStyles = {
    primary: 'bg-primary',
    secondary: 'bg-surface',
    outline: 'border border-primary bg-transparent',
    ghost: 'bg-transparent',
    danger: 'bg-error',
  };
  
  const sizeStyles = {
    sm: 'px-4 py-2',
    md: 'px-6 py-3',
    lg: 'px-8 py-4',
  };
  
  const textStyles = {
    primary: 'text-background font-semibold',
    secondary: 'text-foreground font-semibold',
    outline: 'text-primary font-semibold',
    ghost: 'text-foreground font-medium',
    danger: 'text-white font-semibold',
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      testID={testID}
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && 'w-full',
        (disabled || loading) && 'opacity-50'
      )}
      style={style}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? '#0f1422' : '#FFD447'}
          size="small"
        />
      ) : (
        <Text className={cn(textStyles[variant], textSizes[size])}>
          {children}
        </Text>
      )}
    </TouchableOpacity>
  );
}
