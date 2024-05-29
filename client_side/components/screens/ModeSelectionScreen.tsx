
import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { TextInput, Button, RadioButton, Text, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import NumericInput from 'react-native-numeric-input';
import { RootStackParamList } from '@/app/(tabs)/index';
import axios from 'axios';
import Ionicons from 'react-native-vector-icons/Ionicons';

type ModeSelectionScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ModeSelection'>;

type Props = {
  navigation?: ModeSelectionScreenNavigationProp;
};

const ModeSelection: React.FC<Props> = ({ navigation = useNavigation<ModeSelectionScreenNavigationProp>() }) => {
  const [tripPurpose, setTripPurpose] = useState('');
  const [startingPoint, setStartingPoint] = useState('');
  const [destination, setDestination] = useState('');
  const [stopPoints, setStopPoints] = useState<string[]>([]);
  const [maxSlope, setMaxSlope] = useState('');
  const [healthHighlights, setHealthHighlights] = useState('');
  const [calories, setCalories] = useState(0);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!tripPurpose) {
      errors.tripPurpose = 'Please select the purpose of the trip';
    }
    if (!startingPoint) {
      errors.startingPoint = 'Starting point is required';
    }
    if (!destination) {
      errors.destination = 'Destination is required';
    }
    if (tripPurpose === 'sports' && !calories) {
      errors.calories = 'Calories is required for sports purposes';
    }
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleTripPurposeChange = (value: string) => {
    setTripPurpose(value);
    setErrors({ ...errors, tripPurpose: '' });
  };

  const handleStartingPointChange = (value: string) => {
    setStartingPoint(value);
    setErrors({ ...errors, startingPoint: '' });
  };

  const handleDestinationChange = (value: string) => {
    setDestination(value);
    setErrors({ ...errors, destination: '' });
  };

  const handleStopPointsChange = (index: number, value: string) => {
    const updatedStopPoints = [...stopPoints];
    updatedStopPoints[index] = value;
    setStopPoints(updatedStopPoints);
  };

  const handleAddStopPoint = () => {
    setStopPoints([...stopPoints, '']);
  };

  const handleMaxSlopeChange = (value: string) => {
    setMaxSlope(value);
  };

  const handleHealthHighlightsChange = (value: string) => {
    setHealthHighlights(value);
  };

  const handleCaloriesChange = (value: number) => {
    setCalories(value);
    setErrors({ ...errors, calories: '' });
  };

  const handleSubmit = () => {
    console.log("enter handleSubmit")
    if (validateForm()) {
      axios.post('http://localhost:3000/DataTrip/',
        {
          tripPurpose: tripPurpose,
          startingPoint: startingPoint,
          destination: destination,
          stopPoints: stopPoints,
          maxSlope: maxSlope,
          healthHighlights: healthHighlights
        }).then(() => {
          navigation.navigate('Home');
        }).catch((err) => { console.error(err) })
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>Route Details</Text>
      <RadioButton.Group onValueChange={handleTripPurposeChange} value={tripPurpose}>
        <RadioButton.Item label="Sports Purposes" value="sports" />
        <RadioButton.Item label="Traveling with Stops" value="traveling" />
      </RadioButton.Group>
      {errors.tripPurpose && <Text style={styles.error}>{errors.tripPurpose}</Text>}
      {tripPurpose && (
        <>
          <TextInput
            label="Starting Point"
            value={startingPoint}
            onChangeText={handleStartingPointChange}
            style={styles.input}
            error={Boolean(errors.startingPoint)}
          />
          {errors.startingPoint && <Text style={styles.error}>{errors.startingPoint}</Text>}
          <TextInput
            label="Destination"
            value={destination}
            onChangeText={handleDestinationChange}
            style={styles.input}
            error={Boolean(errors.destination)}
          />
          {errors.destination && <Text style={styles.error}>{errors.destination}</Text>}
          {tripPurpose === 'traveling' && stopPoints.map((stopPoint, index) => (
            <TextInput
              key={index}
              label={`Stop Point ${index + 1}`}
              value={stopPoint}
              onChangeText={(value) => handleStopPointsChange(index, value)}
              style={styles.input}
            />
          ))}
          {tripPurpose === 'traveling' && (
            <Button mode="contained" onPress={handleAddStopPoint} style={styles.addButton}>
              Add Stop Point
            </Button>
          )}
          <TextInput
            label="Maximum Slope"
            value={maxSlope}
            onChangeText={handleMaxSlopeChange}
            style={styles.input}
          />
          <TextInput
            label="Health Highlights"
            value={healthHighlights}
            onChangeText={handleHealthHighlightsChange}
            style={styles.input}
          />
          {tripPurpose === 'sports' && (
            <View style={styles.numericStepperContainer}>
              <Text style={styles.label}>Calories</Text>
              <NumericInput
                value={calories}
                onChange={handleCaloriesChange}
                minValue={0}
                totalHeight={50}
                iconSize={15}
                step={1}
                valueType='real'
                rounded
                textColor='#B0228C'
                rightButtonBackgroundColor='white'
                leftButtonBackgroundColor='white'
              />
              {errors.calories && <Text style={styles.error}>{errors.calories}</Text>}
            </View>
          )}
          <Button mode="contained" onPress={handleSubmit} style={styles.button}>
            Submit
          </Button>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    justifyContent: 'center',
  },
  title: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
  },
  label: {
    marginRight: 16,
  },
  numericStepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  error: {
    color: 'red',
    marginBottom: 8,
  },
  addButton: {
    marginTop: 16,
    marginBottom: 32,
  },
});

export default ModeSelection;
