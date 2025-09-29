
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { IconCircle } from './IconCircle';
import { colors } from '../styles/commonStyles';
import { Leaderboard } from '../types';

interface LeaderboardCardProps {
  item: Leaderboard;
  isCurrentUser?: boolean;
}

export const LeaderboardCard: React.FC<LeaderboardCardProps> = ({ 
  item, 
  isCurrentUser = false 
}) => {
  const getRankEmoji = (rank: number) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return '🎬';
    }
  };

  return (
    <View style={[styles.container, isCurrentUser && styles.currentUserContainer]}>
      <View style={styles.leftSection}>
        <IconCircle 
          emoji={getRankEmoji(item.rank)} 
          size={40}
          backgroundColor={colors.primary}
        />
        <View style={styles.userInfo}>
          <Text style={[styles.username, isCurrentUser && styles.currentUserText]}>
            {item.username}
          </Text>
          <Text style={styles.rankText}>Rang #{item.rank}</Text>
        </View>
      </View>
      
      <View style={styles.rightSection}>
        <Text style={[styles.totalPoints, isCurrentUser && styles.currentUserText]}>
          {item.totalPoints}
        </Text>
        <Text style={styles.pointsLabel}>Points Total</Text>
        <Text style={styles.weeklyPoints}>
          +{item.weeklyPoints} cette semaine
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 12,
    padding: 16,
    marginVertical: 4,
    marginHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  currentUserContainer: {
    borderWidth: 2,
    borderColor: colors.accent,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userInfo: {
    marginLeft: 12,
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  currentUserText: {
    color: colors.accent,
  },
  rankText: {
    fontSize: 12,
    color: colors.grey,
    marginTop: 2,
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  totalPoints: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  pointsLabel: {
    fontSize: 10,
    color: colors.grey,
    marginTop: 2,
  },
  weeklyPoints: {
    fontSize: 12,
    color: colors.accent,
    fontWeight: '500',
    marginTop: 4,
  },
});
