import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const ProfileScreen = () => {
  const queryClient = useQueryClient();

  // Fetch user preferences
  const { data: preferences, isLoading } = useQuery(['preferences'], async () => {
    const response = await fetch('/api/preferences');
    return response.json();
  });

  // Update preferences mutation
  const updatePreference = useMutation(
    async ({ key, value }: { key: string; value: any }) => {
      const response = await fetch('/api/preferences', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          [key]: value,
        }),
      });
      return response.json();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['preferences']);
      },
    }
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Language Skills</Text>
        <View style={styles.preferenceItem}>
          <Text>English</Text>
          <View style={styles.pickerContainer}>
            {['None', 'Basic', 'Fluent'].map((level) => (
              <TouchableOpacity
                key={level}
                style={[
                  styles.levelButton,
                  preferences?.languageSkills?.english === level.toLowerCase() &&
                    styles.selectedLevel,
                ]}
                onPress={() =>
                  updatePreference.mutate({
                    key: 'languageSkills.english',
                    value: level.toLowerCase(),
                  })
                }
              >
                <Text
                  style={[
                    styles.levelText,
                    preferences?.languageSkills?.english === level.toLowerCase() &&
                      styles.selectedLevelText,
                  ]}
                >
                  {level}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.preferenceItem}>
          <Text>Italian</Text>
          <View style={styles.pickerContainer}>
            {['None', 'Basic', 'Fluent'].map((level) => (
              <TouchableOpacity
                key={level}
                style={[
                  styles.levelButton,
                  preferences?.languageSkills?.italian === level.toLowerCase() &&
                    styles.selectedLevel,
                ]}
                onPress={() =>
                  updatePreference.mutate({
                    key: 'languageSkills.italian',
                    value: level.toLowerCase(),
                  })
                }
              >
                <Text
                  style={[
                    styles.levelText,
                    preferences?.languageSkills?.italian === level.toLowerCase() &&
                      styles.selectedLevelText,
                  ]}
                >
                  {level}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Serving Preferences</Text>
        <View style={styles.preferenceItem}>
          <Text>Serve with family</Text>
          <Switch
            value={preferences?.serveWithFamily}
            onValueChange={(value) =>
              updatePreference.mutate({
                key: 'serveWithFamily',
                value,
              })
            }
          />
        </View>

        <View style={styles.preferenceItem}>
          <Text>Maximum services per month</Text>
          <View style={styles.pickerContainer}>
            {[1, 2, 3, 4].map((num) => (
              <TouchableOpacity
                key={num}
                style={[
                  styles.levelButton,
                  preferences?.maxServicesPerMonth === num && styles.selectedLevel,
                ]}
                onPress={() =>
                  updatePreference.mutate({
                    key: 'maxServicesPerMonth',
                    value: num,
                  })
                }
              >
                <Text
                  style={[
                    styles.levelText,
                    preferences?.maxServicesPerMonth === num &&
                      styles.selectedLevelText,
                  ]}
                >
                  {num}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <View style={styles.preferenceItem}>
          <Text>Roster Updates</Text>
          <Switch
            value={preferences?.notifications?.rosterUpdates}
            onValueChange={(value) =>
              updatePreference.mutate({
                key: 'notifications.rosterUpdates',
                value,
              })
            }
          />
        </View>
        <View style={styles.preferenceItem}>
          <Text>Reminders</Text>
          <Switch
            value={preferences?.notifications?.reminders}
            onValueChange={(value) =>
              updatePreference.mutate({
                key: 'notifications.reminders',
                value,
              })
            }
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  preferenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  pickerContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  levelButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedLevel: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  levelText: {
    color: '#333',
  },
  selectedLevelText: {
    color: '#fff',
  },
});

export default ProfileScreen;