import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { useDriverStore } from '@/lib/store';
import { MaterialIcons } from '@expo/vector-icons';

type Period = 'today' | 'week' | 'month';

const MOCK_EARNINGS = {
  today: { total: 145.5, rides: 8, hours: 6.5 },
  week: { total: 892.0, rides: 52, hours: 42 },
  month: { total: 3450.0, rides: 198, hours: 165 },
};

export default function EarningsScreen() {
  const colors = useColors();
  const { currentDriver, todayEarnings, todayRides } = useDriverStore();
  const [period, setPeriod] = useState<Period>('today');

  const earnings = MOCK_EARNINGS[period];
  const hourlyRate = earnings.hours > 0 ? earnings.total / earnings.hours : 0;

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, { color: colors.foreground }]}>Earnings</Text>

        <View style={styles.periodTabs}>
          {(['today', 'week', 'month'] as Period[]).map((p) => (
            <TouchableOpacity
              key={p}
              style={[
                styles.periodTab,
                { backgroundColor: period === p ? colors.primary : colors.surface },
              ]}
              onPress={() => setPeriod(p)}
              testID={`period-${p}`}
            >
              <Text
                style={[
                  styles.periodTabText,
                  { color: period === p ? colors.background : colors.muted },
                ]}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={[styles.mainCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.earningsLabel, { color: colors.muted }]}>Total Earnings</Text>
          <Text style={[styles.earningsValue, { color: colors.primary }]}>
            ${earnings.total.toFixed(2)}
          </Text>
        </View>

        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
            <MaterialIcons name="local-taxi" size={24} color={colors.primary} />
            <Text style={[styles.statValue, { color: colors.foreground }]}>{earnings.rides}</Text>
            <Text style={[styles.statLabel, { color: colors.muted }]}>Rides</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
            <MaterialIcons name="schedule" size={24} color={colors.primary} />
            <Text style={[styles.statValue, { color: colors.foreground }]}>{earnings.hours}h</Text>
            <Text style={[styles.statLabel, { color: colors.muted }]}>Online</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
            <MaterialIcons name="trending-up" size={24} color={colors.primary} />
            <Text style={[styles.statValue, { color: colors.foreground }]}>
              ${hourlyRate.toFixed(0)}
            </Text>
            <Text style={[styles.statLabel, { color: colors.muted }]}>/Hour</Text>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.muted }]}>Recent Rides</Text>
        {[...Array(5)].map((_, i) => (
          <View key={i} style={[styles.rideItem, { backgroundColor: colors.surface }]}>
            <View style={styles.rideInfo}>
              <Text style={[styles.rideTime, { color: colors.foreground }]}>
                {new Date(Date.now() - i * 3600000).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
              <Text style={[styles.rideRoute, { color: colors.muted }]} numberOfLines={1}>
                Market St → Mission Bay
              </Text>
            </View>
            <Text style={[styles.rideFare, { color: colors.success }]}>
              +${(12 + Math.random() * 20).toFixed(2)}
            </Text>
          </View>
        ))}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: { paddingBottom: 24, gap: 16 },
  title: { fontSize: 28, fontWeight: 'bold' },
  periodTabs: { flexDirection: 'row', gap: 10 },
  periodTab: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  periodTabText: { fontSize: 14, fontWeight: '600' },
  mainCard: { padding: 24, borderRadius: 16, alignItems: 'center' },
  earningsLabel: { fontSize: 14 },
  earningsValue: { fontSize: 48, fontWeight: 'bold', marginTop: 4 },
  statsRow: { flexDirection: 'row', gap: 10 },
  statCard: { flex: 1, padding: 16, borderRadius: 16, alignItems: 'center', gap: 8 },
  statValue: { fontSize: 22, fontWeight: 'bold' },
  statLabel: { fontSize: 12 },
  sectionTitle: { fontSize: 13, fontWeight: '600', marginTop: 8 },
  rideItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
  },
  rideInfo: { flex: 1 },
  rideTime: { fontSize: 15, fontWeight: '600' },
  rideRoute: { fontSize: 13, marginTop: 2 },
  rideFare: { fontSize: 16, fontWeight: '600' },
});
