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
        title: 'MyBudget Reminder',
        body: "Don't forget to log your expenses today!",
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.CALENDAR, // ✅ TS-safe
        hour: 20,
        minute: 0,
        repeats: true,
      },
    });

    // ✅ Weekly savings reminder (time interval trigger)
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Savings Goal',
        body: 'How about adding some money to your savings this week?',
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, // ✅ TS-safe
        seconds: 60 * 60 * 24 * 7, // one week
        repeats: true,
      },
    });
  }

  async cancelNotifications(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  async sendBudgetAlert(category: string, amount: number, limit: number): Promise<void> {
    const hasPermission = await this.requestPermissions();
    if (!hasPermission) return;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Budget Alert!',
        body: `You've spent €${amount.toFixed(2)} in ${category}, exceeding your limit of €${limit.toFixed(2)}`,
      },
      trigger: null, // send immediately
    });
  }
}

export const notificationService = new NotificationService();