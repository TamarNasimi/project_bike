
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { IconButton, Text } from 'react-native-paper';
import { useUser } from './UserContext';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Profile: undefined;
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen: React.FC = () => {
  //בדיקה האם המשתמש מחובר
  const { user } = useUser();
  const navigation = useNavigation<HomeScreenNavigationProp>();
//אם המשתמש מחובר מפנה אותו לפרופיל שלו, אם לא לטופס התחברות
  const handleUserIconPress = () => {
    if (user) {
      navigation.navigate('Profile');
    } else {
      navigation.navigate('Login');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Here you must add a logo of the application and a brief explanation of what the application does</Text>
      <IconButton
        icon="account"
        size={30}
        onPress={handleUserIconPress}
        style={styles.userIcon}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  userIcon: {
    position: 'absolute',
    top: 16,
    left: 16,
  },
});

export default HomeScreen;
