// React + Expo imports
import React, { Component } from 'react';
import { View, StyleSheet, Text, Image, Dimensions, TouchableOpacity, Alert, Platform } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

// Expo helper imports
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

// uuid import
import { v4 as uuidv4 } from 'uuid';

// Firebase import
import firebase from 'firebase';

// Getting the width of the device for layout
const { width } = Dimensions.get('screen');

/**
 * ImageDetailsScreen - This screen allows the user to view and interact with image of interest.
 * 
 * Options on this screen are to download the image on the physical device (Android, iOS only),
 * Share the image to socials or other applications (Android, iOS only) and delete the image from
 * ImgVault.
 * 
 * For sharing, I have the image be downloaded from Firebase and then let the user decide
 * where to share the image. This way provides the most flexibility regarding where the image 
 * goes and who has access to the image.
 * 
 * For Web, the user can delete the image ONLY. The web version does
 * allow the user to right click the image and save it on the computer and they can use the
 * image as they see fit.
 */
export default class ImageDetailsScreen extends Component {
    _imageDirectory = FileSystem.cacheDirectory + 'ImgVault/';

    // Setting up the screen methods
    constructor(props) {
        super(props);

        // Be able to use 'this' within the methods.
        this.deleteImage = this.deleteImage.bind(this);
        this.downloadImage = this.downloadImage.bind(this);
        this.shareImage = this.shareImage.bind(this);
        this.ensureDirExists = this.ensureDirExists.bind(this);
        this.getLocalUriForImage = this.getLocalUriForImage.bind(this);
    }

    /* 
     * NOTE: firebase storage vs. firebase firestore
     * ----------------------------------------------
     * firebase storage - this stores the actual files of interest,
     *                    this can be any camera photo or image.
     * 
     * firebase firestore - this is the noSQL database that holds
     *                      data values or references to other resources
     *                      in firebase. For our case it will be image refs
     *                      in storage.
     * 
     * ----------------------------------------------
     * NOTE: Expo's FileSystem library provides a storage that is 
     *       exclusive to the expo application and cannot be accessed
     *       by other applications. Thus, storing the images permanently in this storage
     *       is not feasible. At this moment in time, there is no solution from Expo to directly 
     *       access the device's memory easily and to write to an ImgVault directory.
     * 
     *       https://expo.canny.io/feature-requests/p/expose-native-filesystems
     *       
     *       A workaround that is acceptable for this application is to place
     *       images in the user's media libraries. This is fine since we are dealing with
     *       images and the phone's media directories is an acceptable location for images
     *       anyways.
     */

    /**
     * deleteImage - Deletes the image of interest from firebase storage
     */
    deleteImage() {
        const { image } = this.props.route.params;
        var imgRef = firebase.storage().refFromURL(image.downloadURL);
        imgRef.delete().then(() => {
            this.deleteRefFromFirestore();
            this.props.navigation.goBack("My Images");
        }).catch(() => {
            Alert.alert("Could Not Delete", "There was an error deleting this image. Please Try again.");
        });
    }

    /**
     * deleteRefFromFirestore - Deletes the image reference in firebase firestore
     */
    deleteRefFromFirestore() {
        const { image } = this.props.route.params;
        firebase.firestore()
            .collection('users')
            .doc(firebase.auth().currentUser.uid)
            .collection("images")
            .where('downloadURL', '==', image.downloadURL)
            .get()
            .then((snapshot) => {
                snapshot.forEach((doc) => {
                    doc.ref.delete();
                });
            }).catch((error) => console.log(error));
    }

    /**
     * downloadImage - downloads the image from firebase into expo storage, creates a media library uri for the image,
     *                 and puts it in the user's media library.
     * 
     *                 Android => puts it in a DCIM folder in your photo gallery.
     *                 iOS => puts it in your photo gallery.
     */
    async downloadImage() {
        const localFileUri = await this.getLocalUriForImage();
        const asset = await MediaLibrary.createAssetAsync(localFileUri);

        // We are taking the created asset and taking that uri to store it into the media library.
        await MediaLibrary.saveToLibraryAsync(asset.uri).then(() => {
            Alert.alert("Success", "Image downloaded successfully.");
        }).catch((error) => {
            // iOS returns rejected promise with "This file type is not supported yet".
            // but the image is a supported file type (.jpeg) and it saves with no issue in the media library.
            // https://github.com/expo/expo/issues/11070 -> this is happening since ios 14.2, testing iphone is 14.3.
            // This is the solution for now, to not break the user experience when downloading the image.
            Alert.alert("Success", "Image downloaded successfully.");
        });
    }

