import React, { memo, useMemo, useCallback, useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, Image, ImageBackground, StyleSheet, Modal, ToastAndroid } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ImageViewing from 'react-native-image-viewing';
import Comment from '../component/Comment';
import ReposnsePost from './ReposnsePost';
import firestore from '@react-native-firebase/firestore';

const PostsList = memo(({ posts, status }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [commentModal, setCommentModal] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [images, setImages] = useState([]);
    const [visible, setVisible] = useState(false);

    const getStatusText = useCallback((status) => {
        switch (status) {
            case 'Chưa duyệt':
                return <Text style={{ paddingHorizontal: 15, backgroundColor: '#ccc', borderRadius: 100, fontWeight: '700' }}>
                    Chưa duyệt</Text>;
            case 'Đang kiểm tra':
                return <Text style={{ paddingHorizontal: 15, backgroundColor: '#FFC107', borderRadius: 100, fontWeight: '700' }}>
                    Đang kiểm tra</Text>;
            case 'Chờ xử lí':
                return <Text style={{ paddingHorizontal: 15, backgroundColor: '#ADD8E6', borderRadius: 100, fontWeight: '700' }}>
                    Chờ xử lí</Text>;
            case 'Đang xử lí':
                return <Text style={{ paddingHorizontal: 15, backgroundColor: 'yellow', borderRadius: 100, fontWeight: '700' }}>
                    Đang xử lí</Text>;
            case 'Đã hoàn thành':
                return <Text style={{ paddingHorizontal: 15, backgroundColor: '#8BC34A', borderRadius: 100, fontWeight: '700' }}>
                    Đã hoàn thành</Text>;
            case 'Từ chối':
                return <Text style={{ paddingHorizontal: 15, backgroundColor: '#FF0000', borderRadius: 100, fontWeight: '700' }}>
                    Từ chối</Text>;
            default:
                return <Text>Không xác định</Text>;
        }
    }, []);
    const handleImagePress = (imageIndex, images) => {
        const formattedImages = images.map(image => ({ uri: image }));
        setCurrentImageIndex(imageIndex);
        setImages(formattedImages);
        setVisible(true);
    };
    const handleImageViewingClose = () => {
        setVisible(false);
    };
    const onCloseModal = () => {
        setModalVisible(false);
    };
    const onCloseModalComment = () => {
        setCommentModal(false);
    };
    const handleDetailsPress = (post) => {
        setSelectedPost(post);
        setModalVisible(true);
    };
    const handleCommentModal = (post) => {
        setSelectedPost(post);
        setCommentModal(true);
    };

    const handleLogin = () => {
        console.log("Hello");
    };

    const handleSave = async (post) => {
        try {
            await firestore()
                .collection('articles')
                .doc(post.id.toString())
                .update({
                    responseDate: post?.responseDate || "Lỗi",
                    responseDesc: post?.responseDesc || "",
                    responseUnit: post?.responseUnit || "",
                    status: post?.status || "Chưa duyệt",
                    Severity: post?.Severity || "Nhẹ",
                })
                .then(() => {
                    ToastAndroid.show("Thành công", ToastAndroid.SHORT);
                })
                .catch((error) => {
                    console.log(error);
                })
        } catch (error) {
            console.error("handleSave Error:  ", error);

        }
    }


    const memoizedPosts = useMemo(() => {
        return posts
            .filter((post) => !status || post?.status === status)
            .map((post, index) => (
                <View key={`${post?.id}-${status}-${index}`} style={styles.postContainer}>
                    <TouchableOpacity onPress={() => handleDetailsPress(post)}>
                        <View style={styles.postHeader}>
                            <Text style={{ fontWeight: 'bold' }}>{post?.displayName}</Text>
                            <Text style={{ color: '#555' }}>{post?.reportDate}</Text>
                        </View>
                        <Text style={{ marginBottom: 10 }}>{post?.title}</Text>
                    </TouchableOpacity>
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
                    <TouchableOpacity style={styles.postStats} onPress={() => handleDetailsPress(post)}>
                        <Text style={styles.likes}>{post?.likes} likes</Text>
                        {getStatusText(post?.status)}
                    </TouchableOpacity>

                    <View style={styles.postActions}>
                        <TouchableOpacity style={styles.actionButton} onPress={() => handleCommentModal(post)}>
                            <MaterialIcons name="comment" size={20} color="#000" />
                            <Text style={styles.actionText}>Bình luận</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionButton} onPress={() => handleDetailsPress(post)}>
                            <MaterialIcons name="comment" size={20} color="#000" />
                            <Text style={styles.actionText}>Phản hồi báo cáo</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ));
    }, [posts, status]);


    return (
        <ImageBackground style={styles.container} source={require("../../assets/background.png")}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {memoizedPosts}
            </ScrollView>
            <ImageViewing
                images={images}
                imageIndex={currentImageIndex}
                visible={visible}
                onRequestClose={handleImageViewingClose}
            />
            <Modal visible={modalVisible} animationType="slide" onRequestClose={onCloseModal}>
                <ReposnsePost post={selectedPost} onClose={onCloseModal} onSave={handleSave} />
            </Modal>
            <Modal visible={commentModal} animationType="slide" onRequestClose={onCloseModalComment} transparent={true}>
                <Comment post={selectedPost} onClose={onCloseModalComment} onLogin={handleLogin} />
            </Modal>
        </ImageBackground>
    );
});

export default PostsList;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f2f5',
    },
    scrollContent: {
        paddingHorizontal: 10,
        paddingTop: 10,
    },
    statusBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#fff',
        paddingVertical: 10,
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 2,
        elevation: 1,
    },
    statusButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusText: {
        marginLeft: 5,
        fontSize: 24,
        fontWeight: 'bold'
    },
    normalText: {
        fontSize: 16
    },
    postContainer: {
        backgroundColor: '#fff',
        paddingHorizontal: 10,
        paddingTop: 10,
        paddingBottom: 5,
        borderRadius: 10,
        marginVertical: 10,
        shadowRadius: 2,
        overflow: 'hidden',
        elevation: 1,
    },
    postHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    postImage: {
        width: '100%',
        height: 200,
        borderRadius: 10,
    },
    postActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 10,
        marginTop: 5,
        borderTopColor: '#ddd',
    },
    actionButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    actionText: {
        marginLeft: 5,
        fontSize: 16,
        textAlign: 'center'
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
});