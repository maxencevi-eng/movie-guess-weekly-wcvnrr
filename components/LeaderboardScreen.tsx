
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
} from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { mockLeaderboard } from '../data/mockData';
import { commonStyles, colors } from '../styles/commonStyles';
import { Leaderboard } from '../types';

export default function LeaderboardScreen() {
  const { user } = useAuth();

  const renderLeaderboardItem = ({ item, index }: { item: Leaderboard; index: number }) => {
    const isCurrentUser = item.userId === user?.id;
    
    return (
      <View style={[styles.leaderboardItem, isCurrentUser && styles.currentUserItem]}>
        <View style={styles.rankContainer}>
          <Text style={[styles.rank, isCurrentUser && styles.currentUserText]}>
            {getRankEmoji(item.rank)}{item.rank}
          </Text>
        </View>
        
        <View style={styles.userInfo}>
          <Text style={[styles.username, isCurrentUser && styles.currentUserText]}>
            {item.username}
            {isCurrentUser && ' (You)'}
          </Text>
          <Text style={styles.weeklyPoints}>
            This week: {item.weeklyPoints} pts
          </Text>
        </View>
        
        <View style={styles.totalPoints}>
          <Text style={[styles.totalPointsText, isCurrentUser && styles.currentUserText]}>
            {item.totalPoints}
          </Text>
          <Text style={styles.totalPointsLabel}>total</Text>
        </View>
      </View>
    );
  };

  const getRankEmoji = (rank: number) => {
    switch (rank) {
      case 1: return '🥇 ';
      case 2: return '🥈 ';
      case 3: return '🥉 ';
      default: return '';
    }
  };

  const currentUserRank = mockLeaderboard.find(item => item.userId === user?.id);

  return (
    <ScrollView style={commonStyles.wrapper} contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🏆 Leaderboard</Text>
        <Text style={styles.subtitle}>
          Updated every Sunday at 12am
        </Text>
      </View>

      {currentUserRank && (
        <View style={styles.userRankCard}>
          <Text style={styles.userRankTitle}>Your Ranking</Text>
          <View style={styles.userRankInfo}>
            <Text style={styles.userRankText}>
              #{currentUserRank.rank} • {currentUserRank.totalPoints} points
            </Text>
            <Text style={styles.userWeeklyPoints}>
              This week: {currentUserRank.weeklyPoints} pts
            </Text>
          </View>
        </View>
      )}

      <View style={styles.leaderboardContainer}>
        <Text style={styles.leaderboardTitle}>All Players</Text>
        <FlatList
          data={mockLeaderboard}
          renderItem={renderLeaderboardItem}
          keyExtractor={(item) => item.userId}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
        />
      </View>

      <View style={styles.gameInfo}>
        <Text style={styles.gameInfoTitle}>Game Progress</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '10%' }]} />
        </View>
        <Text style={styles.progressText}>Week 1 of 10</Text>
        
        <View style={styles.gameStats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>10</Text>
            <Text style={styles.statLabel}>Total Weeks</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>1</Text>
            <Text style={styles.statLabel}>Current Week</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>9</Text>
            <Text style={styles.statLabel}>Weeks Left</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 100,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: colors.grey,
    textAlign: 'center',
  },
  userRankCard: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  userRankTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 8,
  },
  userRankInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userRankText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  userWeeklyPoints: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  leaderboardContainer: {
    marginBottom: 30,
  },
  leaderboardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundAlt,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  currentUserItem: {
    backgroundColor: colors.primary + '20',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  rankContainer: {
    width: 50,
    alignItems: 'center',
  },
  rank: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  currentUserText: {
    color: colors.primary,
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  weeklyPoints: {
    fontSize: 12,
    color: colors.grey,
  },
  totalPoints: {
    alignItems: 'center',
  },
  totalPointsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  totalPointsLabel: {
    fontSize: 10,
    color: colors.grey,
  },
  gameInfo: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 12,
    padding: 16,
  },
  gameInfoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.background,
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: colors.grey,
    textAlign: 'center',
    marginBottom: 16,
  },
  gameStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.accent,
  },
  statLabel: {
    fontSize: 12,
    color: colors.grey,
    marginTop: 2,
  },
});
