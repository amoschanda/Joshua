import React from 'react';
import { Redirect } from 'expo-router';
import { useDriverStore } from '@/lib/store';

export default function Index() {
  const { isAuthenticated } = useDriverStore();

  if (isAuthenticated) {
    return <Redirect href="/(tabs)/home" />;
  }

  return <Redirect href="/(auth)/welcome" />;
}
