import React from 'react';
import { View, TextInput, Text, type TextInputProps } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { cn } from '../theme/utils';
import { useTheme } from '../providers/ThemeProvider';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  icon?: keyof typeof MaterialIcons.glyphMap;
  containerClassName?: string;
}

export function Input({
  label,
  error,
  icon,
  containerClassName,
  className,
  ...props
}: InputProps) {
  const { colors } = useTheme();

  return (
    <View className={cn('gap-2', containerClassName)}>
      {label && (
        <Text className="text-muted text-sm font-medium">{label}</Text>
      )}
      <View
        className={cn(
          'flex-row items-center bg-surface rounded-xl px-4 py-3 gap-3',
          error && 'border border-error'
        )}
      >
        {icon && (
          <MaterialIcons name={icon} size={20} color={colors.muted} />
        )}
        <TextInput
          placeholderTextColor={colors.muted}
          className={cn('flex-1 text-foreground text-base', className)}
          {...props}
        />
      </View>
      {error && (
        <Text className="text-error text-xs">{error}</Text>
      )}
    </View>
  );
}
