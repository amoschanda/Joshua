import { useState, useEffect, useCallback } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';

interface BiometricsState {
  isAvailable: boolean;
  biometryType: LocalAuthentication.AuthenticationType | null;
  isEnrolled: boolean;
}

export function useBiometrics() {
  const [state, setState] = useState<BiometricsState>({
    isAvailable: false,
    biometryType: null,
    isEnrolled: false,
  });

  useEffect(() => {
    checkBiometrics();
  }, []);

  const checkBiometrics = async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();

    setState({
      isAvailable: hasHardware && isEnrolled,
      biometryType: supportedTypes[0] || null,
      isEnrolled,
    });
  };

  const authenticate = useCallback(
    async (promptMessage: string = 'Authenticate'): Promise<boolean> => {
      if (!state.isAvailable) return false;

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage,
        fallbackLabel: 'Use passcode',
        cancelLabel: 'Cancel',
      });

      return result.success;
    },
    [state.isAvailable]
  );

  return {
    ...state,
    authenticate,
  };
}
