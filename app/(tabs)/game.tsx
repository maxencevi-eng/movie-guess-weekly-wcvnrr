
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { useGame } from '../../hooks/useGame';
import { useNotifications } from '../../hooks/useNotifications';
import { GameCard } from '../../components/GameCard';
import { GuessInput } from '../../components/GuessInput';
import { CountdownTimer } from '../../components/CountdownTimer';
import { colors, commonStyles } from '../../styles/commonStyles';

export default function GameScreen() {
  const { user } = useAuth();
  const { gameState, submitGuess, releaseNextImage, loading } = useGame();
  const { scheduleNewImageNotification } = useNotifications();

  useEffect(() => {
    // Check if it's time to release next image
    if (gameState.nextImageReleaseTime && new Date() >= gameState.nextImageReleaseTime) {
      releaseNextImage();
      scheduleNewImageNotification();
    }
  }, [gameState.nextImageReleaseTime]);

  const handleGuessSubmit = async (guess: string) => {
    if (!user) return { success: false, points: 0 };
    return await submitGuess(user.id, guess);
  };

  const handleTimerComplete = () => {
    releaseNextImage();
    scheduleNewImageNotification();
  };

  if (loading) {
    return (
      <View style={[commonStyles.container, styles.loadingContainer]}>
        <Text style={commonStyles.text}>Loading game...</Text>
      </View>
    );
  }

  if (!gameState.gameStarted || !gameState.currentMovie) {
    return (
      <View style={[commonStyles.container, styles.noGameContainer]}>
        <Text style={commonStyles.title}>🎬 No Active Game</Text>
        <Text style={commonStyles.text}>
          There's no active movie quiz right now. Check back soon!
        </Text>
      </View>
    );
  }

  const currentImage = gameState.currentMovie.images[gameState.currentImageIndex];
  const hasMoreImages = gameState.currentImageIndex < gameState.currentMovie.images.length - 1;

  return (
    <ScrollView style={commonStyles.wrapper} contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={commonStyles.title}>🎬 Movie Quiz</Text>
        <Text style={styles.welcomeText}>Welcome back, {user?.username}!</Text>
      </View>

      <GameCard
        imageUrl={currentImage}
        week={gameState.currentWeek}
        imageIndex={gameState.currentImageIndex}
        totalImages={gameState.currentMovie.images.length}
      />

      {hasMoreImages && gameState.nextImageReleaseTime && (
        <CountdownTimer
          targetDate={gameState.nextImageReleaseTime}
          onComplete={handleTimerComplete}
        />
      )}

      <GuessInput onSubmit={handleGuessSubmit} />

      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>How to Play:</Text>
        <Text style={styles.infoText}>
          • Guess the movie title from the image clues
        </Text>
        <Text style={styles.infoText}>
          • New clues released Monday, Thursday, Friday at 8 PM
        </Text>
        <Text style={styles.infoText}>
          • Earlier guesses earn more points (6→3→1)
        </Text>
        <Text style={styles.infoText}>
          • Wrong guesses earn 0 points
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  loadingContainer: {
    justifyContent: 'center',
  },
  noGameContainer: {
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  welcomeText: {
    fontSize: 16,
    color: colors.grey,
    marginTop: 4,
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
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: colors.grey,
    marginBottom: 4,
    lineHeight: 20,
  },
});
