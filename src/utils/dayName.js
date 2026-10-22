const DIAS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export function dayName(dateStr, index) {
  if (index === 0) {
    return 'Hoje';
  }

  const [y, m, d] = dateStr.split('-').map(Number);

  return DIAS[new Date(y, m - 1, d).getDay()];
}
