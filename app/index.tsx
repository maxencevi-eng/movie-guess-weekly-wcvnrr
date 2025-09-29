
import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { Redirect } from 'expo-router';
import { useAuth } from '../hooks/useAuth';
import { commonStyles } from '../styles/commonStyles';

export default function IndexScreen() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={commonStyles.container}>
        <Text style={commonStyles.text}>Loading...</Text>
      </View>
    );
  }

  if (user) {
    return <Redirect href="/(tabs)/game" />;
  }

  return <Redirect href="/(auth)/login" />;
}
