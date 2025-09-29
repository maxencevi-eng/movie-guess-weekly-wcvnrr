
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, Alert } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../hooks/useNotifications';
import { Button } from '../../components/button';
import { IconCircle } from '../../components/IconCircle';
import { colors, commonStyles } from '../../styles/commonStyles';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { settings, updateSettings } = useNotifications();

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/(auth)/login');
          }
        }
      ]
    );
  };

  const handleNotificationToggle = (key: keyof typeof settings) => {
    updateSettings({
      ...settings,
      [key]: !settings[key]
    });
  };

  if (!user) {
    return (
      <View style={commonStyles.container}>
        <Text style={commonStyles.text}>Please sign in to view your profile.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={commonStyles.wrapper} contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <IconCircle 
          emoji="🎬" 
          size={80} 
          backgroundColor={colors.primary}
        />
        <Text style={styles.username}>{user.username}</Text>
        <Text style={styles.email}>{user.email}</Text>
        {user.isAdmin && (
          <View style={styles.adminBadge}>
            <Text style={styles.adminText}>Admin</Text>
          </View>
        )}
      </View>

      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>Your Stats</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{user.totalPoints}</Text>
            <Text style={styles.statLabel}>Total Points</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{user.weeklyPoints}</Text>
            <Text style={styles.statLabel}>This Week</Text>
          </View>
        </View>
      </View>

      <View style={styles.notificationsSection}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        
        <View style={styles.notificationItem}>
          <View style={styles.notificationInfo}>
            <Text style={styles.notificationTitle}>Game Start</Text>
            <Text style={styles.notificationDesc}>When a new movie quiz begins</Text>
          </View>
          <Switch
            value={settings.gameStart}
            onValueChange={() => handleNotificationToggle('gameStart')}
            trackColor={{ false: colors.grey, true: colors.accent }}
            thumbColor={colors.text}
          />
        </View>

        <View style={styles.notificationItem}>
          <View style={styles.notificationInfo}>
            <Text style={styles.notificationTitle}>New Images</Text>
            <Text style={styles.notificationDesc}>When new clues are released</Text>
          </View>
          <Switch
            value={settings.newImage}
            onValueChange={() => handleNotificationToggle('newImage')}
            trackColor={{ false: colors.grey, true: colors.accent }}
            thumbColor={colors.text}
          />
        </View>

        <View style={styles.notificationItem}>
          <View style={styles.notificationInfo}>
            <Text style={styles.notificationTitle}>Leaderboard</Text>
            <Text style={styles.notificationDesc}>Weekly ranking updates</Text>
          </View>
          <Switch
            value={settings.leaderboardUpdate}
            onValueChange={() => handleNotificationToggle('leaderboardUpdate')}
            trackColor={{ false: colors.grey, true: colors.accent }}
            thumbColor={colors.text}
          />
        </View>
      </View>

      {user.isAdmin && (
        <View style={styles.adminSection}>
          <Button
            onPress={() => router.push('/(admin)/dashboard')}
            style={styles.adminButton}
          >
            Admin Dashboard
          </Button>
        </View>
      )}

      <View style={styles.actionsSection}>
        <Button
          onPress={handleLogout}
          variant="outline"
          style={styles.logoutButton}
        >
          Sign Out
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  username: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginTop: 16,
  },
  email: {
    fontSize: 16,
    color: colors.grey,
    marginTop: 4,
  },
  adminBadge: {
    backgroundColor: colors.accent,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },
  adminText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.background,
  },
  statsSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.backgroundAlt,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.accent,
  },
  statLabel: {
    fontSize: 12,
    color: colors.grey,
    marginTop: 4,
  },
  notificationsSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.backgroundAlt,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  notificationInfo: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  notificationDesc: {
    fontSize: 12,
    color: colors.grey,
    marginTop: 2,
  },
  adminSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  adminButton: {
    backgroundColor: colors.accent,
  },
  actionsSection: {
    paddingHorizontal: 16,
  },
  logoutButton: {
    borderColor: colors.grey,
  },
});
