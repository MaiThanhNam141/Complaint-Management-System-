import React, { useEffect, useState } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import firestore from '@react-native-firebase/firestore';
import PostsList from './PostsList';

const Tab = createMaterialTopTabNavigator();

const ArticlesManager = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const articlesRef = firestore().collection('articles');
                let query = articlesRef.orderBy('id', 'desc');

                const articles = await query.get();
                const newPosts = articles.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

                setPosts((prevPosts) => [...prevPosts, ...newPosts]);
            } catch (error) {
                console.error(error);
            }
        };
        fetchPosts();
    }, []);

    return (
        <Tab.Navigator
            screenOptions={{
                tabBarScrollEnabled: true,
                tabBarLabelStyle: { fontSize: 12 },
                tabBarItemStyle: { width: 100 },
                tabBarIndicatorStyle: { backgroundColor: '#007bff' },
            }}
        >
            <Tab.Screen name="Tất cả">
                {() => <PostsList posts={posts} status={null} />}
            </Tab.Screen>
            <Tab.Screen name="Chưa duyệt">
                {() => <PostsList posts={posts} status="Chưa duyệt" />}
            </Tab.Screen>
            <Tab.Screen name="Đang kiểm tra">
                {() => <PostsList posts={posts} status="Đang kiểm tra" />}
            </Tab.Screen>
            <Tab.Screen name="Chờ xử lí">
                {() => <PostsList posts={posts} status="Chờ xử lí" />}
            </Tab.Screen>
            <Tab.Screen name="Đang xử lí">
                {() => <PostsList posts={posts} status="Đang xử lí" />}
            </Tab.Screen>
            <Tab.Screen name="Đã hoàn thành">
                {() => <PostsList posts={posts} status="Đã hoàn thành" />}
            </Tab.Screen>
            <Tab.Screen name="Từ chối">
                {() => <PostsList posts={posts} status="Từ chối" />}
            </Tab.Screen>
        </Tab.Navigator>
    );
};

export default ArticlesManager;
