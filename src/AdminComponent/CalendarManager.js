import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

const CalendarManager = () => {
    return (
        <View style={styles.container}>
            <Text>CalendarManager</Text>
        </View>
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