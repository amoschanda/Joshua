import { create } from 'zustand';
import type { Rider, Ride, NearbyDriver, Coordinates } from '../types';

interface RiderState {
  currentRider: Rider | null;
  isAuthenticated: boolean;
  currentLocation: Coordinates | null;
  activeRide: Ride | null;
  rideHistory: Ride[];
  nearbyDrivers: NearbyDriver[];

  setCurrentRider: (rider: Rider | null) => void;
  setIsAuthenticated: (authenticated: boolean) => void;
  setCurrentLocation: (location: Coordinates | null) => void;
  setActiveRide: (ride: Ride | null) => void;
  setRideHistory: (history: Ride[]) => void;
  addToHistory: (ride: Ride) => void;
  setNearbyDrivers: (drivers: NearbyDriver[]) => void;
  reset: () => void;
}

const initialState = {
  currentRider: null,
  isAuthenticated: false,
  currentLocation: null,
  activeRide: null,
  rideHistory: [],
  nearbyDrivers: [],
};

export const useRiderStore = create<RiderState>((set) => ({
  ...initialState,

  setCurrentRider: (rider) => set({ currentRider: rider }),
  setIsAuthenticated: (authenticated) => set({ isAuthenticated: authenticated }),
  setCurrentLocation: (location) => set({ currentLocation: location }),
  setActiveRide: (ride) => set({ activeRide: ride }),
  setRideHistory: (history) => set({ rideHistory: history }),
  addToHistory: (ride) =>
    set((state) => ({ rideHistory: [ride, ...state.rideHistory] })),
  setNearbyDrivers: (drivers) => set({ nearbyDrivers: drivers }),
  reset: () => set(initialState),
}));
