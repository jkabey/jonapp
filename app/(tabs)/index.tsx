
import React from 'react';
import { Image, StyleSheet, ScrollView, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { LeagueList } from '@/components/LeagueList';

export default function HomeScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={require('@/assets/images/football_soccer.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      />

      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome to jonapp</ThemedText>
        <ThemedText>
          Connecting Fans, Celebrating the Beautiful Game
        </ThemedText>
      </ThemedView>

      <LeagueList />
    </ScrollView>
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
});