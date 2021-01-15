// React + Expo imports
import React, { Component } from 'react';
import { View, ScrollView, Text, StyleSheet, ActivityIndicator } from 'react-native';

// React Navigation imports
import { createStackNavigator } from '@react-navigation/stack';
const Stack = createStackNavigator();

// Firebase imports
import firebase from 'firebase';

// Component import
import ImageTile from '../ImageTile';

/**
 * MyImagesScreen - This screen shows the user all of their images on Firebase.
 *                  They can click on the ImageTile to reveal more details and options
 *                  about the image. 
 * 
 *                  It refreshes and gets the latest collection of images
 *                  (if there is new additions/deletions) whenever the screen is showing.
 */
export default class MyImagesScreen extends Component {
    _focusListener = null;

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            imageResult: [],
        };
        this.getUserImages = this.getUserImages.bind(this);
    }

    /*
     * Registering a listener via navigation for when this screen is showing.
     * If the screen is showing, the listener fires the getUserImages method
     * to get the latest snapshot of the user images in Firebase.
     */

    componentDidMount() {
        this._focusListener = this.props.navigation.addListener('focus', () => {
            this.getUserImages();
        });
    }

    componentWillUnmount() {
        this._focusListener();
    }

    /**
     * getUserImages - Gets the latest snapshot (if there are any changes to the user's collection of images) 
     *                 and updates the screen with the latest information.
     * 
     *                 Orders the images in reverse chronological order, based on when they were uploaded.
     */
    getUserImages() {
        this.setState({ isLoading: true });
        firebase.firestore()
            .collection("users")
            .doc(firebase.auth().currentUser.uid)
            .collection("images")
            .orderBy('dateUploaded', 'desc')
            .get()
            .then((snapshot) => {
                let images = snapshot.docs.map((doc) => {
                    const data = doc.data();
                    const id = doc.id;
                    return { id, ...data }
                });
                this.setState({ isLoading: false, imageResult: images });
            });
    }

    render() {
        const { imageResult } = this.state;
        const { navigation } = this.props;
        // No images to showcase
        if (imageResult.length === 0) {
            return (
                <View style={styles.textContainer}>
                    <Text style={styles.text}>No images to display.</Text>
                </View>
            );
        }
        // Show a loading spinner to inform user about state of image list
        if (this.state.isLoading) {
            return (
                <View style={styles.indicator}>
                    <ActivityIndicator size="large" color="#000080"/>
                    <Text style={styles.indicatorText}>Loading...</Text>
                </View>
            );
        }
        return (
            <ScrollView>
                <View style={styles.imageTileContainer}>
                    {imageResult.map((image, index) => <ImageTile 
                                                        navigation={navigation}
                                                        image={image} 
                                                        isOdd={(index % 2) !== 0} 
                                                        key={index}/>)}
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    indicator: {
        height: '100%',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    indicatorText: {
        fontSize: 24, 
        color: '#000080'
    },
    textContainer: {
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: '#000080',
        fontSize: 24,
    },
    imageTileContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
});
