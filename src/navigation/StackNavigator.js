import React, { useContext } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from '../screen/HomeScreen'
import ProfileScreen from'../screen/ProfileScreen'
import LoginScreen from "../screen/LoginScreen";
import SearchScreen from "../screen/SearchScreen";
import { UserContext } from "../context/UserContext";
import Report from "../screen/Report";
import PostType from "../component/PostType";
import PostDetailsModal from "../component/PostDetailsModal";
import CalendarSchedule from "../screen/CalendarSchedule";
import Comment from "../component/Comment";
import About from "../component/About";

const Stack = createStackNavigator()

const MainStackNavigator = () =>{
    return(
        <Stack.Navigator
            initialRouteName="homescreen"
            screenOptions={{
                headerStyle:{ backgroundColor:"#91c4f8" },
                headerShown:false,
                gestureEnabled: true,
                gestureDirection:"horizontal",
            }}>
            <Stack.Screen name="homescreen" component={HomeScreen}/>
            <Stack.Screen name="posttype" component={PostType}/>
            <Stack.Screen name="postdetail" component={PostDetailsModal}/>
            <Stack.Screen name="comment" component={Comment}/>
            
        </Stack.Navigator>
    )
}


const ProfileStackNavigator = () =>{
    const { userExist } = useContext(UserContext);

    return(
        <Stack.Navigator 
            initialRouteName="loginscreen"
            screenOptions={{
                headerStyle: {backgroundColor: "#91c4f8"},
                headerShown: false,
                gestureEnabled: true,
                gestureDirection:"horizontal",
            }}>
            {userExist ? (
                <Stack.Screen name="profilescreen" component={ProfileScreen} />
            ) : (
                <Stack.Screen name="loginscreen" component={LoginScreen} />
            )}
            <Stack.Screen name="about" component={About} />
        </Stack.Navigator>
    )
}

const SearchStackNavigator = () => {
    return(
        <Stack.Navigator 
            initialRouteName="search"
            screenOptions={{
                headerStyle:{ backgroundColor:"#91c4f8" },
                headerShown:false,
                gestureEnabled: true,
                gestureDirection:"horizontal",
            }}>
                <Stack.Screen name="search" component={SearchScreen} />
        </Stack.Navigator>
    )
}

const CalendarScheduleStackNavigator = () => {
    return(
        <Stack.Navigator 
            initialRouteName="calendar"
            screenOptions={{
                headerStyle:{ backgroundColor:"#91c4f8" },
                headerShown:false,
                gestureEnabled: true,
                gestureDirection:"horizontal",
            }}>
                <Stack.Screen name="calendar" component={CalendarSchedule} /> 
                
        </Stack.Navigator>
    )
}

const AddReportStackNavigator = () => {
    return(
        <Stack.Navigator 
            initialRouteName="addreport"
            screenOptions={{
                headerStyle:{ backgroundColor:"#91c4f8" },
                headerShown:false,
                gestureEnabled: true,
                gestureDirection:"horizontal",
            }}>
                <Stack.Screen name="addreport" component={Report} /> 
                
        </Stack.Navigator>
    )
}

export  {MainStackNavigator, ProfileStackNavigator, SearchStackNavigator, CalendarScheduleStackNavigator, AddReportStackNavigator}