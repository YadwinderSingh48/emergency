import { PermissionsAndroid, StyleSheet, Text, View, Button } from 'react-native'
import React, { useState } from 'react'
import BackgroundService from 'react-native-background-actions';
import Geolocation from 'react-native-geolocation-service'
import { useLocation } from '../components/LocationContext';

const Test = () => {
    const { location } = useLocation();
    const [loc,setLoc]=useState('');
    const requestLocationPermission = async () => {
        try {
          console.log('Requesting location permission...');
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Location Permission',
              message: 'This app needs access to your location.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            }
          );
      
          console.log('Permission result:', granted);
      
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('Location permission granted. Requesting location updates...');
            const watchId = Geolocation.watchPosition(
              (pos) => {
                console.log('Fine location update received.');
                const { latitude, longitude } = pos.coords;
                console.log(`${latitude} ${longitude}`);
                setLoc(latitude)
              },
              (error) => {
                console.log('Error getting location', error);
              },
              {
                enableHighAccuracy: true,
                timeout: 20000,
                maximumAge: 5000,
                distanceFilter: 5,
              }
            );
      
            // Clear the watch on component unmount
            return () => Geolocation.clearWatch(watchId);
          } else {
            console.log('Location permission denied');
          }
        } catch (err) {
          console.warn('Error during location permission request:', err);
        }
      };

      const sleep = (time) => new Promise((resolve) => setTimeout(() => resolve(), time));
  const veryIntensiveTask = async (taskDataArguments) => {
    // Example of an infinite loop task
    const { delay } = taskDataArguments;
  
      for (let i = 0; BackgroundService.isRunning(); i++) {
        const l = await requestLocationPermission();
        console.log(loc)
   //const location = await requestLocationPermission();
   await sleep(delay);
      }
   
};

const options = {
    taskName: 'Example',
    taskTitle: 'ExampleTask title',
    taskDesc: 'ExampleTask description',
    taskIcon: {
        name: 'ic_launcher',
        type: 'mipmap',
    },
    color: '#ff00ff',
    linkingURI: 'yourSchemeHere://chat/jane', // See Deep Linking for more info
    parameters: {
        delay: 5000,
    },
};

const startservice = async()=>{
  await BackgroundService.start(veryIntensiveTask, options);
  await BackgroundService.updateNotification({taskDesc: 'Timer '}); // Only Android, iOS will ignore this call

}
const stopservice = async()=>{
  // iOS will also run everything here in the background until .stop() is called
  await BackgroundService?.stop();
}


  return (
    <View>
      <Text>test</Text>
      <Button title="Check Location" onPress={()=>{startservice()}} />
    </View>
  )
}

export default Test

const styles = StyleSheet.create({})