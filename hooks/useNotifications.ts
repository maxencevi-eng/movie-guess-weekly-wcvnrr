
import { useState, useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NotificationSettings } from '../types';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const useNotifications = () => {
  const [expoPushToken, setExpoPushToken] = useState<string>('');
  const [settings, setSettings] = useState<NotificationSettings>({
    gameStart: true,
    newImage: true,
    leaderboardUpdate: true
  });

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => {
      if (token) {
        setExpoPushToken(token);
      }
    });
    
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem('notificationSettings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.log('Error loading notification settings:', error);
    }
  };

  const updateSettings = async (newSettings: NotificationSettings) => {
    try {
      setSettings(newSettings);
      await AsyncStorage.setItem('notificationSettings', JSON.stringify(newSettings));
    } catch (error) {
      console.log('Error updating notification settings:', error);
    }
  };

  const registerForPushNotificationsAsync = async (): Promise<string | undefined> => {
    let token;

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
      if (finalStatus !== 'granted') {
        console.log('Failed to get push token for push notification!');
        return;
      }
      try {
        token = (await Notifications.getExpoPushTokenAsync()).data;
        console.log('Expo push token:', token);
      } catch (e) {
        console.log('Error getting push token:', e);
      }
    } else {
      console.log('Must use physical device for Push Notifications');
    }

    return token;
  };

  const scheduleGameStartNotification = async () => {
    if (!settings.gameStart) return;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "🎬 Nouveau Concours Ciné Commencé!",
        body: "Un nouveau film est prêt à être deviné. Découvrez le premier indice!",
        data: { type: 'gameStart' },
      },
      trigger: null, // Send immediately
    });
  };

  const scheduleNewImageNotification = async () => {
    if (!settings.newImage) return;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "📸 Nouvel Indice Disponible!",
        body: "Un nouvel indice image a été publié pour le film de cette semaine!",
        data: { type: 'newImage' },
      },
      trigger: null,
    });
  };

  const scheduleLeaderboardNotification = async () => {
    if (!settings.leaderboardUpdate) return;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "🏆 Classement Mis à Jour!",
        body: "Vérifiez votre classement dans le concours ciné de cette semaine!",
        data: { type: 'leaderboard' },
      },
      trigger: null,
    });
  };

  return {
    expoPushToken,
    settings,
    updateSettings,
    scheduleGameStartNotification,
    scheduleNewImageNotification,
    scheduleLeaderboardNotification
  };
};
