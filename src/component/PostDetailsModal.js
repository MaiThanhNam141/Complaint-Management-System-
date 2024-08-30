import React, {useState, useCallback, useMemo} from 'react';
import {Linking, View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, SafeAreaView } from 'react-native';
import ImageViewing from 'react-native-image-viewing';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const PostDetailsModal = ({ post, onClose }) => {
    const [visible, setVisible] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [images, setImages] = useState([]);
    console.log(post.id, post.location);
    
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
      const googleMapsAppURL = `comgooglemaps://?q=${latitude},${longitude}`; // URL để mở trong app Google Maps
      const googleMapsWebURL = `https://www.google.com/maps?q=${latitude},${longitude}`; // URL để mở trên website
    
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

    const getStatusText = useCallback((status) => {
      switch (status) {
        case 'Chưa duyệt':
          return <Text style={{paddingHorizontal:15, backgroundColor: '#ccc', borderRadius:100, fontWeight:'700'}}>
              Chưa duyệt</Text>;
        case 'Đang kiểm tra':
          return <Text style={{paddingHorizontal:15, backgroundColor: '#FFC107', borderRadius:100, fontWeight:'700'}}>
              Đang kiểm tra</Text>;
        case 'Chờ xử lí':
          return <Text style={{paddingHorizontal:15, backgroundColor: '#ADD8E6', borderRadius:100, fontWeight:'700'}}>
              Chờ xử lí</Text>;
        case 'Đang xử lí':
          return <Text style={{paddingHorizontal:15, backgroundColor: 'yellow', borderRadius:100, fontWeight:'700'}}>
              Đang xử lí</Text>;
        case 'Đã hoàn thành':
          return <Text style={{paddingHorizontal:15, backgroundColor: '#8BC34A', borderRadius:100, fontWeight:'700'}}>
              Đã hoàn thành</Text>;
        case 'Từ chối':
          return <Text style={{paddingHorizontal:15, backgroundColor: '#FF0000', borderRadius:100, fontWeight:'700'}}>
              Từ chối</Text>;
        default:
          return <Text>Không xác định</Text>;
      }
    }, [post]);

    const memoizedPosts = useMemo(() => {
      return (
          <View style={{flex:1, marginVertical:15}}>
              <View style={styles.postHeader}>
                  <Text style={{fontWeight: 'bold'}}>{post?.displayName || "Lỗi"}</Text>
                  <Text style={{color: '#555',}}>{post?.reportDate || "Lỗi"}</Text>
              </View>
              <Text style={{marginBottom: 10,}}>{post?.title || "Lỗi"}</Text>
              <Text style={{marginBottom: 10,}}>{post?.desc || "Lỗi"}</Text>
              {post?.reportImage && (
                  <View>
                      <View style={{ position: 'absolute', top: 10, right: 10, zIndex: 1 }}>
                          <Text style={{ fontSize: 16, color: 'white' }}>
                              1/{post?.reportImage?.length}
                          </Text>
                      </View>
                      <TouchableOpacity  onPress={() => handleImagePress(0, post?.reportImage)}>
                          <Image source={{ uri: post?.reportImage[0] }} style={styles.postImage} />
                      </TouchableOpacity>
                  </View>
              )}
              <View style={styles.postStats}>
                  <Text style={styles.likes}>{post?.likes || 0} likes</Text>
                  {getStatusText(post?.status)}
              </View>

          </View>
      );
    }, [post]); 

    const adminResponse = useMemo(() => {
      return(
        <View style={styles.adminInfoContainer}>
          <Text style={styles.adminInfoLabel}>Thông tin từ admin:</Text>
          <View style={styles.adminInfoWrapper}>
            <Text style={styles.adminInfoText}>Mức độ nghiêm trọng: {post?.Severity || 'Chưa có thông tin'}</Text>
            <Text style={styles.adminInfoText}>Địa chỉ: {post?.address || 'Chưa có thông tin'}</Text>
            <Text style={styles.adminInfoText}>Vị trí: {post?.location ? '' : "Chưa có thông tin"}
              {post?.location && (
                <TouchableOpacity onPress={() => openGoogleMaps(post?.location?._latitude, post?.location?._longitude)}>
                  <MaterialIcons name="location-on" color="gray" size={24}/>
                </TouchableOpacity>
              )}
            </Text>
            <Text style={styles.adminInfoText}>Ngày phản hồi: {post?.responseDate || 'Chưa có thông tin'}</Text>
            <Text style={styles.adminInfoText}>Mô tả phản hồi: {post?.responseDesc || 'Chưa có thông tin'}</Text>
            <Text style={styles.adminInfoText}>Đơn vị phản hồi: {post?.responseUnit || 'Chưa có thông tin'}</Text>
            <Text style={styles.adminInfoText}>Loại: {post?.type || 'Chưa có thông tin'}</Text>
          </View>
        </View>
      )
    }, [post])

    return (
      <SafeAreaView style={{flex:1}}>
        <ScrollView style={styles.postContainer}>
            {memoizedPosts}
            {adminResponse}
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
    marginVertical:30,
    alignItems:'center'
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
    padding: 10,
  },
  
  adminInfoText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
});

export default PostDetailsModal;