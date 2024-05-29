import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import ProfileScreen from './ProfileScreen';
import ModeSelectionScreen from './ModeSelectionScreen';
import ReservedPlacesScreen from './ReservedPlacesScreen';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator initialRouteName="ModeSelection">
      <Drawer.Screen name="Profile" component={ProfileScreen} />
      <Drawer.Screen name="ModeSelection" component={ModeSelectionScreen} />
      <Drawer.Screen name="ReservedPlaces" component={ReservedPlacesScreen} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
