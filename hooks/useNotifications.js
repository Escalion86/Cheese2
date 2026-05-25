import { useEffect, useRef, useState, useCallback } from 'react'
import { Platform } from 'react-native'
import * as Notifications from 'expo-notifications'
import {
  registerForPushNotificationsAsync,
  getInitialNotification,
} from '../services/notifications'

/**
 * React hook for Expo Notifications.
 * Handles token registration, foreground/background listeners,
 * and notification tap navigation.
 *
 * @param {object} options
 * @param {function} options.onNotificationTap - Called when user taps a notification.
 *   Receives the notification response object.
 * @returns {{ pushToken: string|null, notification: object|null }}
 */
export function useNotifications({ onNotificationTap } = {}) {
  const [pushToken, setPushToken] = useState(null)
  const [notification, setNotification] = useState(null)
  const notificationListener = useRef(null)
  const responseListener = useRef(null)

  const handleNotificationTap = useCallback(
    (response) => {
      setNotification(response)
      if (onNotificationTap) {
        onNotificationTap(response)
      }
    },
    [onNotificationTap]
  )

  useEffect(() => {
    // Register for push notifications on mount
    registerForPushNotificationsAsync().then((token) => {
      if (token) {
        setPushToken(token)
      }
    })

    // Check if app was opened from a notification
    getInitialNotification().then((initialNotification) => {
      if (initialNotification) {
        handleNotificationTap(initialNotification)
      }
    })

    // Listener for notifications received while app is in foreground
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification)
      })

    // Listener for user tapping a notification
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener(
        handleNotificationTap
      )

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(
          notificationListener.current
        )
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current)
      }
    }
  }, [handleNotificationTap])

  return { pushToken, notification }
}

export default useNotifications
