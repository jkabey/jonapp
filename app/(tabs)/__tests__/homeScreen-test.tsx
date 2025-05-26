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
      select: jest.fn(() =>
        Promise.resolve({
          data: [
            {
              id: 1,
              name: "Premier League",
              country: "England",
              topTeam: "Liverpool",
              link: "https://premierleague.com",
            },
            {
              id: 2,
              name: "La Liga",
              country: "Spain",
              topTeam: "Real Madrid",
              link: "https://laliga.com",
            },
          ],
          error: null,
        }),
      ),
      insert: jest.fn(() =>
        Promise.resolve({
          data: [
            {
              id: 3,
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

// Mock League Context
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

describe("HomeScreen flow", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderHomeScreen = () =>
    render(
      <View style={{ flex: 1 }}>
        <NavigationContainer>
          <Screen />
        </NavigationContainer>
      </View>,
    );

  test("shows no leagues initially, adds a league and displays Supabase data", async () => {
    renderHomeScreen();

    expect(screen.getByPlaceholderText("Search Leagues")).toBeTruthy();
    expect(screen.getByText("Add a League")).toBeTruthy();
    expect(screen.queryByText("Premier League")).toBeNull();
    expect(screen.queryByText("La Liga")).toBeNull();

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

    // Wait for each league name individually
    await waitFor(() => {
      expect(screen.getByText("Premier League")).toBeTruthy();
    });

    await waitFor(() => {
      expect(screen.getByText("La Liga")).toBeTruthy();
    });
  });

  test("filters leagues after adding", async () => {
    renderHomeScreen();

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

    await waitFor(() => {
      expect(screen.getByText("Premier League")).toBeTruthy();
    });

    await waitFor(() => {
      expect(screen.getByText("La Liga")).toBeTruthy();
    });

    fireEvent.changeText(screen.getByPlaceholderText("Search Leagues"), "La");

    await waitFor(() => {
      expect(screen.getByText("La Liga")).toBeTruthy();
    });

    expect(screen.queryByText("Premier League")).toBeNull();
  });
});
