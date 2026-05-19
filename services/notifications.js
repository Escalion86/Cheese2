import * as Notifications from 'expo-notifications'
import * as Device from 'expo-device'
import { Platform } from 'react-native'

// Configure how notifications appear when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
})

const ANDROID_CHANNEL_ID = 'default'

/**
 * Create Android notification channel (required for Android 8+)
 */
async function createAndroidNotificationChannel() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(ANDROID_CHANNEL_ID, {
      name: 'Default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
      sound: undefined,
      enableVibrate: true,
      showBadge: true,
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
    })
  }
}

/**
 * Request notification permissions and return the Expo push token.
 * Returns null if permissions are denied or device is not physical.
 */
export async function registerForPushNotificationsAsync() {
  // Notifications only work on physical devices
  if (!Device.isDevice) {
    console.log('Push notifications require a physical device')
    return null
  }

  // Check existing permissions
  const { status: existingStatus } = await Notifications.getPermissionsAsync()
  let finalStatus = existingStatus

  // Request permission if not already granted
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync()
    finalStatus = status
  }

  if (finalStatus !== 'granted') {
    console.log('Notification permission denied')
    return null
  }

  // Create Android channel
  await createAndroidNotificationChannel()

  // Get the Expo push token
  try {
    const tokenData = await Notifications.getExpoPushTokenAsync()
    console.log('Expo push token:', tokenData.data)
    return tokenData.data
  } catch (error) {
    console.error('Failed to get push token:', error)
    return null
  }
}

/**
 * Get the notification that opened the app (if any).
 * Call after the app has finished rendering.
 */
export async function getInitialNotification() {
  const notification = await Notifications.getLastNotificationResponseAsync()
  return notification
}

/**
 * Schedule a local notification
 */
export async function scheduleLocalNotification(title, body, data = {}, seconds = 1) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data,
      sound: false,
    },
    trigger: { seconds },
  })
}

/**
 * Cancel all scheduled notifications
 */
export async function cancelAllScheduledNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync()
}

/**
 * Set the app icon badge number (iOS)
 */
export async function setBadgeCount(count) {
  await Notifications.setBadgeCountAsync(count)
}

export { Notifications, ANDROID_CHANNEL_ID }
