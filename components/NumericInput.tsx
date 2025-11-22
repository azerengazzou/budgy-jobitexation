import React from 'react';
import { TextInput, TextInputProps } from 'react-native';

interface NumericInputProps extends Omit<TextInputProps, 'keyboardType' | 'onChangeText'> {
  value: string;
  onChangeText: (text: string) => void;
  allowDecimals?: boolean;
  maxDecimals?: number;
}

// Utility function to normalize amounts to 3 decimal places
export const normalizeAmount = (value: string | number): number => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return isNaN(num) ? 0 : parseFloat(num.toFixed(3));
};

export const NumericInput: React.FC<NumericInputProps> = ({
  value,
  onChangeText,
  allowDecimals = true,
  maxDecimals = 3,
  ...props
}) => {
  const handleTextChange = (text: string) => {
    // Remove any non-numeric characters except decimal point
    let cleanText = text.replace(/[^0-9.]/g, '');
    
    if (!allowDecimals) {
      cleanText = cleanText.replace(/\./g, '');
    } else {
      // Ensure only one decimal point
      const parts = cleanText.split('.');
      if (parts.length > 2) {
        cleanText = parts[0] + '.' + parts.slice(1).join('');
      }
      
      // Limit decimal places
      if (parts.length === 2 && parts[1].length > maxDecimals) {
        cleanText = parts[0] + '.' + parts[1].substring(0, maxDecimals);
      }
    }
    
    // Prevent leading zeros (except for decimal numbers like 0.5)
    if (cleanText.length > 1 && cleanText[0] === '0' && cleanText[1] !== '.') {
      cleanText = cleanText.substring(1);
    }
    
    onChangeText(cleanText);
  };

  return (
    <TextInput
      {...props}
      value={value}
      onChangeText={handleTextChange}
      keyboardType="numeric"
    />
  );
};