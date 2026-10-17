import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import * as Location from 'expo-location';
import { fetchWeather, searchCities } from '../services/weatherApi';
 
const WeatherContext = createContext(null);
 
const DEFAULT_LOCATION = {
  id: 'default',
  name: 'São Paulo',
  country: 'Brasil',
  latitude: -23.5505,
  longitude: -46.6333,
};
 
export function WeatherProvider({ children }) {
  const [location, setLocation] = useState(DEFAULT_LOCATION);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 
  // Define o local e carrega a previsão dele
  const load = useCallback(async (loc) => {
    setLocation(loc);
    setLoading(true);
    setError(null);
    try {
      setWeather(await fetchWeather(loc));
    } catch (e) {
      setError(e.message || 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  }, []);
 
  // Usa a localização atual do aparelho
  const locateMe = useCallback(async () => {
    setError(null);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão negada', 'Permita o acesso à localização nas configurações do aparelho.');
        return;
      }
 
      const enabled = await Location.hasServicesEnabledAsync();
      if (!enabled) {
        Alert.alert('GPS desligado', 'Ative a localização do aparelho e tente de novo.');
        return;
      }
 
      let pos;
      try {
        pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      } catch {
        pos = await Location.getLastKnownPositionAsync();
      }
      if (!pos) {
        Alert.alert(
          'Localização indisponível',
          'Não foi possível obter sua posição agora. Verifique o GPS ou busque a cidade pelo nome.'
        );
        return;
      }
 
      const { latitude, longitude } = pos.coords;
      let name = 'Minha localização';
      let country = '';
      try {
        const [place] = await Location.reverseGeocodeAsync({ latitude, longitude });
        if (place) {
          name = place.city || place.subregion || place.region || name;
          country = place.country || '';
        }
      } catch {}
      await load({ id: 'me', name, country, latitude, longitude });
    } catch (e) {
      Alert.alert('Erro de localização', e.message || 'Não foi possível obter a localização.');
    }
  }, [load]);
 
  // Carrega o local inicial uma única vez
  useEffect(() => {
    load(DEFAULT_LOCATION);
  }, [load]);
 
  const refresh = useCallback(() => load(location), [load, location]);
 
  return (
    <WeatherContext.Provider
      value={{
        location,
        weather,
        loading,
        error,
        load,
        locateMe,
        refresh,
        searchCity: searchCities,
        selectLocation: load,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
}
 
export function useWeather() {
  const ctx = useContext(WeatherContext);
  if (!ctx) throw new Error('useWeather precisa estar dentro de <WeatherProvider>');
  return ctx;
}