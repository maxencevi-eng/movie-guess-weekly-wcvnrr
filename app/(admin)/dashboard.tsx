
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { Button } from '../../components/button';
import { useGame } from '../../hooks/useGame';
import { useNotifications } from '../../hooks/useNotifications';
import { mockMovies } from '../../data/mockData';
import { colors, commonStyles } from '../../styles/commonStyles';

export default function AdminDashboard() {
  const { gameState, startNewGame } = useGame();
  const { scheduleGameStartNotification } = useNotifications();
  const [loading, setLoading] = useState(false);

  const handleStartGame = async (movieId: string) => {
    Alert.alert(
      'Start New Game',
      'Are you sure you want to start a new movie quiz? This will reset the current game.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Start Game',
          onPress: async () => {
            setLoading(true);
            try {
              await startNewGame(movieId);
              await scheduleGameStartNotification();
              Alert.alert('Success', 'New game started successfully!');
            } catch (error) {
              Alert.alert('Error', 'Failed to start new game');
              console.log('Start game error:', error);
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={commonStyles.wrapper} contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={commonStyles.title}>🎛️ Admin Dashboard</Text>
        <Text style={styles.subtitle}>Manage movie quizzes and game settings</Text>
      </View>

      <View style={styles.currentGameSection}>
        <Text style={styles.sectionTitle}>Current Game Status</Text>
        <View style={styles.statusCard}>
          <Text style={styles.statusLabel}>Week:</Text>
          <Text style={styles.statusValue}>{gameState.currentWeek}</Text>
        </View>
        <View style={styles.statusCard}>
          <Text style={styles.statusLabel}>Movie:</Text>
          <Text style={styles.statusValue}>
            {gameState.currentMovie?.title || 'No active movie'}
          </Text>
        </View>
        <View style={styles.statusCard}>
          <Text style={styles.statusLabel}>Current Image:</Text>
          <Text style={styles.statusValue}>
            {gameState.currentImageIndex + 1} of {gameState.currentMovie?.images.length || 0}
          </Text>
        </View>
        <View style={styles.statusCard}>
          <Text style={styles.statusLabel}>Game Active:</Text>
          <Text style={[styles.statusValue, { color: gameState.gameStarted ? colors.accent : colors.grey }]}>
            {gameState.gameStarted ? 'Yes' : 'No'}
          </Text>
        </View>
      </View>

      <View style={styles.moviesSection}>
        <Text style={styles.sectionTitle}>Available Movies</Text>
        {mockMovies.map((movie) => (
          <View key={movie.id} style={styles.movieCard}>
            <View style={styles.movieInfo}>
              <Text style={styles.movieTitle}>{movie.title}</Text>
              <Text style={styles.movieWeek}>Week {movie.week}</Text>
              <Text style={styles.movieImages}>{movie.images.length} images</Text>
            </View>
            <Button
              onPress={() => handleStartGame(movie.id)}
              disabled={loading || gameState.currentMovie?.id === movie.id}
              size="small"
              style={[
                styles.startButton,
                gameState.currentMovie?.id === movie.id && styles.activeButton
              ]}
            >
              {gameState.currentMovie?.id === movie.id ? 'Active' : 'Start'}
            </Button>
          </View>
        ))}
      </View>

      <View style={styles.actionsSection}>
        <Button
          onPress={() => router.push('/(admin)/upload')}
          style={styles.uploadButton}
        >
          Upload New Movie
        </Button>
        
        <Button
          onPress={() => router.back()}
          variant="outline"
          style={styles.backButton}
        >
          Back to Profile
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
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  subtitle: {
    fontSize: 14,
    color: colors.grey,
    marginTop: 4,
    textAlign: 'center',
  },
  currentGameSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  statusCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.backgroundAlt,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  statusLabel: {
    fontSize: 14,
    color: colors.grey,
  },
  statusValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  moviesSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  movieCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.backgroundAlt,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  movieInfo: {
    flex: 1,
  },
  movieTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  movieWeek: {
    fontSize: 12,
    color: colors.grey,
    marginTop: 2,
  },
  movieImages: {
    fontSize: 12,
    color: colors.accent,
    marginTop: 2,
  },
  startButton: {
    backgroundColor: colors.primary,
    minWidth: 80,
  },
  activeButton: {
    backgroundColor: colors.accent,
  },
  actionsSection: {
    paddingHorizontal: 16,
    gap: 12,
  },
  uploadButton: {
    backgroundColor: colors.accent,
  },
  backButton: {
    borderColor: colors.grey,
  },
});
