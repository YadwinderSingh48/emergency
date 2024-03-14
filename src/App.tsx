// App.js
import React from 'react';
import AppNavigator, { TabNavigator } from './Screens/AppNavigator';
import { NavigationContainer } from '@react-navigation/native';
import { LocationProvider } from './components/LocationContext'; 
const App = () => {
  return (
   <LocationProvider>
    <AppNavigator />
</LocationProvider>
  )
};

export default App;
