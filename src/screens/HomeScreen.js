import React from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useWeather } from '../context/WeatherContext';
import { colors } from '../utils/theme';
import { describeWeather } from '../utils/weather';

export default function HomeScreen() {
  const { location, weather, loading, error, refresh } = useWeather();

  if (loading && !weather) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  if (error && !weather) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <Text style={styles.error}>{error}</Text>
        <Text style={styles.link} onPress={refresh}>Tentar novamente</Text>
      </SafeAreaView>
    );
  }

  const c = weather.current;
  const info = describeWeather(c.weather_code);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} tintColor={colors.primary} />}
      >
        <Text style={styles.city}>{location.name}</Text>
        <Text style={styles.country}>{location.country}</Text>

        <Ionicons name={info.icon} size={96} color={colors.primary} style={{ marginTop: 24 }} />
        <Text style={styles.temp}>{Math.round(c.temperature_2m)}°</Text>
        <Text style={styles.desc}>{info.label}</Text>

        <View style={styles.row}>
          <Stat icon="thermometer" label="Sensação" value={`${Math.round(c.apparent_temperature)}°`} />
          <Stat icon="water" label="Umidade" value={`${c.relative_humidity_2m}%`} />
          <Stat icon="flag" label="Vento" value={`${Math.round(c.wind_speed_10m)} km/h`} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Stat({ icon, label, value }) {
  return (
    <View style={styles.stat}>
      <Ionicons name={icon} size={22} color={colors.textSecondary} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { alignItems: 'center', justifyContent: 'center' },
  content: { alignItems: 'center', padding: 24 },
  city: { color: colors.text, fontSize: 30, fontWeight: '700', marginTop: 16 },
  country: { color: colors.textSecondary, fontSize: 16 },
  temp: { color: colors.text, fontSize: 80, fontWeight: '200' },
  desc: { color: colors.textSecondary, fontSize: 20 },
  row: { flexDirection: 'row', gap: 12, marginTop: 32 },
  stat: { flex: 1, backgroundColor: colors.card, borderRadius: 16, padding: 16, alignItems: 'center', gap: 6 },
  statValue: { color: colors.text, fontSize: 18, fontWeight: '600' },
  statLabel: { color: colors.textSecondary, fontSize: 12 },
  error: { color: '#F87171', fontSize: 16, marginBottom: 12 },
  link: { color: colors.primary, fontSize: 16 },
});
