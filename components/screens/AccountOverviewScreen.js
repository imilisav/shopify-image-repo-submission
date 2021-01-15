// React and Expo imports
import React, { Component } from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Platform, ScrollView } from 'react-native';

// Firebase imports
import firebase from 'firebase';

/**
 * AccountOverviewScreen - this screen is to allow the user to sign out or to learn how to
 *                         use the application.
 */
export default class AccountOverviewScreen extends Component {
    _isMounted = false; // Variable used to check if the screen is mounted

    constructor(props) {
        super(props);
        this.state = {
            userEmail: ''
        };
        this.getUserDetails = this.getUserDetails.bind(this);
        this.signOut = this.signUserOut.bind(this);
    }

    // Setting the _isMounted variable depending on the component lifecycle
    componentDidMount() {
        this._isMounted = true;
        this.getUserDetails();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    /**
     * getUserDetails - gets the user's email for account attribute purposes.
     */
    getUserDetails() {
        if (this._isMounted) {
            firebase.firestore()
                .collection("users")
                .doc(firebase.auth().currentUser.uid)
                .get()
                .then((doc) => {
                    this.setState({ userEmail: doc.data().Email });
                })
        }
    }

    /**
     * signUserOut - logs the user out of their Firebase auth account.
     */
    signUserOut() {
        // Can only log out if the screen is mounted, and this method can't be called elsewhere from app
        if (this._isMounted) {
            firebase.auth().signOut().then(() => {
                console.log("sign out successful!")
            }).catch((error) => {
                console.log(error);
            });
        }
    }

    render() {
        return (
            <ScrollView style={styles.container}>
                <View style={{ borderBottomWidth: 1, borderBottomColor: '#DDD'}}>
                    <Text style={styles.sectionHeader}>Account Details</Text>
                    <View style={styles.attribute}>
                        <Text style={styles.bolded}>ImgVault Version: </Text>
                        <Text style={styles.regularText}> 1.0.0</Text>
                    </View>
                    <View style={styles.attribute}>
                        <Text style={styles.bolded}>OS: </Text>
                        <Text style={styles.regularText}> { Platform.OS.toLocaleUpperCase() + " " + Platform.Version }</Text>
                    </View>
                    <View style={styles.attribute}>
                        <Text style={styles.bolded}>Email: </Text>
                        <Text style={styles.regularText}> { this.state.userEmail }</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.btn} onPress={() => this.signUserOut()}>
                    <Text style={styles.btnText}>Sign Out</Text>
                </TouchableOpacity>
                <View style={{ borderBottomWidth: 1, borderBottomColor: '#DDD'}}></View>
                <View>
                    <Text style={styles.sectionHeader}>Overview</Text>
                    <Text style={styles.bolded}>My Images Tab</Text>
                    <Text style={styles.helpText}>This is where all your uploaded images will show up. If the screen goes blank, this means the images are being rendered and should appear shortly. Press on an image tile to see more details about that image.</Text>
                    <Text style={styles.bolded}>Image Details</Text>
                    <Text style={styles.helpText}>A larger version of your selected image is shown here. You can download it for offline use, share it, or delete it from the cloud entirely.</Text>
                    <Text style={styles.bolded}>Upload Images</Text>
                    <Text style={styles.helpText}>This is where you can upload as many images as you want. The images can be from your photo gallery or you can take pictures from your camera and immediately store them on the cloud. When the images are done uploading, they'll show up in My Images.</Text>
                </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        height: '100%',
    },
    sectionHeader: {
        fontWeight: 'bold',
        fontSize: 20,
        color: '#000080',
        marginTop: 8,
        marginLeft: 8,
    },
    attribute: {
        flexDirection: 'row',
    },
    bolded: {
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
        marginVertical: 8,
    },
    regularText: {
        flex: 1,
        color: '#000080',
        textAlign: 'right',
        marginRight: 16,
        fontSize: 16,
    },
    helpText: {
        marginHorizontal: 8,
    },
    btn: {
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 8,
        margin: 8,
        borderRadius: 5,
        backgroundColor: "#000080",
    },
    btnText: {
        color: 'white',
        fontSize: 20,
        margin: 8,
    },
    btnIcon: {
        color: 'white',
        fontSize: 24,
        margin: 8,
    }
});
