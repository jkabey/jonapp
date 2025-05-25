import React from "react";
import {
  render,
  fireEvent,
  waitFor,
  screen,
} from "@testing-library/react-native";
import { NavigationContainer } from "@react-navigation/native";
import { View } from "react-native";
import Screen from "@/app/(tabs)/index";

// Mock Supabase
jest.mock("@/app/utils/supabase", () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => Promise.resolve({ data: [], error: null })),
      insert: jest.fn(() =>
        Promise.resolve({
          data: [
            {
              id: 1,
              name: "Premier League",
              country: "England",
              topTeam: "Man City",
              link: "https://premierleague.com",
            },
          ],
          error: null,
        }),
      ),
    })),
  },
}));

// Mock League Context to allow update after adding
jest.mock("@/app/context/LeagueContext", () => {
  let leagues = [];
  return {
    useLeagueContext: () => ({
      leagues,
      isLoading: false,
      isError: false,
      error: null,
      addLeague: (newLeague) => leagues.push(newLeague),
    }),
  };
});

describe("HomeScreen functionality", () => {
  it("renders list after a league is added", async () => {
    render(
      <View style={{ flex: 1 }}>
        <NavigationContainer>
          <Screen />
        </NavigationContainer>
      </View>,
    );

    // Verify search and add buttons are visible
    expect(screen.getByPlaceholderText("Search Leagues")).toBeTruthy();
    fireEvent.press(screen.getByText("Add a League"));

    // Fill the form
    fireEvent.changeText(
      screen.getByPlaceholderText("League Name"),
      "Premier League",
    );
    fireEvent.changeText(screen.getByPlaceholderText("Country"), "England");
    fireEvent.changeText(
      screen.getByPlaceholderText("Leading Team"),
      "Man City",
    );
    fireEvent.changeText(
      screen.getByPlaceholderText("See More Link"),
      "https://premierleague.com",
    );

    // Submit the form
    fireEvent.press(screen.getByText("Submit"));

    // Wait for league to appear
    const newLeague = await screen.findByText("Premier League");
    expect(newLeague).toBeTruthy();
  });

  it("filters the list based on search input", async () => {
    render(
      <View style={{ flex: 1 }}>
        <NavigationContainer>
          <Screen />
        </NavigationContainer>
      </View>,
    );

    // Add a league first
    fireEvent.press(screen.getByText("Add a League"));
    fireEvent.changeText(
      screen.getByPlaceholderText("League Name"),
      "Premier League",
    );
    fireEvent.changeText(screen.getByPlaceholderText("Country"), "England");
    fireEvent.changeText(
      screen.getByPlaceholderText("Leading Team"),
      "Man City",
    );
    fireEvent.changeText(
      screen.getByPlaceholderText("See More Link"),
      "https://premierleague.com",
    );
    fireEvent.press(screen.getByText("Submit"));
    await screen.findByText("Premier League");

    // Type into search input
    const searchInput = screen.getByPlaceholderText("Search Leagues");
    fireEvent.changeText(searchInput, "Premier");

    // League should still be visible
    expect(screen.getByText("Premier League")).toBeTruthy();

    //  searching for something not in the list
    fireEvent.changeText(searchInput, "La Liga");

    await waitFor(() => {
      expect(screen.queryByText("Premier League")).toBeNull();
    });
  });
});
