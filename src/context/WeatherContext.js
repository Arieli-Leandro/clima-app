import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

const WeatherContext = createContext(null);

const DEFAULT_LOCATION = {
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

  const fetchWeather = useCallback(async (loc) => {
    setLoading(true);
    setError(null);
    try {
      const url =
        `https://api.open-meteo.com/v1/forecast?latitude=${loc.latitude}&longitude=${loc.longitude}` +
        `&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m` +
        `&hourly=temperature_2m,weather_code,precipitation_probability` +
        `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max` +
        `&timezone=auto&forecast_days=7`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Falha ao buscar o clima');
      setWeather(await res.json());
    } catch (e) {
      setError(e.message || 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWeather(location);
  }, [location, fetchWeather]);

  // Busca cidades pelo nome. Retorna uma lista de locais.
  const searchCity = useCallback(async (query) => {
    const q = (query || '').trim();
    if (!q) return [];
    const res = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=8&language=pt`
    );
    const data = await res.json();
    return (data.results || []).map((r) => ({
      name: r.name,
      country: r.country,
      admin: r.admin1,
      latitude: r.latitude,
      longitude: r.longitude,
    }));
  }, []);

  const selectLocation = useCallback((loc) => setLocation(loc), []);
  const refresh = useCallback(() => fetchWeather(location), [fetchWeather, location]);

  return (
    <WeatherContext.Provider
      value={{ location, weather, loading, error, searchCity, selectLocation, refresh }}
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
