import React, { useEffect, useState } from 'react';
import { Alert, Text, View, StyleSheet, TextInput, FlatList, Image, KeyboardAvoidingView, ToastAndroid, ActivityIndicator } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { getCurrentUser, getUserRef } from '../context/FirestoreFunction';
import firestore from '@react-native-firebase/firestore';

const Comment = ({ post, onClose, onLogin }) => {
    const [commentInput, setCommentInput] = useState('');
    const [comment, setComment] = useState(post.comments);
    const userRef = getUserRef();
    const [loading, setLoading] = useState(true);
    const [userDataMap, setUserDataMap] = useState({});
    const defaultImage = 'https://firebasestorage.googleapis.com/v0/b/disastermanagerment-b0a31.appspot.com/o/users%2Fdefault.png?alt=media&token=5b09c058-8392-424b-bb97-177a4b2c5e76';

    const fetchUserData = async (ref) => {
        try {
            const userSnapshot = await firestore().collection('users').doc(ref.toString()).get();
            if (userSnapshot.exists) {
                return userSnapshot.data();
            } else {
                console.log("Người dùng không tồn tại:", userRef.path);
            }
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu user:", error);
        }
        return null;
    };

    useEffect(() => {
        const fetchCommentsUsers = async () => {
            try {
                const userMap = { ...userDataMap };
                const promises = comment?.map(async (item) => {
                    const userRef = item.user;
                    const userId = userRef.path.split('/').pop();
                    if (!userMap[userId]) {
                        const userData = await fetchUserData(userId);
                        userMap[userId] = userData;
                    }
                });
                if (promises) {
                    await Promise.all(promises);
                }
                setUserDataMap(userMap);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchCommentsUsers();
    }, [comment]);

    const handleSendComment = () => {
        try {
            if (commentInput.trim().length >= 5) {
                setCommentInput('');
                const currentUser = getCurrentUser();
                if (!currentUser) {
                    Alert.alert(
                        'Đã xảy ra lỗi',
                        'Bạn cần đăng nhập để like bài viết này',
                        [
                            { text: 'Đăng nhập', onPress: onLogin },
                            { text: 'Hủy', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                        ]
                    );
                    return;
                }
                onSubmitComment(commentInput, post.id);
            }
            else {
                ToastAndroid.show("Bình luận quá ngắn", ToastAndroid.SHORT);
            }
        } catch (error) {
            ToastAndroid.show("Hãy kiểm tra lại đường truyền internet", ToastAndroid.SHORT);
        }
    }

    const onSubmitComment = async (comment, postid) => {
        try {
            const newComment = {
                user: userRef,
                contentComment: comment,
                date: firestore.Timestamp.now(),
            };
    
            // Tạo một mảng chứa các thao tác bất đồng bộ
            const updatePromises = [
                firestore()
                    .collection('articles')
                    .doc(postid.toString())
                    .update({
                        comments: firestore.FieldValue.arrayUnion(newComment),
                    })
            ];
    
            // Nếu bài viết có chủ sở hữu (post.uid), thêm tác vụ gửi thông báo vào mảng promises
            if (post?.userUploadUID) {
                const textNotify = {
                    content: `Báo cáo có về ${post.title} của bạn đã có bình luận mới!`,
                    id: postid,
                    date: firestore.Timestamp.now(),
                };
                updatePromises.push(
                    firestore()
                        .collection('users')
                        .doc(post.userUploadUID)
                        .update({
                            notRead: true,
                            dataNotify: firestore.FieldValue.arrayUnion(textNotify),
                        })
                );
            }
    
            // Thực thi tất cả các promises cùng lúc để tăng hiệu suất
            await Promise.all(updatePromises);
    
            // Nếu thành công, cập nhật bình luận vào state và hiển thị thông báo
            setComment((prevComment) => [...prevComment, newComment]);
            ToastAndroid.show("Bình luận thành công", ToastAndroid.SHORT);
            
        } catch (error) {
            console.error("Lỗi khi bình luận: ", error);
            ToastAndroid.show("Bình luận thất bại", ToastAndroid.SHORT);
        }
    };
    

    return (
        <KeyboardAvoidingView style={styles.backgroundContainer}>
            <View style={styles.title}>
                <Text style={{ fontWeight: '600', fontSize: 25 }}>Bình luận</Text>
                <MaterialIcons name={"close"} size={30} color={"#000"} onPress={onClose} />
            </View>
            {loading ? <ActivityIndicator size={'large'} /> : null}
            <View style={styles.content}>
                {comment?.length > 0 ? (
                    <FlatList
                        data={comment}
                        showsVerticalScrollIndicator={true}
                        renderItem={({ item }) => {
                            const userId = item.user.path.split('/').pop();
                            const user = userDataMap[userId];
                            return (
                                <View style={styles.commentItem}>
                                    <Image
                                        source={{ uri: user?.photoURL || defaultImage }}
                                        style={styles.commentPhoto}
                                    />
                                    <View>
                                        <View style={{ backgroundColor: '#E7E7E7', paddingVertical: 3, paddingHorizontal: 3, borderRadius: 5, maxWidth: 320 }}>
                                            <Text style={styles.commentDisplayName}>
                                                {user?.displayName || "Tên hiển thị"}
                                                {userId === 'E39uuBnnF7f7OxcltOnNid44OXY2' && (
                                                    <View style={{backgroundColor: 'red', paddingHorizontal:10, borderRadius:100,}}>
                                                        <Text style={{ fontSize: 12,  color:'#fff' }}><MaterialIcons name="shield" size={10} color="#fff" /> Admin</Text>
                                                    </View>
                                                )}
                                            </Text>
                                            <Text style={styles.commentContent}>
                                                {item.contentComment}
                                            </Text>
                                        </View>
                                        <Text style={styles.commentDate}>
                                            {item.date ? new Date(item.date._seconds * 1000).toLocaleString() : "Ngày hiển thị"}
                                        </Text>
                                    </View>
                                </View>
                            )
                        }}
                        keyExtractor={(item) => item.contentComment}
                    />
                ) : (
                    <Text style={styles.noCommentText}>Hiện chưa có ai bình luận</Text>
                )}
                <View style={styles.inputComment}>
                    <TextInput style={styles.input} value={commentInput} onChangeText={setCommentInput} placeholder="Nhập tin nhắn ở đây..." />
                    <MaterialIcons name={"send"} size={30} color={'#000'} onPress={handleSendComment} />
                </View>
            </View>
        </KeyboardAvoidingView>
    );
};

export default Comment;

const styles = StyleSheet.create({
    backgroundContainer: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    title: {
        width: '93%',
        height: 50,
        backgroundColor: '#DCDCDC',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    content: {
        flex: 1,
        backgroundColor: '#fff',
        width: '93%',
        height: '90%',
        marginBottom: 10,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    commentItem: {
        padding: 10,
        flex: 5,
        flexDirection: 'row'
    },
    commentContent: {
        fontSize: 16,
        marginBottom: 5,
        flexWrap: 'wrap',
        textAlign: 'justify'
    },
    commentDate: {
        fontSize: 14,
        color: '#666',
    },
    commentDisplayName: {
        fontSize: 16,
        fontWeight: 'bold',
        flexWrap: 'wrap',
    },
    commentPhoto: {
        width: 30,
        height: 30,
        borderRadius: 100,
        marginRight: 10,
        resizeMode: 'cover',
    },
    noCommentText: {
        fontSize: 16,
        textAlign: 'center',
        padding: 20,
        flex: 5,
    },
    input: {
        flex: 1,
        height: 48,
        borderRadius: 60,
        paddingHorizontal: 8,
        color: '#000',
        marginRight: 10,
        borderRadius: 45,
        borderWidth: 1
    },
    inputComment: {
        flex: 1,
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: 'center',
        marginHorizontal: 10,
        position: 'absolute',
        bottom: 10,
        backgroundColor: 'white'
    }
});