
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Alert,
  FlatList,
} from 'react-native';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { Button } from './button';
import { useGame } from '../hooks/useGame';
import { useNotifications } from '../hooks/useNotifications';
import { commonStyles, colors } from '../styles/commonStyles';
import { Movie } from '../types';

export default function AdminScreen() {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newImages, setNewImages] = useState<string[]>([]);
  const { movies, gameState, startGame, updateMovie } = useGame();
  const { scheduleGameStartNotification, scheduleImageReleaseNotification } = useNotifications();

  const handleStartGame = async () => {
    Alert.alert(
      'Start Game',
      'Are you sure you want to start the movie quiz game?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Start',
          onPress: async () => {
            const result = await startGame();
            if (result.success) {
              await scheduleGameStartNotification();
              Alert.alert('Success', 'Game started successfully!');
            } else {
              Alert.alert('Error', result.error || 'Failed to start game');
            }
          },
        },
      ]
    );
  };

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        const newImageUri = result.assets[0].uri;
        setNewImages([...newImages, newImageUri]);
      }
    } catch (error) {
      console.log('Image picker error:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleUpdateMovie = async () => {
    if (!selectedMovie) return;

    if (!newTitle.trim()) {
      Alert.alert('Error', 'Please enter a movie title');
      return;
    }

    if (newImages.length !== 3) {
      Alert.alert('Error', 'Please select exactly 3 images');
      return;
    }

    const result = await updateMovie(selectedMovie.id, {
      title: newTitle.trim(),
      images: newImages,
    });

    if (result.success) {
      Alert.alert('Success', 'Movie updated successfully!');
      setSelectedMovie(null);
      setNewTitle('');
      setNewImages([]);
    } else {
      Alert.alert('Error', result.error || 'Failed to update movie');
    }
  };

  const handleReleaseNextImage = async () => {
    Alert.alert(
      'Release Next Image',
      'Are you sure you want to release the next image clue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Release',
          onPress: async () => {
            await scheduleImageReleaseNotification(gameState.currentImageNow let me create the complete Movie Quiz App structure. I'll start with the types and data models:

<write file="types/index.ts">
export interface User {
  id: string;
  username: string;
  email: string;
  isAdmin: boolean;
  totalPoints: number;
  weeklyPoints: number;
  createdAt: Date;
}

export interface Movie {
  id: string;
  title: string;
  week: number;
  images: string[];
  isActive: boolean;
  startDate: Date;
  endDate: Date;
}

export interface GameState {
  currentWeek: number;
  currentMovie: Movie | null;
  gameStarted: boolean;
  currentImageIndex: number;
  nextImageReleaseTime: Date | null;
}

export interface Guess {
  id: string;
  userId: string;
  movieId: string;
  guess: string;
  isCorrect: boolean;
  points: number;
  submittedAt: Date;
  imageIndex: number;
}

export interface Leaderboard {
  userId: string;
  username: string;
  totalPoints: number;
  weeklyPoints: number;
  rank: number;
}

export interface NotificationSettings {
  gameStart: boolean;
  newImage: boolean;
  leaderboardUpdate: boolean;
}
