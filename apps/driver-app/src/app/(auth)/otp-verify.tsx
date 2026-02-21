import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { useDriverStore } from '@/lib/store';
import { MaterialIcons } from '@expo/vector-icons';

export default function OtpVerifyScreen() {
  const router = useRouter();
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const colors = useColors();
  const { setIsAuthenticated, setCurrentDriver, persist } = useDriverStore();
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const handleOtpChange = (value: string, index: number) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length !== 6) {
      setError('Please enter the complete code');
      return;
    }

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      if (code === '123456' || code.length === 6) {
        router.push('/(auth)/profile-setup');
      } else {
        setError('Invalid verification code');
      }
    } catch (err) {
      setError('Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  return (
    <ScreenContainer>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          testID="back-btn"
        >
          <MaterialIcons name="arrow-back" size={24} color={colors.foreground} />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.foreground }]}>Verify Phone</Text>
          <Text style={[styles.subtitle, { color: colors.muted }]}>
            Enter the 6-digit code sent to {phone}
          </Text>
        </View>

        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputRefs.current[index] = ref)}
              style={[
                styles.otpInput,
                {
                  backgroundColor: colors.surface,
                  color: colors.foreground,
                  borderColor: error ? colors.error : digit ? colors.primary : 'transparent',
                },
              ]}
              value={digit}
              onChangeText={(value) => handleOtpChange(value, index)}
              onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
              keyboardType="number-pad"
              maxLength={1}
              testID={`otp-input-${index}`}
            />
          ))}
        </View>

        {error ? <Text style={[styles.error, { color: colors.error }]}>{error}</Text> : null}

        <TouchableOpacity
          style={[
            styles.verifyButton,
            {
              backgroundColor: otp.join('').length === 6 ? colors.primary : colors.surface,
            },
          ]}
          onPress={handleVerify}
          disabled={isLoading || otp.join('').length !== 6}
          testID="verify-btn"
        >
          <Text
            style={[
              styles.verifyButtonText,
              { color: otp.join('').length === 6 ? colors.background : colors.muted },
            ]}
          >
            {isLoading ? 'Verifying...' : 'Verify'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.resendButton} onPress={handleResend}>
          <Text style={[styles.resendText, { color: colors.primary }]}>
            Didn't receive code? Resend
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  backButton: { marginTop: 10, marginBottom: 20 },
  header: { marginBottom: 40 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 8 },
  subtitle: { fontSize: 15 },
  otpContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  otpInput: {
    width: 50,
    height: 56,
    borderRadius: 12,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '600',
    borderWidth: 2,
  },
  error: { fontSize: 14, textAlign: 'center', marginBottom: 16 },
  verifyButton: { padding: 18, borderRadius: 14, alignItems: 'center' },
  verifyButtonText: { fontSize: 17, fontWeight: '600' },
  resendButton: { marginTop: 24, alignItems: 'center' },
  resendText: { fontSize: 14 },
});
