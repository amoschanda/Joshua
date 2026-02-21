import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Switch, StyleSheet, Alert } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { MapComponent } from '@/components/map-component';
import { useColors } from '@/hooks/use-colors';
import { useDriverStore } from '@/lib/store';
import { MaterialIcons } from '@expo/vector-icons';

export default function HomeScreen() {
  const colors = useColors();
  const { currentDriver, isOnline, setIsOnline, todayEarnings, todayRides, setCurrentLocation, persist } = useDriverStore();

  const handleToggleOnline = async (value: boolean) => {
    setIsOnline(value);
    await persist();
    Alert.alert(value ? 'You are now online' : 'You are now offline', value ? 'You will receive ride requests' : 'You will not receive ride requests');
  };

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: colors.muted }]}>Welcome back</Text>
            <Text style={[styles.name, { color: colors.foreground }]}>{currentDriver?.name}</Text>
          </View>
          <View style={[styles.ratingBadge, { backgroundColor: colors.surface }]}>
            <MaterialIcons name="star" size={16} color={colors.primary} />
            <Text style={[styles.ratingText, { color: colors.foreground }]}>{currentDriver?.rating.toFixed(1)}</Text>
          </View>
        </View>

        {/* Online Toggle */}
        <View style={[styles.onlineCard, { backgroundColor: colors.surface }]}>
          <View style={styles.onlineInfo}>
            <View style={[styles.statusDot, { backgroundColor: isOnline ? colors.success : colors.error }]} />
            <View>
              <Text style={[styles.onlineTitle, { color: colors.foreground }]}>{isOnline ? 'Online' : 'Offline'}</Text>
              <Text style={[styles.onlineSubtitle, { color: colors.muted }]}>
                {isOnline ? 'Accepting ride requests' : 'Not accepting rides'}
              </Text>
            </View>
          </View>
          <Switch
            value={isOnline}
            onValueChange={handleToggleOnline}
            trackColor={{ false: '#767577', true: colors.primary }}
            thumbColor="#fff"
          />
        </View>

        {/* Today Stats */}
        <Text style={[styles.sectionTitle, { color: colors.muted }]}>Today's Summary</Text>
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
            <MaterialIcons name="attach-money" size={24} color={colors.success} />
            <Text style={[styles.statValue, { color: colors.foreground }]}>${todayEarnings.toFixed(2)}</Text>
            <Text style={[styles.statLabel, { color: colors.muted }]}>Earnings</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
            <MaterialIcons name="local-taxi" size={24} color={colors.primary} />
            <Text style={[styles.statValue, { color: colors.foreground }]}>{todayRides}</Text>
            <Text style={[styles.statLabel, { color: colors.muted }]}>Rides</Text>
          </View>
        </View>

        {/* Map */}
        <Text style={[styles.sectionTitle, { color: colors.muted }]}>Your Location</Text>
        <MapComponent
          height={250}
          showUserLocation
          onLocationChange={(loc) => setCurrentLocation(loc)}
        />

        {/* Vehicle Info */}
        <View style={[styles.vehicleCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.vehicleTitle, { color: colors.muted }]}>Your Vehicle</Text>
          <View style={styles.vehicleRow}>
            <Text style={[styles.vehicleLabel, { color: colors.foreground }]}>Type</Text>
            <Text style={[styles.vehicleValue, { color: colors.foreground }]}>{currentDriver?.vehicleType}</Text>
          </View>
          <View style={styles.vehicleRow}>
            <Text style={[styles.vehicleLabel, { color: colors.foreground }]}>Number</Text>
            <Text style={[styles.vehicleValue, { color: colors.foreground }]}>{currentDriver?.vehicleNumber}</Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 24,
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 14,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
  },
  onlineCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
  },
  onlineInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  onlineTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  onlineSubtitle: {
    fontSize: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 8,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    gap: 8,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
  },
  vehicleCard: {
    padding: 16,
    borderRadius: 16,
    gap: 12,
  },
  vehicleTitle: {
    fontSize: 12,
    fontWeight: '600',
  },
  vehicleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  vehicleLabel: {
    fontSize: 14,
  },
  vehicleValue: {
    fontSize: 14,
    fontWeight: '600',
  },
});
