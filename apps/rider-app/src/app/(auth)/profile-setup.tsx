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
import { useRiderStore } from '@/lib/store';
import { MaterialIcons } from '@expo/vector-icons';

export default function ProfileSetupScreen() {
  const router = useRouter();
  const colors = useColors();
  const { setCurrentRider, setIsAuthenticated, persist } = useRiderStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleComplete = async () => {
    if (!name) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const rider = {
        id: `rider_${Date.now()}`,
        phone: '+15551234567',
        name,
        email: email || undefined,
        rating: 5.0,
        totalRides: 0,
      };

      setCurrentRider(rider);
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
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()} testID="back-btn">
          <MaterialIcons name="arrow-back" size={24} color={colors.foreground} />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.foreground }]}>Complete Profile</Text>
          <Text style={[styles.subtitle, { color: colors.muted }]}>
            Tell us a bit about yourself
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
        </View>

        <TouchableOpacity
          style={[
            styles.completeButton,
            { backgroundColor: name ? colors.primary : colors.surface },
          ]}
          onPress={handleComplete}
          disabled={isLoading || !name}
          testID="complete-btn"
        >
          <Text
            style={[
              styles.completeButtonText,
              { color: name ? colors.background : colors.muted },
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
  completeButton: { padding: 18, borderRadius: 14, alignItems: 'center' },
  completeButtonText: { fontSize: 17, fontWeight: '600' },
});
