import { dayName } from './dayName';

describe('Teste de unidade da função dayName', () => {
  test('deve retornar Hoje quando o índice for zero', () => {
    expect(dayName('2026-10-19', 0)).toBe('Hoje');
  });

  test('deve retornar Ter para uma terça-feira', () => {
    expect(dayName('2026-10-20', 1)).toBe('Ter');
  });

  test('deve retornar Sáb para um sábado', () => {
    expect(dayName('2026-10-24', 5)).toBe('Sáb');
  });

  test('deve retornar Dom para um domingo', () => {
    expect(dayName('2026-10-25', 6)).toBe('Dom');
  });
});
