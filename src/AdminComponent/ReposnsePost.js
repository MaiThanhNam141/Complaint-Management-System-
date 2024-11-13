import React, { useState, useMemo } from 'react';
import { TextInput, Linking, View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, SafeAreaView, Alert, ToastAndroid } from 'react-native';
import ImageViewing from 'react-native-image-viewing';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { Picker } from '@react-native-picker/picker';
import firestore from '@react-native-firebase/firestore';
import { Calendar } from 'react-native-calendars';

const ResponsePost = ({ post, onClose, onSave, onSliceIdDeleted }) => {
  const [visible, setVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [images, setImages] = useState([]);
  const [severity, setSeverity] = useState(post?.Severity);
  const [responseDesc, setResponseDesc] = useState(post?.responseDesc);
  const [responseUnit, setResponseUnit] = useState(post?.responseUnit);
  const [status, setStatus] = useState(post?.status || "Chưa duyệt");
  const noImageAvailable = require('../../assets/noImage.jpg');

  const initialStartRepairDate = post?.startRepairDate instanceof firestore.Timestamp
    ? post.startRepairDate.toDate().toISOString().split('T')[0]
    : post?.startRepairDate || 'Chưa chọn';

  const initialEndRepairDate = post?.endRepairDate instanceof firestore.Timestamp
    ? post.endRepairDate.toDate().toISOString().split('T')[0]
    : post?.endRepairDate || 'Chưa chọn';

  const [startRepairDate, setStartRepairDate] = useState(initialStartRepairDate);
  const [endRepairDate, setEndRepairDate] = useState(initialEndRepairDate);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const handleImagePress = (imageIndex, images) => {
    const formattedImages = images.map(image => ({ uri: image }));
    setCurrentImageIndex(imageIndex);
    setImages(formattedImages);
    setVisible(true);
  };

  const renderDatePicker = (dateType) => {
    return (
      <Calendar
        onDayPress={(day) => {
          if (dateType === 'start') {
            setStartRepairDate(day.dateString);
          } else {
            setEndRepairDate(day.dateString);
          }
          // Đóng lại bộ chọn ngày sau khi chọn
          setShowStartDatePicker(false);
          setShowEndDatePicker(false);
        }}
        markedDates={{
          [dateType === 'start' ? startRepairDate : endRepairDate]: {
            selected: true,
            marked: true,
            selectedColor: 'blue',
          },
        }}
      />
    );
  };

  const handleShowCalendar = (type) => {
    if (type === 'start') {
      setShowStartDatePicker(true);
      setShowEndDatePicker(false);
    } else {
      setShowEndDatePicker(true);
      setShowStartDatePicker(false);
    }
  }

  const handleDeleteArticles = () => {
    Alert.alert(
      "Xác nhận xóa",
      "Có thật sự chắc chắn xóa bài đăng hay không? \nHành động này không thể hoàn tác.",
      [
        {
          text: "Hủy",
          style: "cancel"
        },
        {
          text: "OK", onPress: () => {
            deleteArticles();
          }
        }
      ]
    );
  };

  const deleteArticles = async () => {
    try {
      await firestore().collection('articles').doc(post.id.toString()).delete();
      ToastAndroid.show("Xóa thành công", ToastAndroid.SHORT);
      onClose();
      onSliceIdDeleted(post.id);
    } catch (error) {
      ToastAndroid.show("Xóa thất bại", ToastAndroid.SHORT);
      console.error(error);
    }
  }

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

  const savePost = () => {
    //Đảm bảo dữ liệu đầy đ
    if ((status === 'Đang xử lí' || status === 'Đã hoàn thành') && (!startRepairDate || !endRepairDate)) {
      Alert.alert("Lỗi", "Vui lòng chọn ngày bắt đầu và ngày hoàn thành cho trạng thái hiện tại.");
      return;
    }

    // Chuyển dữ liệu từ String sang Timestamp
    const firestoreStartRepairDate = (status === 'Đang xử lí' || status === 'Đã hoàn thành')
      ? firestore.Timestamp.fromDate(new Date(startRepairDate))
      : null;
    const firestoreCompleteDate = (status === 'Đang xử lí' || status === 'Đã hoàn thành')
      ? firestore.Timestamp.fromDate(new Date(endRepairDate))
      : null;

    const reportDateString = new Date().toISOString().split('T')[0]; // 'YYYY-MM-DD'

    if (status === 'Đang xử lí' || status === 'Đã hoàn thành') {
      const updatedPost = {
        ...post, // Existing data
        responseDate: reportDateString || "",
        status: status,
        severity: severity,
        responseDesc: responseDesc || "",
        responseUnit: responseUnit || "",
        startRepairDate: firestoreStartRepairDate,
        completeDate: firestoreCompleteDate,
      };
      onSave(updatedPost);
    } else {
      const updatedPost = {
        ...post, // Existing data
        responseDate: reportDateString || "",
        status: status,
        severity: severity,
        responseDesc: responseDesc || "",
        responseUnit: responseUnit || "",
      };
      onSave(updatedPost);
    }
    onClose();
  };

  const memoizedPosts = useMemo(() => {
    return (
      <View style={{ flex: 1, marginVertical: 15 }}>
        <View style={styles.postHeader}>
          <Text style={{ fontWeight: 'bold' }}>{post?.displayName || "Trống"}</Text>
          <Text style={{ color: '#555', }}>{post?.reportDate || "Trống"}</Text>
        </View>
        <Text style={{ marginBottom: 10, }}>{post?.title || "Trống"}</Text>
        <Text style={{ marginBottom: 10, }}>{post?.desc || "Trống"}</Text>
        <Text style={styles.adminInfoText}>Loại: {post?.type || 'Chưa có thông tin'}</Text>
        <Text style={styles.adminInfoText}>Địa chỉ: {post?.address || 'Chưa có thông tin'}</Text>
        <Text style={styles.adminInfoText}>Vị trí: {post?.location ? '' : "Chưa có thông tin"}
          {post?.location && (
            <TouchableOpacity onPress={() => openGoogleMaps(post?.location?._latitude, post?.location?._longitude)}>
              <MaterialIcons name="location-on" color="gray" size={24} />
            </TouchableOpacity>
          )}
        </Text>
        {post?.reportImage && post?.reportImage.length > 0 ? (
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
        ) : (
          <Image source={noImageAvailable} style={styles.postImage} />
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
            onChangeText={setResponseDesc}
            placeholder="Mô tả phản hồi"
          />
          <TextInput
            style={styles.adminInfoText}
            value={responseUnit}
            onChangeText={setResponseUnit}
            placeholder="Đơn vị phản hồi"
          />
          <Text style={styles.adminInfoText}>Ngày phản hồi: {post?.responseDate || 'Chưa có thông tin'}</Text>

          {(status === 'Đang xử lí' || status === 'Đã hoàn thành') && (
            <View>
              <TouchableOpacity style={styles.datePickerButton} onPress={() => handleShowCalendar('start')}>
                <Text style={styles.datePickerText}>Ngày bắt đầu sửa chữa: {startRepairDate}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.datePickerButton} onPress={() => handleShowCalendar('end')}>
                <Text style={styles.datePickerText}>Ngày{status === 'Đang xử lí' && ' dự kiến'} hoàn thành: {endRepairDate}</Text>
              </TouchableOpacity>
            </View>
          )}

        </View>
      </View>
    );
  }, [post, status, severity, startRepairDate, endRepairDate, responseDesc, responseUnit]);

  return (
    <ScrollView style={{ flex: 1, padding: 10 }}>
      <View style={styles.postContainer}>
        {memoizedPosts}
      </View>
      <ImageViewing
        images={images}
        imageIndex={currentImageIndex}
        visible={visible}
        onRequestClose={handleImageViewingClose}
      />
      {showStartDatePicker && renderDatePicker('start')}
      {showEndDatePicker && renderDatePicker('end')}
      <TouchableOpacity style={styles.closeButton} onPress={savePost}>
        <Text style={styles.closeButtonText}>Lưu</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeButtonText}>Đóng</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.closeButton, { backgroundColor: '#fff', borderColor: 'red', marginVertical: 25 }]} onPress={handleDeleteArticles}>
        <Text style={[styles.closeButtonText, { color: 'red' }]}>Xóa bài đăng</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  postContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 5,
    borderWidth: 1,
    marginBottom: 35
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
    resizeMode: 'contain',
    borderRadius: 10,
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    marginHorizontal: 20,
    borderRadius: 10,
    marginVertical: 5,
    alignItems: 'center',
    borderWidth: 1
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
  datePickerButton: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    marginVertical: 10,
  },
  datePickerText: {
    fontSize: 16,
    color: '#007bff',
  },
  adminInfoText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
});

export default ResponsePost;
