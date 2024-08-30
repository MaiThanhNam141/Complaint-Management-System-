import React, { useState } from 'react';
import { KeyboardAvoidingView, ScrollView, Text, View, StyleSheet, TextInput, TouchableOpacity, ToastAndroid, ActivityIndicator, ImageBackground, Image, Platform } from 'react-native';
import auth from '@react-native-firebase/auth';

const ForgetPasswd = ({ email, onClose }) => {
    const [e, setE] = useState(email);
    const [loading, setLoading] = useState(false);

    const handleSendEmail = async () => {
        setLoading(true);
        try {
            await auth().sendPasswordResetEmail(e);
            ToastAndroid.show(`Gửi thành công`, ToastAndroid.SHORT);
        } catch (error) {
            ToastAndroid.show(`Thất bại. Hãy kiểm tra lại Internet`, ToastAndroid.SHORT);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ImageBackground style={styles.container} source={require("../../assets/background.png")}>
            <KeyboardAvoidingView 
                style={styles.keyboardAvoidingView} 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // Sử dụng behavior phù hợp với nền tảng
            >
                <ScrollView contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}>
                    <View style={styles.logo}>
                        <Image style={styles.logoImg} source={require("../../assets/logo.png")} />
                        <Text style={styles.title}>Quên mật khẩu</Text>
                    </View>
                    
                    <View style={styles.mainContainer}>
                        <Text style={styles.subTitle}>Nhập email để lấy lại mật khẩu</Text>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Email"
                            placeholderTextColor={"gray"} 
                            value={e}
                            onChangeText={(text) => setE(text)}
                            keyboardType="email-address"
                            spellCheck={false}
                            autoCorrect={false}
                        />
                    </View>

                    <View style={{ marginVertical: 30 }}>
                        <TouchableOpacity style={styles.loginButton} onPress={handleSendEmail}>
                            {loading ? <ActivityIndicator size={'large'} /> : <Text style={styles.loginTextButton}>Gửi</Text>}
                        </TouchableOpacity>
                        <TouchableOpacity style={{ alignItems: 'center', marginTop: 20 }} onPress={onClose}>
                            <Text style={styles.otherMethodText}>Quay lại đăng nhập?</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </ImageBackground>
    );
};

export default ForgetPasswd;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        resizeMode: 'contain',
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    scrollViewContent: {
        flexGrow: 1,
        justifyContent: 'center',  // Giúp căn giữa nội dung khi bàn phím không hiển thị
        alignItems: 'center',
    },
    logo: {
        marginTop: 10,
        marginBottom: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#49688d',
        alignSelf: 'center'
    },
    logoImg: {
        width: 200,
        height: 200,
        resizeMode: 'contain',
    },
    mainContainer: {
        marginBottom: 20,
    },
    subTitle: {
        fontSize: 16,
        marginBottom: 15,
    },
    textInput: {
        color: "gray",
        fontSize: 14,
        width: 300,
        textAlignVertical: 'center',
        borderRadius: 15,
        borderWidth: 1,
        paddingHorizontal: 10,
        alignSelf: 'center'
    },
    loginButton: {
        borderRadius: 100,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: 220,
        height: 70,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    loginTextButton: {
        fontSize: 20,
        paddingHorizontal: 15,
        color: '#49688d',
        fontWeight: '400'
    },
    otherMethodText: {
        fontSize: 13,
        fontWeight: '300',
        paddingHorizontal: 10
    }
});
