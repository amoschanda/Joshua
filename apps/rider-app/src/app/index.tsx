import React from 'react';
import { Redirect } from 'expo-router';
import { useRiderStore } from '@/lib/store';

export default function Index() {
  const { isAuthenticated } = useRiderStore();

  if (isAuthenticated) {
    return <Redirect href="/(tabs)/home" />;
  }

  return <Redirect href="/(auth)/welcome" />;
}
