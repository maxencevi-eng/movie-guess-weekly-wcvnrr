
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../styles/commonStyles';

interface CountdownTimerProps {
  targetDate: Date;
  onComplete?: () => void;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ 
  targetDate, 
  onComplete 
}) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const difference = target - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        onComplete?.();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, onComplete]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Prochain indice dans :</Text>
      <View style={styles.timeContainer}>
        {timeLeft.days > 0 && (
          <View style={styles.timeUnit}>
            <Text style={styles.timeValue}>{timeLeft.days}</Text>
            <Text style={styles.timeLabel}>jours</Text>
          </View>
        )}
        <View style={styles.timeUnit}>
          <Text style={styles.timeValue}>{timeLeft.hours.toString().padStart(2, '0')}</Text>
          <Text style={styles.timeLabel}>heures</Text>
        </View>
        <View style={styles.timeUnit}>
          <Text style={styles.timeValue}>{timeLeft.minutes.toString().padStart(2, '0')}</Text>
          <Text style={styles.timeLabel}>min</Text>
        </View>
        <View style={styles.timeUnit}>
          <Text style={styles.timeValue}>{timeLeft.seconds.toString().padStart(2, '0')}</Text>
          <Text style={styles.timeLabel}>sec</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 14,
    color: colors.grey,
    marginBottom: 8,
    fontWeight: '500',
  },
  timeContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  timeUnit: {
    alignItems: 'center',
  },
  timeValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.accent,
  },
  timeLabel: {
    fontSize: 12,
    color: colors.grey,
    marginTop: 2,
  },
});
