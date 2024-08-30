import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

const LikedPost = () => {
    const [user, setuser] = useState('');
    const [isLiked, setIsLiked] = useState([]);
    
    const isArticleLiked = async () => {
        try {
            const user = await getUserInfo();
            if (user && user?.likes) {
                setuser(user)
                const likedPosts = user.likes.filter((like) => like.postId === selectedPost.id);
                setIsLiked(user?.likes);
            }
        } catch (error) {
            console.error(error);
        }
        return Promise.resolve()
    }
    return (
        <View style={styles.container}>
            <Text>LikedPost</Text>
        </View>
    );
};

export default LikedPost;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});