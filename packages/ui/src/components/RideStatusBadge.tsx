import React from 'react';
import { View, Text } from 'react-native';
import { cn } from '../theme/utils';

type RideStatus = 'pending' | 'accepted' | 'arriving' | 'in_progress' | 'completed' | 'cancelled';

interface RideStatusBadgeProps {
  status: RideStatus;
  size?: 'sm' | 'md' | 'lg';
}

export function RideStatusBadge({ status, size = 'md' }: RideStatusBadgeProps) {
  const config: Record<RideStatus, { label: string; bgClass: string; textClass: string }> = {
    pending: {
      label: 'Searching',
      bgClass: 'bg-warning/20',
      textClass: 'text-warning',
    },
    accepted: {
      label: 'Driver Assigned',
      bgClass: 'bg-info/20',
      textClass: 'text-info',
    },
    arriving: {
      label: 'Driver Arriving',
      bgClass: 'bg-primary/20',
      textClass: 'text-primary',
    },
    in_progress: {
      label: 'In Progress',
      bgClass: 'bg-success/20',
      textClass: 'text-success',
    },
    completed: {
      label: 'Completed',
      bgClass: 'bg-success/20',
      textClass: 'text-success',
    },
    cancelled: {
      label: 'Cancelled',
      bgClass: 'bg-error/20',
      textClass: 'text-error',
    },
  };

  const sizeStyles = {
    sm: 'px-2 py-1',
    md: 'px-3 py-1.5',
    lg: 'px-4 py-2',
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  const { label, bgClass, textClass } = config[status];

  return (
    <View className={cn('rounded-full', bgClass, sizeStyles[size])}>
      <Text className={cn('font-semibold', textClass, textSizes[size])}>
        {label}
      </Text>
    </View>
  );
}
