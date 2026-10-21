import React from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useWeather } from '../context/WeatherContext';
import { colors } from '../utils/theme';
import { describeWeather } from '../utils/weather';

export default function HourlyScreen() {
  const { weather, loading, location } = useWeather();

  if (!weather) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        {loading && <ActivityIndicator size="large" color={colors.primary} />}
      </SafeAreaView>
    );
  }

  const h = weather.hourly;
  const start = Math.max(0, h.time.findIndex((t) => t >= weather.current.time));
  const items = h.time.slice(start, start + 24).map((t, i) => ({
    time: t,
    temp: h.temperature_2m[start + i],
    code: h.weather_code[start + i],
    rain: h.precipitation_probability[start + i],
  }));

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.barra_navegacao}>
        <Text style={styles.title}>Próximas 24 horas</Text>
        <Text style={styles.subtitle}>{location.name}</Text>
      </View>
      
      <FlatList
        data={items}
        keyExtractor={(item) => item.time}
        contentContainerStyle={{ padding: 16, gap: 8 }}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.hour}>{item.time.slice(11, 16)}</Text>
            <Ionicons name={describeWeather(item.code).icon} size={26} color={colors.primary} />
            <Text style={styles.rain}>{item.rain ?? 0}%</Text>
            <Text style={styles.temp}>{Math.round(item.temp)}°</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  container: { 
    flex: 1, 
    backgroundColor: colors.background 
  },

  center: { alignItems: 'center', justifyContent: 'center' },

  title: { 
    color: colors.text, 
    fontSize: 24, 
    fontWeight: '700', 
    paddingHorizontal: 16, 
    paddingTop: 16 
  },

  subtitle: { 
    color: colors.textSecondary, 
    paddingHorizontal: 16 
  },

  row: {
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    backgroundColor: colors.card, 
    borderRadius: 14, 
    paddingVertical: 14, 
    paddingHorizontal: 16,
  },

  hour: { 
    color: colors.text, 
    fontSize: 16, 
    width: 60 
  },

  rain: { 
    color: colors.textSecondary, 
    width: 50, 
    textAlign: 'center' 
  },

  temp: { 
    color: colors.text, 
    fontSize: 18, 
    fontWeight: '600', 
    width: 50, 
    textAlign: 'right' 
  },

  barra_navegacao : {

    paddingBottom: 8,


  }

});
