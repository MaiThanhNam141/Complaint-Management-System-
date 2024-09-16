import React, { useState, useCallback, useMemo } from 'react';
import { TextInput, Linking, View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, SafeAreaView } from 'react-native';
import ImageViewing from 'react-native-image-viewing';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { Picker } from '@react-native-picker/picker';

const ResponsePost = ({ post, onClose, onSave }) => {
  const [visible, setVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [images, setImages] = useState([]);
  const [severity, setSeverity] = useState(post?.Severity); 
  const [responseDesc, setResponseDesc] = useState(post?.responseDesc);
  const [responseUnit, setResponseUnit] = useState(post?.responseUnit);
  
  // New state for status
  const [status, setStatus] = useState(post?.status || "Chưa duyệt");

  const handleImagePress = (imageIndex, images) => {
    const formattedImages = images.map(image => ({ uri: image }));
    setCurrentImageIndex(imageIndex);
    setImages(formattedImages);
    setVisible(true);
  };

  const handleImageViewingClose = () => {
    setVisible(false);
  };

  const openGoogleMaps = async (latitude, longitude) => {
    const googleMapsAppURL = `comgooglemaps://?q=${latitude},${longitude}`;
    const googleMapsWebURL = `https://www.google.com/maps?q=${latitude},${longitude}`;

    try {
      const isGoogleMapsAppInstalled = await Linking.canOpenURL(googleMapsAppURL);

      if (isGoogleMapsAppInstalled) {
        await Linking.openURL(googleMapsAppURL);
      } else {
        await Linking.openURL(googleMapsWebURL);
      }
    } catch (error) {
      Alert.alert('Error', 'Không thể mở Google Maps');
    }
  };

  const memoizedPosts = useMemo(() => {
    return (
      <View style={{ flex: 1, marginVertical: 15 }}>
        <View style={styles.postHeader}>
          <Text style={{ fontWeight: 'bold' }}>{post?.displayName || "Lỗi"}</Text>
          <Text style={{ color: '#555', }}>{post?.reportDate || "Lỗi"}</Text>
        </View>
        <Text style={{ marginBottom: 10, }}>{post?.title || "Lỗi"}</Text>
        <Text style={{ marginBottom: 10, }}>{post?.desc || "Lỗi"}</Text>
        <Text style={styles.adminInfoText}>Loại: {post?.type || 'Chưa có thông tin'}</Text>
        <Text style={styles.adminInfoText}>Địa chỉ: {post?.address || 'Chưa có thông tin'}</Text>
        <Text style={styles.adminInfoText}>Vị trí: {post?.location ? '' : "Chưa có thông tin"}
              {post?.location && (
                <TouchableOpacity onPress={() => openGoogleMaps(post?.location?._latitude, post?.location?._longitude)}>
                  <MaterialIcons name="location-on" color="gray" size={24} />
                </TouchableOpacity>
              )}
            </Text>
          {post?.reportImage && (
            <View>
              <View style={{ position: 'absolute', top: 10, right: 10, zIndex: 1 }}>
                <Text style={{ fontSize: 16, color: 'white' }}>
                  1/{post?.reportImage?.length}
                </Text>
              </View>
              <TouchableOpacity onPress={() => handleImagePress(0, post?.reportImage)}>
                <Image source={{ uri: post?.reportImage[0] }} style={styles.postImage} />
              </TouchableOpacity>
            </View>
          )}
          <View style={styles.postStats}>
            <Text style={styles.likes}>{post?.likes || 0} likes</Text>
            <Picker
              selectedValue={status}
              onValueChange={(itemValue) => setStatus(itemValue)}
              style={{ width: 200 }}
            >
              <Picker.Item label="Chưa duyệt" value="Chưa duyệt" />
              <Picker.Item label="Đang kiểm tra" value="Đang kiểm tra" />
              <Picker.Item label="Chờ xử lí" value="Chờ xử lí" />
              <Picker.Item label="Đang xử lí" value="Đang xử lí" />
              <Picker.Item label="Đã hoàn thành" value="Đã hoàn thành" />
              <Picker.Item label="Từ chối" value="Từ chối" />
            </Picker>
          </View>
          <View style={styles.adminInfoWrapper}>
          <Text style={styles.adminInfoText}>Mức độ nghiêm trọng:</Text>
          <Picker
            selectedValue={severity}
            onValueChange={(itemValue) => setSeverity(itemValue)}
          >
            <Picker.Item label="Thấp" value="Thấp" />
            <Picker.Item label="Trung bình" value="Trung bình" />
            <Picker.Item label="Cao" value="Cao" />
            <Picker.Item label="Nghiêm trọng" value="Nghiêm trọng" />
          </Picker>
          <TextInput
            style={styles.adminInfoText}
            value={responseDesc}
            onChangeText={(text) => setResponseDesc(text)}
            placeholder="Mô tả phản hồi"
          />
          <TextInput
            style={styles.adminInfoText}
            value={responseUnit}
            onChangeText={(text) => setResponseUnit(text)}
            placeholder="Đơn vị phản hồi"
          />
          <Text style={styles.adminInfoText}>Ngày phản hồi: {post?.responseDate || 'Chưa có thông tin'}</Text>
        </View>
      </View>
    );
  }, [post, status, severity]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.postContainer}>
        {memoizedPosts}
        <TouchableOpacity style={styles.closeButton} onPress={() => onSave({ ...post, status, severity })}>
          <Text style={styles.closeButtonText}>Lưu</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>Đóng</Text>
        </TouchableOpacity>
      </ScrollView>
      <ImageViewing
        images={images}
        imageIndex={currentImageIndex}
        visible={visible}
        onRequestClose={handleImageViewingClose}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  postContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 5,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  postImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 10,
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 10,
    marginVertical: 30,
    alignItems: 'center'
  },
  closeButtonText: {
    fontSize: 16,
    color: '#fff',
  },
  postStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  likes: {
    fontSize: 16,
    color: '#555',
  },
  adminInfoContainer: {
    backgroundColor: '#ccc',
    borderRadius: 30,
    padding: 10,
    marginBottom: 10,
  },

  adminInfoLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },

  adminInfoWrapper: {
    padding: 0,
  },

  adminInfoText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
});

export default ResponsePost;
