// App.js
import React from 'react';
import AppNavigator, { TabNavigator } from './Screens/AppNavigator';
import { NavigationContainer } from '@react-navigation/native';
import { LocationProvider } from './components/LocationContext';
import { SafeAreaView } from 'react-native';

const App = () => {
  return (

    <LocationProvider>
      <SafeAreaView style={{flex:1}}>
        <AppNavigator />
      </SafeAreaView>

    </LocationProvider>


  )
};

export default App;
