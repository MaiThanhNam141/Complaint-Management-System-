import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

const PostUpload = () => {
    return (
        <View style={styles.container}>
            <Text>PostUpload</Text>
        </View>
    );
};

export default PostUpload;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});