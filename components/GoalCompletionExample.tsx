import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { GoalCompletionAnimation } from './GoalCompletionAnimation';
import { useGoalCompletionAnimation } from '@/hooks/useGoalCompletionAnimation';
import { Goal } from '@/app/interfaces/savings';

/**
 * Example usage of GoalCompletionAnimation
 * This demonstrates how to integrate the animation into your goal screens
 */
export const GoalCompletionExample: React.FC = () => {
  const [progress, setProgress] = useState(75);
  
  // Mock goal for demonstration
  const mockGoal: Goal = {
    id: '1',
    title: 'Vacation Fund',
    targetAmount: 1000,
    currentAmount: (progress / 100) * 1000,
    currency: 'EUR',
    status: progress >= 100 ? 'completed' : 'active',
    createdAt: new Date().toISOString(),
  };

  const {
    isAnimating,
    showAnimation,
    isComplete,
    currentProgress,
    handleAnimationFinished,
  } = useGoalCompletionAnimation({
    goal: mockGoal,
    onCompletionFinished: () => {
      console.log('🎉 Goal completed animation finished!');
    },
  });

  const completeGoal = () => {
    setProgress(100);
  };

  const resetGoal = () => {
    setProgress(75);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Goal Completion Animation Demo</Text>
      
      <GoalCompletionAnimation
        isComplete={isComplete}
        size={160}
        strokeWidth={12}
        progress={currentProgress}
        color="#10B981"
        onFinished={handleAnimationFinished}
      >
        <View style={styles.progressContent}>
          <Text style={styles.progressText}>
            {currentProgress.toFixed(0)}%
          </Text>
          <Text style={styles.progressLabel}>Complete</Text>
        </View>
      </GoalCompletionAnimation>

      <View style={styles.controls}>
        <TouchableOpacity 
          style={[styles.button, styles.completeButton]} 
          onPress={completeGoal}
          disabled={isAnimating}
        >
          <Text style={styles.buttonText}>Complete Goal</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.resetButton]} 
          onPress={resetGoal}
          disabled={isAnimating}
        >
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.status}>
        Status: {isAnimating ? 'Animating...' : isComplete ? 'Completed' : 'In Progress'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F9FAFB',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#1F2937',
  },
  progressContent: {
    alignItems: 'center',
  },
  progressText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  progressLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  controls: {
    flexDirection: 'row',
    marginTop: 40,
    gap: 16,
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  completeButton: {
    backgroundColor: '#10B981',
  },
  resetButton: {
    backgroundColor: '#6B7280',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  status: {
    marginTop: 20,
    fontSize: 16,
    color: '#6B7280',
  },
});