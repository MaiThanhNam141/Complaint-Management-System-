import React, { useState, useEffect } from 'react';
import { Modal, Alert, Text, View, StyleSheet, Image, FlatList, TextInput, ImageBackground, ToastAndroid, TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import auth from '@react-native-firebase/auth';

const UserManager = () => {
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [debounceTimeout, setDebounceTimeout] = useState(null);
    const [titleResults, setTitleResults] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null); // Lưu người dùng được chọn để cập nhật
    const [newAvatarUrl, setNewAvatarUrl] = useState('');
    const [newDisplayName, setNewDisplayName] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            const usersCollection = await firestore().collection('users').get();
            const usersList = usersCollection.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setUsers(usersList);
        };

        fetchUsers();
    }, []);

    const handleSearch = (query) => {
        setSearchQuery(query);
        if (!query.trim() || query.length < 3) {
            setTitleResults([]);
            clearTimeout(debounceTimeout);
            return;
        }
        clearTimeout(debounceTimeout);
        setDebounceTimeout(setTimeout(() => {
            searchArticles(query);
        }, 500));
    };

    const searchArticles = (query) => {
        const filteredUsers = users.filter(user =>
            user.displayName.toLowerCase().includes(query.toLowerCase()) ||
            user.email.toLowerCase().includes(query.toLowerCase())
        );
        setTitleResults(filteredUsers);
    };

    const deleteUser = async (userId) => {
        Alert.alert(
            'Xóa người dùng',
            'Bạn có chắc chắn muốn xóa người dùng này?',
            [
                {
                    text: 'Hủy',
                    onPress: () => console.log('Hủy xóa người dùng'),
                    style: 'cancel',
                },
                {
                    text: 'Xóa',
                    onPress: async () => {
                        try {
                            if (userId === "E39uuBnnF7f7OxcltOnNid44OXY2") {
                                ToastAndroid.show("Không thể xóa admin", ToastAndroid.SHORT);
                                return;
                            } else {
                                await firestore().collection('users').doc(userId).delete();
                                setUsers(users.filter((user) => user.id !== userId));
                                ToastAndroid.show("Xóa thành công", ToastAndroid.SHORT);
                            }
                        } catch (error) {
                            console.error(error);
                        }
                    },
                },
            ],
            { cancelable: false },
        );
    };

    const editUser = (user) => {
        setSelectedUser(user);
        setNewAvatarUrl(user.photoURL || '');
        setNewDisplayName(user.displayName || '');
        setModalVisible(true);
    };

    const handleUpdateAvatar = async () => {
        if (selectedUser && newAvatarUrl.trim()) {
            try {
                await firestore().collection('users').doc(selectedUser.id).update({ photoURL: newAvatarUrl });
                const updatedUsers = users.map(user => 
                    user.id === selectedUser.id ? { ...user, photoURL: newAvatarUrl } : user
                );
                setUsers(updatedUsers);
                setModalVisible(false);
                ToastAndroid.show("Cập nhật avatar thành công", ToastAndroid.SHORT);
            } catch (error) {
                console.error(error);
            }
        }
    };

    const handleUpdateDisplayName = async () => {
        if (selectedUser && newDisplayName.trim()) {
            try {
                await firestore().collection('users').doc(selectedUser.id).update({ displayName: newDisplayName });
                const updatedUsers = users.map(user => 
                    user.id === selectedUser.id ? { ...user, displayName: newDisplayName } : user
                );
                setUsers(updatedUsers);
                setModalVisible(false);
                ToastAndroid.show("Cập nhật tên thành công", ToastAndroid.SHORT);
            } catch (error) {
                console.error(error);
            }
        }
    };

    const renderUser = ({ item }) => (
        <View style={styles.userContainer}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image source={{ uri: item.photoURL }} style={styles.image} />
                <View>
                    <Text style={styles.text}> {item.displayName}</Text>
                    <Text style={styles.text}> {item.email}</Text>
                </View>
            </View>
            <View style={{ flexDirection: 'row', position:'absolute', bottom:10, right:10}}>
                <MaterialIcons name="delete" size={25} color={'#f15267'} onPress={() => deleteUser(item.id)} />
                <MaterialIcons name="edit-square" size={25} color={'#49688d'} style={{ marginLeft:10 }} onPress={() => editUser(item)} />
            </View>
        </View>
    );

    return (
        <ImageBackground style={styles.container} source={require("../../assets/background.png")}>
            <View style={styles.searchBar}>
                <MaterialIcons name="search" size={45} color="#fff" style={{ backgroundColor: "#3669a4", borderRadius: 100 }} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Bạn tìm gì?"
                    placeholderTextColor={"#49688d"}
                    value={searchQuery}
                    onChangeText={handleSearch}
                />
            </View>
            <View style={{ flex: 1, width: '100%' }}>
                <FlatList
                    data={searchQuery ? titleResults : users}
                    renderItem={renderUser}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ margin: 10 }}
                />
            </View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ backgroundColor: '#fff', padding: 20, borderRadius: 10 }}>
                        <Text style={{ fontSize: 18, marginBottom: 10 }}>
                            Cập nhật thông tin cơ bản
                        </Text>
                        <TextInput
                            style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10 }}
                            placeholder="Nhập đường link avatar mới"
                            value={newAvatarUrl}
                            onChangeText={(text) => setNewAvatarUrl(text)}
                        />
                        <TouchableOpacity onPress={handleUpdateAvatar}>
                            <Text style={{ fontSize: 16, color: 'blue', marginBottom:30 }}>Cập nhật avatar</Text>
                        </TouchableOpacity>
                        <TextInput
                            style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10 }}
                            placeholder="Nhập tên mới"
                            value={newDisplayName}
                            onChangeText={(text) => setNewDisplayName(text)}
                        />
                        <TouchableOpacity onPress={handleUpdateDisplayName}>
                            <Text style={{ fontSize: 16, color: 'blue' }}>Cập nhật tên</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setModalVisible(false)}>
                            <Text style={{ fontSize: 16, color: 'gray' }}>Hủy</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </ImageBackground>
    );
};

export default UserManager;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderWidth: 5,
        borderColor: '#3669a4',
        borderRadius: 100,
        marginVertical: 10,
        width: "80%",
        height: 50,
        overflow: 'hidden'
    },
    searchInput: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
    },
    userContainer: {
        flexDirection: 'row',
        marginVertical: 5,
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 51,
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        height:70
    },
    image: {
        width: 40,
        height: 40,
        borderRadius: 100,
        marginRight: 15,
        resizeMode: 'cover'
    },
    text: {
        fontSize: 13,
        color: '#3669a4'
    }
});
