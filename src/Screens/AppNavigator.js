import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Splash from './Splash';
// Navigation
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native'
import LoginScreen from './LoginScreen';
import SignupScreen from './SignupScreen';
import HomeScreen from './HomeScreen';
import Picker from './Picker';
const stack = createStackNavigator();
const AppNavigator = () => {
  return (
    <NavigationContainer>
      <stack.Navigator initialRouteName='Splash'>
        <stack.Screen
          name='Splash' component={Splash} options={{
                                            headerShown: false
                                            }}
        ></stack.Screen>
        <stack.Screen
          name='LoginScreen' component={LoginScreen} options={{
                                            headerShown: false
                                            }}
        ></stack.Screen>
        <stack.Screen
          name='SignupScreen' component={SignupScreen} options={{
                                            headerShown: false
                                            }}
        ></stack.Screen>
        <stack.Screen
          name='HomeScreen' component={HomeScreen} options={{
                                            headerShown: true,
                                            title:'Your Contacts'
                                            }}
        ></stack.Screen>
        <stack.Screen
          name='Picker' component={Picker} options={{
                                            headerShown: true
                                            }}
        ></stack.Screen>
      </stack.Navigator>
    </NavigationContainer>
  )
}

export default AppNavigator

const styles = StyleSheet.create({})