import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { MaterialIcons } from '@expo/vector-icons';

export default function WelcomeScreen() {
  const router = useRouter();
  const colors = useColors();

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={[styles.logoContainer, { backgroundColor: colors.primary }]}>
            <MaterialIcons name="local-taxi" size={48} color={colors.background} />
          </View>
          <Text style={[styles.title, { color: colors.foreground }]}>Joshua Driver</Text>
          <Text style={[styles.subtitle, { color: colors.muted }]}>
            Earn money on your own schedule
          </Text>
        </View>

        <View style={styles.features}>
          {[
            { icon: 'attach-money', text: 'Competitive earnings with weekly payouts' },
            { icon: 'schedule', text: 'Drive when you want, be your own boss' },
            { icon: 'verified', text: 'Safe, reliable platform with 24/7 support' },
          ].map((feature, idx) => (
            <View key={idx} style={styles.featureRow}>
              <View style={[styles.featureIcon, { backgroundColor: colors.surface }]}>
                <MaterialIcons name={feature.icon as any} size={20} color={colors.primary} />
              </View>
              <Text style={[styles.featureText, { color: colors.foreground }]}>
                {feature.text}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.primary }]}
            onPress={() => router.push('/(auth)/phone-entry')}
            activeOpacity={0.8}
            testID="get-started-btn"
          >
            <Text style={[styles.buttonText, { color: colors.background }]}>Get Started</Text>
          </TouchableOpacity>
          <Text style={[styles.terms, { color: colors.muted }]}>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'space-between', paddingVertical: 40 },
  header: { alignItems: 'center', marginTop: 60 },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 8 },
  subtitle: { fontSize: 16, textAlign: 'center', paddingHorizontal: 40 },
  features: { gap: 20 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  featureIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureText: { flex: 1, fontSize: 15 },
  footer: { gap: 16 },
  button: { padding: 18, borderRadius: 14, alignItems: 'center' },
  buttonText: { fontSize: 17, fontWeight: '600' },
  terms: { fontSize: 12, textAlign: 'center', paddingHorizontal: 20 },
});
