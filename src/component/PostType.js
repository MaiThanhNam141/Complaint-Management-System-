import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Modal, ToastAndroid, Alert, Share, Text, View, StyleSheet, ImageBackground, RefreshControl, ScrollView, TouchableOpacity, Image } from 'react-native';
import SkeletonPost from './SkeletonPost';
import firestore from '@react-native-firebase/firestore';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ImageViewing from 'react-native-image-viewing';
import PostDetailsModal from './PostDetailsModal';
import { getCurrentUser, getUserInfo, updateLikes, updateLikesArticle } from '../context/FirestoreFunction';
import Comment from './Comment';

const PostType = ({ route, navigation }) => {
    const { type, name } = route.params;
    const [user, setuser] = useState('');
    const [refreshing, setRefreshing] = useState(true);
    const [visible, setVisible] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [images, setImages] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [commentModal, setCommentModal] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [lastDoc, setLastDoc] = useState(null);
    const [initialLoading, setInitialLoading] = useState(true);
    const [isLiked, setIsLiked] = useState([]);

    const onRefresh = () => {
        setInitialLoading(true);
        setRefreshing(true);
    };

    const handleImagePress = (imageIndex, images) => {
        const formattedImages = images.map(image => ({ uri: image }));
        setCurrentImageIndex(imageIndex);
        setImages(formattedImages);
        setVisible(true);
    };

    const handleImageViewingClose = () => {
        setVisible(false);
    };

    const handleLike = (post) => {
        try {
            const user = getCurrentUser();
            if (!user || !user.uid) {
                Alert.alert(
                    'Đã xảy ra lỗi',
                    'Bạn cần đăng nhập để like bài viết này',
                    [
                        { text: 'Đăng nhập', onPress: handleLogin },
                        { text: 'Hủy', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                    ]
                );
                return;
            }
            if (isLiked.includes(post.id)) {
                setIsLiked(isLiked.filter((id) => id !== post.id));
                const updatedPost = { ...post, likes: post.likes - 1 };
                const updatedPosts = posts.map((p) => (p.id === post.id ? updatedPost : p));
                setPosts(updatedPosts);
                updateLikes(post.id, 0);
                updateLikesArticle(post.id.toString(), post.likes - 1);
            }
            else {
                setIsLiked((prev) => [...prev, post.id]);
                const updatedPost = { ...post, likes: post.likes + 1 };
                const updatedPosts = posts.map((p) => (p.id === post.id ? updatedPost : p));
                setPosts(updatedPosts);
                updateLikes(post.id);
                updateLikesArticle(post.id.toString(), post.likes + 1);
            }
        } catch (error) {
            console.error(error);
            ToastAndroid.show("Thất bại! hãy kiểm tra lại internet", ToastAndroid.SHORT);
        }
    };

    useEffect(() => {
        if (refreshing) {
            Promise.all([
                isArticleLiked(),
                fetchPosts()]
            ).then(() => {
                setRefreshing(false);
                setLoading(false);
                setInitialLoading(false);
            })
        }
    }, [refreshing]);

    const handleScroll = () => {
        if (!loading && lastDoc) {
            fetchPosts();
        }
    };

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
    const handleLogin = () => {
        navigation.jumpTo('Hồ sơ')
    }

    const onShare = async (post) => {
        try {
            const imageUrl = post?.reportImage;
            if (!imageUrl) {
                await Share.share({ message: `${post.title}\n${post?.desc}` });
                return;
            }
            let shareMessage = `Người đăng tải: ${post.displayName}\nTiêu đề: ${post.title}\nTình trạng: ${post.status} \nNội dung: ${post?.desc}\n\n`;
            for (let i = 0; i < imageUrl.length; i++) {
                shareMessage += `${i + 1}. ${imageUrl[i]}\n`;
            }
            const shareOptions = {
                title: 'Chia sẻ bài đăng',
                message: shareMessage,
            };
            await Share.share(shareOptions);
        } catch (error) {
            console.error('Error sharing', error);
        }
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
    }
    const isArticleLiked = async () => {
        try {
            const user = await getUserInfo();
            if (user && user?.likes) {
                setuser(user)
                setIsLiked(user?.likes);
            }
        } catch (error) {
            console.error(error);
        }
        return Promise.resolve()
    }
    const fetchPosts = async () => {
        if (!type) {
            ToastAndroid.show("Đã xảy ra lỗi", ToastAndroid.SHORT);
            return;
        }
        try {
            if (loading) return 0;
            setLoading(true);
            const articlesRef = firestore().collection('articles');
            let query = articlesRef.where('type', '==', type.toString()).orderBy('id', 'desc').limit(5);
            if (lastDoc) {
                query = query.startAfter(lastDoc);
            }

            const articles = await query.get();

            // Lọc bài đăng đã tồn tại
            const newPosts = articles.docs
                .map((doc) => ({ id: doc.id, ...doc.data() }))
                .filter((newPost) => !posts.some((existingPost) => existingPost.id === newPost.id));

            setPosts([...posts, ...newPosts]);
            setLastDoc(articles.docs[articles.docs.length - 1]); // Cập nhật lastDoc

        } catch (error) {
            console.error(error);
        }
    };
    const memoizedPosts = useMemo(() => {
        return posts.map((post, index) => (
            <View key={`${post?.id}-${index}`} style={styles.postContainer}>
                <TouchableOpacity onPress={() => handleDetailsPress(post)}>
                    <View style={styles.postHeader}>
                        <Text style={{ fontWeight: 'bold' }}>{post?.displayName}</Text>
                        <Text style={{ color: '#555', }}>{post?.reportDate}</Text>
                    </View>
                    <Text style={{ marginBottom: 10, }}>{post?.title}</Text>
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
                    <TouchableOpacity style={styles.actionButton} onPress={() => handleLike(post)}>
                        <MaterialIcons name="thumb-up" size={20} color={isLiked.includes(post.id) ? '#0C6DF2' : '#000'} />
                        <Text style={styles.actionText}>Like</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton} onPress={() => handleCommentModal(post)}>
                        <MaterialIcons name="comment" size={20} color="#000" />
                        <Text style={styles.actionText}>Bình luận</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton} onPress={() => onShare(post)}>
                        <MaterialIcons name="share" size={20} color="#000" />
                        <Text style={styles.actionText}>Chia sẻ</Text>
                    </TouchableOpacity>
                </View>
            </View>
        ));
    }, [posts]);

    if (initialLoading) {
        return (
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <SkeletonPost />
                <SkeletonPost />
                <SkeletonPost />
            </ScrollView>
        )
    }

    return (
        <ImageBackground style={styles.container} source={require("../../assets/background.png")}>
            <ScrollView
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                onScrollEndDrag={handleScroll}
                onEndReachedThreshold={0.5}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Thanh trạng thái */}
                <View style={styles.statusBar}>
                    <Text style={styles.statusText}>{`<---- ${name} ---->`}</Text>
                </View>
                {memoizedPosts}
            </ScrollView>
            <ImageViewing
                images={images}
                imageIndex={currentImageIndex}
                visible={visible}
                onRequestClose={handleImageViewingClose}
            />
            <Modal visible={modalVisible} animationType="slide" onRequestClose={onCloseModal}>
                <PostDetailsModal post={selectedPost} modalVisible={modalVisible} onClose={onCloseModal} />
            </Modal>
            <Modal visible={commentModal} animationType="slide" onRequestClose={onCloseModalComment} transparent={true}>
                <Comment post={selectedPost} onClose={onCloseModalComment} onLogin={handleLogin} />
            </Modal>
        </ImageBackground>
    );
};

export default PostType;

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