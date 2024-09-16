import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import province from "../context/BDProvince";

const SubmitReportDetail = ({ onResult, onClose }) => {
    const [districtSelected, setDistrictSelected] = useState('');
    const [wardSelected, setWardSelected] = useState('');
    const [address, setAddress] = useState('');
    const [desc, setDesc] = useState('');
    const [type, setType] = useState('');

    const data = [
        { id: 0, name: 'Khác' },
        { id: 1, name: 'Giao thông' },
        { id: 2, name: 'Môi trường' },
        { id: 3, name: 'Cấp - Thoát nước' },
        { id: 4, name: 'Chiếu sáng' },
        { id: 5, name: 'Trật tự đô thị' },
        { id: 6, name: 'Điện lực' },
    ];

    const handleResult = () => {
        const newAddress = address.trim();
        if (
            districtSelected === '' ||
            wardSelected === '' ||
            newAddress === '' ||
            desc === '' ||
            type === ''
        ) {
            alert('Vui lòng nhập đầy đủ thông tin');
            return;
        }
        const result = { district: districtSelected, ward: wardSelected, newAddress, desc, type };
        onResult(result);
        onClose();
    };

    const getDistricts = () => {
        return province.map((district) => (
            <Picker.Item key={district.code} label={district.name} value={district.name} />
        ));
    };

    const getWards = (districtName) => {
        const selectedDistrict = province.find((district) => district.name === districtName);
        if (selectedDistrict) {
            return selectedDistrict.wards.map((ward) => (
                <Picker.Item key={ward.code} label={ward.name} value={ward.name} />
            ));
        } else {
            return <Picker.Item label="Chọn phường/xã" value="" />;
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Chi tiết báo cáo</Text>

            <Text style={styles.label}>Quận/Huyện:</Text>
            <Picker
                selectedValue={districtSelected}
                onValueChange={(itemValue) => setDistrictSelected(itemValue)}
            >
                <Picker.Item label="Chọn quận/huyện" value="" />
                {getDistricts()}
            </Picker>

            <Text style={styles.label}>Phường/Xã:</Text>
            <Picker
                selectedValue={wardSelected}
                onValueChange={(itemValue) => setWardSelected(itemValue)}
                enabled={districtSelected !== ''}
            >
                <Picker.Item label="Chọn phường/xã" value="" />
                {getWards(districtSelected)}
            </Picker>

            <TextInput
                style={styles.input}
                placeholder="Số nhà, tên đường,..."
                value={address}
                onChangeText={(text) => setAddress(text)}
            />
            <TextInput
                style={styles.input}
                placeholder="Mô tả chi tiết sự cố"
                value={desc}
                onChangeText={(text) => setDesc(text)}
                multiline={true}
                numberOfLines={4}
            />

            <Text style={styles.label}>Danh mục báo cáo:</Text>
            <Picker
                selectedValue={type}
                onValueChange={(itemValue) => setType(itemValue)}
            >
                <Picker.Item label="Chọn danh mục" value="" />
                {data.map((item) => (
                    <Picker.Item key={item.id} label={item.name} value={item.name} />
                ))}
            </Picker>

            <TouchableOpacity style={styles.button} onPress={handleResult}>
                <Text style={styles.buttonText}>Lưu</Text>
            </TouchableOpacity>
        </View>
    );
};

export default SubmitReportDetail;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        padding: 10,
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        marginBottom: 10,
    },
    picker: {
        width: '100%',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
});
