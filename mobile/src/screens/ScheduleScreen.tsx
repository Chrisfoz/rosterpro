import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { useQuery } from '@tanstack/react-query';

const ScheduleScreen = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  const { data: availability = [], isLoading } = useQuery(
    ['availability', format(selectedMonth, 'yyyy-MM')],
    async () => {
      const response = await fetch(
        `/api/availability?month=${format(selectedMonth, 'yyyy-MM')}`
      );
      return response.json();
    }
  );

  const monthDays = eachDayOfInterval({
    start: startOfMonth(selectedMonth),
    end: endOfMonth(selectedMonth),
  });

  const handlePrevMonth = () => {
    setSelectedMonth(subMonths(selectedMonth, 1));
  };

  const handleNextMonth = () => {
    setSelectedMonth(addMonths(selectedMonth, 1));
  };

  const getDayAvailability = (date: Date) => {
    return availability.find(
      (a: any) => a.date === format(date, 'yyyy-MM-dd')
    );
  };

  return (
    <View style={styles.container}>
      {/* Month Navigation */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handlePrevMonth}>
          <Text style={styles.navigationButton}>Previous</Text>
        </TouchableOpacity>
        <Text style={styles.monthTitle}>
          {format(selectedMonth, 'MMMM yyyy')}
        </Text>
        <TouchableOpacity onPress={handleNextMonth}>
          <Text style={styles.navigationButton}>Next</Text>
        </TouchableOpacity>
      </View>

      {/* Calendar Grid */}
      <ScrollView>
        <View style={styles.calendarGrid}>
          {/* Weekday Headers */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <View key={day} style={styles.weekdayHeader}>
              <Text style={styles.weekdayText}>{day}</Text>
            </View>
          ))}

          {/* Calendar Days */}
          {monthDays.map((day) => {
            const dayAvailability = getDayAvailability(day);
            return (
              <TouchableOpacity
                key={day.toString()}
                style={[
                  styles.dayCell,
                  dayAvailability?.isAvailable === false && styles.unavailableDay,
                  dayAvailability?.isAvailable === true && styles.availableDay,
                ]}
              >
                <Text style={styles.dayText}>{format(day, 'd')}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, styles.availableDay]} />
          <Text>Available</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, styles.unavailableDay]} />
          <Text>Unavailable</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  navigationButton: {
    color: '#007AFF',
    fontSize: 16,
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
  },
  weekdayHeader: {
    width: '14.28%',
    paddingVertical: 8,
    alignItems: 'center',
  },
  weekdayText: {
    fontSize: 14,
    color: '#666',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    margin: 2,
  },
  dayText: {
    fontSize: 16,
  },
  availableDay: {
    backgroundColor: '#E8F5E9',
  },
  unavailableDay: {
    backgroundColor: '#FFEBEE',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 4,
    marginRight: 4,
  },
});

export default ScheduleScreen;