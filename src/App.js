import React, { useState } from 'react';
import Text1 from './components/common/Text';
import { ThemeProvider } from '@shopify/restyle';
import { theme } from './foundation/theme/theme';
import { SafeAreaView, StatusBar, View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AppleHealthKit from 'react-native-health';
import GoogleFit, { ActivityType, Scopes } from 'react-native-google-fit';
import moment from 'moment';
export default function App() {
  const [steps, setSteps] = useState('');

  const addStepsToHealthKit = async () => {
    const options = {
      permissions: {
        read: [AppleHealthKit.Constants.Permissions.StepCount],
        write: [AppleHealthKit.Constants.Permissions.StepCount],
      },
    };
    console.log('🚀 ~ addStepsToHealthKit ~ options:', options);

    AppleHealthKit.initHealthKit(options, (err) => {
      console.log('🚀 ~ AppleHealthKit.initHealthKit ~ err:', err);
      if (err) {
        console.log('Error initializing HealthKit:', err);
        Alert.alert('Error', 'HealthKit not initialized');
        return;
      }

      const stepSample = {
        value: parseInt(steps, 10),
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
      };
      console.log('🚀 ~ AppleHealthKit.initHealthKit ~ stepSample:', stepSample);

      AppleHealthKit.saveSteps(stepSample, (err) => {
        if (err) {
          console.log('Error saving steps:', err);
          Alert.alert('Error', 'Could not save steps');
        } else {
          Alert.alert('Success', 'Steps added to HealthKit');
        }
      });
    });
  };

  const addStepsToGoogleFit = async () => {
    console.log('132123123');
    GoogleFit.checkIsAuthorized().then(() => {
      console.log(GoogleFit.isAuthorized); // Then you can simply refer to `GoogleFit.isAuthorized` boolean.
    });
    const options = {
      scopes: [
        Scopes.FITNESS_ACTIVITY_READ,
        Scopes.FITNESS_ACTIVITY_WRITE,
        Scopes.FITNESS_BODY_READ,
        Scopes.FITNESS_BODY_WRITE,
      ],
    };
    // const startTime = new Date(Date.now() - (30 * 60 * 1000)).getTime(); // 30 mins ago
    // const endTime = new Date().getTime();
    const startTime = moment().utc().valueOf() // 30 mins ago
    const endTime = moment().utc().valueOf()
    
    console.log('🚀 ~ addStepsToGoogleFit ~ options:', moment().utc().valueOf());
    console.log('🚀 ~ addStepsToGoogleFit ~ options:', options);
    GoogleFit.authorize(options)
      .then(() => {
        const stepData = {
    //       sessionName: "Morning Run",
    // sessionId: new Date().getTime().toString(), 
    //       startDate: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    //       endDate: new Date().toISOString(),
    //       steps: parseInt(steps, 10),
    sessionName: "Morning Run",
    identifier: new Date().getTime().toString(), // Unique session ID
    // startTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
    startTime: startTime, // 30 minutes ago
    endTime: endTime, // Now
    activityType: ActivityType.Walking,
    steps:parseInt(steps, 10)
    // activityType: 8,
        };
        console.log('🚀 ~ .then ~ stepData:', stepData);

        GoogleFit.saveWorkout(stepData)
          .then((abc) => {
            console.log('🚀 ~ GoogleFit.saveWorkout ~ abc:', abc);
          })
          .catch((err) => {
            console.log('🚀 ~ GoogleFit.saveSteps ~ err:', err);
            if (err) {
              console.log('Error saving steps:', err);
              Alert.alert('Error', 'Could not save steps to Google Fit');
            } else {
              Alert.alert('Success', 'Steps added to Google Fit');
            }
          });
      })
      .catch((err) => {
        console.log('Google Fit authorization failed:', err);
        Alert.alert('Error', 'Authorization failed');
      });
  };

  return (
    <ThemeProvider theme={theme}>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar />
        <View style={styles.container}>
          <Text style={styles.title}>Add Fake Steps</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="Enter steps"
            value={steps}
            onChangeText={setSteps}
          />
          <Button title="Add to Apple Health" onPress={addStepsToHealthKit} />
          <Button title="Add to Google Fit" onPress={addStepsToGoogleFit} />
        </View>
      </SafeAreaView>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: '80%',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
});
