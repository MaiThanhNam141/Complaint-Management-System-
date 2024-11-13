import React, { useEffect, useState } from 'react';
import { Modal, PermissionsAndroid, ImageBackground, Text, View, StyleSheet, Image, TouchableOpacity, ToastAndroid, ActivityIndicator, Alert, TextInput } from 'react-native';
import auth from '@react-native-firebase/auth';
import { getCurrentUser, getUserInfo, updateUserInfo } from '../context/FirestoreFunction';
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import About from '../component/About';

const ProfileScreen = ({navigation}) => {
    const [loading, setLoading] = useState(false);
    const [userInfo, setUserInfo] = useState({});
    const [refresh, setRefresh] = useState(true);
    const [isLiked, setIsLiked] = useState([])
    const [postsUpload, setPostsUpload] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const defaultAvatar = 'https://firebasestorage.googleapis.com/v0/b/disastermanagerment-b0a31.appspot.com/o/users%2Fdefault.png?alt=media&token=5b09c058-8392-424b-bb97-177a4b2c5e76';

    useEffect(() => {
        const fetchUserDate = async () => {
            setLoading(true);
            try {
                const user = await getUserInfo();
                if (user) {
                    setUserInfo(user);
                    setIsLiked(user?.likes);
                    setPostsUpload(user?.postsUpload);
                }
                else {
                    const auth = getCurrentUser();
                    setUserInfo(auth);
                }
            } catch (error) {
                console.log(error);
            }
            finally {
                setLoading(false);
                setRefresh(false);
            }
        }
        if (refresh)
            fetchUserDate();
    }, [refresh])

    const handleSignOut = () => {
        Alert.alert(
            'Thông báo',
            'Bạn có chắc chắn muốn thoát không?',
            [
                { text: 'Hủy', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                { text: 'Thoát', onPress: signOut },
            ],
            { cancelable: false },
        );
    };
    const handleUpload = () => {
        Alert.alert(
            'Đổi Avartar',
            'Chụp ảnh hay lấy dùng hình ảnh có sẵn trong thư viện?',
            [
                { text: 'Chụp ảnh', onPress: takePhotoFromCamera },
                { text: 'Thư viện', onPress: uploadImageFromLibrary },
                { text: 'Hủy', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
            ],
            { cancelable: true }
        );
    };

    const signOut = async () => {
        setLoading(true);
        try {
            await auth().signOut()
                .then(() => {
                    ToastAndroid.show("Đăng xuất thành công", ToastAndroid.SHORT);
                })
                .catch((error) => {
                    ToastAndroid.show("Đăng xuất thất bại", ToastAndroid.SHORT);
                    console.error("SignOut: ", error);
                })
        } catch (error) {
            console.error("SignOut: ", error);
        }
        finally {
            setLoading(false);
        }
    }

    const takePhotoFromCamera = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA
            );

            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                ImagePicker.openCamera({
                    width: 100,
                    height: 100,
                    cropping: true,
                })
                    .then((image) => {
                        const imageUri = image.path;
                        uploadCloudStorage(imageUri);
                    })
                    .catch((error) => {
                        console.error("ImagePicker error:", error);
                        ToastAndroid.show("Đổi avatar thất bại", ToastAndroid.SHORT);
                    });
            } else {
                ToastAndroid.show("Không thể truy cập camera nếu bạn từ chối cấp quyền", ToastAndroid.SHORT);
            }
        } catch (error) {
            console.error("Permission or camera error:", error);
            ToastAndroid.show("Đổi avatar thất bại", ToastAndroid.SHORT);
        }
    };

    const uploadImageFromLibrary = () => {
        try {
            ImagePicker.openPicker({
                width: 100,
                height: 100,
                cropping: true,
            }).then(image => {
                const imageUri = image.path;
                uploadCloudStorage(imageUri);
            })
                .catch((error) => {
                    console.error(error);
                    ToastAndroid.show("Đổi avatar thất bại", ToastAndroid.SHORT);
                })
        } catch (error) {
            ToastAndroid.show("Đổi avatar thất bại", ToastAndroid.SHORT);
            console.log(error);
        }
    }

    const uploadCloudStorage = (uri) => {
        try {
            // Tạo một tham chiếu đến thư mục "user" trong Firebase Storage
            const storageRef = storage().ref();
            const userRef = storageRef.child('users');

            const fileName = userInfo?.email.split('@')[0]
            const imageRef = userRef.child(fileName);

            imageRef.putFile(uri)
                .then(() => {
                    ToastAndroid.show("Cập nhật avatar thành công", ToastAndroid.SHORT);
                    imageRef.getDownloadURL()
                        .then((url) => {
                            updateUserInfo({ photoURL: url })
                            setTimeout(() => setRefresh(true), 1000);
                        })
                        .catch((error) => {
                            console.log(error);
                        });
                })
                .catch((error) => {
                    console.error("Upload Image: ", error);
                    ToastAndroid.show("Cập nhật thất bại", ToastAndroid.SHORT)
                })
        } catch (error) {
            console.log("Upload Image ", error);
        }
    }

    const handleLikeArticles = () => {
        navigation.navigate('postlikes', {likes: isLiked, userData: userInfo});
    }

    const handleUploadArticles = () => {
        navigation.navigate("postupload", {postsUpload: postsUpload});
    }

    const handleResetPassword = async () => {
        setLoading(true);
        try {
            await auth().sendPasswordResetEmail(userInfo.email);
            ToastAndroid.show(`Đã gửi yêu cầu đổi mật khẩu đến email đăng ký!`, ToastAndroid.SHORT);
        } catch (error) {
            ToastAndroid.show(`Thất bại. Hãy kiểm tra lại Internet`, ToastAndroid.SHORT);
        } finally {
            setLoading(false);
        }
    };

    const handleCloseModal = () => {
        setModalVisible(false);
    }

    if (loading) {
        <View style={{ flex: 1 }}>
            <ActivityIndicator size={'large'} />
        </View>
    }

    return (
        <ImageBackground style={styles.container} source={require("../../assets/background.png")}>
            <Modal animationType={'fade'} visible={modalVisible} onRequestClose={() => setModalVisible(false)} >
                <About onClose={handleCloseModal} />
            </Modal>
            <View style={styles.userSection}>
                <View style={styles.logoContainer}>
                    <Image style={styles.logoImage} source={{ uri: userInfo?.photoURL || defaultAvatar }} />
                    <MaterialIcons name={"edit"} size={20} color={"white"} style={styles.icon} onPress={handleUpload} />
                </View>
                <Text style={styles.text}>{userInfo?.displayName || ''}</Text>
                <Text style={styles.textSub}>{userInfo?.email}</Text>
            </View>
            <View style={styles.featuresSection}>
                <TouchableOpacity onPress={handleLikeArticles} style={styles.signOutContainer}>
                    <MaterialIcons name={"thumb-up"} size={30} color={"#49688d"} />
                    <Text style={styles.signOutText}>Tin đã thích</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleUploadArticles} style={styles.signOutContainer}>
                    <MaterialIcons name={"upload-file"} size={30} color={"#49688d"} />
                    <Text style={styles.signOutText}>Nội dung đã đăng tải</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleResetPassword} style={styles.signOutContainer}>
                    <MaterialIcons name={"password"} size={30} color={"#49688d"} />
                    <Text style={styles.signOutText}>Đổi mật khẩu</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleSignOut} style={styles.signOutContainer}>
                    <MaterialIcons name={"logout"} size={30} color={"#49688d"} />
                    <Text style={styles.signOutText}>Đăng xuất</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.signOutContainer}>
                    <MaterialIcons name={"error"} size={30} color={"#49688d"} />
                    <Text style={styles.signOutText}>Giới thiệu về Quản lí sự cố!</Text>
                </TouchableOpacity>
                {userInfo.email === 'nguyenhongnhien020502@gmail.com' && (
                    <TouchableOpacity onPress={() => navigation.navigate('adminpanel')} style={styles.signOutContainer}>
                        <MaterialIcons name={"supervisor-account"} size={30} color={"#49688d"} />
                        <Text style={styles.signOutText}>Công cụ của Admin</Text>
                    </TouchableOpacity>
                )}
            </View>
            <View style={{ flex: 1 }} />
        </ImageBackground>
    );
};

