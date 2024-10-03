import React from 'react';
import { View, StyleSheet } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const SkeletonPost = () => {
  return (
    <SkeletonPlaceholder>
      <View style={styles.skeletonContainer}>
        <View style={styles.header}>
          <View style={styles.avatar} />
          <View>
            <View style={styles.smallRectangle} />
            <View style={styles.tinyRectangle} />
          </View>
        </View>

        <View style={styles.textBlock} />
        <View style={styles.textBlock} />
        <View style={styles.imagePlaceholder} />

        <View style={styles.footer}>
          <View style={styles.smallCircle} />
          <View style={styles.smallCircle} />
          <View style={styles.smallCircle} />
        </View>
      </View>
    </SkeletonPlaceholder>
  );
};

const styles = StyleSheet.create({
  skeletonContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginVertical: 10,
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  smallRectangle: {
    width: 120,
    height: 20,
    borderRadius: 4,
    marginBottom: 5,
  },
  tinyRectangle: {
    width: 80,
    height: 15,
    borderRadius: 4,
  },
  textBlock: {
    width: '100%',
    height: 15,
    borderRadius: 4,
    marginBottom: 5,
  },
  imagePlaceholder: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 15,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  smallCircle: {
    width: "30%",
    height: 35,
  },
});

export default SkeletonPost;
