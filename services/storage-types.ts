export interface AppSettings {
  currency: string;
  language: string;
  notificationsEnabled: boolean;
}

export interface Saving {
  id: string;
  amount: number;
  description: string;
  date: string;
  type: 'manual' | 'goal' | 'automatic';
}

export const STORAGE_KEYS = {
  USER_PROFILE: 'user_profile',
  ONBOARDING_COMPLETE: 'onboarding_complete',
  REVENUES: 'revenues',
  EXPENSES: 'expenses',
  SAVINGS: 'savings',
  GOALS: 'goals',
  CATEGORIES: 'categories',
  SETTINGS: 'settings',
  REVENUE_TRANSACTIONS: 'revenue_transactions',
} as const;