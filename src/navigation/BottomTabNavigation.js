import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useContext, useState, useEffect } from "react";
import { MainStackNavigator, ProfileStackNavigator, SearchStackNavigator, AddReportStackNavigator, CalendarScheduleStackNavigator } from "./StackNavigator";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { UserContext } from '../context/UserContext';
import { View, Keyboard } from 'react-native';
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";

const Tab = createBottomTabNavigator();

const BottomTabNavigation = () => {
  const { loading } = useContext(UserContext);

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);  // Bàn phím được mở
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);  // Bàn phím được đóng
    });

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  if (loading){
    return null
  }

  const getTabBarStyle = (route) => {
    const routeName = getFocusedRouteNameFromRoute(route) ?? "";
    if (routeName.toLowerCase() === "adminpanel") {
      return { display: "none" };
    }
    return {};
  };

  return (
    <Tab.Navigator
      initialRouteName={'Trang chủ'}
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: "#3669a4",
        tabBarInactiveTintColor: "#737373",
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          backgroundColor: "#fff",
          overflow: "visible",
          height:50,
          ...getTabBarStyle(route)
        }
      })}
    >
      <Tab.Screen name='Trang chủ' component={MainStackNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="home" size={25} color={color} />
          )
        }}
      />
      <Tab.Screen name='Tìm kiếm' component={SearchStackNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="search" size={25} color={color} />
          )
        }}
      />
      <Tab.Screen name='Báo cáo' component={AddReportStackNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            !isKeyboardVisible && (
              <View style={{
                width: 77,
                height: 77,
                borderRadius: 100,
                backgroundColor: '#fff',
                justifyContent: 'center',
                alignItems: 'center',
                borderColor: '#3669a4',
                borderWidth: 2,
              }}>
                <MaterialIcons name="warning" size={35} color={color} />
              </View>
            )
          )
        }}
      />
      <Tab.Screen name='Lịch sửa chữa' component={CalendarScheduleStackNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="list-alt" size={25} color={color} />
          )
        }}
      />
      <Tab.Screen name='Hồ sơ' component={ProfileStackNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="account-circle" size={25} color={color} />
          )
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigation;
