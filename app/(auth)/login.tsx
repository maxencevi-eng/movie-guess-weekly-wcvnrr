
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Button } from '../../components/button';
import { useAuth } from '../../hooks/useAuth';
import { colors, commonStyles } from '../../styles/commonStyles';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);
    try {
      const success = await login(username.trim(), password);
      if (success) {
        router.replace('/(tabs)/game');
      } else {
        Alert.alert('Erreur', 'Nom d\'utilisateur ou mot de passe invalide');
      }
    } catch (error) {
      Alert.alert('Erreur', 'Échec de la connexion. Veuillez réessayer.');
      console.log('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={commonStyles.wrapper} contentContainerStyle={styles.container}>
      <View style={styles.content}>
        <Text style={commonStyles.title}>🎬 Concours Ciné</Text>
        <Text style={styles.subtitle}>Bon retour ! Connectez-vous pour continuer à jouer.</Text>
        
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Nom d'utilisateur"
            placeholderTextColor={colors.grey}
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            autoCorrect={false}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Mot de passe"
            placeholderTextColor={colors.grey}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
          />
          
          <Button
            onPress={handleLogin}
            loading={loading}
            disabled={loading}
            style={styles.loginButton}
          >
            Se Connecter
          </Button>
          
          <Button
            onPress={() => router.push('/(auth)/register')}
            variant="outline"
            style={styles.registerButton}
          >
            Créer un Compte
          </Button>
        </View>
        
        <View style={styles.demoSection}>
          <Text style={styles.demoTitle}>Comptes de Démonstration :</Text>
          <Text style={styles.demoText}>Nom d'utilisateur : MovieBuff (Joueur)</Text>
          <Text style={styles.demoText}>Nom d'utilisateur : Admin (Admin)</Text>
          <Text style={styles.demoText}>Mot de passe : n'importe lequel</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  content: {
    maxWidth: 400,
    width: '100%',
    alignSelf: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.grey,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  form: {
    gap: 16,
    marginBottom: 32,
  },
  input: {
    backgroundColor: colors.backgroundAlt,
    borderWidth: 1,
    borderColor: colors.grey,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  loginButton: {
    backgroundColor: colors.primary,
    marginTop: 8,
  },
  registerButton: {
    borderColor: colors.grey,
  },
  demoSection: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  demoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  demoText: {
    fontSize: 12,
    color: colors.grey,
    textAlign: 'center',
  },
});
