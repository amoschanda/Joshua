import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useColors } from '@/hooks/use-colors';
import { type RideRequest } from '@/lib/store';

interface RideRequestCardProps {
  request: RideRequest;
  onAccept: () => void;
  onDecline: () => void;
}

export function RideRequestCard({ request, onAccept, onDecline }: RideRequestCardProps) {
  const colors = useColors();

  return (
    <View style={[styles.card, { backgroundColor: colors.surface }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.riderInfo}>
          <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
            <Text style={styles.avatarText}>{request.riderName.charAt(0).toUpperCase()}</Text>
          </View>
          <View>
            <Text style={[styles.riderName, { color: colors.foreground }]}>{request.riderName}</Text>
            <View style={styles.ratingRow}>
              <MaterialIcons name="star" size={14} color={colors.primary} />
              <Text style={[styles.rating, { color: colors.muted }]}>{request.riderRating.toFixed(1)}</Text>
            </View>
          </View>
        </View>
        <View style={[styles.fareBox, { backgroundColor: 'rgba(255, 212, 71, 0.15)' }]}>
          <Text style={[styles.fareLabel, { color: colors.muted }]}>Est. Fare</Text>
          <Text style={[styles.fareAmount, { color: colors.primary }]}>${request.estimatedFare.toFixed(2)}</Text>
        </View>
      </View>

      {/* Route */}
      <View style={styles.route}>
        <View style={styles.locationRow}>
          <MaterialIcons name="radio-button-checked" size={16} color={colors.success} />
          <Text style={[styles.locationText, { color: colors.foreground }]} numberOfLines={1}>
            {request.pickupAddress}
          </Text>
        </View>
        <View style={[styles.routeLine, { borderLeftColor: colors.muted }]} />
        <View style={styles.locationRow}>
          <MaterialIcons name="location-on" size={16} color={colors.error} />
          <Text style={[styles.locationText, { color: colors.foreground }]} numberOfLines={1}>
            {request.dropoffAddress}
          </Text>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.stats}>
        <View style={styles.stat}>
          <MaterialIcons name="straighten" size={16} color={colors.muted} />
          <Text style={[styles.statText, { color: colors.muted }]}>{request.estimatedDistance.toFixed(1)} km</Text>
        </View>
        <View style={styles.stat}>
          <MaterialIcons name="access-time" size={16} color={colors.muted} />
          <Text style={[styles.statText, { color: colors.muted }]}>{request.estimatedTime} min</Text>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.button, styles.declineButton, { backgroundColor: colors.error }]}
          onPress={onDecline}
          activeOpacity={0.8}
        >
          <MaterialIcons name="close" size={20} color="#fff" />
          <Text style={styles.buttonText}>Decline</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.acceptButton, { backgroundColor: colors.success }]}
          onPress={onAccept}
          activeOpacity={0.8}
        >
          <MaterialIcons name="check" size={20} color="#fff" />
          <Text style={styles.buttonText}>Accept</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  riderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#0f1422',
    fontSize: 18,
    fontWeight: 'bold',
  },
  riderName: {
    fontSize: 16,
    fontWeight: '600',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  rating: {
    fontSize: 12,
  },
  fareBox: {
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  fareLabel: {
    fontSize: 10,
  },
  fareAmount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  route: {
    marginBottom: 16,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  locationText: {
    fontSize: 14,
    flex: 1,
  },
  routeLine: {
    borderLeftWidth: 2,
    borderStyle: 'dashed',
    height: 20,
    marginLeft: 7,
    marginVertical: 4,
  },
  stats: {
    flexDirection: 'row',
    gap: 24,
    marginBottom: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 13,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 12,
    gap: 8,
  },
  declineButton: {},
  acceptButton: {},
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});
