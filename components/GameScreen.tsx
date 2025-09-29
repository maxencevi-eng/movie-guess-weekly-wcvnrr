
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { Button } from './button';
import { useGame } from '../hooks/useGame';
import { useAuth } from '../hooks/useAuth';
import { useNotifications } from '../hooks/useNotifications';
import { commonStyles, colors } from '../styles/commonStyles';

const { width } = Dimensions.get('window');

export default function GameScreen() {
  const [guess, setGuess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { gameState, submitGuess, guesses } = useGame();
  const { user } = useAuth();
  const { scheduleImageReleaseNotification } = useNotifications();

  const currentMovie = gameState.currentMovie;
  const userGuess = guesses.find(g => g.userId === user?.id && g.movieId === currentMovie?.id);
  const hasGuessed = !!userGuess;

  const handleSubmitGuess = async () => {
    if (!guess.trim()) {
      Alert.alert('Error', 'Please enter your guess');
      return;
    }

    if (!user || !currentMovie) {
      Alert.alert('Error', 'Something went wrong');
      return;
    }

    setSubmitting(true);
    try {
      const result = await submitGuess(user.id, currentMovie.id, guess.trim());
      
      if (result.success) {
        const message = result.isCorrect 
          ? `Correct! You earned ${result.points} points!`
          : 'Incorrect guess. Better luck next time!';
        
        Alert.alert(
          result.isCorrect ? '🎉 Correct!' : '❌ Incorrect',
          message
        );
        setGuess('');
      } else {
        Alert.alert('Error', result.error || 'Failed to submit guess');
      }
    } catch (error) {
      console.log('Submit guess error:', error);
      Alert.alert('Error', 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  const getPointsForCurrentImage = () => {
    switch (gameState.currentImageIndex) {
      case 0: return 6;
      case 1: return 3;
      case 2: return 1;
      default: return 0;
    }
  };

  const formatTimeUntilNext = () => {
    if (!gameState.nextImageRelease) return '';
    
    const now = new Date();
    const next = new Date(gameState.nextImageRelease);
    const diff = next.getTime() - now.getTime();
    
    if (diff <= 0) return 'Available now!';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    return `${hours}h`;
  };

  if (!gameState.gameStarted) {
    return (
      <View style={commonStyles.container}>
        <Text style={styles.title}>🎬 Movie Quiz</Text>
        <Text style={styles.subtitle}>
          The game hasn't started yet. Check back soon!
        </Text>
      </View>
    );
  }

  if (!currentMovie) {
    return (
      <View style={commonStyles.container}>
        <Text style={styles.title}>🎬 Movie Quiz</Text>
        <Text style={styles.subtitle}>
          No active movie this week. Check back later!
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={commonStyles.wrapper} contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Week {gameState.currentWeek}</Text>
        <Text style={styles.subtitle}>Guess the movie from the clues!</Text>
      </View>

      <View style={styles.gameInfo}>
        <View style={styles.pointsInfo}>
          <Text style={styles.pointsText}>
            Current points: {getPointsForCurrentImage()} pts
          </Text>
          <Text style={styles.imageInfo}>
            Image {gameState.currentImageIndex + 1} of 3
          </Text>
        </View>

        {gameState.currentImageIndex < 2 && (
          <Text style={styles.nextImageText}>
            Next image: {formatTimeUntilNext()}
          </Text>
        )}
      </View>

      <View style={styles.imageContainer}>
        <Image
          source={{ uri: currentMovie.images[gameState.currentImageIndex] }}
          style={styles.movieImage}
          contentFit="cover"
        />
        <View style={styles.imageOverlay}>
          <Text style={styles.imageLabel}>Clue #{gameState.currentImageIndex + 1}</Text>
        </View>
      </View>

      {hasGuessed ? (
        <View style={styles.guessResult}>
          <Text style={styles.guessResultTitle}>
            {userGuess.isCorrect ? '🎉 Correct!' : '❌ Incorrect'}
          </Text>
          <Text style={styles.guessResultText}>
            Your guess: "{userGuess.guess}"
          </Text>
          <Text style={styles.guessResultPoints}>
            Points earned: {userGuess.points}
          </Text>
          {userGuess.isCorrect && (
            <Text style={styles.correctAnswer}>
              The movie was: {currentMovie.title}
            </Text>
          )}
        </View>
      ) : (
        <View style={styles.guessForm}>
          <Text style={styles.guessLabel}>What movie is this?</Text>
          <TextInput
            style={styles.guessInput}
            placeholder="Enter movie title..."
            placeholderTextColor={colors.grey}
            value={guess}
            onChangeText={setGuess}
            autoCapitalize="words"
          />
          <Button
            onPress={handleSubmitGuess}
            loading={submitting}
            style={styles.submitButton}
          >
            Submit Guess ({getPointsForCurrentImage()} pts)
          </Button>
        </View>
      )}

      <View style={styles.rules}>
        <Text style={styles.rulesTitle}>How it works:</Text>
        <Text style={styles.rulesText}>
          • 3 images released: Monday 8pm, Thursday 8pm, Friday 8pm
        </Text>
        <Text style={styles.rulesText}>
          • Guess after 1st image: 6 points
        </Text>
        <Text style={styles.rulesText}>
          • Guess after 2nd image: 3 points
        </Text>
        <Text style={styles.rulesText}>
          • Guess after 3rd image: 1 point
        </Text>
        <Text style={styles.rulesText}>
          • Wrong guess: 0 points
        </Text>
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
    fontSize: 16,
    color: colors.grey,
    textAlign: 'center',
  },
  gameInfo: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  pointsInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  pointsText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.accent,
  },
  imageInfo: {
    fontSize: 14,
    color: colors.grey,
  },
  nextImageText: {
    fontSize: 14,
    color: colors.text,
    textAlign: 'center',
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 30,
    borderRadius: 12,
    overflow: 'hidden',
  },
  movieImage: {
    width: '100%',
    height: width * 0.75,
    backgroundColor: colors.backgroundAlt,
  },
  imageOverlay: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  imageLabel: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  guessForm: {
    marginBottom: 30,
  },
  guessLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  guessInput: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.grey + '30',
    textAlign: 'center',
  },
  submitButton: {
    marginTop: 8,
  },
  guessResult: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
    alignItems: 'center',
  },
  guessResultTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  guessResultText: {
    fontSize: 16,
    color: colors.grey,
    marginBottom: 4,
  },
  guessResultPoints: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.accent,
    marginBottom: 8,
  },
  correctAnswer: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  rules: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 12,
    padding: 16,
  },
  rulesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  rulesText: {
    fontSize: 14,
    color: colors.grey,
    marginBottom: 4,
    lineHeight: 20,
  },
});
