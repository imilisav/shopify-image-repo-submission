// React + Expo imports
import React, { Component } from 'react';
import { View, TouchableOpacity, ScrollView, Alert, StyleSheet, Text, ActivityIndicator } from 'react-native';
import ImageTile from '../ImageTile';

// Icons import
import Ionicons from '@expo/vector-icons/Ionicons';

// uuid import
import { v4 as uuidv4 } from 'uuid';

// Firebase import
import firebase from 'firebase';
require('firebase/firebase-storage');
require('firebase/firebase-firestore');

// Expo helper import
import * as ImagePicker from 'expo-image-picker';

/**
 * UploadImagesOverviewScreen - This screen allows the user to upload a mix of photo gallery
 *                              and pictures taken from the camera to firebase.
 * 
 *                              Expo has support for a single image picker out of the box, but not for
 *                              a multi image picker.
 *  
 *                              So I built a hybrid system, one where the user can
 *                              still upload many images at once but still take advantage of the stable
 *                              single image picker and camera support provided by Expo.
 * 
 *                              Since the user is adding images one by one, it does gives the
 *                              user the chance to confirm if that image should be uploaded or not.
 */
export default class UploadImagesOverviewScreen extends Component {
    constructor(props) {
        super(props);

        // Setting up state
        this.state = {
            isUploading: false,
            uploadSuccesses: 0,
            images: [],
        };

        // Giving the methods access to 'this'
        this.openCameraAsync = this.openCameraAsync.bind(this);
        this.openPickerAsync = this.openPickerAsync.bind(this);
        this.uploadImagesToFirebase = this.uploadImagesToFirebase.bind(this);
        this.clearImages = this.clearImages.bind(this);
    }

    /**
     * uploadImagesToFirebase() - Uploads images to Firebase storage and then when it has successfully uploaded,
     *                            it adds references to the images in firestore.
     * 
     *                            in the meantime, we set the isUploading to be true to let the user know what is
     *                            happening.
     * 
     *                            Firebase takes one file at a time when the put() method is called, but it is async,
     *                            so we can call put() as many times as we want, so we will loop through all images,
     *                            and the call the uploadSingleImageToFirebase() method to use put() for that
     *                            specific image.
     */
    uploadImagesToFirebase() {
        const { images } = this.state;
        if (images.length === 0) {
            Alert.alert("No images to upload", "You must have at least one Image chosen before uploading.");
            return;
        }
        this.setState({ isUploading: true });

        images.forEach((image) => {
            this.uploadSingleImageToFirebase(image);
        });
    }

    /**
     * uploadSingleImageToFirebase - This is where we create the path where we would like to place
     *                               the image (which is wrapped in a blob object as per firebase requirements) 
     *                               in firebase storage. Firebase will create the directories needed so we can
     *                               upload the image successfully at that path.
     * 
     *                               For logging purposes, we keep track of the progress of the uploading,
     *                               and log the errors if something goes wrong. We notify the user that the image has
     *                               failed without hindering the uploading of the other images.
     * 
     *                               Otherwise, if the task completes, the taskCompleted() function is called
     *                               and we increment how many uploads were successful. When all images have been uploaded
     *                               (that haven't failed) we let the user know that we have uploaded the images.
     *                               
     * @param {*} image - The image that we want to upload to Firebase Storage.
     */
    async uploadSingleImageToFirebase(image) {
        // Setting the directory path on firebase storage and wrapping the image object in a blob object
        const uri = image.uri;
        const childPath = `${firebase.auth().currentUser.uid}/${uuidv4()}.jpeg`;
        const res = await fetch(uri);
        const blob = await res.blob();

        // Uploading the image to firebase
        const task = firebase
            .storage()
            .ref()
            .child(childPath)
            .put(blob)

        // Function called when more bytes of a image have been uploaded successfully to firebase
        const taskProgress = snapshot => {
            console.log(`transferred: ${snapshot.bytesTransferred}`)
        }

        // Function called when the image has been uploaded completely
        const taskCompleted = () => {
            task.snapshot.ref.getDownloadURL().then((snapshot) => {
                this.saveImageData(snapshot);

                var newState = this.state.uploadSuccesses;
                newState += 1;
                this.setState({ uploadSuccesses: newState })

                if (this.state.uploadSuccesses === this.state.images.length) {
                    console.log("successfully finished upload task.")
                    this.setState({ images: [], uploadSuccesses: 0, isUploading: false });
                    Alert.alert("Uploading Complete", "Images have been uploaded to the cloud! If there were any errors, please try uploading those images again.");
                }
            })
        }

        // Function that is called if something went wrong.
        const taskError = snapshot => {
            Alert.alert("Error", `Image ${image.uri} was not uploaded successfully.`);
            console.log(snapshot)

            // Removing this image from the state so that we can finish uploading all remaining images without issue.
            var newState = this.state.images.filter(item => item.uri !== image.uri);
            this.setState({ images: newState });
        }

        // Firebase fires the state_changed event with a type of event and a snapshot. This listener will take that 
        // snapshot and hand it to the corresponding function that handles that type of event.
        task.on("state_changed", taskProgress, taskError, taskCompleted);
    }

