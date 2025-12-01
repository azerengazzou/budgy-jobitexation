import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';
import { CheckCircle } from 'lucide-react-native';

interface CompletionCelebrationProps {
  isCompleted: boolean;
}

export const CompletionCelebration: React.FC<CompletionCelebrationProps> = ({ isCompleted }) => {
  const sparkleAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isCompleted) {
      // Sparkle animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(sparkleAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(sparkleAnim, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Pulse animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [isCompleted]);

  if (!isCompleted) return null;

  return (
    <View style={{ position: 'absolute', top: -5, right: -5 }}>
      <Animated.View
        style={{
          transform: [{ scale: pulseAnim }],
          backgroundColor: '#10B981',
          borderRadius: 20,
          padding: 6,
          shadowColor: '#10B981',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.4,
          shadowRadius: 6,
          elevation: 6,
        }}
      >
        <CheckCircle size={16} color="#FFFFFF" />
      </Animated.View>
      
      {/* Sparkle effects */}
      <Animated.View
        style={{
          position: 'absolute',
          top: -2,
          left: -2,
          opacity: sparkleAnim,
          transform: [
            {
              rotate: sparkleAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '360deg'],
              }),
            },
          ],
        }}
      >
        <View style={{
          width: 4,
          height: 4,
          backgroundColor: '#10B981',
          borderRadius: 2,
        }} />
      </Animated.View>
      
      <Animated.View
        style={{
          position: 'absolute',
          bottom: -2,
          right: -2,
          opacity: sparkleAnim,
          transform: [
            {
              rotate: sparkleAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['180deg', '540deg'],
              }),
            },
          ],
        }}
      >
        <View style={{
          width: 3,
          height: 3,
          backgroundColor: '#059669',
          borderRadius: 1.5,
        }} />
      </Animated.View>
    </View>
  );
};