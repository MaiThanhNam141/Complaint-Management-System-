import React, { useMemo, useState, useEffect, useContext } from 'react';
import { Modal, FlatList, Text, View, StyleSheet, TouchableOpacity, Image, ImageBackground, Dimensions } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { getUserInfo, updateUserInfo } from '../context/FirestoreFunction';
import { UserContext } from '../context/UserContext';

const screen = Dimensions.get('screen');

const HomeScreen = ({ navigation }) => {
    const [modalNotificationVisible, setModalNotificationVisible] = useState(true);
    const [notRead, setNotRead] = useState(false);
    const [dataNotify, setDataNotify] = useState();

    const { userExist } = useContext(UserContext);

    useEffect(() => {
        const fetchNotify = async () => {
            const snapshot = await getUserInfo();
            if (snapshot) {
                setNotRead(snapshot?.isRead || false);
                setDataNotify(snapshot?.dataNotify || []);
                updateUserInfo({ notRead: false });
            }
        };
        if (userExist) fetchNotify();
    }, [userExist]);

    const typeItems = useMemo(
        () => [
            { id: 1, name: 'Giao thông', type: 'Giao thông', image: require('../../assets/Giaothong.png') },
            { id: 2, name: 'Môi trường', type: 'Môi trường', image: require('../../assets/Moitruong.png') },
            { id: 3, name: 'Cấp - Thoát nước', type: 'Cấp - Thoát nước', image: require('../../assets/CapThoatnuoc.png') },
            { id: 4, name: 'Chiếu sáng', type: 'Chiếu sáng', image: require('../../assets/Chieusang.png') },
            { id: 5, name: 'Trật tự đô thị', type: 'Trật tự đô thị', image: require('../../assets/TrattuXH.png') },
            { id: 6, name: 'Điện lực', type: 'Điện lực', image: require('../../assets/Dienluc.png') },
            { id: 7, name: 'Khác', type: 'Khác', image: require('../../assets/Khac.png') },
        ],
        []
    );

    const pickType = (item) => {
        navigation.navigate('posttype', { type: item.type, name: item.name });
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => pickType(item)} style={styles.typeButton}>
            <Image source={item.image} style={styles.typeItemImage} />
            <Text style={styles.typeItemText}>{item.name}</Text>
        </TouchableOpacity>
    );

    const formatDate = (timestamp) => {
        const date = new Date(timestamp._seconds * 1000); // Tạo Date từ timestamp._seconds
        return date.toLocaleString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    const renderNotifyItem = ({ item }) => (
        <View style={styles.notifyItem}>
            <Text style={styles.notificationText}>{item.content}</Text>
            <Text style={styles.notificationDate}>{formatDate(item.date)}</Text>
        </View>
    );

    return (
        <ImageBackground source={require("../../assets/background.png")} style={styles.background}>
            <View style={styles.banner}>
                <Image style={styles.logoImg} source={require("../../assets/anhbia.jpg")} />
            </View>
            <Text style={{ color: '#49688d', fontWeight: '700', alignSelf: 'center', marginVertical: 10, fontSize: 18 }}>Hệ thống tiếp nhận các lĩnh vực</Text>
            <TouchableOpacity onPress={() => setModalNotificationVisible(true)} style={styles.bell}>
                <MaterialIcons name="notifications-active" size={32} color="#fff" />
                {
                    notRead && <Text style={styles.notRead}>!</Text>
                }
            </TouchableOpacity>
            <FlatList
                data={typeItems}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
                numColumns={2}
                contentContainerStyle={styles.renderList}
            />
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalNotificationVisible}
                onRequestClose={() => setModalNotificationVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Thông báo</Text>
                        <View style={styles.dividerModal} />
                        <View style={{ paddingHorizontal: 5 }}>
                            {dataNotify && dataNotify.length > 0 ? (
                                <FlatList
                                    data={dataNotify}
                                    renderItem={renderNotifyItem}
                                    keyExtractor={(item) => item.id.toString()}
                                />
                            ) : (
                                <Text style={[styles.notificationText, { alignSelf: 'center' }]}>Bạn chưa có thông báo nào</Text>
                            )}
                        </View>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setModalNotificationVisible(false)}
                        >
                            <MaterialIcons name="close" size={25} color="#333" />
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </ImageBackground>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    background: {
        flex: 1,
    },
    banner: {
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    bell: {
        position: 'absolute',
        top: 15,
        right: 30,
        backgroundColor: '#3669a4',
        padding: 5,
        borderRadius: 100,
    },
    notRead :{
        position: 'absolute',
        paddingHorizontal: 6,
        backgroundColor: 'red',
        color:'#fff',
        borderRadius: 100,
        top: 0,
        right: 5,
        fontSize: 10,
    },
    logoImg: {
        resizeMode: 'contain',
        height: screen.width / 2,
    },
    typeButton: {
        margin: 5,
        alignItems: 'center',
        justifyContent: 'center',
        width: screen.width / 2 - 20,
        height: 150,
    },
    typeItemImage: {
        width: 100,
        height: 100,
        borderRadius: 23,
        resizeMode: 'contain',
    },
    typeItemText: {
        fontSize: 15,
        textAlign: 'center',
    },
    renderList: {
        paddingHorizontal: 5,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
    },
    modalContent: {
        backgroundColor: '#fff',
        width: '85%',
        borderRadius: 10,
        padding: 20,
    },
    modalTitle: {
        fontSize: 21,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
        color: '#202020',
    },
    dividerModal: {
        backgroundColor: '#333',
        height: 1,
        marginBottom: 10,
    },
    notificationText: {
        fontSize: 16,
        color: '#333',
    },
    notificationDate: {
        fontSize: 12,
        color: '#666',
        textAlign: 'right',
    },
    notifyItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
});
