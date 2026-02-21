import { useState, useCallback } from 'react';
import * as Location from 'expo-location';
import { Platform } from 'react-native';

export interface LocationCoords {
  latitude: number;
  longitude: number;
  accuracy: number | null;
  altitude: number | null;
  heading: number | null;
  speed: number | null;
}

export interface UseLocationReturn {
  location: LocationCoords | null;
  error: string | null;
  loading: boolean;
  permissionStatus: Location.PermissionStatus | null;
  requestPermission: () => Promise<boolean>;
  getCurrentLocation: () => Promise<LocationCoords | null>;
  startTracking: () => Promise<void>;
  stopTracking: () => void;
}

export function useLocation(): UseLocationReturn {
  const [location, setLocation] = useState<LocationCoords | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<Location.PermissionStatus | null>(null);
  const [subscription, setSubscription] = useState<Location.LocationSubscription | null>(null);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const { status } = await Location.requestForegroundPermissionsAsync();
      setPermissionStatus(status);

      if (status !== 'granted') {
        setError('Location permission denied');
        return false;
      }

      if (Platform.OS === 'android') {
        try {
          await Location.requestBackgroundPermissionsAsync();
        } catch (e) {
          console.warn('Background location not granted');
        }
      }

      return true;
    } catch (err) {
      setError('Failed to request permission');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const getCurrentLocation = useCallback(async (): Promise<LocationCoords | null> => {
    try {
      setLoading(true);
      const { status } = await Location.getForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        const granted = await requestPermission();
        if (!granted) return null;
      }

      const currentLoc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const coords: LocationCoords = {
        latitude: currentLoc.coords.latitude,
        longitude: currentLoc.coords.longitude,
        accuracy: currentLoc.coords.accuracy,
        altitude: currentLoc.coords.altitude,
        heading: currentLoc.coords.heading,
        speed: currentLoc.coords.speed,
      };

      setLocation(coords);
      return coords;
    } catch (err) {
      setError('Failed to get location');
      return null;
    } finally {
      setLoading(false);
    }
  }, [requestPermission]);

  const startTracking = useCallback(async () => {
    try {
      setLoading(true);
      const { status } = await Location.getForegroundPermissionsAsync();

      if (status !== 'granted') {
        const granted = await requestPermission();
        if (!granted) return;
      }

      const currentLoc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setLocation({
        latitude: currentLoc.coords.latitude,
        longitude: currentLoc.coords.longitude,
        accuracy: currentLoc.coords.accuracy,
        altitude: currentLoc.coords.altitude,
        heading: currentLoc.coords.heading,
        speed: currentLoc.coords.speed,
      });

      const sub = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000,
          distanceInterval: 10,
        },
        (newLocation) => {
          setLocation({
            latitude: newLocation.coords.latitude,
            longitude: newLocation.coords.longitude,
            accuracy: newLocation.coords.accuracy,
            altitude: newLocation.coords.altitude,
            heading: newLocation.coords.heading,
            speed: newLocation.coords.speed,
          });
        }
      );

      setSubscription(sub);
    } catch (err) {
      setError('Failed to start tracking');
    } finally {
      setLoading(false);
    }
  }, [requestPermission]);

  const stopTracking = useCallback(() => {
    if (subscription) {
      subscription.remove();
      setSubscription(null);
    }
  }, [subscription]);

  return {
    location,
    error,
    loading,
    permissionStatus,
    requestPermission,
    getCurrentLocation,
    startTracking,
    stopTracking,
  };
}
