import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ArticlesManager from '../AdminComponent/ArticlesManager';
import UserManager from '../AdminComponent/UserManager';

const Tab = createBottomTabNavigator();

const AdminPanel = ({ navigation }) => {
    return (
        <Tab.Navigator
            initialRouteName={'Quản lý bài đăng'}
            screenOptions={{
                headerShown: true,
                tabBarShowLabel: true,
                tabBarActiveTintColor: "#3669a4",
                tabBarInactiveTintColor: "#737373",
                tabBarHideOnKeyboard: true,
                tabBarStyle: {
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10,
                    overflow: "hidden",
                    backgroundColor: "#fff",
                    height: 49,
                },
                // Thêm nút back ở header
                headerLeft: () => (
                    <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 15 }}>
                        <MaterialIcons name="arrow-back" size={25} color="#3669a4" />
                    </TouchableOpacity>
                ),
            }}
        >
            <Tab.Screen
                name="Quản lý bài đăng"
                component={ArticlesManager}
                options={{
                    tabBarIcon: ({ color }) => (
                        <MaterialIcons name="summarize" size={25} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Quản lý user"
                component={UserManager}
                options={{
                    tabBarIcon: ({ color }) => (
                        <MaterialIcons name="manage-accounts" size={25} color={color} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

export default AdminPanel;
