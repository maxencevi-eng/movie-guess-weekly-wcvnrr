
import React from 'react';
import { Tabs } from 'expo-router';
import { IconSymbol } from '../../components/IconSymbol';
import { colors } from '../../styles/commonStyles';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.grey,
        tabBarStyle: {
          backgroundColor: colors.backgroundAlt,
          borderTopColor: colors.grey,
          borderTopWidth: 1,
        },
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="game"
        options={{
          title: 'Game',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <IconSymbol name="play.circle" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="leaderboard"
        options={{
          title: 'Leaderboard',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <IconSymbol name="trophy" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <IconSymbol name="person.circle" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
