import { StyleSheet, Text, View, Button, StatusBar } from 'react-native'
import React from 'react'
import Splash from './Splash';
// Navigation
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LoginScreen from './LoginScreen';
import SignupScreen from './SignupScreen';
import ContactScreen from './ContactScreen';
import Picker from './Picker';
import Tracker from './Tracker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HomeScreen from './HomeScreen';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ProfileScreen from './ProfileScreen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Home from './Home'
import Contacts from '../components/Contacts'
import Recents from '../components/Recents';
import ContactDetails from './ContactDetails';
const stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const AppNavigator = () => {
  return (
    
    <NavigationContainer>
      {/* <StatusBar backgroundColor="" /> */}
      <stack.Navigator initialRouteName='Splash'>
        <stack.Screen
          name='Splash' component={Splash} options={{
            headerShown: false
          }}
        ></stack.Screen>
         <stack.Screen
          name='Contacts' component={Contacts} options={{
            headerShown: false
          }}
        ></stack.Screen>
         <stack.Screen
          name='ContactDetails' component={ContactDetails} options={{
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
          name='Picker' component={Picker} options={{
            headerShown: true
          }}
        ></stack.Screen>
        <stack.Screen
          name='Home' component={Home} options={{
            headerShown: false
          }}
        ></stack.Screen>

{/* <stack.Screen
  name='Tracker' component={StackNavigator} options={{
    headerShown: false
  }}
></stack.Screen>
        <stack.Screen
          name='HomeScreen' component={TabNavigator} options={{
            headerShown: false
          }}
        ></stack.Screen> */}

      </stack.Navigator>

    </NavigationContainer>
  )
}

export function TabNavigator() {
  return (
    <Tab.Navigator screenOptions={{
      activeTintColor: 'blue',
      inactiveTintColor: 'gray',
    }} >
      <Tab.Screen
        name='HomeScreen_Tab' component={HomeScreen} options={{
          headerShown: true,
          title: 'Actions',
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => {
            return (
              <Ionicons name="home" color={color} size={size} />
            )
          }
        }}
      ></Tab.Screen>
      <Tab.Screen
        name='ContactScreen' component={ContactScreen} options={{
          headerShown: true,
          title: 'My Contacts',
          tabBarLabel: 'Contacts',
          tabBarIcon: ({ color, size }) => {
            return (
              <MaterialIcons name="contacts" color={color} size={size} />
            )
          }
        }}
      ></Tab.Screen>
      <Tab.Screen
        name='ProfileScreen' component={ProfileScreen} options={{
          title: 'Account Info',
          headerShown: true,
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => {
            return (
              <MaterialCommunityIcons name="account" color={color} size={size} />
            )
          }
        }}
      ></Tab.Screen>
    </Tab.Navigator>
  );
}
const StackNavigator = () => (
  <stack.Navigator>
    <stack.Screen
      name='Tracker_stack' component={Tracker} options={{
        title:'Track'
        // Your stack screen options here
      }}
    />
  </stack.Navigator>
);

export default AppNavigator
const styles = StyleSheet.create({})