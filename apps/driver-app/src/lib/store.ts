import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Driver {
  id: string;
  phone: string;
  name: string;
  email?: string;
  avatar?: string;
  rating: number;
  totalRides: number;
  vehicleType: string;
  vehicleNumber: string;
  vehicleColor?: string;
  licenseNumber: string;
  isOnline: boolean;
  currentLatitude?: number;
  currentLongitude?: number;
  totalEarnings: number;
}

export interface RideRequest {
  id: string;
  riderId: string;
  riderName: string;
  riderPhone: string;
  riderRating: number;
  pickupLatitude: number;
  pickupLongitude: number;
  pickupAddress: string;
  dropoffLatitude: number;
  dropoffLongitude: number;
  dropoffAddress: string;
  estimatedFare: number;
  estimatedDistance: number;
  estimatedTime: number;
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: string;
}

interface DriverStore {
  // Auth
  currentDriver: Driver | null;
  isAuthenticated: boolean;
  setCurrentDriver: (driver: Driver | null) => void;
  setIsAuthenticated: (authenticated: boolean) => void;

  // Location
  currentLocation: { latitude: number; longitude: number } | null;
  setCurrentLocation: (location: { latitude: number; longitude: number } | null) => void;

  // Ride Requests (Dispatch)
  pendingRequests: RideRequest[];
  activeRide: RideRequest | null;
  rideHistory: RideRequest[];
  setPendingRequests: (requests: RideRequest[]) => void;
  addPendingRequest: (request: RideRequest) => void;
  removePendingRequest: (requestId: string) => void;
  setActiveRide: (ride: RideRequest | null) => void;
  addToHistory: (ride: RideRequest) => void;

  // Status
  isOnline: boolean;
  setIsOnline: (online: boolean) => void;

  // Today's Stats
  todayEarnings: number;
  todayRides: number;
  setTodayEarnings: (earnings: number) => void;
  setTodayRides: (rides: number) => void;

  // Persistence
  hydrate: () => Promise<void>;
  persist: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useDriverStore = create<DriverStore>((set, get) => ({
  // Auth
  currentDriver: null,
  isAuthenticated: false,
  setCurrentDriver: (driver) => set({ currentDriver: driver }),
  setIsAuthenticated: (authenticated) => set({ isAuthenticated: authenticated }),

  // Location
  currentLocation: null,
  setCurrentLocation: (location) => set({ currentLocation: location }),

  // Ride Requests
  pendingRequests: [],
  activeRide: null,
  rideHistory: [],
  setPendingRequests: (requests) => set({ pendingRequests: requests }),
  addPendingRequest: (request) =>
    set((state) => ({
      pendingRequests: [request, ...state.pendingRequests],
    })),
  removePendingRequest: (requestId) =>
    set((state) => ({
      pendingRequests: state.pendingRequests.filter((r) => r.id !== requestId),
    })),
  setActiveRide: (ride) => set({ activeRide: ride }),
  addToHistory: (ride) =>
    set((state) => ({
      rideHistory: [ride, ...state.rideHistory],
    })),

  // Status
  isOnline: false,
  setIsOnline: (online) => set({ isOnline: online }),

  // Today's Stats
  todayEarnings: 0,
  todayRides: 0,
  setTodayEarnings: (earnings) => set({ todayEarnings: earnings }),
  setTodayRides: (rides) => set({ todayRides: rides }),

  // Persistence
  hydrate: async () => {
    try {
      const driverJson = await AsyncStorage.getItem('currentDriver');
      const isAuthJson = await AsyncStorage.getItem('isAuthenticated');
      const isOnlineJson = await AsyncStorage.getItem('isOnline');
      const earningsJson = await AsyncStorage.getItem('todayEarnings');
      const ridesJson = await AsyncStorage.getItem('todayRides');
      const historyJson = await AsyncStorage.getItem('rideHistory');

      if (driverJson) set({ currentDriver: JSON.parse(driverJson) });
      if (isAuthJson) set({ isAuthenticated: JSON.parse(isAuthJson) });
      if (isOnlineJson) set({ isOnline: JSON.parse(isOnlineJson) });
      if (earningsJson) set({ todayEarnings: JSON.parse(earningsJson) });
      if (ridesJson) set({ todayRides: JSON.parse(ridesJson) });
      if (historyJson) set({ rideHistory: JSON.parse(historyJson) });
    } catch (error) {
      console.error('Failed to hydrate store:', error);
    }
  },

  persist: async () => {
    try {
      const state = get();
      await AsyncStorage.setItem('currentDriver', JSON.stringify(state.currentDriver));
      await AsyncStorage.setItem('isAuthenticated', JSON.stringify(state.isAuthenticated));
      await AsyncStorage.setItem('isOnline', JSON.stringify(state.isOnline));
      await AsyncStorage.setItem('todayEarnings', JSON.stringify(state.todayEarnings));
      await AsyncStorage.setItem('todayRides', JSON.stringify(state.todayRides));
      await AsyncStorage.setItem('rideHistory', JSON.stringify(state.rideHistory));
    } catch (error) {
      console.error('Failed to persist store:', error);
    }
  },

  logout: async () => {
    try {
      await AsyncStorage.multiRemove([
        'currentDriver',
        'isAuthenticated',
        'isOnline',
        'todayEarnings',
        'todayRides',
        'rideHistory',
      ]);
      set({
        currentDriver: null,
        isAuthenticated: false,
        isOnline: false,
        pendingRequests: [],
        activeRide: null,
        todayEarnings: 0,
        todayRides: 0,
      });
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  },
}));
