import React from 'react';
import { Text, View, StyleSheet, ImageBackground } from 'react-native';

const CalendarManager = () => {
    return (
        <ImageBackground style={styles.container} source={require("../../assets/background.png")}>
            <Text>CalendarManager</Text>
        </ImageBackground>
    );
};

export default CalendarManager;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});