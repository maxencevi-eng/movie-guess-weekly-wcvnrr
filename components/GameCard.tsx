
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { colors } from '../styles/commonStyles';

interface GameCardProps {
  imageUrl: string;
  week: number;
  imageIndex: number;
  totalImages: number;
  onPress?: () => void;
}

export const GameCard: React.FC<GameCardProps> = ({
  imageUrl,
  week,
  imageIndex,
  totalImages,
  onPress
}) => {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.weekText}>Semaine {week}</Text>
        <Text style={styles.imageCounter}>
          Image {imageIndex + 1} sur {totalImages}
        </Text>
      </View>
      
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          contentFit="cover"
          transition={300}
        />
      </View>
      
      <View style={styles.pointsInfo}>
        <Text style={styles.pointsText}>
          {imageIndex === 0 && "6 points pour une bonne réponse"}
          {imageIndex === 1 && "3 points pour une bonne réponse"}
          {imageIndex === 2 && "1 point pour une bonne réponse"}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  weekText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  imageCounter: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.grey,
  },
  imageContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    aspectRatio: 16 / 9,
    marginBottom: 12,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  pointsInfo: {
    alignItems: 'center',
  },
  pointsText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.accent,
    textAlign: 'center',
  },
});
