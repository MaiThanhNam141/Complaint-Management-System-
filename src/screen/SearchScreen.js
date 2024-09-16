import React, { useState, useCallback } from 'react';
import { ToastAndroid, Share, Alert, ImageBackground, View, TextInput, FlatList, Text, StyleSheet, ActivityIndicator, Image, TouchableOpacity, Modal } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import firestore from '@react-native-firebase/firestore';
import { getCurrentUser, updateLikes, updateLikesArticle } from '../context/FirestoreFunction';
import Comment from '../component/Comment';
import PostDetailsModal from '../component/PostDetailsModal';

const SearchScreen = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [titleResults, setTitleResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [debounceTimeout, setDebounceTimeout] = useState(null);
    const [commentModal, setCommentModal] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [isLiked, setIsLiked] = useState([]);

    const handleSearch = (query) => {
        setSearchQuery(query);
        if (!query.trim() || query.length < 3) {
            setTitleResults([])
            clearTimeout(debounceTimeout);
            return;
        }
        clearTimeout(debounceTimeout);
        setDebounceTimeout(setTimeout(() => {
            searchArticles(query);
        }, 500));
    };
    const handleLogin = () => {
        navigation.jumpTo('Hồ sơ')
    }
    const onCloseModal = () => {
        setModalVisible(false);
    };
    const handleDetailsPress = (post) => {
        setSelectedPost(post);
        setModalVisible(true);
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
                const updatedPosts = titleResults.map((p) => (p.id === post.id ? updatedPost : p));
                setTitleResults(updatedPosts);
                updateLikes(post.id, 0);
                updateLikesArticle(post.id.toString(), post.likes - 1);
            }
            else {
                setIsLiked((prev) => [...prev, post.id]);
                const updatedPost = { ...post, likes: post.likes + 1 };
                const updatedPosts = titleResults.map((p) => (p.id === post.id ? updatedPost : p));
                setTitleResults(updatedPosts);
                updateLikes(post.id);
                updateLikesArticle(post.id.toString(), post.likes + 1);
            }
        } catch (error) {
            console.error(error);
            ToastAndroid.show("Thất bại! hãy kiểm tra lại internet", ToastAndroid.SHORT);
        }
    };
    const searchArticles = async (query) => {
        setLoading(true);
        try {
            const db = firestore();
            const articlesRef = db.collection('articles');

            // Tìm kiếm cho title
            const titleSnapshot = await articlesRef
                .where('title', '>=', query)
                .where('title', '<=', query + '\uf8ff')
                .orderBy('title')
                .limit(5) // giới hạn số lượng kết quả trả về
                .get();

            const titleResults = titleSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setTitleResults(titleResults);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

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

    const handleCommentModal = (post) => {
        setSelectedPost(post);
        setCommentModal(true);
    }
    const onSubmitComment = async (post) => {
        console.log(post);

    }

    const renderResultItem = ({ item }) => (
        <View key={item.id} style={styles.postContainer}>
            <TouchableOpacity onPress={() => handleDetailsPress(item)}>
                <View style={styles.postHeader}>
                    <Text style={{ fontWeight: 'bold' }}>{item.displayName}</Text>
                    <Text style={{ color: '#555', }}>{item.reportDate}</Text>
                </View>
                <Text style={{ marginBottom: 10, }}>{item.title}</Text>
            </TouchableOpacity>
            {item.reportImage && (
                <View>
                    <View style={{ position: 'absolute', top: 10, right: 10, zIndex: 1 }}>
                        <Text style={{ fontSize: 16, color: 'white' }}>
                            1/{item.reportImage.length}
                        </Text>
                    </View>
                    <TouchableOpacity onPress={() => handleImagePress(0, item.reportImage)}>
                        <Image source={{ uri: item.reportImage[0] }} style={styles.postImage} />
                    </TouchableOpacity>
                </View>
            )}
            <TouchableOpacity style={styles.postStats} onPress={() => handleDetailsPress(item)}>
                <Text style={styles.likes}>{item?.likes} likes</Text>
                {getStatusText(item?.status)}
            </TouchableOpacity>

            <View style={styles.postActions}>
                <TouchableOpacity style={styles.actionButton} onPress={() => handleLike(item)}>
                    <MaterialIcons name="thumb-up" size={20} color={isLiked.includes(item.id) ? '#0C6DF2' : '#000'} />
                    <Text style={styles.actionText}>Like</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={() => handleCommentModal(item)}>
                    <MaterialIcons name="comment" size={20} color="#000" />
                    <Text style={styles.actionText}>Bình luận</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={() => onShare(item)}>
                    <MaterialIcons name="share" size={20} color="#000" />
                    <Text style={styles.actionText}>Chia sẻ</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderIndependentResults = () => {
        return (
            <>
                <FlatList
                    data={titleResults}
                    keyExtractor={(item) => item.id}
                    renderItem={renderResultItem}
                    ListEmptyComponent={() => <Text style={styles.emptyText}>Không có kết quả theo tiêu đề</Text>}
                />
            </>
        );
    };

    return (
        <ImageBackground style={styles.container} source={require("../../assets/background.png")}>
            <View style={styles.searchBar}>
                <MaterialIcons name="search" size={24} color="#000" />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Tìm kiếm..."
                    value={searchQuery}
                    onChangeText={handleSearch}
                />
            </View>
            <Modal visible={commentModal} animationType="slide" onRequestClose={() => setCommentModal(false)} transparent={true}>
                <Comment post={selectedPost} onClose={() => setCommentModal(false)} onSubmitComment={onSubmitComment} onLogin={handleLogin} />
            </Modal>
            <Modal visible={modalVisible} animationType="slide" onRequestClose={onCloseModal}>
                <PostDetailsModal post={selectedPost} modalVisible={modalVisible} onClose={onCloseModal} />
            </Modal>
            {
                loading ? <ActivityIndicator size={'large'} /> : renderIndependentResults()
            }

        </ImageBackground>
    );
};

export default SearchScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 20,
        marginBottom: 10,
    },
    searchInput: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
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
