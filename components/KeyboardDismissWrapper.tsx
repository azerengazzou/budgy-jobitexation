import React from 'react';
import { Keyboard, Pressable } from 'react-native';

interface KeyboardDismissWrapperProps {
  children: React.ReactNode;
  style?: any;
}

export const KeyboardDismissWrapper: React.FC<KeyboardDismissWrapperProps> = ({
  children,
  style,
}) => {
  return (
    <Pressable style={[{ flex: 1 }, style]} onPress={Keyboard.dismiss}>
      {children}
    </Pressable>
  );
};