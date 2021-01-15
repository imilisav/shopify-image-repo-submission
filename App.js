// React + Expo imports
import React, { Component } from 'react';
import { Appearance, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';

// Route imports
import NotLoggedInRoute from './components/routes/NotLoggedInRoute';
import LoggedInRoute from './components/routes/LoggedInRoute';
import ImageDetailsScreen from './components/screens/ImageDetailsScreen';

// Firebase imports
import * as firebase from 'firebase';
require('firebase/firebase-firestore');
require('firebase/firebase-storage');

// React navigation imports
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

/* 
 * Firebase vars needed to interact with firebase firestore, auth, and storage
 *
 * Input with your own firebase app creds to use this app.
 * 
 * IF YOU GO TO PRODUCTION, PUT THESE CREDS IN AN ENVIRONMENT FILE.
 */
const firebaseConfig = {
  apiKey: "************ input your creds here ************",
  authDomain: "************",
  projectId: "************",
  storageBucket: "************",
  messagingSenderId: "************",
  appId: "************",
  measurementId: "************"
};
if (firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig)
}

// Creating the stack that will house our nested navigations or screens when we are signed out/signed in
const Stack = createStackNavigator(); 

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoggedIn: false,
        };
    }

    componentDidMount() {
        // Check if the user is signed in
        firebase.auth().onAuthStateChanged((user) => {
            var isLoggedIn = (!user) ? false : true;
            this.setState({ isLoggedIn: isLoggedIn })
        })
    }

    render() {
        // Displaying the proper screens depending on whether the user is signed in.
        if (!this.state.isLoggedIn) {
            return(
                <>
                    <StatusBar barStyle="light"/> 
                    <NavigationContainer>
                        <Stack.Navigator>
                            <Stack.Screen 
                                name="NotLoggedInRoute" 
                                component={NotLoggedInRoute}
                                options={{ title: "ImgVault", headerTintColor: '#000080', headerTitleStyle: { fontSize: 24 } }}/>
                        </Stack.Navigator>
                    </NavigationContainer>
                </>
            );
        }
        return (
            <>
                <StatusBar barStyle="light"/>
                <NavigationContainer>
                    <Stack.Navigator initialRouteName="ImgVault">
                        <Stack.Screen 
                            name="ImgVault"
                            component={LoggedInRoute}
                            options={{ title: "ImgVault", headerTintColor: '#000080', headerTitleStyle: { fontSize: 24 } }}/>
                        <Stack.Screen 
                            name="Image Details"
                            component={ImageDetailsScreen}
                            options={{ headerTintColor: '#000080' }}/>
                    </Stack.Navigator>
                </NavigationContainer>
            </>
        );
    }
}