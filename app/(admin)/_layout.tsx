
import React from 'react';
import { Stack } from 'expo-router';
import { colors } from '../../styles/commonStyles';

export default function AdminLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Stack.Screen 
        name="dashboard" 
        options={{ 
          title: 'Admin Dashboard',
          headerBackTitle: 'Back'
        }} 
      />
      <Stack.Screen 
        name="upload" 
        options={{ 
          title: 'Upload Movie',
          headerBackTitle: 'Dashboard'
        }} 
      />
    </Stack>
  );
}
