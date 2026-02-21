import { useState, useEffect } from 'react';
import NetInfo, { type NetInfoState } from '@react-native-community/netinfo';

interface NetworkInfo {
  isConnected: boolean;
  isInternetReachable: boolean | null;
  type: string;
}

export function useNetInfo(): NetworkInfo {
  const [netInfo, setNetInfo] = useState<NetworkInfo>({
    isConnected: true,
    isInternetReachable: true,
    type: 'unknown',
  });

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      setNetInfo({
        isConnected: state.isConnected ?? false,
        isInternetReachable: state.isInternetReachable,
        type: state.type,
      });
    });

    return () => unsubscribe();
  }, []);

  return netInfo;
}
