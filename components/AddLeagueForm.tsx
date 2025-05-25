import React, { useState } from "react";
import {
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useLeagueContext } from "../app/context/LeagueContext";
import { addLeague } from "../app/utils/supabase";
import { useQueryClient } from "@tanstack/react-query";

const AddLeagueForm = () => {
  const navigation = useNavigation();
  // const { leagues, setLeagues } = useLeagueContext();
  const { leagues } = useLeagueContext();

  console.log("Home screen leagues:", leagues);
  const queryClient = useQueryClient();

  const [league, setLeague] = useState("");
  const [country, setCountry] = useState("");
  const [leadingTeam, setLeadingTeam] = useState("");
  const [seeMoreLink, setSeeMoreLink] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = (
    field: string,
    rules: { required?: boolean; minLength?: number; regex?: RegExp },
  ) => {
    if (rules.required && !field.trim()) return "This field is required.";
    if (rules.minLength && field.length < rules.minLength)
      return `Must be at least ${rules.minLength} characters long.`;
    if (rules.regex && !rules.regex.test(field)) return "Invalid format.";
    return null;
  };

  const validate = () => {
    const newErrors = {
      league: validateField(league, { required: true, minLength: 3 }),
      country: validateField(country, { required: true }),
      leadingTeam: validateField(leadingTeam, { required: true }),
      seeMoreLink: validateField(seeMoreLink, {
        required: true,
        regex: /^https?:\/\/\S+\.\S+$/,
      }),
    };

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => !error);
  };

  const handleSubmit = async () => {
    if (isSubmitting || !validate()) return;

    setIsSubmitting(true);
    try {
      await addLeague(league, country, leadingTeam, seeMoreLink);

      // Invalidate the 'leagues' cache to refetch updated data
      queryClient.invalidateQueries(["leagues"]);

      Alert.alert("Success", "League added successfully!");
      setLeague("");
      setCountry("");
      setLeadingTeam("");
      setSeeMoreLink("");
      setErrors({});
      navigation.goBack();
    } catch (error) {
      console.error("Submission error:", error);
      Alert.alert("Error", error.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.wrapper}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Add New League</Text>

        <TextInput
          style={styles.input}
          placeholder="League Name"
          value={league}
          onChangeText={setLeague}
        />
        {errors.league && <Text style={styles.errorText}>{errors.league}</Text>}

        <TextInput
          style={styles.input}
          placeholder="Country"
          value={country}
          onChangeText={setCountry}
        />
        {errors.country && (
          <Text style={styles.errorText}>{errors.country}</Text>
        )}

        <TextInput
          style={styles.input}
          placeholder="Leading Team"
          value={leadingTeam}
          onChangeText={setLeadingTeam}
        />
        {errors.leadingTeam && (
          <Text style={styles.errorText}>{errors.leadingTeam}</Text>
        )}

        <TextInput
          style={styles.input}
          placeholder="See More Link (https://...)"
          value={seeMoreLink}
          onChangeText={setSeeMoreLink}
          keyboardType="url"
          autoCapitalize="none"
        />
        {errors.seeMoreLink && (
          <Text style={styles.errorText}>{errors.seeMoreLink}</Text>
        )}

        <Pressable
          onPress={handleSubmit}
          style={styles.button}
          disabled={isSubmitting}
        >
          <Text style={styles.buttonText}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AddLeagueForm;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  container: {
    flexGrow: 1,
    padding: 24,
    justifyContent: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#f2f2f2",
    padding: 14,
    borderRadius: 10,
    marginBottom: 8,
    fontSize: 16,
    color: "#000",
    borderColor: "#444",
    borderWidth: 1,
  },
  errorText: {
    color: "#ff6b6b",
    marginBottom: 12,
    fontSize: 14,
  },
  button: {
    backgroundColor: "#f97316",
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
