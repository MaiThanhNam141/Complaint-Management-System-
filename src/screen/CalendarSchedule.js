import React, { useState, useEffect } from 'react';
import { Agenda } from 'react-native-calendars';
import firestore from '@react-native-firebase/firestore';
import { Alert, TouchableOpacity, View, Text, StyleSheet, Linking } from 'react-native';

const CalendarSchedule = () => {
  const [items, setItems] = useState({});
  const [articles, setArticles] = useState(null);

  // Hàm lấy dữ liệu từ Firestore
  const fetchArticles = async () => {
    try {
      const snapshot = await firestore()
        .collection('articles')
        .where('status', 'in', ['Đang xử lí', 'Đã hoàn thành'])
        .get();

      // Trả về danh sách articles từ Firestore
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      Alert.alert('Error fetching data', error.message);
      throw new Error(error.message);
    }
  };

  // Hàm để chuyển đổi articles thành items cho Agenda
  const processArticlesToAgendaItems = (articles) => {
    const newItems = {};

    articles.forEach(article => {
      const { title, startRepairDate, completeDate, responseUnit, locate } = article;

      // Chuyển timestamp thành đối tượng Date chỉ với phần ngày
      const startDate = new Date(startRepairDate.toDate().setHours(0, 0, 0, 0));
      const endDate = new Date(completeDate.toDate().setHours(0, 0, 0, 0));
      let order = 1;

      // Duyệt qua tất cả các ngày từ startRepairDate đến completeDate
      for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1), order++) {
        const dateString = d.toISOString().split('T')[0];

        if (!newItems[dateString]) {
          newItems[dateString] = [];
        }

        // Đánh dấu ngày bắt đầu và ngày kết thúc đặc biệt
        const isStart = d.getTime() === startDate.getTime();
        const isComplete = d.getTime() === endDate.getTime();

        newItems[dateString].push({
          order: order,
          name: title,
          height: 50,
          isStart,
          isComplete,
          responseUnit,
          locate, // Thêm locate vào item
        });
      }
    });

    return newItems;
  };

  useEffect(() => {
    const loadArticles = async () => {
      if (!articles) { // Kiểm tra xem đã có articles trong state chưa
        try {
          const fetchedArticles = await fetchArticles();
          setArticles(fetchedArticles); // Lưu articles vào state
          const agendaItems = processArticlesToAgendaItems(fetchedArticles);
          setItems(agendaItems);
        } catch (error) {
          console.error(error);
        }
      }
    };

    loadArticles();
  }, [articles]);

  // Hàm mở Google Maps từ tọa độ
  const openMap = async (latitude, longitude) => {
    const googleMapsAppURL = `comgooglemaps://?q=${latitude},${longitude}`; // URL để mở trong app Google Maps
    const googleMapsWebURL = `https://www.google.com/maps?q=${latitude},${longitude}`; // URL để mở trên website

    try {
      const isGoogleMapsAppInstalled = await Linking.canOpenURL(googleMapsAppURL);

      if (isGoogleMapsAppInstalled) {
        await Linking.openURL(googleMapsAppURL);
      } else {
        await Linking.openURL(googleMapsWebURL);
      }
    } catch (error) {
      Alert.alert('Error', 'Không thể mở Google Maps');
    }
  };

  const renderItem = (item) => (
    <TouchableOpacity
      onPress={() => item?.locate && openMap(item.locate.latitude, item.locate.longitude)}
      style={[
        styles.itemContainer,
        item.isStart && styles.startItem,
        item.isComplete && styles.completeItem,
      ]}
    >
      <Text style={{ fontStyle: 'italic' }}>
        <Text style={{ fontWeight: '600', fontStyle: 'normal' }}>{item.name}</Text>
        {` - ngày giải quyết thứ ${item.order}\nĐơn vị chịu trách nhiệm: ${item.responseUnit}`}
      </Text>
    </TouchableOpacity>
  );


  return (
    <Agenda
      items={items}
      renderItem={renderItem}
      renderEmptyDate={() => (
        <View style={styles.emptyDate}>
          <Text>Hiện chưa có công việc nào đang diễn ra</Text>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    margin: 5,
    padding: 5,
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

export default CalendarSchedule;
