import React, {useState} from 'react';
import { KeyboardAvoidingView, ScrollView, Text, View, StyleSheet, Image, TextInput, TouchableOpacity, Modal, ToastAndroid, ActivityIndicator, ImageBackground, Platform } from 'react-native';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import auth from "@react-native-firebase/auth";
import ForgetPasswd from '../component/ForgetPasswd';
import SignUp from '../component/SignUp';

const LoginScreen = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(true);
    const [showForgetModal, setShowForgetModal] = useState(false);
    const [registerModal, setRegisterModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const signIn = async () => {
        setLoading(true);
        const e = email.trim();
        const p = password.trim();
        if (!e || e.length < 6){
            setLoading(false);
            ToastAndroid.show("Email quá ngắn", ToastAndroid.SHORT);
            return null;
        }
        if (!p || p.length < 6){
            setLoading(false);
            ToastAndroid.show("Password quá ngắn", ToastAndroid.SHORT);
            return null;
        }
        try {
            await auth().signInWithEmailAndPassword(e, p)
                .then(() => {
                    ToastAndroid.show("Đăng nhập thành công", ToastAndroid.SHORT);
                })
                .catch((error) => {
                    console.error(error);
                    if (error.code === 'auth/invalid-email') {
                        ToastAndroid.show("Email không hợp lệ", ToastAndroid.SHORT);
                    } else if (error.code === 'auth/wrong-password') {
                        ToastAndroid.show("Sai tài khoản hoặc mật khẩu", ToastAndroid.SHORT);
                    }
                    else ToastAndroid.show("Sai tài khoản hoặc mật khẩu", ToastAndroid.SHORT);
                });
        } catch (error) {
            console.error("signin function error: ", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ImageBackground source={require("../../assets/background.png")} style={styles.background}>
            <KeyboardAvoidingView 
                style={styles.keyboardAvoidingView} 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}  // Sử dụng behavior phù hợp với nền tảng
            >
                <ScrollView contentContainerStyle={styles.scrollViewContent}>
                    <View style={styles.logo}>
                        <Image style={styles.logoImg} source={require("../../assets/logo.png")}/>
                        <Text style={styles.title}>Chào mừng!</Text>
                    </View>
                    
                    {loading && (
                        <View style={{flex: 1}}>
                            <ActivityIndicator size={'large'} />
                        </View>
                    )}

                    <View style={styles.mainContainer}>
                        <View style={styles.inputContainer}>
                            <TextInput 
                              value={email} 
                              onChangeText={(text) => setEmail(text)} 
                              placeholderTextColor={"gray"} 
                              style={[styles.textInput, {width: 270}]} 
                              spellCheck={false}
                              autoCorrect={false}
                              placeholder="Email"
                              keyboardType='email-address'/>
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
                        <TouchableOpacity onPress={() => setShowForgetModal(true)}>
                            <Text style={styles.otherMethodText}>Quên mật khẩu?</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{marginBottom: 30}}>
                        <TouchableOpacity style={styles.loginButton} onPress={signIn}>
                            <Text style={styles.loginTextButton}>Đăng nhập</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{alignItems: 'center', marginTop: 20}} onPress={() => setRegisterModal(true)}>
                            <Text style={styles.otherMethodText}>Chưa có tài khoản?</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Modals */}
                    <Modal animationType='slide' visible={showForgetModal} onRequestClose={() => setShowForgetModal(false)}>
                        <ForgetPasswd email={email} onClose={() => setShowForgetModal(false)}/>
                    </Modal>
                    <Modal animationType='slide' visible={registerModal} onRequestClose={() => setRegisterModal(false)} >
                        <SignUp onClose={() => setRegisterModal(false)}/>
                    </Modal>
                </ScrollView>
            </KeyboardAvoidingView>
        </ImageBackground>
    );
};

export default LoginScreen;

const styles = StyleSheet.create({
    background:{
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        resizeMode:'contain',
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
