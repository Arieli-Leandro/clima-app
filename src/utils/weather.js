// Converte o código do clima (WMO) da Open-Meteo em texto e ícone (Ionicons)
export function describeWeather(code) {
  if (code === 0) return { label: 'Céu limpo', icon: 'sunny' };
  if (code <= 2) return { label: 'Parcialmente nublado', icon: 'partly-sunny' };
  if (code === 3) return { label: 'Nublado', icon: 'cloud' };
  if (code === 45 || code === 48) return { label: 'Neblina', icon: 'cloudy' };
  if (code >= 51 && code <= 57) return { label: 'Garoa', icon: 'rainy' };
  if (code >= 61 && code <= 67) return { label: 'Chuva', icon: 'rainy' };
  if (code >= 71 && code <= 77) return { label: 'Neve', icon: 'snow' };
  if (code >= 80 && code <= 82) return { label: 'Pancadas de chuva', icon: 'rainy' };
  if (code >= 95) return { label: 'Tempestade', icon: 'thunderstorm' };
  return { label: 'Indefinido', icon: 'help-circle' };
}
