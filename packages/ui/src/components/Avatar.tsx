import React from 'react';
import { View, Text, Image, type ViewStyle } from 'react-native';
import { cn } from '../theme/utils';

interface AvatarProps {
  name?: string;
  imageUrl?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  style?: ViewStyle;
}

export function Avatar({ name, imageUrl, size = 'md', style }: AvatarProps) {
  const sizeStyles = {
    sm: 'w-8 h-8',
    md: 'w-11 h-11',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-xl',
    xl: 'text-3xl',
  };

  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?';

  if (imageUrl) {
    return (
      <Image
        source={{ uri: imageUrl }}
        className={cn('rounded-full', sizeStyles[size])}
        style={style}
      />
    );
  }

  return (
    <View
      className={cn(
        'rounded-full bg-primary items-center justify-center',
        sizeStyles[size]
      )}
      style={style}
    >
      <Text className={cn('text-background font-bold', textSizes[size])}>
        {initials}
      </Text>
    </View>
  );
}
