

import React from 'react';
import { Image, StyleSheet, ScrollView, View, Text, Pressable, Linking } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { LeagueList } from '@/components/LeagueList';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

function HomeScreen({ navigation }) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={require('@/assets/images/football_soccer.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      />

      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome to Jonapp</ThemedText>
        <ThemedText>
          Connecting Fans, Celebrating the Beautiful Game
        </ThemedText>
      </ThemedView>

      <LeagueList
        onLeaguePress={(league) =>
          navigation.navigate('Detail', { league })
        }
      />
    </ScrollView>
  );
}

function DetailScreen({ route }) {
  const { league } = route.params;

  const openLink = () => {
    Linking.openURL(league.seeMoreLink).catch((err) =>
      console.error("Failed to open URL:", err)
    );
  };

  return (
    <View style={styles.detailContainer}>
      <Text style={styles.title}>League: {league.league}</Text>
      <Text>Country: {league.country}</Text>
      <Text>Leading Team: {league.leadingTeam}</Text>
      <Pressable onPress={openLink}>
        <Text style={styles.link}>See More</Text>
      </Pressable>
    </View>
  );
}

export default function Screen() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Detail"
        component={DetailScreen}
        options={{ title: 'League Details' }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    width: '100%',
    height: 250,
  },
  titleContainer: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  detailContainer: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  link: {
    color: 'blue',
    marginTop: 10,
    textDecorationLine: 'underline',
  },
});