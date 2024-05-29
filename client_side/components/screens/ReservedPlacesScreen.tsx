import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Button, Text, TextInput, List } from 'react-native-paper';

const ReservedPlacesScreen: React.FC = () => {
  const [places, setPlaces] = useState<string[]>([]);
  const [newPlace, setNewPlace] = useState('');

  const handleAddPlace = () => {
    if (newPlace.trim() !== '') {
      setPlaces([...places, newPlace]);
      setNewPlace('');
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">Reserved Places</Text>
      <FlatList
        data={places}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <List.Item
            title={item}
            left={props => <List.Icon {...props} icon="map-marker" />}
          />
        )}
      />
      <TextInput
        label="New Place"
        value={newPlace}
        onChangeText={setNewPlace}
        style={styles.input}
      />
      <Button mode="contained" onPress={handleAddPlace} style={styles.button}>
        Add Place
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    marginVertical: 16,
  },
  button: {
    marginTop: 16,
  },
});

export default ReservedPlacesScreen;
