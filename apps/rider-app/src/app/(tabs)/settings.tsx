import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { useRiderStore } from '@/lib/store';
import { MaterialIcons } from '@expo/vector-icons';

export default function SettingsScreen() {
  const router = useRouter();
  const colors = useColors();
  const { currentRider, logout } = useRiderStore();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/(auth)/welcome');
        },
      },
    ]);
  };

  const menuSections = [
    {
      title: 'Account',
      items: [
        { icon: 'person', label: 'Profile', action: () => {} },
        { icon: 'credit-card', label: 'Payment Methods', action: () => {} },
        { icon: 'location-on', label: 'Saved Places', action: () => {} },
      ],
    },
    {
      title: 'Preferences',
      items: [
        { icon: 'notifications', label: 'Notifications', action: () => {} },
        { icon: 'language', label: 'Language', action: () => {} },
      ],
    },
    {
      title: 'Support',
      items: [
        { icon: 'help', label: 'Help Center', action: () => {} },
        { icon: 'chat', label: 'Contact Support', action: () => {} },
        { icon: 'info', label: 'About', action: () => {} },
      ],
    },
  ];

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, { color: colors.foreground }]}>Settings</Text>

        <View style={[styles.profileCard, { backgroundColor: colors.surface }]}>
          <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
            <Text style={[styles.avatarText, { color: colors.background }]}>
              {currentRider?.name?.charAt(0).toUpperCase() || 'R'}
            </Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, { color: colors.foreground }]}>
              {currentRider?.name || 'Rider'}
            </Text>
            <Text style={[styles.profilePhone, { color: colors.muted }]}>
              {currentRider?.phone || '+1 555 000 0000'}
            </Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} color={colors.muted} />
        </View>

        {menuSections.map((section, sIdx) => (
          <View key={sIdx} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.muted }]}>{section.title}</Text>
            <View style={[styles.menuCard, { backgroundColor: colors.surface }]}>
              {section.items.map((item, iIdx) => (
                <TouchableOpacity
                  key={iIdx}
                  style={[
                    styles.menuItem,
                    iIdx < section.items.length - 1 && {
                      borderBottomWidth: 1,
                      borderBottomColor: 'rgba(255,255,255,0.05)',
                    },
                  ]}
                  onPress={item.action}
                  testID={`menu-${item.label.toLowerCase().replace(' ', '-')}`}
                >
                  <MaterialIcons name={item.icon as any} size={22} color={colors.muted} />
                  <Text style={[styles.menuLabel, { color: colors.foreground }]}>{item.label}</Text>
                  <MaterialIcons name="chevron-right" size={22} color={colors.muted} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        <TouchableOpacity
          style={[styles.logoutButton, { backgroundColor: colors.error }]}
          onPress={handleLogout}
          testID="logout-btn"
        >
          <MaterialIcons name="logout" size={20} color="#fff" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <Text style={[styles.version, { color: colors.muted }]}>Version 1.0.0</Text>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: { paddingBottom: 40, gap: 16 },
  title: { fontSize: 28, fontWeight: 'bold' },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    gap: 14,
  },
  avatar: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 24, fontWeight: 'bold' },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 18, fontWeight: '600' },
  profilePhone: { fontSize: 14, marginTop: 2 },
  section: { gap: 8 },
  sectionTitle: { fontSize: 13, fontWeight: '600' },
  menuCard: { borderRadius: 16, overflow: 'hidden' },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 14 },
  menuLabel: { flex: 1, fontSize: 15 },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 14,
    gap: 8,
    marginTop: 8,
  },
  logoutText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  version: { textAlign: 'center', fontSize: 12, marginTop: 8 },
});
