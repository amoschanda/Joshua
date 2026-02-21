import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { MaterialIcons } from '@expo/vector-icons';
import { useColors } from '@/hooks/use-colors';
import { useLocation } from '@/hooks/use-location';
import { type Driver } from '@/lib/store';

interface MapComponentProps {
  height?: number;
  showUserLocation?: boolean;
  onLocationChange?: (location: { latitude: number; longitude: number }) => void;
  nearbyDrivers?: Driver[];
  pickupLocation?: { latitude: number; longitude: number; address: string };
  dropoffLocation?: { latitude: number; longitude: number; address: string };
}

export function MapComponent({
  height = 300,
  showUserLocation = true,
  onLocationChange,
  nearbyDrivers = [],
  pickupLocation,
  dropoffLocation,
}: MapComponentProps) {
  const colors = useColors();
  const mapRef = useRef<MapView>(null);
  const { location, loading, requestPermission, startTracking, stopTracking } = useLocation();
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    requestPermission().then((granted) => {
      if (granted) startTracking();
    });
    return () => stopTracking();
  }, []);

  useEffect(() => {
    if (location && onLocationChange) {
      onLocationChange({ latitude: location.latitude, longitude: location.longitude });
    }
  }, [location]);

  useEffect(() => {
    if (mapReady && location) {
      mapRef.current?.animateToRegion(
        {
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        },
        1000
      );
    }
  }, [mapReady, location]);

  const handleRecenter = () => {
    if (location) {
      mapRef.current?.animateToRegion(
        {
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        },
        500
      );
    }
  };

  const initialRegion: Region = {
    latitude: location?.latitude || 40.7128,
    longitude: location?.longitude || -74.006,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  return (
    <View style={[styles.container, { height }]}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={initialRegion}
        onMapReady={() => setMapReady(true)}
        showsUserLocation={false}
        showsMyLocationButton={false}
      >
        {showUserLocation && location && (
          <Marker
            coordinate={{ latitude: location.latitude, longitude: location.longitude }}
            title="Your Location"
          >
            <View style={[styles.userMarker, { backgroundColor: colors.primary }]}>
              <View style={styles.userMarkerDot} />
            </View>
          </Marker>
        )}

        {nearbyDrivers.map((driver) => (
          <Marker
            key={driver.id}
            coordinate={{ latitude: driver.latitude, longitude: driver.longitude }}
            title={driver.name}
            description={`${driver.vehicleType} - ${driver.eta} min away`}
          >
            <View style={[styles.driverMarker, { backgroundColor: colors.surface }]}>
              <MaterialIcons name="local-taxi" size={18} color={colors.primary} />
            </View>
          </Marker>
        ))}

        {pickupLocation && (
          <Marker coordinate={pickupLocation} title="Pickup" description={pickupLocation.address}>
            <View style={[styles.locationMarker, { backgroundColor: colors.success }]}>
              <MaterialIcons name="radio-button-checked" size={14} color="#fff" />
            </View>
          </Marker>
        )}

        {dropoffLocation && (
          <Marker coordinate={dropoffLocation} title="Dropoff" description={dropoffLocation.address}>
            <View style={[styles.locationMarker, { backgroundColor: colors.error }]}>
              <MaterialIcons name="location-on" size={14} color="#fff" />
            </View>
          </Marker>
        )}
      </MapView>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}

      <TouchableOpacity style={[styles.recenterBtn, { backgroundColor: colors.primary }]} onPress={handleRecenter}>
        <MaterialIcons name="my-location" size={22} color="#0f1422" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recenterBtn: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  userMarker: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  userMarkerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0f1422',
  },
  driverMarker: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffd447',
  },
  locationMarker: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
});
