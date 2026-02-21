import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Rider {
  id: string;
  phone: string;
  name: string;
  email?: string;
  avatar?: string;
  rating: number;
  totalRides: number;
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  rating: number;
  vehicleType: string;
  vehicleNumber: string;
  vehicleColor?: string;
  latitude: number;
  longitude: number;
  eta: number;
}

export interface Ride {
  id: string;
  driverId?: string;
  driverName?: string;
  driverPhone?: string;
  driverRating?: number;
  vehicleType?: string;
  vehicleNumber?: string;
  pickupLatitude: number;
  pickupLongitude: number;
  pickupAddress: string;
  dropoffLatitude: number;
  dropoffLongitude: number;
  dropoffAddress: string;
  estimatedFare: number;
  actualFare?: number;
  estimatedDistance: number;
  estimatedTime: number;
  status: 'searching' | 'accepted' | 'arriving' | 'in_progress' | 'completed' | 'cancelled';
  driverEta?: number;
  createdAt: string;
}

interface RiderStore {
  // Auth
  currentRider: Rider | null;
  isAuthenticated: boolean;
  setCurrentRider: (rider: Rider | null) => void;
  setIsAuthenticated: (authenticated: boolean) => void;

  // Location
  currentLocation: { latitude: number; longitude: number } | null;
  setCurrentLocation: (location: { latitude: number; longitude: number } | null) => void;

  // Rides
  activeRide: Ride | null;
  rideHistory: Ride[];
  setActiveRide: (ride: Ride | null) => void;
  addToHistory: (ride: Ride) => void;

  // Nearby Drivers
  nearbyDrivers: Driver[];
  setNearbyDrivers: (drivers: Driver[]) => void;

  // Persistence
  hydrate: () => Promise<void>;
  persist: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useRiderStore = create<RiderStore>((set, get) => ({
  // Auth
  currentRider: null,
  isAuthenticated: false,
  setCurrentRider: (rider) => set({ currentRider: rider }),
  setIsAuthenticated: (authenticated) => set({ isAuthenticated: authenticated }),

  // Location
  currentLocation: null,
  setCurrentLocation: (location) => set({ currentLocation: location }),

  // Rides
  activeRide: null,
  rideHistory: [],
  setActiveRide: (ride) => set({ activeRide: ride }),
  addToHistory: (ride) =>
    set((state) => ({
      rideHistory: [ride, ...state.rideHistory],
    })),

  // Nearby Drivers
  nearbyDrivers: [],
  setNearbyDrivers: (drivers) => set({ nearbyDrivers: drivers }),

  // Persistence
  hydrate: async () => {
    try {
      const riderJson = await AsyncStorage.getItem('currentRider');
      const isAuthJson = await AsyncStorage.getItem('isAuthenticated');
      const historyJson = await AsyncStorage.getItem('rideHistory');

      if (riderJson) set({ currentRider: JSON.parse(riderJson) });
      if (isAuthJson) set({ isAuthenticated: JSON.parse(isAuthJson) });
      if (historyJson) set({ rideHistory: JSON.parse(historyJson) });
    } catch (error) {
      console.error('Failed to hydrate store:', error);
    }
  },

  persist: async () => {
    try {
      const state = get();
      await AsyncStorage.setItem('currentRider', JSON.stringify(state.currentRider));
      await AsyncStorage.setItem('isAuthenticated', JSON.stringify(state.isAuthenticated));
      await AsyncStorage.setItem('rideHistory', JSON.stringify(state.rideHistory));
    } catch (error) {
      console.error('Failed to persist store:', error);
    }
  },

  logout: async () => {
    try {
      await AsyncStorage.multiRemove(['currentRider', 'isAuthenticated', 'rideHistory']);
      set({
        currentRider: null,
        isAuthenticated: false,
        activeRide: null,
        rideHistory: [],
        nearbyDrivers: [],
      });
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  },
}));
