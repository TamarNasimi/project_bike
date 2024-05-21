import React, { useState } from 'react';
import { View, StyleSheet, TextInput ,Button, Text} from 'react-native';
// import { TextInput, Button, Text } from 'react-native-paper';

export function LoginScreen( {navigation }  ) {
  // const LoginScreen = () => {
    const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Handle login logic
  };

  return (
    <View style={styles.container}>
      <Text>Login</Text>
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
      <Button title='Login' onPress={()=>{handleLogin()}}  />
      <Button title="Don't have an account? Register" onPress={() => navigation.navigate('Register') } />
      {/* <Button
        mode="text"
        onPress={handleLogin}
        // onPress={() => navigation.navigate('Register')}
        style={styles.button}
      > */}
        
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

// export default LoginScreen;