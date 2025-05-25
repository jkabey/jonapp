import { useQuery } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "../app/utils/supabase";
import { LeagueInfo } from "@/constants/LeaguesData";

const LEAGUE_CACHE_KEY = "leagues";

// Helper to check if running in React Native
const isReactNativeEnvironment = () => {
  return (
    typeof navigator !== "undefined" && navigator.product === "ReactNative"
  );
};

export const useGetLeagues = () => {
  return useQuery<LeagueInfo[], Error>({
    // Explicitly type the query data and error
    queryKey: ["leagues"],
    queryFn: async () => {
      const { data, error } = await supabase.from("leagues").select("*");

      if (error) {
        console.error("Error fetching leagues from Supabase:", error);
        throw new Error(error.message);
      }

      // Save to AsyncStorage only in a React Native environment
      if (isReactNativeEnvironment()) {
        try {
          if (data) {
            await AsyncStorage.setItem(LEAGUE_CACHE_KEY, JSON.stringify(data));
          } else {
            // If data is null (e.g., empty table), store an empty array string
            await AsyncStorage.setItem(LEAGUE_CACHE_KEY, JSON.stringify([]));
          }
        } catch (e) {
          console.warn("Failed to save leagues to AsyncStorage in queryFn:", e);
        }
      }
      return data || []; // Ensure returning an array even if data is null/undefined
    },
    initialData: async () => {
      // Only attempt to read from AsyncStorage if in a React Native environment
      if (isReactNativeEnvironment()) {
        try {
          const cachedData = await AsyncStorage.getItem(LEAGUE_CACHE_KEY);
          if (cachedData) {
            return JSON.parse(cachedData) as LeagueInfo[];
          }
          return undefined; // No cached data
        } catch (error) {
          console.warn(
            "Failed to load leagues from AsyncStorage for initialData:",
            error,
          );
          return undefined; // Gracefully fail if AsyncStorage errors
        }
      }
      return undefined; // Default if not in RN environment
    },
    staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
  });
};
