import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { MaterialIcons } from '@expo/vector-icons';
import { useColors } from '@/hooks/use-colors';
import { useLocation } from '@/hooks/use-location';

interface MapComponentProps {
  height?: number;
  showUserLocation?: boolean;
  onLocationChange?: (location: { latitude: number; longitude: number }) => void;
  markers?: Array<{
    id: string;
    latitude: number;
    longitude: number;
    title: string;
    type?: 'pickup' | 'dropoff' | 'driver';
  }>;
}

export function MapComponent({ height = 300, showUserLocation = true, onLocationChange, markers = [] }: MapComponentProps) {
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
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
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
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
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
            title="You"
          >
            <View style={[styles.userMarker, { backgroundColor: colors.primary }]}>
              <MaterialIcons name="navigation" size={16} color="#0f1422" />
            </View>
          </Marker>
        )}
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
            title={marker.title}
          >
            <View
              style={[
                styles.markerPin,
                {
                  backgroundColor:
                    marker.type === 'pickup'
                      ? colors.success
                      : marker.type === 'dropoff'
                      ? colors.error
                      : colors.primary,
                },
              ]}
            >
              <MaterialIcons
                name={marker.type === 'pickup' ? 'radio-button-checked' : marker.type === 'dropoff' ? 'location-on' : 'local-taxi'}
                size={14}
                color="#fff"
              />
            </View>
          </Marker>
        ))}
      </MapView>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}

      <TouchableOpacity style={[styles.recenterBtn, { backgroundColor: colors.primary }]} onPress={handleRecenter}>
        <MaterialIcons name="my-location" size={22} color="#0f1422" />
      </TouchableOpacity>

      {location && (
        <View style={[styles.coordsBox, { backgroundColor: colors.surface }]}>
          <Text style={[styles.coordText, { color: colors.muted }]}>Lat: {location.latitude.toFixed(4)}</Text>
          <Text style={[styles.coordText, { color: colors.muted }]}>Lng: {location.longitude.toFixed(4)}</Text>
        </View>
      )}
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
  coordsBox: {
    position: 'absolute',
    top: 12,
    left: 12,
    padding: 8,
    borderRadius: 8,
  },
  coordText: {
    fontSize: 10,
    fontWeight: '600',
  },
  userMarker: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  markerPin: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
});
