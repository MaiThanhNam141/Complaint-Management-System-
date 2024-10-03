import React, { useState, useEffect } from 'react';
import { Agenda } from 'react-native-calendars';
import firestore from '@react-native-firebase/firestore';
import { Alert, View, Text, StyleSheet } from 'react-native';

const RepairAgenda = () => {
  const [items, setItems] = useState({});

  // Hàm để lấy dữ liệu từ Firestore
  const fetchArticles = async () => {
    try {
      const snapshot = await firestore()
        .collection('articles')
        .where('status', 'in', ['Đang xử lí', 'Đã hoàn thành'])
        .get();

      const articles = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      const newItems = {};

      articles.forEach(article => {
        const { title, startRepairDate, completeDate } = article;

        // Chuyển đổi timestamp Firestore thành đối tượng Date
        const startDate = startRepairDate.toDate();
        const endDate = completeDate.toDate();

        // Duyệt qua tất cả các ngày từ startRepairDate đến completeDate
        for (
          let d = new Date(startDate);
          d <= endDate;
          d.setDate(d.getDate() + 1)
        ) {
          const dateString = d.toISOString().split('T')[0]; // Chuyển thành format YYYY-MM-DD

          if (!newItems[dateString]) {
            newItems[dateString] = [];
          }

          // Đánh dấu ngày bắt đầu và ngày kết thúc đặc biệt
          const isStart = d.getTime() === startDate.getTime();
          const isComplete = d.getTime() === endDate.getTime();
          console.log(d.getTime(), startDate.getTime());
          
          // Thêm title của article vào mỗi ngày, cùng với cờ đánh dấu
          newItems[dateString].push({
            name: title,
            height: 50, // Chiều cao của item, có thể tùy chỉnh
            isStart,
            isComplete,
          });
        }
      });

      setItems(newItems);
    } catch (error) {
      Alert.alert('Error fetching data', error.message);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  // Hàm để render các item, với kiểu đặc biệt cho startRepairDate và completeDate
  const renderItem = (item) => (
    <View
      style={[
        styles.itemContainer,
        item.isStart && styles.startItem, // Style đặc biệt cho ngày bắt đầu
        item.isComplete && styles.completeItem, // Style đặc biệt cho ngày kết thúc
      ]}
    >
      <Text>{item.name}</Text>
    </View>
  );

  return (
    <Agenda
      items={items}
      renderItem={renderItem}
      renderEmptyDate={() => (
        <View style={styles.emptyDate}>
          <Text>No events</Text>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    margin: 10,
    padding: 3,
    backgroundColor: 'white',
    borderRadius: 5,
  },
  startItem: {
    backgroundColor: '#4CAF50',
  },
  completeItem: {
    backgroundColor: '#FF5722', 
  },
  emptyDate: {
    margin: 10,
    padding: 10,
  },
});

export default RepairAgenda;
