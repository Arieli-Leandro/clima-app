import React from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useWeather } from '../context/WeatherContext';
import { colors } from '../utils/theme';
import { describeWeather } from '../utils/weather';

const DIAS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

function dayName(dateStr, index) {
  if (index === 0) return 'Hoje';
  const [y, m, d] = dateStr.split('-').map(Number);
  return DIAS[new Date(y, m - 1, d).getDay()];
}

export default function DailyScreen() {
  const { weather, loading, location } = useWeather();

  if (!weather) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        {loading && <ActivityIndicator size="large" color={colors.primary} />}
      </SafeAreaView>
    );
  }

  const d = weather.daily;
  const items = d.time.map((t, i) => ({
    date: t,
    name: dayName(t, i),
    code: d.weather_code[i],
    max: d.temperature_2m_max[i],
    min: d.temperature_2m_min[i],
    rain: d.precipitation_probability_max[i],
  }));

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Próximos 7 dias</Text>
      <Text style={styles.subtitle}>{location.name}</Text>
      <FlatList
        data={items}
        keyExtractor={(item) => item.date}
        contentContainerStyle={{ padding: 16, gap: 8 }}
        renderItem={({ item }) => {
          const info = describeWeather(item.code);
          return (
            <View style={styles.row}>
              <Text style={styles.day}>{item.name}</Text>
              <Ionicons name={info.icon} size={26} color={colors.primary} />
              <Text style={styles.rain}>{item.rain ?? 0}%</Text>
              <Text style={styles.max}>{Math.round(item.max)}°</Text>
              <Text style={styles.min}>{Math.round(item.min)}°</Text>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { alignItems: 'center', justifyContent: 'center' },
  title: { color: colors.text, fontSize: 24, fontWeight: '700', paddingHorizontal: 16, paddingTop: 16 },
  subtitle: { color: colors.textSecondary, paddingHorizontal: 16 },
  row: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: colors.card, borderRadius: 14, paddingVertical: 14, paddingHorizontal: 16,
  },
  day: { color: colors.text, fontSize: 16, width: 60 },
  rain: { color: colors.textSecondary, width: 50, textAlign: 'center' },
  max: { color: colors.text, fontSize: 18, fontWeight: '600', width: 44, textAlign: 'right' },
  min: { color: colors.textSecondary, fontSize: 18, width: 44, textAlign: 'right' },
});
