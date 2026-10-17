import React from 'react';
import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { WeatherProvider } from '../context/WeatherContext';
import { colors } from '../utils/theme';

const tab = (title, icon) => ({
  title,
  tabBarIcon: ({ color, size }) => <Ionicons name={icon} size={size} color={color} />,
});

export default function RootLayout() {
  return (
    <WeatherProvider>
      <StatusBar style="light" />
      <Tabs
        screenOptions={{
          headerStyle: { backgroundColor: colors.bg },
          headerTintColor: colors.text,
          tabBarStyle: { backgroundColor: colors.card, borderTopColor: colors.line },
          tabBarActiveTintColor: colors.accent,
          tabBarInactiveTintColor: colors.muted,
        }}
      >
        <Tabs.Screen name="index" options={tab('Agora', 'partly-sunny-outline')} />
        <Tabs.Screen name="hourly" options={tab('Por hora', 'time-outline')} />
        <Tabs.Screen name="daily" options={tab('Próximos dias', 'calendar-outline')} />
        <Tabs.Screen name="search" options={tab('Cidades', 'search-outline')} />
      </Tabs>
    </WeatherProvider>
  );
}
