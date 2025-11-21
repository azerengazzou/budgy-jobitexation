import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface RequiredFieldIndicatorProps {
  label: string;
  required?: boolean;
  style?: any;
}

export const RequiredFieldIndicator: React.FC<RequiredFieldIndicatorProps> = ({
  label,
  required = false,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.label}>{label}</Text>
      {required && <Text style={styles.asterisk}>*</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  asterisk: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
    marginLeft: 4,
  },
});