export default ProfileScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    textInput: {
        color: "gray",
        fontSize: 14,
        width: 270,
        textAlignVertical: 'center',
        borderWidth: 1,
        borderRadius: 15,
        marginBottom: 5,
        borderColor: 'black'
    },
    alertContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    alertBox: {
        backgroundColor: 'white',
        padding: 15,
        paddingVertical: 40,
        borderRadius: 30,
        alignItems: 'center',
        width: '100%',
        maxWidth: 340,
        height: 300,
        justifyContent: 'space-around'
    },
    alertText: {
        fontSize: 18,
        marginBottom: 20,
        textAlign: 'center',
        color: 'black',
    },
    alertButtons: {
        flexDirection: 'row',
    },
    confirmButtonText: {
        fontSize: 16,
        color: 'white',
        paddingHorizontal: 20,
        fontWeight: '500'
    },
    buttonContainer: {
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 15,
        marginHorizontal: 20,
        padding: 15,
        alignItems: 'center',
        textAlign: 'center',
        justifyContent: 'center',
        backgroundColor: 'red',
        borderColor: 'black'
    },
    userSection: {
        flex: 1,
        backgroundColor: '#ffffff',
        alignItems: 'center',
        width: '90%',
        marginTop: 50,
        borderRadius: 20,
        justifyContent: 'center',
    },
    logoContainer: {
        position: 'absolute',
        top: "-40%",
    },
    logoImage: {
        width: 70,
        height: 70,
        resizeMode: 'cover',
        borderRadius: 100,
        zIndex: 1
    },
    icon: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#a6a6a6',
        borderRadius: 100,
        padding: 3,
        zIndex: 2
    },
    text: {
        fontWeight: '500',
        fontSize: 15,
        color: '#000',
        marginTop: 15
    },
    textSub: {
        fontWeight: '400',
        fontSize: 13,
        color: '#919191'
    },
    featuresSection: {
        flex: 4,
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        backgroundColor: '#fff',
        marginVertical: 30,
        width: '90%',
        borderRadius: 20,
    },
    signOutContainer: {
        flexDirection: 'row',
        width:'95%',
        paddingVertical: 10,
        marginHorizontal: 10,
        alignItems: 'center',
    },
    signOutText: {
        color: 'black',
        fontWeight: '300',
        fontSize: 18,
        textAlign: 'center',
        marginLeft: 10
    }
});