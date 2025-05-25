import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useLeagueContext } from "../app/context/LeagueContext";
import { LeagueInfo } from "@/constants/LeaguesData";

export const LeagueList = ({
  onLeaguePress,
}: {
  onLeaguePress: (league: LeagueInfo) => void;
}) => {
  const { leagues, isLoading, isError, error } = useLeagueContext(); // Consume new states

  const [searchText, setSearchText] = useState("");
  const [filteredLeagues, setFilteredLeagues] = useState<LeagueInfo[]>([]);

  useEffect(() => {
    // Ensure leagues is not null or undefined before filtering
    const itemsToFilter = leagues || [];
    if (searchText === "") {
      setFilteredLeagues(itemsToFilter);
    } else {
      const filteredResults = itemsToFilter.filter(
        (item) =>
          item.league.toLowerCase().includes(searchText.toLowerCase()) ||
          item.country.toLowerCase().includes(searchText.toLowerCase()) ||
          item.leadingTeam.toLowerCase().includes(searchText.toLowerCase()),
      );
      setFilteredLeagues(filteredResults);
    }
  }, [searchText, leagues]); // leagues from context is now reactive to Supabase updates

  if (isLoading) {
    return (
      <View style={styles.centeredMessageContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading leagues...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centeredMessageContainer}>
        <Text style={styles.errorText}>
          Error loading leagues: {error?.message || "Unknown error"}
        </Text>
      </View>
    );
  }

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
        data={filteredLeagues}
        // Use a unique ID from your Supabase table if available (e.g., item.id)
        // If 'league' name is guaranteed unique, it can be used, but IDs are safer.
        keyExtractor={(item, index) =>
          item.id?.toString() || item.league || index.toString()
        }
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
          <View style={styles.centeredMessageContainer}>
            <Text style={styles.noResult}>
              {leagues && leagues.length === 0 && searchText === ""
                ? "No leagues available. Try adding one!"
                : "No results found."}
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f2f2f2",

    flex: 1,
  },
  searchBar: {
    height: 40,
    borderColor: "#444",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
    paddingHorizontal: 10,
    color: "#000",
    backgroundColor: "#fff",
  },
  card: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    borderColor: "#333",
    borderWidth: 1,
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#000",
  },
  text: {
    fontSize: 14,
    marginTop: 2,
    color: "#000",
  },
  noResult: {
    textAlign: "center",
    color: "gray",
    marginTop: 20,
  },
});
