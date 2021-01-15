// React + Expo imports
import React, { Component } from 'react'
import { View, TextInput, Text, Alert, StyleSheet, TouchableOpacity, Image } from 'react-native'

// Asset imports
import icon from '../../assets/icon.png';

// Firebase imports
import firebase from 'firebase';

/**
 * CreateAccountScreen - This screen allows the user to create an account for ImgVault.
 */
export default class CreateAccountScreen extends Component {
    constructor(props) {
        super(props);

        // Set up the state
        this.state = {
            Email: '',
            Password: '',
            RetypePassword: '',
        }

        // Adding the ability to use 'this' in the method
        this.onRegisterUser = this.onRegisterUser.bind(this);
    }

    /**
     * onRegisterUser - Creates an auth account for the user on Firebase and logs them in.
     */
    onRegisterUser() {
        const { Email, Password, RetypePassword } = this.state;
        // Input Validation
        if (Email === "") {
            Alert.alert("Uh Oh!", "You have not entered an email address.");
            return;
        }
        if (Password === "") {
            Alert.alert("Uh Oh!", "You have not entered a password.");
            return;
        }
        if (RetypePassword === "") {
            Alert.alert("Uh Oh!", "You need to confirm your password by re-typing it in the field below.");
            return;
        }
        if (Password !== RetypePassword) {
            Alert.alert("Uh Oh!", "The passwords do not match.");
            return;
        } else {
            // Create the user account in firebase auth and then add reference to account in firestore.
            // Can add more user attributes here for future features
            firebase.auth().createUserWithEmailAndPassword(Email, Password)
                .then((result) => {
                    firebase.firestore().collection("users")
                        .doc(firebase.auth().currentUser.uid)
                        .set({
                            Email
                        })
                })
                .catch((error) => {
                    Alert.alert("Could not make account", error);
                });
        }
    }

    render() {
        return (
            <View style={styles.formContainer}>
                <View style={styles.logoContainer}>
                    <Image source={icon} style={styles.logo}/>
                    <Text style={styles.title}>Create an account to start storing photos/images on the cloud! ☁️</Text>
                </View>
                <View style={styles.inputs}>
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        value={this.state.Email}
                        onChangeText={(Email) => this.setState({ Email })}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        secureTextEntry={true}
                        value={this.state.Password}
                        onChangeText={(Password) => this.setState({ Password })}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Confirm Password"
                        secureTextEntry={true}
                        value={this.state.RetypePassword}
                        onChangeText={(RetypePassword) => this.setState({ RetypePassword })}
                    />
                </View>
                <View style={styles.inputs}>
                    <TouchableOpacity
                        style={styles.btn}
                        onPress={() => this.onRegisterUser()}>
                        <Text style={styles.btnText}>Create Account</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    logoContainer: {
        flexDirection: 'column',
        alignItems: "center",
        justifyContent: 'center',
    },
    logo: {
        height: 100,
        width: 100,
    },
    formContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: "center",
        justifyContent: 'space-evenly',
        height: '100%',
    },
    title: {
        marginLeft: 8,
        marginRight: 8,
        color: "#000080",
        fontSize: 20,
        textAlign: "center",
    },
    inputs: {
        width: '100%',
    },
    input: {
        margin: 8,
        marginBottom: 0,
        padding: 16,
        fontSize: 20,
        backgroundColor: '#FAFAFA',
        color: "#000080",
        borderRadius: 5,
        borderColor: '#DDD',
        borderWidth: 1,
    },
    btn: {
        borderRadius: 5,
        marginHorizontal: 8,
        backgroundColor: "#000080",
    },
    btnText: {
        color: 'white',
        padding: 16,
        fontSize: 20,
        textAlign: 'center',
    }
});