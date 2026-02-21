import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { useDriverStore } from '@/lib/store';
import { MaterialIcons } from '@expo/vector-icons';

const VEHICLE_TYPES = ['Sedan', 'SUV', 'Luxury', 'Economy'];

export default function ProfileSetupScreen() {
  const router = useRouter();
  const colors = useColors();
  const { setCurrentDriver, setIsAuthenticated, persist } = useDriverStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isValid = name && vehicleType && vehicleNumber && licenseNumber;

  const handleComplete = async () => {
    if (!isValid) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const driver = {
        id: `driver_${Date.now()}`,
        phone: '+15551234567',
        name,
        email: email || undefined,
        rating: 5.0,
        totalRides: 0,
        vehicleType,
        vehicleNumber,
        licenseNumber,
        isOnline: false,
        totalEarnings: 0,
      };

      setCurrentDriver(driver);
      setIsAuthenticated(true);
      await persist();

      router.replace('/(tabs)/home');
    } catch (err) {
      Alert.alert('Error', 'Failed to create profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScreenContainer>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          testID="back-btn"
        >
          <MaterialIcons name="arrow-back" size={24} color={colors.foreground} />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.foreground }]}>Complete Profile</Text>
          <Text style={[styles.subtitle, { color: colors.muted }]}>
            Fill in your details to start driving
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.muted }]}>Full Name *</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.surface, color: colors.foreground }]}
              placeholder="Enter your name"
              placeholderTextColor={colors.muted}
              value={name}
              onChangeText={setName}
              testID="name-input"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.muted }]}>Email (Optional)</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.surface, color: colors.foreground }]}
              placeholder="Enter your email"
              placeholderTextColor={colors.muted}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              testID="email-input"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.muted }]}>Vehicle Type *</Text>
            <View style={styles.vehicleTypes}>
              {VEHICLE_TYPES.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.vehicleTypeButton,
                    {
                      backgroundColor: vehicleType === type ? colors.primary : colors.surface,
                    },
                  ]}
                  onPress={() => setVehicleType(type)}
                  testID={`vehicle-type-${type.toLowerCase()}`}
                >
                  <Text
                    style={[
                      styles.vehicleTypeText,
                      { color: vehicleType === type ? colors.background : colors.foreground },
                    ]}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.muted }]}>Vehicle Number *</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.surface, color: colors.foreground }]}
              placeholder="ABC-1234"
              placeholderTextColor={colors.muted}
              value={vehicleNumber}
              onChangeText={setVehicleNumber}
              autoCapitalize="characters"
              testID="vehicle-number-input"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.muted }]}>License Number *</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.surface, color: colors.foreground }]}
              placeholder="DL123456"
              placeholderTextColor={colors.muted}
              value={licenseNumber}
              onChangeText={setLicenseNumber}
              autoCapitalize="characters"
              testID="license-input"
            />
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.completeButton,
            { backgroundColor: isValid ? colors.primary : colors.surface },
          ]}
          onPress={handleComplete}
          disabled={isLoading || !isValid}
          testID="complete-btn"
        >
          <Text
            style={[
              styles.completeButtonText,
              { color: isValid ? colors.background : colors.muted },
            ]}
          >
            {isLoading ? 'Creating Profile...' : 'Complete Setup'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  backButton: { marginTop: 10, marginBottom: 20 },
  header: { marginBottom: 32 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 8 },
  subtitle: { fontSize: 15 },
  form: { gap: 20, marginBottom: 32 },
  inputGroup: { gap: 8 },
  label: { fontSize: 13, fontWeight: '500' },
  input: { borderRadius: 12, padding: 16, fontSize: 16 },
  vehicleTypes: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  vehicleTypeButton: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20 },
  vehicleTypeText: { fontSize: 14, fontWeight: '500' },
  completeButton: { padding: 18, borderRadius: 14, alignItems: 'center', marginBottom: 40 },
  completeButtonText: { fontSize: 17, fontWeight: '600' },
});
