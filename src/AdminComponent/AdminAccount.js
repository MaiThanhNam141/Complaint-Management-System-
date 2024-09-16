import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

const AdminAccount = () => {
    return (
        <View style={styles.container}>
            <Text>AdminAccout</Text>
        </View>
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