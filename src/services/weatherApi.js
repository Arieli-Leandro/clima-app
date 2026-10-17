// Serviço de API (Open-Meteo, gratuita e sem chave)

// Busca cidades pelo nome. Retorna uma lista de locais.
export async function searchCities(query) {
  const q = (query || '').trim();
  if (!q) return [];
  const res = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=8&language=pt`
  );
  if (!res.ok) throw new Error('Falha ao buscar cidades');
  const data = await res.json();
  return (data.results || []).map((r) => ({
    id: String(r.id ?? `${r.latitude},${r.longitude}`),
    name: r.name,
    country: r.country,
    country_code: r.country_code,
    admin1: r.admin1,
    admin: r.admin1,
    state: r.admin1,
    latitude: r.latitude,
    longitude: r.longitude,
  }));
}

// Busca a previsão para uma coordenada.
export async function fetchWeather({ latitude, longitude }) {
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
    `&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m` +
    `&hourly=temperature_2m,weather_code,precipitation_probability` +
    `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max` +
    `&timezone=auto&forecast_days=7`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Falha ao buscar o clima');
  return res.json();
}
