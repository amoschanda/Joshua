import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, RefreshControl } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { RideRequestCard } from '@/components/ride-request-card';
import { useColors } from '@/hooks/use-colors';
import { useDriverStore, type RideRequest } from '@/lib/store';
import { MaterialIcons } from '@expo/vector-icons';

function generateMockRequests(): RideRequest[] {
  const names = ['Sarah M.', 'Michael K.', 'Jennifer L.', 'David R.', 'Emma W.'];
  const pickups = ['123 Market St', '456 Mission St', '789 Howard St', '321 Powell St'];
  const dropoffs = ['Airport SFO', 'Downtown Plaza', 'Golden Gate Park', 'Fisherman\'s Wharf'];

  return Array.from({ length: 3 }, (_, i) => ({
    id: `req_${Date.now()}_${i}`,
    riderId: `rider_${i}`,
    riderName: names[i % names.length],
    riderPhone: `+1555${1000000 + i}`,
    riderRating: 4.5 + Math.random() * 0.5,
    pickupLatitude: 37.7749 + (Math.random() - 0.5) * 0.02,
    pickupLongitude: -122.4194 + (Math.random() - 0.5) * 0.02,
    pickupAddress: pickups[i % pickups.length],
    dropoffLatitude: 37.7849 + (Math.random() - 0.5) * 0.02,
    dropoffLongitude: -122.4094 + (Math.random() - 0.5) * 0.02,
    dropoffAddress: dropoffs[i % dropoffs.length],
    estimatedFare: 10 + Math.random() * 25,
    estimatedDistance: 2 + Math.random() * 8,
    estimatedTime: 8 + Math.floor(Math.random() * 15),
    status: 'pending' as const,
    createdAt: new Date().toISOString(),
  }));
}

export default function DispatchScreen() {
  const colors = useColors();
  const {
    isOnline,
    pendingRequests,
    setPendingRequests,
    removePendingRequest,
    setActiveRide,
    addToHistory,
    setTodayEarnings,
    setTodayRides,
    todayEarnings,
    todayRides,
    persist,
  } = useDriverStore();

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (isOnline && pendingRequests.length === 0) {
      setPendingRequests(generateMockRequests());
    }
  }, [isOnline]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      if (isOnline) {
        setPendingRequests(generateMockRequests());
      }
      setRefreshing(false);
    }, 1000);
  }, [isOnline]);

  const handleAccept = async (request: RideRequest) => {
    removePendingRequest(request.id);
    setActiveRide({ ...request, status: 'accepted' });
    Alert.alert(
      'Ride Accepted!',
      `Navigate to ${request.pickupAddress} to pick up ${request.riderName}`
    );
  };

  const handleDecline = (requestId: string) => {
    removePendingRequest(requestId);
  };

  return (
    <ScreenContainer>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.foreground }]}>Dispatch</Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: isOnline ? 'rgba(118, 219, 163, 0.2)' : 'rgba(255, 107, 107, 0.2)' },
            ]}
          >
            <View
              style={[styles.statusDot, { backgroundColor: isOnline ? colors.success : colors.error }]}
            />
            <Text
              style={[styles.statusText, { color: isOnline ? colors.success : colors.error }]}
            >
              {isOnline ? 'Online' : 'Offline'}
            </Text>
          </View>
        </View>

        {!isOnline ? (
          <View style={[styles.offlineCard, { backgroundColor: colors.surface }]}>
            <MaterialIcons name="wifi-off" size={48} color={colors.muted} />
            <Text style={[styles.offlineTitle, { color: colors.foreground }]}>
              You're Offline
            </Text>
            <Text style={[styles.offlineText, { color: colors.muted }]}>
              Go online from the Home screen to start receiving ride requests
            </Text>
          </View>
        ) : pendingRequests.length === 0 ? (
          <View style={[styles.emptyCard, { backgroundColor: colors.surface }]}>
            <MaterialIcons name="hourglass-empty" size={48} color={colors.muted} />
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
              No Pending Requests
            </Text>
            <Text style={[styles.emptyText, { color: colors.muted }]}>
              New ride requests will appear here
            </Text>
          </View>
        ) : (
          <View style={styles.requestsContainer}>
            <Text style={[styles.sectionTitle, { color: colors.muted }]}>
              {pendingRequests.length} Pending Request{pendingRequests.length > 1 ? 's' : ''}
            </Text>
            {pendingRequests.map((request) => (
              <RideRequestCard
                key={request.id}
                request={request}
                onAccept={() => handleAccept(request)}
                onDecline={() => handleDecline(request.id)}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: { paddingBottom: 24, gap: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold' },
  statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, gap: 6 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusText: { fontSize: 13, fontWeight: '600' },
  offlineCard: { padding: 40, borderRadius: 16, alignItems: 'center', gap: 12, marginTop: 60 },
  offlineTitle: { fontSize: 20, fontWeight: '600' },
  offlineText: { fontSize: 14, textAlign: 'center' },
  emptyCard: { padding: 40, borderRadius: 16, alignItems: 'center', gap: 12, marginTop: 60 },
  emptyTitle: { fontSize: 20, fontWeight: '600' },
  emptyText: { fontSize: 14, textAlign: 'center' },
  requestsContainer: { gap: 12 },
  sectionTitle: { fontSize: 13, fontWeight: '600' },
});
