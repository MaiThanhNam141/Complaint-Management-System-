import React, { useEffect, useState, useContext } from 'react';
import { Alert, Text, View, StyleSheet, TextInput, Image, ImageBackground, ToastAndroid, TouchableOpacity, PermissionsAndroid, Modal, Button, ActivityIndicator } from 'react-native';
import { getUserInfo } from '../context/FirestoreFunction';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ImagePicker from 'react-native-image-crop-picker';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import SubmitReportDetail from '../component/SubmitReportDetail';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage'
import { UserContext } from '../context/UserContext';

const Report = ({ navigation }) => {
    const [user, setUser] = useState('');
    const [reportInput, setReportInput] = useState('');
    const [reportImage, setReportImage] = useState([]);
    const [location, setLocation] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [isMapVisible, setIsMapVisible] = useState(false);
    const [isDetailVisible, setIsDetailVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const defaultAvatar = 'https://firebasestorage.googleapis.com/v0/b/disastermanagerment-b0a31.appspot.com/o/users%2Fdefault.png?alt=media&token=5b09c058-8392-424b-bb97-177a4b2c5e76';
    const [detailData, setDetailData] = useState("");

    const { userExist } = useContext(UserContext)

    useEffect(() => {
        // Hàm lấy thông tin người dùng hiện tại để thay thế vào đăng báo cáo
        const fetchUserInfo = async () => {
            try {
                const user = await getUserInfo();
                if (user) {
                    setUser(user);
                } else {
                    Alert.alert(
                        'Thông báo',
                        'Bạn cần đăng nhập để sử dụng tính năng này này',
                        [
                            { text: 'Đăng nhập', onPress: handleLogin },
                            { text: 'Hủy', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                        ]
                    );
                }
            } catch (error) {
                ToastAndroid.show("Không thể lấy dữ liệu người dùng. Hãy kiểm tra lại internet", ToastAndroid.SHORT);
            }
        };
        // Hàm yêu cầu quyền truy cập vị trí
        const requestLocationPermission = async () => {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    getCurrentLocation();
                } else {
                    ToastAndroid.show("Không thể truy cập vị trí", ToastAndroid.SHORT);
                }
            } catch (err) {
                console.warn(err);
            }
        };

        // Thực hiện đồng thời hai hàm trên mỗi khi truy cập vào màn hình này
        // để đảm bảo luôn có thông tin người dùng và vị trí
        // hàm này sẽ được gọi lại mỗi khi đăng nhập/đăng xuất khỏi app

        Promise.all([fetchUserInfo(), requestLocationPermission()])
            .catch((error) => {
                console.error("Có lỗi xảy ra khi thực hiện 2 hàm", error);
            });
    }, [userExist]);

    // Hàm này chuyển đến screen login
    const handleLogin = () => {
        navigation.jumpTo('Hồ sơ')
    }

    // Hàm lấy vị trí hiện tại và dùng vị trí hiện tại để làm điểm neo cho google map

    const getCurrentLocation = () => {
        Geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setLocation({ latitude, longitude });
            },
            (error) => {
                console.error("getCurrentLocation: ", error);
                if (error.code === 3) { // Timeout error
                    ToastAndroid.show("Vị trí không khả dụng hoặc yêu cầu bị hết thời gian", ToastAndroid.SHORT);
                } else {
                    ToastAndroid.show("Không thể lấy vị trí của bạn", ToastAndroid.SHORT);
                }
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
            }
        );
    };

    // Hàm hiển thị bản đồ khi nhấn vào nút vị trí
    const handleMapPress = async () => {
        try {
            const granted = await PermissionsAndroid.check(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
            );
            if (granted) {
                setIsMapVisible(true); // Hiển thị bản đồ dưới dạng Modal
            } else {
                Alert.alert('Permission Denied', 'Location permission is required to show your current location on the map.');
            }
        } catch (err) {
            console.warn(err);
        }
    };

    // Hàm xử lý hành động chọn vị trí trên bản đồ
    const handleMapPressOnMap = (event) => {
        const { latitude, longitude } = event.nativeEvent.coordinate;
        setSelectedLocation({ latitude, longitude });
        ToastAndroid.show(`Vị trí đã chọn: ${latitude}, ${longitude}`, ToastAndroid.SHORT);
    };

    // Hàm menu cho phép người dùng tải ảnh báo cáo lên
    const handleUpload = () => {
        Alert.alert(
            'Tải ảnh lên',
            'Chụp ảnh hay lấy dùng hình ảnh có sẵn trong thư viện?',
            [
                { text: 'Chụp ảnh', onPress: takePhotoFromCamera },
                { text: 'Thư viện', onPress: uploadImageFromLibrary },
                { text: 'Hủy', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
            ],
            { cancelable: true }
        );
    };

    // Hàm chụp ảnh từ camera
    // Hình ảnh được chọn sẽ được cắt hình để phù hợp với kích thước ảnh trong ứng dụng là 250x250
    // Hàm này sẽ được gọi khi người dùng chọn "Chụp ảnh" trong hàm menu tải ảnh lên
    // Sau khi chọn ảnh, ảnh sẽ được thêm vào mảng reportImage
    // Nếu người dùng chọn nhiều ảnh hơn 3 ảnh, sẽ hiện thông báo tối đa 3 ảnh

    const takePhotoFromCamera = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA
            );

            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                ImagePicker.openCamera({
                    width: 250,
                    height: 250,
                    cropping: true,
                    multiple: true
                })
                    .then((image) => {
                        const imageUri = image.path;
                        if (reportImage.length < 3) {
                            setReportImage([...reportImage, imageUri]);
                        } else {
                            ToastAndroid.show("Tối đa 3 hình ảnh", ToastAndroid.SHORT);
                        }
                    })
                    .catch((error) => {
                        console.error("ImagePicker error:", error);
                        ToastAndroid.show("Something went wrong", ToastAndroid.SHORT);
                    });
            } else {
                ToastAndroid.show("Không thể truy cập camera nếu bạn từ chối cấp quyền", ToastAndroid.SHORT);
            }
        } catch (error) {
            console.error("Permission or camera error:", error);
            ToastAndroid.show("Vui lòng cấp quyền sử dụng camera để sử dụng tính năng này", ToastAndroid.SHORT);
        }
    };

    // Hàm tải ảnh từ thư viện
    // Hàm này sẽ được gọi khi người dùng chọn "thư viện" trong hàm menu tải ảnh lên
    // Cho phép người dùng chọn nhiều ảnh nhưng tối đa là 3 ảnh
    // Sau khi chọn ảnh, ảnh sẽ được thêm vào mảng reportImage
    // Nếu người dùng chọn nhiều ảnh hơn 3 ảnh, sẽ hiện thông báo tối đa 3 ảnh
    // Nếu người dùng chọn ảnh nhưng không có quyền truy cập vào thư viện ảnh, sẽ hiện thông báo lỗi
    // Hình ảnh được chọn sẽ được cắt hình để phù hợp với kích thước ảnh trong ứng dụng là 250x250

    const uploadImageFromLibrary = () => {
        try {
            ImagePicker.openPicker({
                width: 250,
                height: 250,
                cropping: true,
                multiple: true,
            }).then(images => {
                const imageUris = images.map(image => image.path);
                if (reportImage.length + imageUris.length <= 3) {
                    setReportImage([...reportImage, ...imageUris]);
                } else {
                    ToastAndroid.show("Tối đa 3 hình ảnh", ToastAndroid.SHORT);
                }
            })
                .catch((error) => {
                    console.error("uploadImageFromLibrary: ", error);
                    ToastAndroid.show("Lấy hình ảnh thất bại", ToastAndroid.SHORT);
                })
        } catch (error) {
            ToastAndroid.show("Vui lòng cấp quyền sử dụng thư viện ảnh để sử dụng tính năng này", ToastAndroid.SHORT);
            console.log(error);
        }
    }

    // Hàm xóa ảnh đã tải lên
    const handleDeleteImage = (index) => {
        const newReportImage = [...reportImage];
        newReportImage.splice(index, 1);
        setReportImage(newReportImage);
    };

    // Hàm xử lý kết quả từ Chi tiết
    const handleResult = (result) => {
        const formattedResult = {
            address: `${result.newAddress}, ${result.ward}, ${result.district}`,
            desc: result.desc,
            type: result.type,
        };
        console.log(formattedResult);
        setDetailData(formattedResult);
    };

    // Hàm lưu ảnh báo cáo lên Firebase Storage
    // Ảnh sẽ được lưu vào thư mục có tên là ID của bài cáo và nằm bên trong thư mục 
    // reportAssets trong Firebase Storage
    // Mỗi ảnh sẽ được đặt tên bắt đầu từ số 1 và tăng dần lên
    const saveImageCloudStorage = async (newId) => {
        try {
            const storageRef = storage().ref();
            const reportAssetsRef = storageRef.child(`reportAssets/${newId}`);
            const imageUrls = [];

            await Promise.all(
                reportImage.map(async (imageUri) => {
                    const imageRef = reportAssetsRef.child(`image_${Date.now()}_${Math.random()}`);
                    await imageRef.putFile(imageUri);
                    const downloadUrl = await imageRef.getDownloadURL();
                    imageUrls.push(downloadUrl);
                })
            );

            return imageUrls;
        } catch (error) {
            console.log("Upload Image ", error);
        }
    };

    // Hàm xác nhận gửi báo cáo
    const showConfirmAlert = () => {
        Alert.alert(
            'Xác nhận',
            'Bạn có chắc chắn muốn gửi báo cáo này không?',
            [
                {
                    text: 'Hủy',
                    onPress: () => console.log('Hủy bỏ'),
                    style: 'cancel',
                },
                {
                    text: 'Đồng ý',
                    onPress: handleSubmit,
                },
            ],
            { cancelable: true }
        );
    };

    // Hàm gửi báo cáo lên collection articles Firebase Cloud Firestore
    // Hàm sẽ đọc dữ liệu trong collection counters để lấy ID mới nhất

    const handleSubmit = async () => {
        try {
            setLoading(true);
            if (!detailData.address || !detailData.desc || !detailData.type || !reportInput) {
                ToastAndroid.show("Lỗi! Hãy điền đầy đủ thông tin", ToastAndroid.SHORT)
                return;
            }
            const countersRef = firestore().collection('counters').doc('articlesCounter');
            const articlesRef = firestore().collection('articles');
            const counterDoc = await countersRef.get();
            const currentId = counterDoc.data().articlesId;
            const newId = currentId + 1;
            const imageURLs = await saveImageCloudStorage(newId);

            // Nếu người dùng chưa chọn vị trí trên bản đồ thì hệ thống sẽ 
            // mặc định lấy vị trí là vị trí hiện tại của người đăng báo cáo
            // Nếu vị trí hiện tại không thể truy cập được do chưa cấp quyền, không có internet
            // hoặc 1 nguyên nhân khác thì sẽ mặc định lấy vị trí của "Tòa nhà Trung tâm Hành chính Bình Dương"
            const locationData = selectedLocation ? {
                latitude: selectedLocation.latitude,
                longitude: selectedLocation.longitude,
            } : {
                latitude: location?.latitude || 11.056270918774537,
                longitude: location?.longitude || 106.68220577854719,
            };

            // Ngày báo cáo sẽ được định dạnh thành 'YYYY-MM-DD'
            const reportDateString = new Date().toISOString().split('T')[0];

            const articleData = {
                ...detailData,
                reportImage: imageURLs,
                title: reportInput,
                status: "Chưa duyệt",
                location: new firestore.GeoPoint(locationData.latitude, locationData.longitude),
                id: newId,
                displayName: user?.displayName,
                reportDate: reportDateString,
                likes: 0,
                comments: [],
                responseDate: '',
                responseDesc: '',
                responseUnit: '',
                Severity: "Nhẹ",
            };
            const newArticleRef = articlesRef.doc(newId.toString());
            Promise.all([newArticleRef.set(articleData), countersRef.update({ articlesId: newId })])
            setReportImage([]);
            setReportInput("");
            setDetailData("");
            navigation.navigate('posttype', { type: detailData.type, name: detailData.type });
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <ImageBackground style={styles.container} source={require("../../assets/background.png")}>
            <View style={styles.reportContainer}>
                <View style={styles.avatarContainer}>
                    <Image source={{ uri: user.photoURL || defaultAvatar }} style={styles.avatar} />
                    <Text style={{ fontWeight: '800', color: 'black' }}>{user.displayName || 'Người dùng'}</Text>
                </View>
                <TextInput
                    style={styles.textInput}
                    placeholder={`${user.displayName} ơi, bạn muốn báo cáo về vấn đề gì?`}
                    value={reportInput}
                    onChangeText={(text) => setReportInput(text)}
                    multiline={true}
                />
                {reportImage.length > 0 && (
                    <View style={{ flexWrap: 'wrap', flexDirection: 'row', justifyContent:'space-between' }}>
                        {reportImage.map((imageUri, index) => (
                            <View key={index} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Image source={{ uri: imageUri }} style={styles.image} />
                                <TouchableOpacity style={styles.buttonClose} onPress={() => handleDeleteImage(index)}>
                                    <MaterialIcons name="close" size={25} color={"#fff"} />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                )}

                <View style={styles.utilities}>
                    <TouchableOpacity style={styles.utility} onPress={handleMapPress}>
                        <MaterialIcons name={"pin-drop"} size={20} color={"red"} style={styles.icon} />
                        <Text style={styles.utilityText}> Vị trí</Text>
                        {
                            selectedLocation && (
                                <MaterialIcons name={"check"} size={20} color={"#4AEB0F"} />
                            )

                        }
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.utility} onPress={handleUpload}>
                        <MaterialIcons name={"image"} size={20} color={"blue"} style={styles.icon} />
                        <Text style={styles.utilityText}> Hình ảnh</Text>
                        {
                            reportImage && reportImage.length > 0 && (
                                <MaterialIcons name={"check"} size={20} color={"#4AEB0F"} />
                            )

                        }
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.utility} onPress={() => setIsDetailVisible(true)}>
                        <MaterialIcons name={"info"} size={20} color={"black"} style={styles.icon} />
                        <Text style={styles.utilityText}> Chi tiết</Text>
                        {
                            detailData && (
                                <MaterialIcons name={"check"} size={20} color={"#4AEB0F"} />
                            )

                        }
                    </TouchableOpacity>
                </View>

                <Modal
                    visible={isMapVisible}
                    animationType="slide"
                    onRequestClose={() => setIsMapVisible(false)} // Đóng Modal khi bấm nút back
                >
                    <MapView
                        provider={MapView.PROVIDER_GOOGLE}
                        showsUserLocation={true}
                        showsMyLocationButton={true}
                        style={styles.map}
                        initialRegion={{
                            latitude: location?.latitude || 11.056270918774537,
                            longitude: location?.longitude || 106.68220577854719,
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421,
                        }}
                        onPress={handleMapPressOnMap}
                    >
                        {selectedLocation && (
                            <Marker coordinate={selectedLocation} />
                        )}
                    </MapView>
                    <Button title="Xác nhận vị trí" onPress={() => setIsMapVisible(false)} />
                </Modal>
            </View>
            <TouchableOpacity style={styles.button} onPress={showConfirmAlert}>
                {loading ? <ActivityIndicator size={'large'} /> : <Text style={styles.buttonText}>Đăng Báo Cáo</Text>}
            </TouchableOpacity>
            <Modal
                visible={isDetailVisible}
                animationType="slide"
                onRequestClose={() => setIsDetailVisible(false)}
            >
                <SubmitReportDetail onResult={handleResult} onClose={() => setIsDetailVisible(false)} detailData={detailData} />
            </Modal>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        justifyContent: 'space-around'
    },
    reportContainer: {
        marginTop: 15,
        marginBottom: 15,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    avatarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        resizeMode: 'cover',
        marginRight: 15
    },
    textInput: {
        fontSize: 16,
        backgroundColor: '#f2f2f2',
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 5,
        height: 200,
        textAlignVertical: 'top',
        marginBottom: 15,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius:5,
        resizeMode:'contain'
    },
    utilities: {
        flexDirection: 'column',
        justifyContent: 'space-around',
        height: 120
    },
    utility: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 5,
    },
    utilityText: {
        marginHorizontal: 5,
        fontSize: 14,
    },
    map: {
        flex: 1
    },
    button: {
        backgroundColor: '#3669a4',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    buttonClose: {
        backgroundColor: 'rgba(132, 132, 132, 0.68)',
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 5,
        right: 10,
    }
});

export default Report;
