
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { LeaderboardCard } from '../../components/LeaderboardCard';
import { mockLeaderboard } from '../../data/mockData';
import { colors, commonStyles } from '../../styles/commonStyles';

export default function LeaderboardScreen() {
  const { user } = useAuth();

  return (
    <ScrollView style={commonStyles.wrapper} contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={commonStyles.title}>🏆 Leaderboard</Text>
        <Text style={styles.subtitle}>
          Rankings updated every Sunday at 12 AM
        </Text>
      </View>

      <View style={styles.leaderboardContainer}>
        {mockLeaderboard.map((item, index) => (
          <LeaderboardCard
            key={item.userId}
            item={item}
            isCurrentUser={item.userId === user?.id}
          />
        ))}
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>Scoring System:</Text>
        <Text style={styles.infoText}>🥇 6 points - Correct guess after 1st image</Text>
        <Text style={styles.infoText}>🥈 3 points - Correct guess after 2nd image</Text>
        <Text style={styles.infoText}>🥉 1 point - Correct guess after 3rd image</Text>
        <Text style={styles.infoText}>❌ 0 points - Incorrect guess</Text>
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
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  subtitle: {
    fontSize: 14,
    color: colors.grey,
    marginTop: 4,
    textAlign: 'center',
  },
  leaderboardContainer: {
    paddingVertical: 8,
  },
  infoSection: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: colors.grey,
    marginBottom: 8,
    lineHeight: 20,
  },
});
