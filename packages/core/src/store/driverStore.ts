import { create } from 'zustand';
import type { Driver, Ride, Coordinates } from '../types';

interface DriverState {
  currentDriver: Driver | null;
  isAuthenticated: boolean;
  currentLocation: Coordinates | null;
  isOnline: boolean;
  activeRide: Ride | null;
  pendingRequests: Ride[];
  rideHistory: Ride[];
  todayEarnings: number;
  todayRides: number;

  setCurrentDriver: (driver: Driver | null) => void;
  setIsAuthenticated: (authenticated: boolean) => void;
  setCurrentLocation: (location: Coordinates | null) => void;
  setIsOnline: (online: boolean) => void;
  setActiveRide: (ride: Ride | null) => void;
  setPendingRequests: (requests: Ride[]) => void;
  addPendingRequest: (request: Ride) => void;
  removePendingRequest: (requestId: string) => void;
  setRideHistory: (history: Ride[]) => void;
  addToHistory: (ride: Ride) => void;
  setTodayEarnings: (earnings: number) => void;
  setTodayRides: (rides: number) => void;
  reset: () => void;
}

const initialState = {
  currentDriver: null,
  isAuthenticated: false,
  currentLocation: null,
  isOnline: false,
  activeRide: null,
  pendingRequests: [],
  rideHistory: [],
  todayEarnings: 0,
  todayRides: 0,
};

export const useDriverStore = create<DriverState>((set) => ({
  ...initialState,

  setCurrentDriver: (driver) => set({ currentDriver: driver }),
  setIsAuthenticated: (authenticated) => set({ isAuthenticated: authenticated }),
  setCurrentLocation: (location) => set({ currentLocation: location }),
  setIsOnline: (online) => set({ isOnline: online }),
  setActiveRide: (ride) => set({ activeRide: ride }),
  setPendingRequests: (requests) => set({ pendingRequests: requests }),
  addPendingRequest: (request) =>
    set((state) => ({ pendingRequests: [request, ...state.pendingRequests] })),
  removePendingRequest: (requestId) =>
    set((state) => ({
      pendingRequests: state.pendingRequests.filter((r) => r.id !== requestId),
    })),
  setRideHistory: (history) => set({ rideHistory: history }),
  addToHistory: (ride) =>
    set((state) => ({ rideHistory: [ride, ...state.rideHistory] })),
  setTodayEarnings: (earnings) => set({ todayEarnings: earnings }),
  setTodayRides: (rides) => set({ todayRides: rides }),
  reset: () => set(initialState),
}));
