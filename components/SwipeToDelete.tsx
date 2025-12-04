import React, { useRef } from 'react';
import { View, Animated, PanResponder } from 'react-native';
import { Trash2 } from 'lucide-react-native';

interface SwipeToDeleteProps {
  children: React.ReactNode;
  onDelete: (onCancel: () => void) => void;
}

export const SwipeToDelete: React.FC<SwipeToDeleteProps> = ({
  children,
  onDelete,
}) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const resetPosition = () => {
    Animated.parallel([
      Animated.spring(translateX, {
        toValue: 0,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => {
      return Math.abs(gestureState.dx) > 10 && Math.abs(gestureState.dy) < 50;
    },
    onPanResponderMove: (_, gestureState) => {
      if (gestureState.dx < 0) {
        translateX.setValue(gestureState.dx);
      }
    },
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dx < -80) {
        onDelete(resetPosition);
      } else {
        resetPosition();
      }
    },
  });

  const deleteOpacity = translateX.interpolate({
    inputRange: [-100, -20, 0],
    outputRange: [1, 0.3, 0],
    extrapolate: 'clamp',
  });

  return (
    <View style={{ position: 'relative' }}>
      <Animated.View
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: 80,
          backgroundColor: '#EF4444',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 12,
          opacity: deleteOpacity,
        }}
      >
        <Trash2 size={24} color="white" />
      </Animated.View>

      <Animated.View
        {...panResponder.panHandlers}
        style={{
          transform: [{ translateX }],
          opacity,
        }}
      >
        {children}
      </Animated.View>
    </View>
  );
};