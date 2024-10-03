import React from 'react';
import { Text, View, StyleSheet, ImageBackground } from 'react-native';

const About = () => {
    return (
        <ImageBackground style={styles.container} source={require("../../assets/background.png")}>
            <Text>About CityFix!</Text>
        </ImageBackground>
    );
};

export default About;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});