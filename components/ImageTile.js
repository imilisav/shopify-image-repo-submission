// React + Expo imports
import React, { Component } from 'react';
import { Dimensions, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';

// Get dimensions of the screen to help with layouts.
const { width } = Dimensions.get('screen');

export default class ImageTile extends Component {
  render() {
    // isOdd - tells us if the image is on the right side of the screen, helps with layouts.
    const { image, uri, isOdd, navigation } = this.props;
    return (
        <ImageBackground 
            style={isOdd ? styles.oddTile : styles.tile}
            imageStyle={{ borderRadius: 5 }}
            source={{ uri : (image !== undefined) ? image.downloadURL : uri }}>
                    <TouchableOpacity
                        style={isOdd ? styles.oddTile : styles.tile}
                        onPress={() => { 
                          if (navigation !== undefined) {
                            navigation.navigate("Image Details", { image: image }) 
                          }
                        }}>
                    </TouchableOpacity>
        </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  tile: {
    marginLeft: 8,
    marginTop: 8,
    marginRight: 4,
    height: (width/2 - 12), 
    width: (width/2 - 12),
  },
  oddTile: {
    marginLeft: 4,
    marginTop: 8,
    marginRight: 8,
    height: (width/2 - 12),
    width: (width/2 - 12),
  }
});