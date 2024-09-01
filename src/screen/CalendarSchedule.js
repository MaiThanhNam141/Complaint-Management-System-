import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const CalendarSchedule = () => {

    return (
        <View style={styles.container}>
            <Text>CalendarSchedule</Text>
        </View>
    );
};

export default CalendarSchedule;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});