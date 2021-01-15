// React + Expo imports
import React, { Component } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons'

// Navigation imports and set up
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
const Tab = createBottomTabNavigator();

// Screen imports
import MyImagesScreen from '../screens/MyImagesScreen';
import UploadImagesOverviewScreen from '../screens/UploadImagesOverviewScreen';
import AccountOverviewScreen from '../screens/AccountOverviewScreen';

/**
 * LoggedInRoute - this is the route used to navigate between tabs
 *                 that are for signed in users.
 * 
 * Options include the 'My Images' screen to view all images that are stored in
 * Firebase, "Upload Images" to add more images to Firebase, or "My Account" to sign out
 * or to learn to use the application.
 */
export default class LoggedInRoute extends Component {
    render() {
        return (
            <Tab.Navigator 
                initialRouteName="My Images"
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused, color, size }) => {
                      let iconName;
          
                      if (route.name === "My Images") {
                        iconName = focused ? 'images' : 'images-outline';
                      } else if (route.name === "Upload Images") {
                        iconName = focused ? 'add' : 'add-outline';
                      } else if (route.name === "My Account") {
                        iconName = focused ? 'person-circle' : 'person-circle-outline';
                      }
          
                      // You can return any component that you like here!
                      return <Ionicons name={iconName} size={size} color={color} />;
                    },
                  })}
                  tabBarOptions={{
                    activeTintColor: "#000080",
                    inactiveTintColor: 'gray',
                  }}>
                <Tab.Screen name="My Images" component={MyImagesScreen}/>
                <Tab.Screen name="Upload Images" component={UploadImagesOverviewScreen}/>
                <Tab.Screen name="My Account" component={AccountOverviewScreen}/>
            </Tab.Navigator>
        )
    }
}