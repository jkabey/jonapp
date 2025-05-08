import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  Pressable,
} from 'react-native';
import { useLeagueContext } from '../app/context/LeagueContext';

export const LeagueList = ({ onLeaguePress }: { onLeaguePress: (league: any) => void }) => {
  const { leagues } = useLeagueContext();

  const [searchText, setSearchText] = useState('');
  const [filtered, setFiltered] = useState(leagues);

  useEffect(() => {
    // Running filter when leagues or searchText changes
    const filteredResults = leagues.filter((item) =>
      item.league.toLowerCase().includes(searchText.toLowerCase()) ||
      item.country.toLowerCase().includes(searchText.toLowerCase()) ||
      item.leadingTeam.toLowerCase().includes(searchText.toLowerCase())
    );
    setFiltered(filteredResults);
  }, [searchText, leagues]);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search leagues, countries, or teams..."
        value={searchText}
        onChangeText={setSearchText}
        placeholderTextColor="#888"
      />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.league}
        renderItem={({ item }) => (
          <Pressable onPress={() => onLeaguePress(item)}>
            <View style={styles.card}>
              <Text style={styles.title}>{item.league}</Text>
              <Text style={styles.text}>Country: {item.country}</Text>
              <Text style={styles.text}>Leading Team: {item.leadingTeam}</Text>
            </View>
          </Pressable>
        )}
        ListEmptyComponent={
          <Text style={styles.noResult}>No results found.</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f2f2f2',

    flex: 1,
  },
  searchBar: {
    height: 40,
    borderColor: '#444',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
    paddingHorizontal: 10,
    color: '#000',
    backgroundColor: '#fff',
  },
  card: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    borderColor: '#333',
    borderWidth: 1,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#000',
  },
  text: {
    fontSize: 14,
    marginTop: 2,
    color: '#000',
  },
  noResult: {
    textAlign: 'center',
    color: 'gray',
    marginTop: 20,
  },
});
