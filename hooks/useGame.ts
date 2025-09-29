
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GameState, Movie, Guess } from '../types';
import { mockMovies } from '../data/mockData';

export const useGame = () => {
  const [gameState, setGameState] = useState<GameState>({
    currentWeek: 1,
    currentMovie: null,
    gameStarted: false,
    currentImageIndex: 0,
    nextImageReleaseTime: null
  });
  
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGameState();
    loadGuesses();
  }, []);

  const loadGameState = async () => {
    try {
      const savedState = await AsyncStorage.getItem('gameState');
      if (savedState) {
        const parsed = JSON.parse(savedState);
        // Convert date strings back to Date objects
        if (parsed.nextImageReleaseTime) {
          parsed.nextImageReleaseTime = new Date(parsed.nextImageReleaseTime);
        }
        setGameState(parsed);
      } else {
        // Initialize with first movie
        const initialState: GameState = {
          currentWeek: 1,
          currentMovie: mockMovies[0] || null,
          gameStarted: true,
          currentImageIndex: 0,
          nextImageReleaseTime: getNextImageReleaseTime()
        };
        setGameState(initialState);
        await AsyncStorage.setItem('gameState', JSON.stringify(initialState));
      }
    } catch (error) {
      console.log('Error loading game state:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadGuesses = async () => {
    try {
      const savedGuesses = await AsyncStorage.getItem('guesses');
      if (savedGuesses) {
        setGuesses(JSON.parse(savedGuesses));
      }
    } catch (error) {
      console.log('Error loading guesses:', error);
    }
  };

  const getNextImageReleaseTime = (): Date => {
    const now = new Date();
    const nextRelease = new Date();
    
    // Set to next Monday, Thursday, or Friday at 8 PM
    const daysUntilNext = [1, 4, 5]; // Monday, Thursday, Friday
    const currentDay = now.getDay();
    const currentHour = now.getHours();
    
    let targetDay = daysUntilNext.find(day => 
      day > currentDay || (day === currentDay && currentHour < 20)
    );
    
    if (!targetDay) {
      targetDay = daysUntilNext[0]; // Next Monday
      nextRelease.setDate(now.getDate() + (7 - currentDay + targetDay));
    } else {
      nextRelease.setDate(now.getDate() + (targetDay - currentDay));
    }
    
    nextRelease.setHours(20, 0, 0, 0); // 8 PM
    return nextRelease;
  };

  const submitGuess = async (userId: string, guess: string): Promise<{ success: boolean; points: number }> => {
    try {
      if (!gameState.currentMovie) {
        return { success: false, points: 0 };
      }

      const isCorrect = guess.toLowerCase().trim() === gameState.currentMovie.title.toLowerCase().trim();
      let points = 0;

      if (isCorrect) {
        // Calculate points based on current image index
        if (gameState.currentImageIndex === 0) {
          points = 6;
        } else if (gameState.currentImageIndex === 1) {
          points = 3;
        } else {
          points = 1;
        }
      }

      const newGuess: Guess = {
        id: Date.now().toString(),
        userId,
        movieId: gameState.currentMovie.id,
        guess,
        isCorrect,
        points,
        submittedAt: new Date(),
        imageIndex: gameState.currentImageIndex
      };

      const updatedGuesses = [...guesses, newGuess];
      setGuesses(updatedGuesses);
      await AsyncStorage.setItem('guesses', JSON.stringify(updatedGuesses));

      return { success: isCorrect, points };
    } catch (error) {
      console.log('Error submitting guess:', error);
      return { success: false, points: 0 };
    }
  };

  const startNewGame = async (movieId: string) => {
    try {
      const movie = mockMovies.find(m => m.id === movieId);
      if (!movie) return;

      const newState: GameState = {
        currentWeek: gameState.currentWeek + 1,
        currentMovie: movie,
        gameStarted: true,
        currentImageIndex: 0,
        nextImageReleaseTime: getNextImageReleaseTime()
      };

      setGameState(newState);
      await AsyncStorage.setItem('gameState', JSON.stringify(newState));
    } catch (error) {
      console.log('Error starting new game:', error);
    }
  };

  const releaseNextImage = async () => {
    try {
      if (gameState.currentImageIndex < 2) {
        const newState = {
          ...gameState,
          currentImageIndex: gameState.currentImageIndex + 1,
          nextImageReleaseTime: gameState.currentImageIndex < 1 ? getNextImageReleaseTime() : null
        };
        
        setGameState(newState);
        await AsyncStorage.setItem('gameState', JSON.stringify(newState));
      }
    } catch (error) {
      console.log('Error releasing next image:', error);
    }
  };

  return {
    gameState,
    guesses,
    loading,
    submitGuess,
    startNewGame,
    releaseNextImage
  };
};
