import auth from "@react-native-firebase/auth";
import firestore from '@react-native-firebase/firestore'

export const getCurrentUser = () => {
    return auth().currentUser;
}
export const getUserInfo = async () => {
    try {
        const user = getCurrentUser();
        const userRef = firestore().collection('users').doc(user.uid);
        if (userRef) {
            const snapshot = await userRef.get();
            return snapshot.data();
        }
    } catch (error) {
        console.error("Firebase getUserInfo: ", error);
        return null;
    }
}
export const getUserRef = () => {
    try {
        const user = getCurrentUser();
        return firestore().collection('users').doc(user.uid);
    } catch (error) {
        console.error(error);
        return null;
    }
}

export const setuserInfo = (userDocData) => {
    try {
        const user = getCurrentUser();
        const userRef = firestore().collection('users').doc(user.uid);
        userRef.set(userDocData);
    } catch (error) {
        console.error("Firebase setUserInfo: ", error);
    }
}

export const updateUserInfo = (userDocData) => {
    try {
        const user = getCurrentUser();
        const userRef = firestore().collection('users').doc(user.uid);
        userRef.update(userDocData);
    } catch (error) {
        console.error("Firebase setUserInfo: ", error);
    }
}

export const updateLikes = (postId, like) => {
    try {
        const user = getCurrentUser();
        const userRef = firestore().collection('users').doc(user.uid);
        if (like){
            userRef.update({
                likes: firestore.FieldValue.arrayRemove(postId),
            });
        }
        else{
            userRef.update({
                likes: firestore.FieldValue.arrayUnion(postId),
            });
        }
    } catch (error) {
        console.error('Lỗi cập nhật likes:', error);
    }
};

export const updateLikesArticle = (postId, like) => {
    try {
        const userRef = firestore().collection('articles').doc(postId);
        userRef.update({likes: like})
    } catch (error) {
        console.error('Lỗi cập nhật likes:', error);
    }
};

