import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useWeather } from '../context/WeatherContext';
import { searchCities } from '../services/weatherApi';
import { colors } from '../utils/theme';

export default function SearchScreen() {
  const router = useRouter();
  const { load, locateMe } = useWeather();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(null);

  async function onSearch() {
    const q = query.trim();
    if (q.length < 2) {
      setMessage('Digite pelo menos 2 letras.');
      return;
    }
    setBusy(true);
    setMessage(null);
    try {
      const found = await searchCities(q);
      setResults(found);
      if (found.length === 0) setMessage('Nenhuma cidade encontrada. Confira o nome digitado.');
    } catch (e) {
      setResults([]);
      setMessage(e.message);
    } finally {
      setBusy(false);
    }
  }

  async function choose(city) {
    await load(city);
    router.navigate('/');
  }

  async function chooseMyLocation() {
    await locateMe();
    router.navigate('/');
  }

  return (
    <View style={styles.screen}>
      <TextInput
        style={styles.input}
        placeholder="Buscar cidade (ex.: Londrina)"
        placeholderTextColor={colors.muted}
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={onSearch}
        returnKeyType="search"
        autoCorrect={false}
      />
      <View style={styles.actions}>
        <Pressable style={styles.btn} onPress={onSearch}>
          <Text style={styles.btnText}>Buscar</Text>
        </Pressable>
        <Pressable style={[styles.btn, styles.btnAlt]} onPress={chooseMyLocation}>
          <Text style={[styles.btnText, { color: colors.text }]}>Usar minha localização</Text>
        </Pressable>
      </View>

      {busy && <ActivityIndicator color={colors.accent} style={{ marginTop: 16 }} />}
      {!!message && <Text style={styles.message}>{message}</Text>}

      <FlatList
        data={results}
        keyExtractor={(c) => c.id}
        style={{ marginTop: 12 }}
        renderItem={({ item }) => (
          <Pressable style={styles.item} onPress={() => choose(item)}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemSub}>{[item.region, item.country].filter(Boolean).join(', ')}</Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg, padding: 16 },
  input: { backgroundColor: colors.card, color: colors.text, borderRadius: 10, padding: 14, fontSize: 16, borderWidth: 1, borderColor: colors.line },
  actions: { flexDirection: 'row', gap: 10, marginTop: 10 },
  btn: { backgroundColor: colors.accent, paddingHorizontal: 16, paddingVertical: 12, borderRadius: 10 },
  btnAlt: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line },
  btnText: { color: colors.bg, fontWeight: '700' },
  message: { color: colors.error, marginTop: 14 },
  item: { backgroundColor: colors.card, borderRadius: 10, padding: 14, marginBottom: 8 },
  itemName: { color: colors.text, fontSize: 16, fontWeight: '600' },
  itemSub: { color: colors.muted, fontSize: 13, marginTop: 2 },
});
