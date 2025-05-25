// preloadLeagues.ts test1111
import AsyncStorage from "@react-native-async-storage/async-storage";
import { QueryClient } from "@tanstack/react-query";

export async function preloadLeagues(queryClient: QueryClient) {
  try {
    const cached = await AsyncStorage.getItem("leagues");
    if (cached) {
      queryClient.setQueryData(["leagues"], JSON.parse(cached));
    }
  } catch (error) {
    console.warn("Failed to preload leagues from AsyncStorage", error);
  }
}
