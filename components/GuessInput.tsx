
import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Alert } from 'react-native';
import { Button } from './button';
import { colors } from '../styles/commonStyles';

interface GuessInputProps {
  onSubmit: (guess: string) => Promise<{ success: boolean; points: number }>;
  disabled?: boolean;
}

export const GuessInput: React.FC<GuessInputProps> = ({ onSubmit, disabled }) => {
  const [guess, setGuess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!guess.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer un titre de film');
      return;
    }

    setLoading(true);
    try {
      const result = await onSubmit(guess.trim());
      
      if (result.success) {
        Alert.alert(
          '🎉 Correct !', 
          `Excellent travail ! Vous avez gagné ${result.points} points !`,
          [{ text: 'OK', onPress: () => setGuess('') }]
        );
      } else {
        Alert.alert(
          '❌ Incorrect', 
          'Ce n\'est pas le bon film. Essayez encore !',
          [{ text: 'OK', onPress: () => setGuess('') }]
        );
      }
    } catch (error) {
      Alert.alert('Erreur', 'Échec de l\'envoi de la réponse. Veuillez réessayer.');
      console.log('Guess submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Entrez le titre du film..."
        placeholderTextColor={colors.grey}
        value={guess}
        onChangeText={setGuess}
        editable={!disabled && !loading}
        autoCapitalize="words"
        autoCorrect={false}
      />
      <Button
        onPress={handleSubmit}
        disabled={disabled || loading || !guess.trim()}
        loading={loading}
        style={styles.button}
      >
        Envoyer la Réponse
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 12,
  },
  input: {
    backgroundColor: colors.background,
    borderWidth: 2,
    borderColor: colors.grey,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  button: {
    backgroundColor: colors.primary,
  },
});
