import React from "react";
import {
  Image,
  StyleSheet,
  ScrollView,
  View,
  Text,
  Pressable,
  Linking,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { LeagueList } from "@/components/LeagueList";
import {
  createStackNavigator,
  StackScreenProps,
} from "@react-navigation/stack";
import AddLeagueForm from "@/components/AddLeagueForm";

// Defining the navigation stack types
type RootStackParamList = {
  Home: undefined;
  Detail: {
    league: {
      league: string;
      country: string;
      leadingTeam: string;
      seeMoreLink: string;
    };
  };
  AddLeague: undefined;
};

// Defining the props for each screen
type HomeScreenProps = StackScreenProps<RootStackParamList, "Home">;
type DetailScreenProps = StackScreenProps<RootStackParamList, "Detail">;

const Stack = createStackNavigator<RootStackParamList>();

function HomeScreen({ navigation }: HomeScreenProps) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={require("@/assets/images/football_soccer.jpg")}
        style={styles.backgroundImage}
        resizeMode="cover"
      />

      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome to Jonapp</ThemedText>
        <ThemedText>Connecting Fans, Celebrating the Beautiful Game</ThemedText>
      </ThemedView>

      {/* Adding New League Button */}
      <View style={styles.addButton}>
        <Pressable
          onPress={() => navigation.navigate("AddLeague")}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Add New League</Text>
        </Pressable>
      </View>

      <LeagueList
        onLeaguePress={(league) => navigation.navigate("Detail", { league })}
      />
    </ScrollView>
  );
}

function DetailScreen({ route }: DetailScreenProps) {
  const { league } = route.params;

  const openLink = () => {
    Linking.openURL(league.seeMoreLink).catch((err) =>
      console.error("Failed to open URL:", err),
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
        options={{ title: "League Details" }}
      />
      <Stack.Screen
        name="AddLeague"
        component={AddLeagueForm}
        options={{ title: "Add New League" }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    width: "100%",
    height: 250,
  },
  titleContainer: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  detailContainer: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  link: {
    color: "blue",
    marginTop: 10,
    textDecorationLine: "underline",
  },
  addButton: {
    marginHorizontal: 20,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#1e90ff",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});
