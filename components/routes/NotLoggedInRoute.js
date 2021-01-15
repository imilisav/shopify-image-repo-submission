// React + Expo imports
import React, { Component } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons'

// React navigation imports and set up
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
const Tab = createBottomTabNavigator();

// Screen imports
import LoginScreen from '../screens/LoginScreen';
import CreateAccountScreen from '../screens/CreateAccountScreen';

/**
 * NotLoggedInRoute - Route used to navigate between tabs for users
 *                    that are not signed in.
 * 
 * Options are to sign in with the 'Sign in' screen or to create an
 * account with the 'Create account' screen.
 */
export default class NotLoggedInRoute extends Component {
    render() {
        return (
            <Tab.Navigator 
                initialRouteName="Sign In"
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused, color, size }) => {
                      let iconName;
          
                      if (route.name === "Sign In") {
                        iconName = focused ? 'log-in' : 'log-in-outline';
                      } else if (route.name === "Create Account") {
                        iconName = focused ? 'person-add' : 'person-add-outline';
                      }
          
                      // You can return any component that you like here!
                      return <Ionicons name={iconName} size={size} color={color} />;
                    },
                  })}
                  tabBarOptions={{
                    activeTintColor: "#000080",
                    inactiveTintColor: 'gray',
                  }}>
                <Tab.Screen name="Sign In" component={LoginScreen}/>
                <Tab.Screen name="Create Account" component={CreateAccountScreen}/>
            </Tab.Navigator>
        )
    }
}