    /**
     * saveImageData - Stores a reference to the image in firebase storage on firestore and the upload date.
     * @param {string} downloadURL - URL pointing to the image in storage.
     */
    saveImageData(downloadURL) {
        firebase.firestore()
            .collection('users')
            .doc(firebase.auth().currentUser.uid)
            .collection("images")
            .add({
                downloadURL,
                dateUploaded: firebase.firestore.FieldValue.serverTimestamp(),
            })
    }

    /**
     * openPickerAsync - Opens the native image picker and allows the user to go through their media libraries
     *                   to select an image.
     */
    async openPickerAsync() {
        // Request permissions to access the user's media libraries.
        let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted == false) {
            alert("Permissions are required to access your image gallery. Please enable them and retry.");
            return;
        }

        // Launch the image picker and wait for the user to select an image.
        let pickerResult = await ImagePicker.launchImageLibraryAsync();
        if (pickerResult.cancelled === true) {
            return;
        }

        // When image is selected, push new image into the state.
        var imgsArray = this.state.images;
        imgsArray.push(pickerResult);
        this.setState({ images: imgsArray })
    }

    /**
     * openCameraAsync - Opens the native camera and allows the user to take a picture.
     */
    async openCameraAsync() {
        // Request permissions to access the user's camera.
        let permissionResult = await ImagePicker.requestCameraPermissionsAsync();
        if (permissionResult.granted == false) {
            alert("Permissions are required to access your camera. Please enable them and retry.");
            return;
        }

        // Launch the camera and wait for the user to take a picture.
        let cameraResult = await ImagePicker.launchCameraAsync();
        if (cameraResult.cancelled === true) {
            return;
        }

        // When the picture has been taken, push new picture into the state.
        var imgsArray = this.state.images;
        imgsArray.push(cameraResult);
        this.setState({ images: imgsArray })
    }

    /**
     * clearImages - clears the images from the screen.
     */
    clearImages() {
        this.setState({ images: [] });
    }

    render() {
        const { images } = this.state;
        // If the user has uploaded some images, the screen will show a spinner to let user know whats happening
        if (this.state.isUploading) {
            return (
                <View style={styles.indicator}>
                    <ActivityIndicator size="large" color="#000080"/>
                    <Text style={styles.indicatorText}>Uploading...</Text>
                </View>
            );
        }
        return (
            <View>
                <ScrollView>
                    <View style={styles.btnContainer}>
                        <TouchableOpacity
                            style={styles.btn}
                            onPress={ () => { this.openPickerAsync() }}>
                                <Ionicons style={styles.btnIcon} name="duplicate"/>
                                <Text style={styles.btnText}>Gallery</Text>
                            </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.btn}
                            onPress={ () => { this.openCameraAsync() }}>
                                <Ionicons style={styles.btnIcon} name="camera"/>
                                <Text style={styles.btnText}>Camera</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.btn}
                            onPress={ () => this.clearImages() }>
                                <Ionicons style={styles.btnIcon} name="close-circle"/>
                                <Text style={styles.btnText}>Clear</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.btnUpload}
                            onPress={ () => { this.uploadImagesToFirebase() }}>
                                <Ionicons style={styles.btnIcon} name="cloud-upload"/>
                                <Text style={styles.btnText}>Upload</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.imgContainer}>
                        {images.map((image, index) => <ImageTile isOdd={(index % 2) !== 0} uri={image.uri} key={index}/> )}
                    </View>
                </ScrollView>
            </View>
        )
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
    btnContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    btn: {
        margin: 8,
        backgroundColor: '#000080',
        padding: 16,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
    },  
    btnIcon: {
        color: 'white',
        marginBottom: 4,
        fontSize: 32,
    },
    btnText: {
        marginTop: 4,
        color: 'white',
    },
    btnUpload: {
        margin: 8,
        backgroundColor: 'red',
        padding: 16,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
    },
    imgContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        padding: 0
    },
});