    /**
     * ensureDirExists - Checks if there is an existing ImgVault directory in expo storage, creates one if it doesn't exist.
     */
    async ensureDirExists() {
        const dirInfo = await FileSystem.getInfoAsync(this._imageDirectory);
        if (!dirInfo.exists) {
            await FileSystem.makeDirectoryAsync(this._imageDirectory, { intermediates: true });
        }
    }

    /**
     * getLocalUriForImage - Downloads the image from firebase, stores it in expo storage, and returns the local uri of that image.
     */
    async getLocalUriForImage() {
        const { image } = this.props.route.params;

        // Make sure the directory exists, and create the uri for the image in that directory
        await this.ensureDirExists();
        const localFileUri = this._imageDirectory + `${uuidv4()}.jpeg`;
        console.log(localFileUri);

        // Get data pertaining to the image if it already exists in the directory
        const fileInfo = await FileSystem.getInfoAsync(localFileUri);
        if (!fileInfo.exists) {
            await FileSystem.downloadAsync(image.downloadURL, localFileUri);
        }
        return localFileUri;
    }

    /**
     * shareImage - Gets local copy of image, and then allows user to share the image.
     */
    async shareImage() {
        // Get a local uri of the image to be shared
        const localFileUri = await this.getLocalUriForImage();

        // Check for native sharing capability and share image only if it exists
        if (!(await Sharing.isAvailableAsync())) {
            Alert.alert("Sharing not available", "Your device does not support sharing.");
            return;
        }
        await Sharing.shareAsync(localFileUri);

        // when complete, delete the image from the expo storage to prevent taking up space.
        await FileSystem.deleteAsync(localFileUri);
    } 

    render() {
        const { image } = this.props.route.params;
        const dateUploadedString = image.dateUploaded.toDate().toString();

        return (
            <View style={styles.container}>
                <Image style={styles.img} source={{ uri: image.downloadURL }} />
                <View style={styles.attribute}>
                    <Text style={styles.bolded}>Uploaded: </Text>
                    <Text style={styles.regularText}>{ dateUploadedString }</Text>
                </View>
                <View style={styles.btnContainer}>
                    {Platform.OS !== "web" ? 
                        <TouchableOpacity 
                            style={styles.btn}
                            onPress={() => this.downloadImage(image)}>
                            <Ionicons style={styles.btnIcon} name="cloud-download"/>
                            <Text style={styles.btnText}>Download</Text>
                        </TouchableOpacity> :
                        <Text style={styles.regularText}>
                            Right click on the image and click on "Save Image As..." To download the image.</Text>}
                    {Platform.OS !== "web" && 
                        <TouchableOpacity 
                            style={styles.btn}
                            onPress={() => this.shareImage()}>
                            <Ionicons style={styles.btnIcon} name="share-social"/>
                            <Text style={styles.btnText}>Share</Text>
                        </TouchableOpacity>}
                    <TouchableOpacity 
                        style={styles.btnRed}
                        onPress={() => this.deleteImage()}>
                        <Ionicons style={styles.btnIcon} name="trash"/>
                        <Text style={styles.btnText}>Delete</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        padding: 8,
    },
    img: {
        width: (width - 16),
        height: (width - 16),
        borderRadius: 5,
    },
    attribute: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 8,
    },
    bolded: {
        fontWeight: 'bold',
        color: '#000080',
    },
    regularText: {
        color: '#000080',
    },
    btnContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        marginTop: 8,
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
    btnRed: {
        margin: 8,
        backgroundColor: 'red',
        padding: 16,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
    },
    btnIcon: {
        color: 'white',
        fontSize: 32,
    },
    btnText: {
        color: 'white',
    }
});
