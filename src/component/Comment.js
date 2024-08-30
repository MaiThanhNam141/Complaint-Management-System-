import React, { useEffect, useState } from 'react';
import { Alert, Text, View, StyleSheet, TextInput, FlatList, Image, KeyboardAvoidingView, ToastAndroid } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { getCurrentUser, getUserRef } from '../context/FirestoreFunction';

const Comment = ({ post, onClose, onSubmitComment, onLogin }) => {
    const [commentInput, setCommentInput] = useState('');
    const [ user, setUser] = useState('');

    const fetchUserInfoFromReference = async () => {
        try {
            const userRef = getUserRef();
            const userDoc = await userRef.get();
            const data = userDoc.data();
            if(data){
                setUser(data)
            }
        } catch (error) {
            console.error("Data: ", error);
        }
    };

    useEffect(() => {
        fetchUserInfoFromReference();
    }, [])

    const handleSendComment = () => {
        try {
            if (commentInput.trim().length >= 5){
                setCommentInput('');
                const user = getCurrentUser();
                if (!user || !user.uid) { 
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

    return (
        <KeyboardAvoidingView style={styles.backgroundContainer}>
            <View style={styles.title}>
                <Text style={{ fontWeight: '600', fontSize: 25 }}>Bình luận</Text>
                <MaterialIcons name={"close"} size={30} color={"#000"} onPress={onClose} />
            </View>
            <View style={styles.content}>
                {post?.comment?.length > 0 ? (
                    <FlatList
                        data={post.comment}
                        showsVerticalScrollIndicator={true}
                        renderItem={({ item }) => (
                            <View style={styles.commentItem}>
                                <Image source={{ uri: item.photoURL }} style={styles.commentPhoto} />
                                <View>
                                    <View style={{ backgroundColor: '#E7E7E7', paddingVertical: 3, paddingHorizontal: 3, borderRadius: 5, maxWidth:320 }}>
                                        <Text style={styles.commentDisplayName}>
                                            {item.displayName}
                                        </Text>
                                        <Text style={styles.commentContent}>
                                            {item.contentComment}
                                        </Text>
                                    </View>
                                    <Text style={styles.commentDate}>{item.date.toDate().toLocaleString()}</Text>
                                </View>
                            </View>
                        )}
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
        textAlign:'justify'
    },
    commentDate: {
        fontSize: 14,
        color: '#666',
    },
    commentDisplayName: {
        fontSize: 16,
        fontWeight: 'bold',
        flexWrap: 'wrap'
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
        position:'absolute',
        bottom:10
    }
});