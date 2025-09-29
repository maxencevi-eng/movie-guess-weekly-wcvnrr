
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Button } from '../../components/button';
import { Image } from 'expo-image';
import { colors, commonStyles } from '../../styles/commonStyles';

export default function UploadMovieScreen() {
  const [title, setTitle] = useState('');
  const [week, setWeek] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    if (images.length >= 3) {
      Alert.alert('Limite Atteinte', 'Vous ne pouvez télécharger que 3 images par film.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImages([...images, result.assets[0].uri]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer un titre de film');
      return;
    }

    if (!week.trim() || isNaN(Number(week))) {
      Alert.alert('Erreur', 'Veuillez entrer un numéro de semaine valide');
      return;
    }

    if (images.length === 0) {
      Alert.alert('Erreur', 'Veuillez télécharger au moins une image');
      return;
    }

    setLoading(true);
    try {
      // In a real app, you would upload the images to your backend here
      // For now, we'll just simulate the upload
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Succès',
        'Film téléchargé avec succès ! Il sera disponible pour sélection dans le tableau de bord admin.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      Alert.alert('Erreur', 'Échec du téléchargement du film. Veuillez réessayer.');
      console.log('Upload error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={commonStyles.wrapper} contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={commonStyles.title}>📤 Télécharger un Film</Text>
        <Text style={styles.subtitle}>Ajouter un nouveau film à la base de données du concours</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Titre du Film</Text>
          <TextInput
            style={styles.input}
            placeholder="Entrez le titre du film..."
            placeholderTextColor={colors.grey}
            value={title}
            onChangeText={setTitle}
            autoCapitalize="words"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Numéro de Semaine</Text>
          <TextInput
            style={styles.input}
            placeholder="Entrez le numéro de semaine..."
            placeholderTextColor={colors.grey}
            value={week}
            onChangeText={setWeek}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Images ({images.length}/3)</Text>
          <Text style={styles.helperText}>
            Téléchargez jusqu'à 3 images qui seront révélées comme indices
          </Text>
          
          <Button
            onPress={pickImage}
            disabled={images.length >= 3}
            variant="outline"
            style={styles.imageButton}
          >
            {images.length === 0 ? 'Ajouter la Première Image' : `Ajouter l'Image ${images.length + 1}`}
          </Button>

          {images.length > 0 && (
            <View style={styles.imagesContainer}>
              {images.map((uri, index) => (
                <View key={index} style={styles.imagePreview}>
                  <Image source={{ uri }} style={styles.image} contentFit="cover" />
                  <Text style={styles.imageLabel}>Indice {index + 1}</Text>
                  <Button
                    onPress={() => removeImage(index)}
                    size="small"
                    variant="outline"
                    style={styles.removeButton}
                  >
                    Supprimer
                  </Button>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>

      <View style={styles.actions}>
        <Button
          onPress={handleSubmit}
          loading={loading}
          disabled={loading}
          style={styles.submitButton}
        >
          Télécharger le Film
        </Button>
        
        <Button
          onPress={() => router.back()}
          variant="outline"
          style={styles.cancelButton}
        >
          Annuler
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
  form: {
    paddingHorizontal: 16,
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  helperText: {
    fontSize: 12,
    color: colors.grey,
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
  imageButton: {
    borderColor: colors.accent,
    marginTop: 8,
  },
  imagesContainer: {
    gap: 12,
    marginTop: 12,
  },
  imagePreview: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 8,
  },
  imageLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
  },
  removeButton: {
    borderColor: colors.grey,
  },
  actions: {
    paddingHorizontal: 16,
    paddingTop: 24,
    gap: 12,
  },
  submitButton: {
    backgroundColor: colors.primary,
  },
  cancelButton: {
    borderColor: colors.grey,
  },
});
