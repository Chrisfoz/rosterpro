import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface AvailabilitySelectorProps {
  value: boolean | null;
  onChange: (value: boolean) => void;
}

const AvailabilitySelector: React.FC<AvailabilitySelectorProps> = ({
  value,
  onChange,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.option,
          value === true && styles.selectedOption,
          styles.availableOption,
        ]}
        onPress={() => onChange(true)}
      >
        <Text
          style={[
            styles.optionText,
            value === true && styles.selectedOptionText,
          ]}
        >
          Available
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.option,
          value === false && styles.selectedOption,
          styles.unavailableOption,
        ]}
        onPress={() => onChange(false)}
      >
        <Text
          style={[
            styles.optionText,
            value === false && styles.selectedOptionText,
          ]}
        >
          Unavailable
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
  },
  option: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedOption: {
    borderColor: 'transparent',
  },
  availableOption: {
    backgroundColor: '#E8F5E9',
  },
  unavailableOption: {
    backgroundColor: '#FFEBEE',
  },
  optionText: {
    fontSize: 14,
    color: '#666',
  },
  selectedOptionText: {
    color: '#333',
    fontWeight: '500',
  },
});

export default AvailabilitySelector;