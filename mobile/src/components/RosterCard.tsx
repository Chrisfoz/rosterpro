import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { format } from 'date-fns';

interface RosterCardProps {
  date: string;
  role: string;
  serviceType: string;
  status: 'scheduled' | 'confirmed' | 'cancelled';
  onPress?: () => void;
}

const RosterCard: React.FC<RosterCardProps> = ({
  date,
  role,
  serviceType,
  status,
  onPress,
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View style={styles.dateContainer}>
        <Text style={styles.day}>{format(new Date(date), 'd')}</Text>
        <Text style={styles.month}>{format(new Date(date), 'MMM')}</Text>
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.role}>{role}</Text>
        <Text style={styles.serviceType}>{serviceType}</Text>
      </View>
      <View
        style={[
          styles.statusContainer,
          status === 'confirmed' && styles.confirmedStatus,
          status === 'cancelled' && styles.cancelledStatus,
        ]}
      >
        <Text style={styles.statusText}>{status}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  dateContainer: {
    alignItems: 'center',
    marginRight: 16,
    width: 50,
  },
  day: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  month: {
    fontSize: 14,
    color: '#666',
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  role: {
    fontSize: 16,
    fontWeight: '500',
  },
  serviceType: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  statusContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: '#E3F2FD',
    alignSelf: 'center',
  },
  confirmedStatus: {
    backgroundColor: '#E8F5E9',
  },
  cancelledStatus: {
    backgroundColor: '#FFEBEE',
  },
  statusText: {
    fontSize: 12,
    textTransform: 'capitalize',
  },
});

export default RosterCard;