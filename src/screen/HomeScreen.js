import React, {useMemo, useState} from 'react';
import { Modal, FlatList, Text, View, StyleSheet, TouchableOpacity, Image, ImageBackground, ScrollView, Dimensions } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const screen = Dimensions.get('screen');

const HomeScreen = ({navigation}) => {
    const [modalNotificationVisible, setModalNotificationVisible] = useState(false);

    const typeItems = useMemo(() =>
        [
            {id: 1, name: 'Giao thông', type: 'Giao thông', image: require('../../assets/Giaothong.png')},
            {id: 2, name: 'Môi trường', type: 'Môi trường', image: require('../../assets/Moitruong.png')},
            {id: 3, name: 'Nguồn nước', type: 'Cấp - Thoát nước', image: require('../../assets/CapThoatnuoc.png')},
            {id: 4, name: 'Chiếu sáng', type: 'Chiếu sáng', image: require('../../assets/Chieusang.png')},
            {id: 5, name: 'Trật tự đô thị', type: 'Trật tự đô thị', image: require('../../assets/TrattuXH.png')},
            {id: 6, name: 'Điện lực', type: 'Điện lực', image: require('../../assets/Dienluc.png')},
            {id: 7, name: 'Khác', type: 'Khác', image: require('../../assets/Khac.png')},

            
        ], [])

    const pickType = (item) => {
        navigation.navigate('posttype', { type: item.type, name: item.name });
    }
    const renderItem = ({item}) => (
        <TouchableOpacity onPress={() => pickType(item)} style={styles.typeButton}>
            <Image source={item.image} style={styles.typeItemImage} />
            <Text style={styles.typeItemText}>{item.name}</Text>
        </TouchableOpacity>
    );
    return (
        <ImageBackground source={require("../../assets/background.png")} style={styles.background}>
            <View style={styles.banner}>
                <Image style={styles.logoImg} source={require("../../assets/anhbia.jpg")}/>
            </View>
            <TouchableOpacity onPress={() => setModalNotificationVisible(true)} style={styles.bell}>
                <MaterialIcons name="notifications-active" size={32} color="#fff" />
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
                        <View style={{alignItems: 'center',}}>
                            <Text style={styles.notificationText}>Bạn chưa có thông báo nào</Text>
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
        resizeMode: 'cover',
        justifyContent:'flex-start'
    },
    banner: {
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    bell:{
        position:'absolute',
        top:15,
        right:30,
        backgroundColor:'#3669a4',
        padding:5,
        borderRadius:100
    },
    logoImg: {
        resizeMode:'contain',
        height:screen.width/2
    },
    typeButton:{
        margin:5,
        alignItems: 'center',
        justifyContent:'center',
        width:screen.width / 2 - 20,
        height:150,
    },
    typeItemImage: {
        width: 100,
        height: 100,
        marginRight: 10,
        borderRadius:23,
        resizeMode:'contain'
    },
    typeItemText: {
        fontSize: 20,
        textAlign:'center'
    },
    renderList: {
        justifyContent: 'center',
        paddingHorizontal: 5,
        paddingVertical: 10,
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
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
});