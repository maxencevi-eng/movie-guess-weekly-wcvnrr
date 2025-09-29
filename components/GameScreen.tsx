
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
      Alert.alert('Erreur', 'Veuillez entrer votre réponse');
      return;
    }

    if (!user || !currentMovie) {
      Alert.alert('Erreur', 'Une erreur s\'est produite');
      return;
    }

    setSubmitting(true);
    try {
      const result = await submitGuess(user.id, currentMovie.id, guess.trim());
      
      if (result.success) {
        const message = result.isCorrect 
          ? `Correct ! Vous avez gagné ${result.points} points !`
          : 'Mauvaise réponse. Bonne chance pour la prochaine fois !';
        
        Alert.alert(
          result.isCorrect ? '🎉 Correct !' : '❌ Incorrect',
          message
        );
        setGuess('');
      } else {
        Alert.alert('Erreur', result.error || 'Échec de l\'envoi de la réponse');
      }
    } catch (error) {
      console.log('Submit guess error:', error);
      Alert.alert('Erreur', 'Une erreur s\'est produite');
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
    
    if (diff <= 0) return 'Disponible maintenant !';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}j ${hours}h`;
    return `${hours}h`;
  };

  if (!gameState.gameStarted) {
    return (
      <View style={commonStyles.container}>
        <Text style={styles.title}>🎬 Concours Ciné</Text>
        <Text style={styles.subtitle}>
          Le jeu n'a pas encore commencé. Revenez bientôt !
        </Text>
      </View>
    );
  }

  if (!currentMovie) {
    return (
      <View style={commonStyles.container}>
        <Text style={styles.title}>🎬 Concours Ciné</Text>
        <Text style={styles.subtitle}>
          Aucun film actif cette semaine. Revenez plus tard !
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={commonStyles.wrapper} contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Semaine {gameState.currentWeek}</Text>
        <Text style={styles.subtitle}>Devinez le film à partir des indices !</Text>
      </View>

      <View style={styles.gameInfo}>
        <View style={styles.pointsInfo}>
          <Text style={styles.pointsText}>
            Points actuels : {getPointsForCurrentImage()} pts
          </Text>
          <Text style={styles.imageInfo}>
            Image {gameState.currentImageIndex + 1} sur 3
          </Text>
        </View>

        {gameState.currentImageIndex < 2 && (
          <Text style={styles.nextImageText}>
            Prochaine image : {formatTimeUntilNext()}
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
          <Text style={styles.imageLabel}>Indice #{gameState.currentImageIndex + 1}</Text>
        </View>
      </View>

      {hasGuessed ? (
        <View style={styles.guessResult}>
          <Text style={styles.guessResultTitle}>
            {userGuess.isCorrect ? '🎉 Correct !' : '❌ Incorrect'}
          </Text>
          <Text style={styles.guessResultText}>
            Votre réponse : "{userGuess.guess}"
          </Text>
          <Text style={styles.guessResultPoints}>
            Points gagnés : {userGuess.points}
          </Text>
          {userGuess.isCorrect && (
            <Text style={styles.correctAnswer}>
              Le film était : {currentMovie.title}
            </Text>
          )}
        </View>
      ) : (
        <View style={styles.guessForm}>
          <Text style={styles.guessLabel}>Quel est ce film ?</Text>
          <TextInput
            style={styles.guessInput}
            placeholder="Entrez le titre du film..."
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
            Envoyer la réponse ({getPointsForCurrentImage()} pts)
          </Button>
        </View>
      )}

      <View style={styles.rules}>
        <Text style={styles.rulesTitle}>Comment ça marche :</Text>
        <Text style={styles.rulesText}>
          • 3 images publiées : Lundi 20h, Jeudi 20h, Vendredi 20h
        </Text>
        <Text style={styles.rulesText}>
          • Réponse après la 1ère image : 6 points
        </Text>
        <Text style={styles.rulesText}>
          • Réponse après la 2ème image : 3 points
        </Text>
        <Text style={styles.rulesText}>
          • Réponse après la 3ème image : 1 point
        </Text>
        <Text style={styles.rulesText}>
          • Mauvaise réponse : 0 point
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
