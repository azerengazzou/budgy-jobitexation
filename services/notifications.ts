import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

class NotificationService {
  async requestPermissions(): Promise<boolean> {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
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

  async scheduleNotifications(): Promise<void> {
    const hasPermission = await this.requestPermissions();
    if (!hasPermission) return;

    // Cancel existing notifications
    await this.cancelNotifications();

    // ✅ Daily expense reminder (calendar trigger)
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'MyBudget Reminder', // Note: Notifications don't support i18n directly
        body: "Don't forget to log your expenses today!",
      },
      trigger: {
        hour: 20,
        minute: 41,
        repeats: true,
      },
    });

    // ✅ Weekly savings reminder (time interval trigger)
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Savings Goal', // Note: Notifications don't support i18n directly
        body: 'How about adding some money to your savings this week?',
      },
      trigger: {
        seconds: 60 * 60 * 24 * 7, // one week
        repeats: true,
      },
    });

    // Hourly expense reminder
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Budgeting Reminder',
        body: 'Did you stop tracking your expenses? Don\'t forget to log your expenses for today.',
      },
      trigger: {
        seconds: 60 * 60, // 1 hour
        repeats: true,
      },
    });
  }

  async cancelNotifications(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  async sendBudgetAlert(category: string, amount: number, limit: number, formatAmount: (amount: number) => string): Promise<void> {
    const hasPermission = await this.requestPermissions();
    if (!hasPermission) return;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Budget Alert!',
        body: `You've spent ${formatAmount(amount)} in ${category}, exceeding your limit of ${formatAmount(limit)}`,
      },
      trigger: null,
    });
  }
}

export const notificationService = new NotificationService();