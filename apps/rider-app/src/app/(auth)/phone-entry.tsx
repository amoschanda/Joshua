import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { MaterialIcons } from '@expo/vector-icons';

export default function PhoneEntryScreen() {
  const router = useRouter();
  const colors = useColors();
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleContinue = async () => {
    if (phone.length < 10) return;
    
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push({ pathname: '/(auth)/otp-verify', params: { phone } });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScreenContainer>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()} testID="back-btn">
          <MaterialIcons name="arrow-back" size={24} color={colors.foreground} />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.foreground }]}>Enter your phone</Text>
          <Text style={[styles.subtitle, { color: colors.muted }]}>
            We'll send you a verification code
          </Text>
        </View>

        <View style={[styles.inputContainer, { backgroundColor: colors.surface }]}>
          <Text style={[styles.countryCode, { color: colors.foreground }]}>+1</Text>
          <TextInput
            style={[styles.input, { color: colors.foreground }]}
            placeholder="(555) 000-0000"
            placeholderTextColor={colors.muted}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            autoFocus
            testID="phone-input"
          />
        </View>

        <TouchableOpacity
          style={[
            styles.continueButton,
            { backgroundColor: phone.length >= 10 ? colors.primary : colors.surface },
          ]}
          onPress={handleContinue}
          disabled={isLoading || phone.length < 10}
          testID="continue-btn"
        >
          <Text
            style={[
              styles.continueButtonText,
              { color: phone.length >= 10 ? colors.background : colors.muted },
            ]}
          >
            {isLoading ? 'Sending...' : 'Continue'}
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  backButton: { marginTop: 10, marginBottom: 20 },
  header: { marginBottom: 32 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 8 },
  subtitle: { fontSize: 15 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 24,
  },
  countryCode: { fontSize: 18, fontWeight: '500', marginRight: 12 },
  input: { flex: 1, fontSize: 18 },
  continueButton: { padding: 18, borderRadius: 14, alignItems: 'center' },
  continueButtonText: { fontSize: 17, fontWeight: '600' },
});
