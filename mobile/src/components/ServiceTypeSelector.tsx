import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface ServiceTypeSelectorProps {
  value: 'english' | 'italian';
  onChange: (value: 'english' | 'italian') => void;
}

const ServiceTypeSelector: React.FC<ServiceTypeSelectorProps> = ({
  value,
  onChange,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.option,
          value === 'english' && styles.selectedOption,
        ]}
        onPress={() => onChange('english')}
      >
        <Text
          style={[
            styles.optionText,
            value === 'english' && styles.selectedOptionText,
          ]}
        >
          English
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.option,
          value === 'italian' && styles.selectedOption,
        ]}
        onPress={() => onChange('italian')}
      >
        <Text
          style={[
            styles.optionText,
            value === 'italian' && styles.selectedOptionText,
          ]}
        >
          Italian
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    padding: 4,
    borderRadius: 8,
  },
  option: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  selectedOption: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
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

export default ServiceTypeSelector;