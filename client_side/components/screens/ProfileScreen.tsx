import React from 'react';
import { View, StyleSheet } from 'react-native';
import { IconButton, Text } from 'react-native-paper';
import { useUser } from './UserContext';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Profile: undefined;
  ModeSelection: undefined;
  ReservedPlaces: undefined;
};

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Profile'>;

const ProfileScreen: React.FC = () => {
  const { user, logout } = useUser();
  const navigation = useNavigation<ProfileScreenNavigationProp>();

  const handleLogout = () => {
    logout();
    navigation.navigate('Login');
  };

  const handleMenu = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const handleLocation = () => {
    // Handle location logic here
  };

  return (
    <View style={styles.container}>
      <IconButton
        icon="menu"
        size={30}
        onPress={handleMenu}
        style={styles.menuIcon}
      />
      <Text variant="headlineMedium">Profile</Text>
      {user && (
        <>
          <Text>Email: {user.email}</Text>
          <IconButton
            icon="logout"
            size={30}
            onPress={handleLogout}
            style={styles.logoutIcon}
          />
        </>
      )}
      <IconButton
        icon="crosshairs-gps"
        size={30}
        onPress={handleLocation}
        style={styles.locationIcon}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  menuIcon: {
    position: 'absolute',
    top: 16,
    left: 16,
  },
  logoutIcon: {
    marginVertical: 8,
  },
  locationIcon: {
    position: 'absolute',
    bottom: 16,
    left: 16,
  },
});

export default ProfileScreen;
