import React from 'react';
import { Text, View, StyleSheet, ImageBackground, ScrollView } from 'react-native';

const About = () => {
    return (
        <ImageBackground style={styles.container} source={require("../../assets/background.png")}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.h1}>Hệ thống QUẢN LÍ SỰ CỐ tỉnh Bình Dương</Text>
                <View>
                    <Text style={styles.h2}>1. Về hệ thống</Text>
                    <View style={{ marginLeft: 15}}>
                        <Text style={styles.normalText}>Hệ thống tiếp nhận và xử lí các vấn đề về đô thị cho người dân trên địa bàn tỉnh Bình Dương. Hoạt động liên tục 24 giờ/ngày và 7 ngày trong tuần để tiếp nhận, phản ánh, kiến nghị của cá nhân, tổ chức.</Text>
                        <Text style={styles.normalText}>Sử dụng hệ thống QUẢN LÍ SỰ CỐ, người dân có thể: theo dõi đuộc quá trình xử lí các phản ánh, kiến nghị của mình; nhận được thông báo về kết quả xử lí; xem lịch xử lí; đối chiếu thực tế và tiếp tục phản ánh, kiến nghị chưa được xử lí hoặc chưa đạt chất lượng.</Text>
                    </View>
                    <Text style={styles.h2}>2. Phương thức liên hệ</Text>
                    <View>
                        <Text style={[styles.normalText, { marginLeft: 15}]}>Để gửi phản ánh, kiến nghị đến hệ thống QUẢN LÍ SỰ CỐ tỉnh Bình Dương, người dân có thể sử dụng các phương thức sau:</Text>
                        <View style={{ marginLeft: 15}}>
                            <Text style={styles.h3}>• Ứng dụng QUẢN LÍ SỰ CỐ</Text>
                            <Text style={[styles.normalText, { paddingLeft:15}]}>Truy cập AppStore hoặc Cửa hàng Play để tải ứng dụng Quản lí sự cố</Text>
                            <Text style={styles.h3}>• Tổng đài 1111</Text>
                            <Text style={[styles.normalText, { paddingLeft:15}]}>Gọi điện đến Tổng đài 1111 (điện thoại bàn bấm 1111, điện thoại di động bấm 0274 - 1111)</Text>
                            <Text style={styles.h3}>• Cổng thông tin điện tử</Text>
                            <Text style={[styles.normalText, { paddingLeft:15}]}>Truy cập Trang thông tin điện tử <Text style={styles.linkTetxt}>quanlisuco.binhduong.gov.vn</Text></Text>
                            <Text style={styles.h3}>• Hộp thư điện tử</Text>
                            <Text style={[styles.normalText, { paddingLeft:15}]}>Gửi phản ánh, kiến nghị đến hộp thư điện tử <Text style={styles.linkTetxt}>quanlisuco@binhduong.gov.vn</Text></Text>
                            <Text style={styles.h3}>• Facebook</Text>
                            <Text style={[styles.normalText, { paddingLeft:15}]}>Truy cập Fanpage: QUẢN LÍ SỰ CỐ tỉnh Bình Dương <Text style={styles.linkTetxt}>fb.com/websiteQuanlisucoBinhDuong</Text></Text>
                            <Text style={styles.h3}>• Zalo</Text>
                            <Text style={[styles.normalText, { paddingLeft:15}]}>Kênh liên lạc chính thức trên Zalo <Text style={styles.linkTetxt}>QUAN LI SU CO BINH DUONG</Text></Text>
                        </View>
                    </View>
                    <Text style={styles.h2}>3. Một số lưu ý, yêu cầu khi gửi phản ánh, kiến nghị</Text>
                    <View>
                        <Text style={styles.normalText}>Để hệ thống hoạt động hiệu quả; tiếp nhận và xử lí nhanh, chính xác cần lưu ý nhưng yêu cầu sau:</Text>
                        <View>
                            <Text style={styles.h3}>• Một số lưu ý</Text>
                            <View style={{ marginLeft: 15}}>
                                <Text style={styles.normalText}>Các phản ánh, kiến nghị qua Hệ thống QUẢN LÍ SỰ CỐ sử dụng ngôn từ tiếng Việt. Hình ảnh, âm thanh, đoạn phim ngắn thể hiện rõ nội dung phản ánh, kiến nghị.</Text>
                                <Text style={styles.normalText}>Cá nhân, tổ chức phản ánh, kiến nghị cung cấp thông tin trung thực và chịu trách nhiệm trước pháp luật về những nội dung do mình cung cấp cho Hệ thống QUẢN LÍ SỰ CỐ.</Text>
                            </View>
                            <Text style={styles.h3}>• Nghiêm cấm các hành vi</Text>
                            <View style={{ marginLeft: 15}}>
                                <Text style={styles.normalText}>Cung cấp thông tin sai sự thật, mang tính chất hoang báo; sử dụng từ ngữ thô tục, có nội dung bôi nhọ, xúc phạm đến người khác; quấy rối qua điện thoại, gây bức xúc, làm ảnh hưởng, gián đoạn công việc của cán bộ, công chức, viên chức tiếp nhận thông tin và hoạt động của Hệ thống QUẢN LÍ SỰ CỐ.</Text>
                                <Text style={styles.normalText}>Các hành vi nêu trên tùy mức độ nghiệm trọng sẽ bị xem xét, xử lí hoặc chuyển cơ quan chức năng xử lí theo quy định của pháp luật</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </ImageBackground>
    );
};

export default About;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    scrollContent: {
        paddingBottom: 100,
        paddingHorizontal: 15
    },
    h1: {
        fontSize: 26,
        color: '#000',
        fontWeight: 'bold',
        alignSelf: 'center',
        textAlign: 'center',
        marginVertical: 10
    },
    h2: {
        fontSize: 18,
        color: '#000',
        fontWeight: '700',
        textAlign: 'justify'
    },
    h3: {
        fontSize: 16,
        fontStyle: 'italic', 
    },
    normalText: {
        fontSize: 14,
        textAlign: 'justify',
        
    },
    linkTetxt: {
        color: "#3669a4"
    }
});