import React from 'react';
import { Text, View, StyleSheet, ImageBackground } from 'react-native';

const AdminAccount = () => {
    return (
        <ImageBackground style={styles.container} source={require("../../assets/background.png")}>
            <Text>AdminAccout</Text>
        </ImageBackground>
    );
};

export default AdminAccount;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});