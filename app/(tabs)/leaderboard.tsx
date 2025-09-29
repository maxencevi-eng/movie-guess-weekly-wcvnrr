
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
        <Text style={commonStyles.title}>🏆 Classement</Text>
        <Text style={styles.subtitle}>
          Classements mis à jour chaque dimanche à minuit
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
        <Text style={styles.infoTitle}>Système de Points :</Text>
        <Text style={styles.infoText}>🥇 6 points - Bonne réponse après la 1ère image</Text>
        <Text style={styles.infoText}>🥈 3 points - Bonne réponse après la 2ème image</Text>
        <Text style={styles.infoText}>🥉 1 point - Bonne réponse après la 3ème image</Text>
        <Text style={styles.infoText}>❌ 0 point - Mauvaise réponse</Text>
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
