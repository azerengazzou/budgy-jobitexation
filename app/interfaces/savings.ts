export type GoalStatus = 'active' | 'completed' | 'paused' | 'archived';

export interface Goal {
  id: string;
  title: string;
  description?: string;
  emoji?: string;
  targetAmount: number;
  currentAmount: number;
  currency: string;
  createdAt: string;
  updatedAt?: string;
  deadline?: string | null;
  category?: string;
  status: GoalStatus;
  isAutoSaveEnabled?: boolean;
  autoSaveRuleId?: string | null;
  metadata?: Record<string, any>;
}

export type SavingsTransactionType = 'deposit' | 'withdrawal';

export interface SavingsTransaction {
  id: string;
  goalId: string;
  amount: number;
  type: SavingsTransactionType;
  description?: string;
  date: string;
  revenueSourceId?: string; // Link to revenue source if deducted from income
}

export interface GoalCategory {
  id: string;
  name: string;
  emoji: string;
  color: string;
}

export const DEFAULT_GOAL_CATEGORIES: GoalCategory[] = [
  { id: 'emergency', name: 'emergency_fund', emoji: '🚨', color: '#EF4444' },
  { id: 'vacation', name: 'vacation', emoji: '✈️', color: '#3B82F6' },
  { id: 'house', name: 'house_property', emoji: '🏠', color: '#10B981' },
  { id: 'car', name: 'car_vehicle', emoji: '🚗', color: '#F59E0B' },
  { id: 'education', name: 'education', emoji: '📚', color: '#8B5CF6' },
  { id: 'other', name: 'other', emoji: '💰', color: '#6B7280' },
];