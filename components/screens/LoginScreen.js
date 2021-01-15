// React + Expo Imports
import React, { Component } from 'react'
import { View, TouchableOpacity, TextInput, Text, Alert, StyleSheet, Image } from 'react-native';

// Asset Import
import icon from '../../assets/icon.png';

// Firebase Imports
import firebase from 'firebase'

/**
 * LoginScreen - This screen allows the user to sign in to their ImgVault Account.
 */
export default class LoginScreen extends Component {
    constructor(props) {
        super(props);

        // Setting up state
        this.state = {
            Email: "",
            Password: "",
        }

        // Allow use of 'this' in the method
        this.onSignUp = this.onSignUp.bind(this)
    }

    onSignUp() {
        const { Email, Password } = this.state;
        // Input Validation
        if (Email === "") {
            Alert.alert("Uh Oh!", "You have not entered an email address.");
            return;
        }
        if (Password === "") {
            Alert.alert("Uh Oh!", "You have not entered a password.");
            return;
        }
        firebase.auth().signInWithEmailAndPassword(Email, Password)
            .then(() => {
                console.log("Signed In Successfully!")
            })
            .catch((error) => {
                Alert.alert("Could Not Sign In", error);
            })
    }

    render() {
        return (
            <View style={styles.formContainer}>
                <View style={styles.logoContainer}>
                    <Image source={icon} style={styles.logo}/>
                    <Text style={styles.title}>Sign in to ImgVault!</Text>
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
                </View>
                <View style={styles.inputs}>
                    <TouchableOpacity
                        style={styles.btn}
                        onPress={() => this.onSignUp()}>
                        <Text style={styles.btnText}>Sign In</Text>
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
        flexDirection: 'column',
        alignItems: "center",
        justifyContent: 'space-evenly',
        height: '100%',
    },
    title: {
        marginLeft: 8,
        marginRight: 8,
        color: "#000080",
        fontSize: 24,
        textAlign: "center"
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
        margin: 8,
        backgroundColor: "#000080",
    },
    btnText: {
        textAlign: 'center',
        color: 'white',
        padding: 16,
        fontSize: 20,
    }
});