import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { useRiderStore } from '@/lib/store';
import { MaterialIcons } from '@expo/vector-icons';

export default function ActivityScreen() {
  const colors = useColors();
  const { rideHistory } = useRiderStore();

  const mockHistory = [
    {
      id: '1',
      date: 'Today, 2:30 PM',
      from: '123 Market St',
      to: 'Airport SFO',
      fare: 35.5,
      status: 'completed',
    },
    {
      id: '2',
      date: 'Yesterday, 6:15 PM',
      from: '456 Mission St',
      to: 'Downtown Plaza',
      fare: 12.0,
      status: 'completed',
    },
    {
      id: '3',
      date: 'Jan 10, 9:00 AM',
      from: 'Golden Gate Park',
      to: 'Fisherman\'s Wharf',
      fare: 18.75,
      status: 'completed',
    },
    {
      id: '4',
      date: 'Jan 8, 3:45 PM',
      from: 'Pier 39',
      to: 'Union Square',
      fare: 14.25,
      status: 'cancelled',
    },
  ];

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, { color: colors.foreground }]}>Activity</Text>

        {mockHistory.length === 0 ? (
          <View style={[styles.emptyCard, { backgroundColor: colors.surface }]}>
            <MaterialIcons name="history" size={48} color={colors.muted} />
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>No Rides Yet</Text>
            <Text style={[styles.emptyText, { color: colors.muted }]}>
              Your ride history will appear here
            </Text>
          </View>
        ) : (
          <View style={styles.historyList}>
            {mockHistory.map((ride) => (
              <View key={ride.id} style={[styles.rideCard, { backgroundColor: colors.surface }]}>
                <View style={styles.rideHeader}>
                  <Text style={[styles.rideDate, { color: colors.muted }]}>{ride.date}</Text>
                  <View
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor:
                          ride.status === 'completed'
                            ? 'rgba(118, 219, 163, 0.15)'
                            : 'rgba(255, 107, 107, 0.15)',
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        { color: ride.status === 'completed' ? colors.success : colors.error },
                      ]}
                    >
                      {ride.status === 'completed' ? 'Completed' : 'Cancelled'}
                    </Text>
                  </View>
                </View>

                <View style={styles.routeInfo}>
                  <View style={styles.routeRow}>
                    <MaterialIcons name="radio-button-checked" size={14} color={colors.success} />
                    <Text style={[styles.routeText, { color: colors.foreground }]} numberOfLines={1}>
                      {ride.from}
                    </Text>
                  </View>
                  <View style={[styles.routeLine, { borderLeftColor: colors.muted }]} />
                  <View style={styles.routeRow}>
                    <MaterialIcons name="location-on" size={14} color={colors.error} />
                    <Text style={[styles.routeText, { color: colors.foreground }]} numberOfLines={1}>
                      {ride.to}
                    </Text>
                  </View>
                </View>

                <View style={styles.rideFooter}>
                  <Text style={[styles.fareLabel, { color: colors.muted }]}>Total Fare</Text>
                  <Text style={[styles.fareValue, { color: colors.primary }]}>
                    ${ride.fare.toFixed(2)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: { paddingBottom: 24, gap: 16 },
  title: { fontSize: 28, fontWeight: 'bold' },
  emptyCard: { padding: 40, borderRadius: 16, alignItems: 'center', gap: 12, marginTop: 60 },
  emptyTitle: { fontSize: 20, fontWeight: '600' },
  emptyText: { fontSize: 14, textAlign: 'center' },
  historyList: { gap: 12 },
  rideCard: { padding: 16, borderRadius: 16 },
  rideHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  rideDate: { fontSize: 13 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 11, fontWeight: '600' },
  routeInfo: { marginBottom: 12 },
  routeRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  routeLine: { borderLeftWidth: 2, borderStyle: 'dashed', height: 16, marginLeft: 6, marginVertical: 2 },
  routeText: { flex: 1, fontSize: 14 },
  rideFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  fareLabel: { fontSize: 13 },
  fareValue: { fontSize: 18, fontWeight: 'bold' },
});
