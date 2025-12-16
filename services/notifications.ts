import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from './i18n';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

interface FinancialData {
  revenues: any[];
  expenses: any[];
  goals: any[];
}

class SmartNotificationService {
  private lastNotificationDate: { [key: string]: string } = {};

  async requestPermissions(): Promise<boolean> {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('budgy_smart', {
        name: 'Budgy Smart Alerts',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#3B82F6',
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      return finalStatus === 'granted';
    }

    return false;
  }

  private async canSendNotification(key: string): Promise<boolean> {
    const today = new Date().toDateString();
    const lastSent = this.lastNotificationDate[key];
    
    if (lastSent === today) return false;
    
    this.lastNotificationDate[key] = today;
    return true;
  }

  async analyzeBudgetThresholds(data: FinancialData): Promise<void> {
    const hasPermission = await this.requestPermissions();
    if (!hasPermission) return;

    const totalRevenues = data.revenues.reduce((sum, r) => sum + r.amount, 0);
    const totalExpenses = data.expenses.reduce((sum, e) => sum + e.amount, 0);
    const expenseRate = totalRevenues > 0 ? (totalExpenses / totalRevenues) * 100 : 0;

    // Critical: 85%+ spending
    if (expenseRate >= 85 && await this.canSendNotification('budget_critical')) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: i18n.t('notif_budget_critical_title'),
          body: i18n.t('notif_budget_critical_body', { rate: Math.round(expenseRate) }),
        },
        trigger: null,
      });
    }
    // Warning: 70-85% spending
    else if (expenseRate >= 70 && await this.canSendNotification('budget_warning')) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: i18n.t('notif_budget_warning_title'),
          body: i18n.t('notif_budget_warning_body', { rate: Math.round(expenseRate) }),
        },
        trigger: null,
      });
    }
  }

  async analyzeGoalProgress(goals: any[]): Promise<void> {
    const hasPermission = await this.requestPermissions();
    if (!hasPermission) return;

    for (const goal of goals) {
      if (goal.status !== 'active') continue;
      
      const progress = (goal.currentAmount / goal.targetAmount) * 100;
      const key = `goal_${goal.id}`;

      // Milestone notifications: 25%, 50%, 75%, 90%
      if (progress >= 90 && await this.canSendNotification(`${key}_90`)) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: i18n.t('notif_goal_almost_title'),
            body: i18n.t('notif_goal_almost_body', { title: goal.title }),
          },
          trigger: null,
        });
      } else if (progress >= 75 && await this.canSendNotification(`${key}_75`)) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: i18n.t('notif_goal_progress_title'),
            body: i18n.t('notif_goal_75_body', { title: goal.title }),
          },
          trigger: null,
        });
      } else if (progress >= 50 && await this.canSendNotification(`${key}_50`)) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: i18n.t('notif_goal_progress_title'),
            body: i18n.t('notif_goal_50_body', { title: goal.title }),
          },
          trigger: null,
        });
      } else if (progress >= 25 && await this.canSendNotification(`${key}_25`)) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: i18n.t('notif_goal_progress_title'),
            body: i18n.t('notif_goal_25_body', { title: goal.title }),
          },
          trigger: null,
        });
      }
    }
  }

  async analyzeFinancialHealth(data: FinancialData): Promise<void> {
    const hasPermission = await this.requestPermissions();
    if (!hasPermission) return;

    const totalRevenues = data.revenues.reduce((sum, r) => sum + r.amount, 0);
    const totalExpenses = data.expenses.reduce((sum, e) => sum + e.amount, 0);
    const totalSavings = data.goals.reduce((sum, g) => sum + g.currentAmount, 0);
    
    const expenseRate = totalRevenues > 0 ? (totalExpenses / totalRevenues) * 100 : 0;
    const savingsRate = totalRevenues > 0 ? (totalSavings / totalRevenues) * 100 : 0;
    const healthScore = Math.max(0, Math.min(100, 100 - expenseRate + savingsRate));

    // Poor health: score < 40
    if (healthScore < 40 && await this.canSendNotification('health_poor')) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: i18n.t('notif_health_poor_title'),
          body: i18n.t('notif_health_poor_body'),
        },
        trigger: null,
      });
    }
    // Fair health: score 40-60
    else if (healthScore < 60 && await this.canSendNotification('health_fair')) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: i18n.t('notif_health_fair_title'),
          body: i18n.t('notif_health_fair_body'),
        },
        trigger: null,
      });
    }
  }

  async sendDailyAdvice(data: FinancialData): Promise<void> {
    const hasPermission = await this.requestPermissions();
    if (!hasPermission || !await this.canSendNotification('daily_advice')) return;

    const totalRevenues = data.revenues.reduce((sum, r) => sum + r.amount, 0);
    const totalExpenses = data.expenses.reduce((sum, e) => sum + e.amount, 0);
    const savingsRate = totalRevenues > 0 ? ((data.goals.reduce((sum, g) => sum + g.currentAmount, 0) / totalRevenues) * 100) : 0;

    const adviceList = [
      { condition: totalRevenues === 0, key: 'advice_start_tracking' },
      { condition: savingsRate < 10, key: 'advice_increase_savings' },
      { condition: savingsRate >= 20, key: 'advice_excellent_savings' },
      { condition: totalExpenses > totalRevenues, key: 'advice_reduce_spending' },
      { condition: data.goals.length === 0, key: 'advice_set_goals' },
    ];

    const applicable = adviceList.filter(a => a.condition);
    if (applicable.length > 0) {
      const advice = applicable[Math.floor(Math.random() * applicable.length)];
      await Notifications.scheduleNotificationAsync({
        content: {
          title: i18n.t('notif_daily_advice_title'),
          body: i18n.t(`notif_${advice.key}`),
        },
        trigger: null,
      });
    }
  }

  async scheduleDailyAdvice(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
    
    await Notifications.scheduleNotificationAsync({
      content: {
        title: i18n.t('notif_daily_advice_title'),
        body: i18n.t('notif_check_finances'),
      },
      trigger: {
        hour: 9,
        minute: 0,
        repeats: true,
      },
    });
  }

  async cancelNotifications(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }
}

export const smartNotificationService = new SmartNotificationService();