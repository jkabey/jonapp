
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, Platform, Pressable } from 'react-native';
import { allLeagues, LeagueInfo } from '@/constants/LeaguesData';

export const LeagueList: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [filtered, setFiltered] = useState<LeagueInfo[]>(allLeagues);

  const handleSearch = (text: string) => {
    setSearchText(text);
    const filteredResults = allLeagues.filter(item =>
      item.league.toLowerCase().includes(text.toLowerCase()) ||
      item.country.toLowerCase().includes(text.toLowerCase()) ||
      item.leadingTeam.toLowerCase().includes(text.toLowerCase())
    );
    setFiltered(filteredResults);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search leagues, countries, or teams..."
        value={searchText}
        onChangeText={handleSearch}
      />
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.league}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.league}</Text>
            <Text style={styles.text}>Country: {item.country}</Text>
            <Text style={styles.text}>Leading Team: {item.leadingTeam}</Text>
            <Pressable onPress={() => Platform.OS === 'web' ? window.open(item.seeMoreLink, '_blank') : null}>
              <Text style={styles.link}>See More</Text>
            </Pressable>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.noResult}>No results found.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  searchBar: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
    paddingHorizontal: 10,
  },
  card: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  text: {
    fontSize: 14,
    marginTop: 2,
  },
  link: {
    color: 'blue',
    marginTop: 6,
  },
  noResult: {
    textAlign: 'center',
    color: 'gray',
    marginTop: 20,
  },
});