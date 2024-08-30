import React, { useState } from 'react';
import { KeyboardAvoidingView, ScrollView, Text, View, StyleSheet, Image, TextInput, TouchableOpacity, Modal, ToastAndroid, ActivityIndicator, ImageBackground, Platform } from 'react-native';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import auth from "@react-native-firebase/auth";
import { setuserInfo } from '../context/FirestoreFunction';

const SignUp = ({ onClose }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rePassword, setRePassword] = useState("");
    const [showPassword, setShowPassword] = useState(true);
    const [showRePassword, setShowRePassword] = useState(true);
    const [userName, setUserName] = useState("");
    const [loading, setLoading] = useState(false);

    const signIn = async () => {
        setLoading(true);
        const e = email.trim();
        const p = password.trim();
        const reP = rePassword.trim();
        if (!e || e.length < 6) {
            setLoading(false);
            ToastAndroid.show("Email quá ngắn", ToastAndroid.SHORT);
            return null;
        }
        if (!p || p.length < 6) {
            setLoading(false);
            ToastAndroid.show("Password quá ngắn", ToastAndroid.SHORT);
            return null;
        }
        try {
            if (p !== reP) {
                ToastAndroid.show("Mật khẩu nhập lại không chính xác!", ToastAndroid.SHORT);
                return null;
            }
            await auth().createUserWithEmailAndPassword(e, p)
                .then(() => {
                    auth().currentUser.sendEmailVerification();
                    ToastAndroid.show("Đăng ký thành công", ToastAndroid.SHORT);
                    const userDocData = {
                        email: e,
                        displayName: userName.trim(),
                        photoURL: 'https://firebasestorage.googleapis.com/v0/b/disastermanagerment-b0a31.appspot.com/o/users%2Fdefault.png?alt=media&token=5b09c058-8392-424b-bb97-177a4b2c5e76',
                    };
                    setuserInfo(userDocData);
                })
                .catch((error) => {
                    console.error(error);
                    if (error.code === 'auth/invalid-email') {
                        ToastAndroid.show("Email không hợp lệ", ToastAndroid.SHORT);
                    } else if (error.code === 'auth/wrong-password') {
                        ToastAndroid.show("Sai tài khoản hoặc mật khẩu", ToastAndroid.SHORT);
                    } else {
                        ToastAndroid.show("Đăng ký thất bại! Kiểm tra lại internet.", ToastAndroid.SHORT);
                    }
                });
        } catch (error) {
            console.error("signin function error: ", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ImageBackground source={require("../../assets/background.png")} style={styles.container}>
            <KeyboardAvoidingView 
                style={styles.keyboardAvoidingView} 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}  // Sử dụng behavior phù hợp với nền tảng
            >
                <ScrollView contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}>
                    <View style={styles.logo}>
                        <Image style={styles.logoImg} source={require("../../assets/logo.png")} />
                        <Text style={styles.title}>Đăng ký</Text>
                    </View>
                    
                    {loading && (
                        <View style={{flex: 1}}>
                            <ActivityIndicator size={'large'} />
                        </View>
                    )}

                    <View style={styles.mainContainer}>
                        <View style={styles.inputContainer}>
                            <TextInput 
                                value={userName} 
                                onChangeText={(text) => setUserName(text)} 
                                placeholderTextColor={"gray"} 
                                style={[styles.textInput, {width: 270}]} 
                                spellCheck={false}
                                autoCorrect={false}
                                placeholder="Tên đăng nhập"
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <TextInput 
                                value={email} 
                                onChangeText={(text) => setEmail(text)} 
                                placeholderTextColor={"gray"} 
                                style={[styles.textInput, {width: 270}]} 
                                spellCheck={false}
                                autoCorrect={false}
                                placeholder="Email"
                                keyboardType='email-address'
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <TextInput 
                                secureTextEntry={showPassword} 
                                value={password} 
                                onChangeText={(text) => setPassword(text)} 
                                placeholderTextColor={"gray"} 
                                style={styles.textInput} 
                                spellCheck={false}
                                autoCorrect={false}
                                placeholder="Mật khẩu"
                            />
                            <MaterialIcons
                                name={showPassword ? 'visibility-off' : 'visibility'}
                                size={24}
                                color="#aaa"
                                style={styles.icon}
                                onPress={() => setShowPassword(!showPassword)}
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <TextInput 
                                secureTextEntry={showRePassword} 
                                value={rePassword} 
                                onChangeText={(text) => setRePassword(text)} 
                                placeholderTextColor={"gray"} 
                                style={styles.textInput} 
                                spellCheck={false}
                                autoCorrect={false}
                                placeholder="Nhập lại mật khẩu"
                            />
                            <MaterialIcons
                                name={showRePassword ? 'visibility-off' : 'visibility'}
                                size={24}
                                color="#aaa"
                                style={styles.icon}
                                onPress={() => setShowRePassword(!showRePassword)}
                            />
                        </View>
                    </View>

                    <View style={{marginVertical: 30}}>
                        <TouchableOpacity style={styles.loginButton} onPress={signIn}>
                            <Text style={styles.loginTextButton}>Đăng ký</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{alignItems: 'center', marginTop: 20}} onPress={onClose}>
                            <Text style={styles.otherMethodText}>Đã có tài khoản?</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </ImageBackground>
    );
};

export default SignUp;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        resizeMode: 'contain',
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    scrollViewContent: {
        flexGrow: 1,
        justifyContent: 'center', 
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
    inputContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: StyleSheet.hairlineWidth,
        marginVertical: 5,
        height: 60,
        borderRadius: 30,
        paddingHorizontal: 10
    },
    textInput: {
        color: "gray",
        fontSize: 14,
        width: 250,
        textAlignVertical: 'center',
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
