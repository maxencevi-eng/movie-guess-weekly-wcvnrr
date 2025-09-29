
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
      'Démarrer un Nouveau Jeu',
      'Êtes-vous sûr de vouloir démarrer un nouveau quiz cinéma ? Cela réinitialisera le jeu actuel.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Démarrer le Jeu',
          onPress: async () => {
            setLoading(true);
            try {
              await startNewGame(movieId);
              await scheduleGameStartNotification();
              Alert.alert('Succès', 'Nouveau jeu démarré avec succès !');
            } catch (error) {
              Alert.alert('Erreur', 'Échec du démarrage du nouveau jeu');
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
        <Text style={commonStyles.title}>🎛️ Tableau de Bord Admin</Text>
        <Text style={styles.subtitle}>Gérer les quiz cinéma et les paramètres du jeu</Text>
      </View>

      <View style={styles.currentGameSection}>
        <Text style={styles.sectionTitle}>État du Jeu Actuel</Text>
        <View style={styles.statusCard}>
          <Text style={styles.statusLabel}>Semaine :</Text>
          <Text style={styles.statusValue}>{gameState.currentWeek}</Text>
        </View>
        <View style={styles.statusCard}>
          <Text style={styles.statusLabel}>Film :</Text>
          <Text style={styles.statusValue}>
            {gameState.currentMovie?.title || 'Aucun film actif'}
          </Text>
        </View>
        <View style={styles.statusCard}>
          <Text style={styles.statusLabel}>Image Actuelle :</Text>
          <Text style={styles.statusValue}>
            {gameState.currentImageIndex + 1} sur {gameState.currentMovie?.images.length || 0}
          </Text>
        </View>
        <View style={styles.statusCard}>
          <Text style={styles.statusLabel}>Jeu Actif :</Text>
          <Text style={[styles.statusValue, { color: gameState.gameStarted ? colors.accent : colors.grey }]}>
            {gameState.gameStarted ? 'Oui' : 'Non'}
          </Text>
        </View>
      </View>

      <View style={styles.moviesSection}>
        <Text style={styles.sectionTitle}>Films Disponibles</Text>
        {mockMovies.map((movie) => (
          <View key={movie.id} style={styles.movieCard}>
            <View style={styles.movieInfo}>
              <Text style={styles.movieTitle}>{movie.title}</Text>
              <Text style={styles.movieWeek}>Semaine {movie.week}</Text>
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
              {gameState.currentMovie?.id === movie.id ? 'Actif' : 'Démarrer'}
            </Button>
          </View>
        ))}
      </View>

      <View style={styles.actionsSection}>
        <Button
          onPress={() => router.push('/(admin)/upload')}
          style={styles.uploadButton}
        >
          Télécharger un Nouveau Film
        </Button>
        
        <Button
          onPress={() => router.back()}
          variant="outline"
          style={styles.backButton}
        >
          Retour au Profil
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
