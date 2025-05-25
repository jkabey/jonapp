import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import "react-native-reanimated";
import { useColorScheme } from "@/hooks/useColorScheme";
import { LeagueProvider } from "../app/context/LeagueContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { supabase } from "./utils/supabase";
import { AppState } from "react-native";

const queryClient = new QueryClient();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  // Handle SplashScreen and fonts
  useEffect(() => {
    const prepare = async () => {
      await SplashScreen.preventAutoHideAsync();
      if (loaded) {
        await SplashScreen.hideAsync();
      }
    };
    prepare();
  }, [loaded]);

  // Auto sign-in logic
  useEffect(() => {
    const autoSignin = async () => {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: "abc@gmail.com",
          password: "test1111",
        });
        if (error) {
          console.error("Error signing in:", error);
        } else {
          setIsAuthenticated(true);
          console.log("Signed in user:", data);
        }
      } catch (err) {
        console.error("Unexpected error during sign-in:", err);
      }
    };

    if (!isAuthenticated) {
      autoSignin();
    }
  }, [isAuthenticated]);

  // AppState listener for Supabase session management
  useEffect(() => {
    const handleAppStateChange = (state: string) => {
      if (state === "active") {
        supabase.auth.startAutoRefresh();
      } else {
        supabase.auth.stopAutoRefresh();
      }
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange,
    );

    return () => {
      subscription.remove(); // Cleanup listener on unmount
    };
  }, []);

  if (!loaded) {
    return null; // Wait for fonts to load
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <LeagueProvider>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="auto" />
        </LeagueProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
