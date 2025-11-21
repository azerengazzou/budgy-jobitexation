import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  interpolateColor,
  runOnJS,
  Easing,
  useAnimatedProps,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import { Check } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

interface GoalCompletionAnimationProps {
  isComplete: boolean;
  size?: number;
  strokeWidth?: number;
  progress: number; // 0-100
  color?: string;
  onFinished?: () => void;
  children?: React.ReactNode;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export const GoalCompletionAnimation: React.FC<GoalCompletionAnimationProps> = ({
  isComplete,
  size = 160,
  strokeWidth = 12,
  progress,
  color = '#10B981',
  onFinished,
  children,
}) => {
  // Shared values for animations
  const animatedProgress = useSharedValue(progress);
  const pulseScale = useSharedValue(1);
  const glowOpacity = useSharedValue(0);
  const ringOpacity = useSharedValue(1);
  const checkOpacity = useSharedValue(0);
  const checkScale = useSharedValue(0.5);

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  // Trigger haptic feedback
  const triggerHaptic = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  // Animation sequence when goal completes
  useEffect(() => {
    if (isComplete && progress >= 100) {
      // Step 1: Animate progress to 100% smoothly
      animatedProgress.value = withTiming(100, {
        duration: 600,
        easing: Easing.out(Easing.cubic),
      });

      // Step 2: Pulse animation with haptic feedback
      pulseScale.value = withSequence(
        withDelay(400, withTiming(1.08, { duration: 200 })),
        withTiming(1.0, { duration: 200 }, () => {
          runOnJS(triggerHaptic)();
        })
      );

      // Step 3: Glow effect
      glowOpacity.value = withSequence(
        withDelay(600, withTiming(1, { duration: 200 })),
        withTiming(0, { duration: 300 })
      );

      // Step 4: Crossfade to checkmark
      ringOpacity.value = withDelay(800, withTiming(0, { duration: 300 }));
      checkOpacity.value = withDelay(800, withTiming(1, { duration: 300 }));
      checkScale.value = withDelay(800, 
        withTiming(1, { duration: 300, easing: Easing.back(1.2) }, () => {
          if (onFinished) {
            runOnJS(onFinished)();
          }
        })
      );
    } else {
      // Reset animations for non-complete state
      animatedProgress.value = withTiming(progress, { duration: 300 });
      pulseScale.value = 1;
      glowOpacity.value = 0;
      ringOpacity.value = 1;
      checkOpacity.value = 0;
      checkScale.value = 0.5;
    }
  }, [isComplete, progress]);

  // Animated styles
  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));
  
  const shadowStyle = {
    shadowColor: color,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 10,
  };

  const ringStyle = useAnimatedStyle(() => ({
    opacity: ringOpacity.value,
  }));

  const checkStyle = useAnimatedStyle(() => ({
    opacity: checkOpacity.value,
    transform: [{ scale: checkScale.value }],
  }));
const animatedCircleProps = useAnimatedProps(() => {
  const strokeDashoffset =
    circumference - (animatedProgress.value / 100) * circumference;

  return {
    strokeDashoffset,
  };
});

  return (
    <Animated.View style={[{ width: size, height: size }, containerStyle]}>
      {/* Glow effect container */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: 'transparent',
          },
          shadowStyle,
          glowStyle,
        ]}
      />

      {/* Progress Ring */}
      <Animated.View style={[{ position: 'absolute' }, ringStyle]}>
        <Svg width={size} height={size}>
          {/* Background circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(255, 255, 255, 0.2)"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress circle */}
          <AnimatedCircle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            animatedProps={animatedCircleProps}
          />
        </Svg>
      </Animated.View>

      {/* Checkmark Icon */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: color,
            borderRadius: size / 2,
          },
          checkStyle,
        ]}
      >
        <Check size={size * 0.4} color="white" strokeWidth={3} />
      </Animated.View>

      {/* Children content (percentage text, etc.) */}
      {children && !isComplete && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {children}
        </View>
      )}
    </Animated.View>
  );
};