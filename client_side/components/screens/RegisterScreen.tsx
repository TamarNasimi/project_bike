import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Text, Button } from 'react-native';
// import { , ,  } from 'react-native-paper';

export function RegisterScreen({ navigation }) {
  // const RegisterScreen = ({  }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = () => {
    // Handle registration logic
  };

  return (
    <View style={styles.container}>
      <Text >Register</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <TextInput
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        style={styles.input}
      />
      <Button onPress={handleRegister} title='Register' />
      <Button onPress={handleRegister} title="Already have an account? Login" />
      {/*         
      <Button
        mode="text"
        // onPress={() => navigation.goBack()}
        style={styles.button}
      >
        Already have an account? Login
      </Button> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginVertical: 8,
  },
});

