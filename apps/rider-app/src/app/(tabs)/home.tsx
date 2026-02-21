import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { MapComponent } from '@/components/map-component';
import { useColors } from '@/hooks/use-colors';
import { useRiderStore, type Driver, type Ride } from '@/lib/store';
import { MaterialIcons } from '@expo/vector-icons';

// Generate mock nearby drivers
function generateMockDrivers(userLat: number, userLng: number): Driver[] {
  const names = ['Alex D.', 'Maria S.', 'James K.', 'Linda P.', 'Robert M.'];
  const vehicles = ['Toyota Camry', 'Honda Civic', 'Tesla Model 3', 'Ford Fusion', 'Hyundai Sonata'];
  
  return names.map((name, i) => ({
    id: `driver_${i}`,
    name,
    phone: `+1555${1000000 + i}`,
    rating: 4.5 + Math.random() * 0.5,
    vehicleType: vehicles[i],
    vehicleNumber: `ABC-${1000 + i}`,
    latitude: userLat + (Math.random() - 0.5) * 0.02,
    longitude: userLng + (Math.random() - 0.5) * 0.02,
    eta: 2 + Math.floor(Math.random() * 8),
  }));
}

export default function HomeScreen() {
  const colors = useColors();
  const { currentRider, activeRide, setActiveRide, nearbyDrivers, setNearbyDrivers, setCurrentLocation, addToHistory, persist } = useRiderStore();
  
  const [destination, setDestination] = useState('');
  const [estimatedFare, setEstimatedFare] = useState<number | null>(null);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  // Calculate fare based on destination length (mock)
  const calculateFare = (dest: string) => {
    const baseFare = 4;
    const perUnitFare = 1.5;
    return Math.max(baseFare, baseFare + dest.length * 0.3 * perUnitFare);
  };

  // Generate nearby drivers when location is available
  useEffect(() => {
    if (userLocation && nearbyDrivers.length === 0) {
      const drivers = generateMockDrivers(userLocation.latitude, userLocation.longitude);
      setNearbyDrivers(drivers);
    }
  }, [userLocation]);

  const handleRequestRide = () => {
    if (!destination.trim()) {
      Alert.alert('Error', 'Please enter a destination');
      return;
    }
    if (!userLocation) {
      Alert.alert('Error', 'Location not available');
      return;
    }

    // Pick a random driver
    const driver = nearbyDrivers[Math.floor(Math.random() * nearbyDrivers.length)];
    
    const ride: Ride = {
      id: `ride_${Date.now()}`,
      driverId: driver.id,
      driverName: driver.name,
      driverPhone: driver.phone,
      driverRating: driver.rating,
      vehicleType: driver.vehicleType,
      vehicleNumber: driver.vehicleNumber,
      pickupLatitude: userLocation.latitude,
      pickupLongitude: userLocation.longitude,
      pickupAddress: 'Current Location',
      dropoffLatitude: userLocation.latitude + 0.02,
      dropoffLongitude: userLocation.longitude + 0.02,
      dropoffAddress: destination,
      estimatedFare: estimatedFare || 10,
      estimatedDistance: 5 + Math.random() * 10,
      estimatedTime: driver.eta + 10 + Math.floor(Math.random() * 15),
      status: 'accepted',
      driverEta: driver.eta,
      createdAt: new Date().toISOString(),
    };

    setActiveRide(ride);
    Alert.alert('Ride Confirmed!', `${driver.name} is on the way!\nETA: ${driver.eta} minutes`);
  };

  const handleCancelRide = () => {
    if (activeRide) {
      addToHistory({ ...activeRide, status: 'cancelled' });
      setActiveRide(null);
      persist();
    }
  };

  const handleCompleteRide = () => {
    if (activeRide) {
      Alert.alert('Ride Completed', `Total: $${activeRide.estimatedFare.toFixed(2)}\nThank you for riding with Joshua!`);
      addToHistory({ ...activeRide, status: 'completed' });
      setActiveRide(null);
      setDestination('');
      setEstimatedFare(null);
      persist();
    }
  };

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: colors.muted }]}>Welcome back</Text>
            <Text style={[styles.name, { color: colors.foreground }]}>{currentRider?.name}</Text>
          </View>
        </View>

        {/* Map */}
        <MapComponent
          height={280}
          showUserLocation
          nearbyDrivers={activeRide ? [] : nearbyDrivers}
          onLocationChange={(loc) => {
            setUserLocation(loc);
            setCurrentLocation(loc);
          }}
        />

        {/* Active Ride */}
        {activeRide ? (
          <View style={[styles.rideCard, { backgroundColor: 'rgba(118, 219, 163, 0.15)' }]}>
            <View style={styles.rideHeader}>
              <MaterialIcons name="check-circle" size={24} color={colors.success} />
              <Text style={[styles.rideTitle, { color: colors.foreground }]}>Ride in Progress</Text>
            </View>
            <View style={styles.driverInfo}>
              <View style={[styles.driverAvatar, { backgroundColor: colors.primary }]}>
                <Text style={styles.driverAvatarText}>{activeRide.driverName?.charAt(0)}</Text>
              </View>
              <View style={styles.driverDetails}>
                <Text style={[styles.driverName, { color: colors.foreground }]}>{activeRide.driverName}</Text>
                <Text style={[styles.vehicleInfo, { color: colors.muted }]}>{activeRide.vehicleType} • {activeRide.vehicleNumber}</Text>
              </View>
              <View style={styles.etaBox}>
                <Text style={[styles.etaValue, { color: colors.primary }]}>{activeRide.driverEta}</Text>
                <Text style={[styles.etaLabel, { color: colors.muted }]}>min</Text>
              </View>
            </View>
            <View style={styles.routeInfo}>
              <View style={styles.routeRow}>
                <MaterialIcons name="radio-button-checked" size={14} color={colors.success} />
                <Text style={[styles.routeText, { color: colors.foreground }]}>{activeRide.pickupAddress}</Text>
              </View>
              <View style={styles.routeRow}>
                <MaterialIcons name="location-on" size={14} color={colors.error} />
                <Text style={[styles.routeText, { color: colors.foreground }]}>{activeRide.dropoffAddress}</Text>
              </View>
            </View>
            <View style={styles.rideActions}>
              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: colors.error }]}
                onPress={handleCancelRide}
              >
                <Text style={styles.actionBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: colors.success }]}
                onPress={handleCompleteRide}
              >
                <Text style={styles.actionBtnText}>Complete Ride</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <>
            {/* Destination Input */}
            <View style={[styles.inputCard, { backgroundColor: colors.surface }]}>
              <Text style={[styles.inputLabel, { color: colors.muted }]}>Where to?</Text>
              <View style={[styles.inputRow, { backgroundColor: 'rgba(255, 255, 255, 0.05)' }]}>
                <MaterialIcons name="location-on" size={20} color={colors.primary} />
                <TextInput
                  style={[styles.input, { color: colors.foreground }]}
                  placeholder="Enter destination"
                  placeholderTextColor={colors.muted}
                  value={destination}
                  onChangeText={(text) => {
                    setDestination(text);
                    if (text.length > 0) {
                      setEstimatedFare(calculateFare(text));
                    } else {
                      setEstimatedFare(null);
                    }
                  }}
                />
              </View>
            </View>

            {/* Fare Estimate */}
            {estimatedFare !== null && (
              <View style={[styles.fareCard, { backgroundColor: colors.surface }]}>
                <View style={styles.fareRow}>
                  <Text style={[styles.fareLabel, { color: colors.muted }]}>Estimated Fare</Text>
                  <Text style={[styles.fareValue, { color: colors.primary }]}>${estimatedFare.toFixed(2)}</Text>
                </View>
                <Text style={[styles.fareNote, { color: colors.muted }]}>Final fare may vary based on route</Text>
              </View>
            )}

            {/* Quick Destinations */}
            <View style={styles.quickDest}>
              <Text style={[styles.sectionTitle, { color: colors.muted }]}>Quick Destinations</Text>
              {['Downtown Plaza', 'Airport', 'Shopping Mall', 'Central Station'].map((place, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={[styles.quickItem, { backgroundColor: colors.surface }]}
                  onPress={() => {
                    setDestination(place);
                    setEstimatedFare(calculateFare(place));
                  }}
                >
                  <MaterialIcons name="place" size={18} color={colors.primary} />
                  <Text style={[styles.quickText, { color: colors.foreground }]}>{place}</Text>
                  <MaterialIcons name="chevron-right" size={18} color={colors.muted} />
                </TouchableOpacity>
              ))}
            </View>

            {/* Request Button */}
            <TouchableOpacity
              style={[
                styles.requestBtn,
                { backgroundColor: destination.trim() ? colors.primary : 'rgba(255, 212, 71, 0.3)' },
              ]}
              onPress={handleRequestRide}
              disabled={!destination.trim()}
              activeOpacity={0.8}
            >
              <Text style={[styles.requestBtnText, { color: destination.trim() ? '#0f1422' : colors.muted }]}>
                Request Ride
              </Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: { paddingBottom: 24, gap: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  greeting: { fontSize: 14 },
  name: { fontSize: 24, fontWeight: 'bold' },
  inputCard: { padding: 16, borderRadius: 16, gap: 12 },
  inputLabel: { fontSize: 12, fontWeight: '600' },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: 10 },
  input: { flex: 1, fontSize: 16 },
  fareCard: { padding: 16, borderRadius: 16 },
  fareRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  fareLabel: { fontSize: 13 },
  fareValue: { fontSize: 24, fontWeight: 'bold' },
  fareNote: { fontSize: 11, marginTop: 4 },
  quickDest: { gap: 10 },
  sectionTitle: { fontSize: 12, fontWeight: '600' },
  quickItem: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 12, gap: 12 },
  quickText: { flex: 1, fontSize: 14 },
  requestBtn: { padding: 16, borderRadius: 12, alignItems: 'center' },
  requestBtnText: { fontSize: 16, fontWeight: 'bold' },
  rideCard: { padding: 16, borderRadius: 16, gap: 16 },
  rideHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  rideTitle: { fontSize: 18, fontWeight: '600' },
  driverInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  driverAvatar: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  driverAvatarText: { color: '#0f1422', fontSize: 18, fontWeight: 'bold' },
  driverDetails: { flex: 1 },
  driverName: { fontSize: 15, fontWeight: '600' },
  vehicleInfo: { fontSize: 12 },
  etaBox: { alignItems: 'center' },
  etaValue: { fontSize: 24, fontWeight: 'bold' },
  etaLabel: { fontSize: 10 },
  routeInfo: { gap: 8, paddingTop: 12, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)' },
  routeRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  routeText: { fontSize: 13 },
  rideActions: { flexDirection: 'row', gap: 12 },
  actionBtn: { flex: 1, padding: 14, borderRadius: 10, alignItems: 'center' },
  actionBtnText: { color: '#fff', fontSize: 14, fontWeight: '600' },
});
