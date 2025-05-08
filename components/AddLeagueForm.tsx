import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useLeagueContext } from '../app/context/LeagueContext';

const AddLeagueForm = () => {
  const navigation = useNavigation();
  const { leagues, setLeagues } = useLeagueContext();

  const [league, setLeague] = useState('');
  const [country, setCountry] = useState('');
  const [leadingTeam, setLeadingTeam] = useState('');
  const [seeMoreLink, setSeeMoreLink] = useState('');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors: any = {};

    if (!league.trim()) newErrors.league = 'League name is required.';
    else if (league.length < 3) newErrors.league = 'League name must be at least 3 characters.';

    if (!country.trim()) newErrors.country = 'Country is required.';

    if (!leadingTeam.trim()) newErrors.leadingTeam = 'Leading team is required.';

    if (!seeMoreLink.trim()) {
      newErrors.seeMoreLink = 'See More link is required.';
    } else if (!/^https?:\/\/\S+\.\S+$/.test(seeMoreLink)) {
      newErrors.seeMoreLink = 'Enter a valid URL (https://...)';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    // Update global state
    const newLeague = { league, country, leadingTeam, seeMoreLink };
    setLeagues([...leagues, newLeague]);

    Alert.alert('Success', 'League added successfully.');

    // Clearing form
    setLeague('');
    setCountry('');
    setLeadingTeam('');
    setSeeMoreLink('');
    setErrors({});

    // Navigating back to Home
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
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
        {errors.country && <Text style={styles.errorText}>{errors.country}</Text>}

        <TextInput
          style={styles.input}
          placeholder="Leading Team"
          value={leadingTeam}
          onChangeText={setLeadingTeam}
        />
        {errors.leadingTeam && <Text style={styles.errorText}>{errors.leadingTeam}</Text>}

        <TextInput
          style={styles.input}
          placeholder="See More Link (https://...)"
          value={seeMoreLink}
          onChangeText={setSeeMoreLink}
          keyboardType="url"
          autoCapitalize="none"
        />
        {errors.seeMoreLink && <Text style={styles.errorText}>{errors.seeMoreLink}</Text>}

        <Pressable onPress={handleSubmit} style={styles.button}>
          <Text style={styles.buttonText}>Submit</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AddLeagueForm;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#f2f2f2'
  },
  container: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#f2f2f2',
    padding: 14,
    borderRadius: 10,
    marginBottom: 8,
    fontSize: 16,
    color: '#000',
    borderColor: '#444',
    borderWidth: 1,
  },
  errorText: {
    color: '#ff6b6b',
    marginBottom: 12,
    fontSize: 14,
  },
  button: {
    backgroundColor: '#f97316',
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
