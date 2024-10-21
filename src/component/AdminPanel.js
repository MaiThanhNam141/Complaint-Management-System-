import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ArticlesManager from '../AdminComponent/ArticlesManager';
import UserManager from '../AdminComponent/UserManager';
import AdminAccount from '../AdminComponent/AdminAccount';

const Tab = createBottomTabNavigator();

const AdminPanel = () => {
    return (
        <Tab.Navigator
            initialRouteName={'Home'}
            tabBarPosition="bottom"
            screenOptions={{
                headerShown: false,
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
            }}
        >

            <Tab.Screen name="Quản lý bài đăng" component={ArticlesManager}
                options={{
                    tabBarIcon: ({ color }) => (
                        <MaterialIcons name="summarize" size={25} color={color} />
                    )
                }} />
            <Tab.Screen name="Quản lý user" component={UserManager}
                options={{
                    tabBarIcon: ({ color }) => (
                        <MaterialIcons name="manage-accounts" size={25} color={color} />
                    )
                }} />
            <Tab.Screen name="Tài khoản" component={AdminAccount}
                options={{
                    tabBarIcon: ({ color }) => (
                        <MaterialIcons name="account-circle" size={25} color={color} />
                    )
                }} />
        </Tab.Navigator>
    );
};

export default AdminPanel;
