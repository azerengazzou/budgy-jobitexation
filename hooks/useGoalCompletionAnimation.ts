import { useEffect, useState, useRef } from 'react';
import { Goal } from '@/app/interfaces/savings';

interface UseGoalCompletionAnimationProps {
  goal: Goal;
  onCompletionFinished?: () => void;
}

export const useGoalCompletionAnimation = ({
  goal,
  onCompletionFinished,
}: UseGoalCompletionAnimationProps) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const previousProgressRef = useRef(0);
  const hasTriggeredRef = useRef(false);

  // Safe calculation with null checks and empty goal handling
  const isValidGoal = goal && goal.id && goal.targetAmount > 0;
  const currentProgress = isValidGoal
    ? Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)
    : 0;

  const isComplete = goal.status === "completed";

  useEffect(() => {
    if (!isValidGoal) return;

    const previousProgress = previousProgressRef.current;

    // Check if goal just reached 100% (transition from <100% to 100%)
    const justCompleted =
      previousProgress < 100 &&
      currentProgress >= 100 &&
      !hasTriggeredRef.current;

    if (justCompleted) {
      setIsAnimating(true);
      setShowAnimation(true);
      hasTriggeredRef.current = true;
    }

    previousProgressRef.current = currentProgress;
  }, [currentProgress, isValidGoal]);

  const handleAnimationFinished = () => {
    setIsAnimating(false);
    if (onCompletionFinished) {
      onCompletionFinished();
    }
  };

  const resetAnimation = () => {
    setIsAnimating(false);
    setShowAnimation(false);
    hasTriggeredRef.current = false;
  };

  return {
    isAnimating,
    showAnimation,
    isComplete,
    currentProgress,
    handleAnimationFinished,
    resetAnimation,
  };
};