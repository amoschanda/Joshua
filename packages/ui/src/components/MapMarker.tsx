import React from 'react';
import { View, Text, type ViewStyle } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { cn } from '../theme/utils';

interface MapMarkerProps {
  type: 'driver' | 'pickup' | 'dropoff' | 'user';
  label?: string;
  eta?: number;
  style?: ViewStyle;
}

export function MapMarker({ type, label, eta, style }: MapMarkerProps) {
  const config = {
    driver: {
      icon: 'local-taxi' as const,
      bgColor: 'bg-primary',
      iconColor: '#0f1422',
    },
    pickup: {
      icon: 'radio-button-checked' as const,
      bgColor: 'bg-success',
      iconColor: '#fff',
    },
    dropoff: {
      icon: 'location-on' as const,
      bgColor: 'bg-error',
      iconColor: '#fff',
    },
    user: {
      icon: 'person' as const,
      bgColor: 'bg-info',
      iconColor: '#fff',
    },
  };

  const { icon, bgColor, iconColor } = config[type];

  return (
    <View className="items-center" style={style}>
      <View
        className={cn(
          'w-10 h-10 rounded-full items-center justify-center',
          bgColor
        )}
      >
        <MaterialIcons name={icon} size={22} color={iconColor} />
      </View>
      {label && (
        <View className="bg-background/90 px-2 py-1 rounded-md mt-1">
          <Text className="text-foreground text-xs font-medium">{label}</Text>
        </View>
      )}
      {eta !== undefined && (
        <View className="bg-primary px-2 py-1 rounded-md mt-1">
          <Text className="text-background text-xs font-bold">{eta} min</Text>
        </View>
      )}
    </View>
  );
}
