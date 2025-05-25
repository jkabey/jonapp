import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

// Check if the code is running in a React Native environment
const isReactNative =
  typeof navigator !== "undefined" && navigator.product === "ReactNative";

// Configure the storage based on the environment
const storage = isReactNative ? AsyncStorage : undefined;
// insert new league data
export const addLeague = async (
  league: string,
  country: string,
  leadingTeam: string,
  seeMoreLink: string,
) => {
  const { data, error } = await supabase
    .from("leagues")
    .insert([{ league, country, leadingTeam, seeMoreLink }]);

  if (error) {
    console.error("Error inserting league:", error.message);
    throw new Error(error.message);
  }

  return data;
};

export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL || "",
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "",
  {
    auth: {
      storage, // Use AsyncStorage for React Native, undefined for other environments
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: !isReactNative, // Only detect session in URL for web
    },
  },
);
