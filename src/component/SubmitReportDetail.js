import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ImageBackground } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import province from "../context/BDProvince";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const SubmitReportDetail = ({ onResult, onClose, detailData }) => {
    const [districtSelected, setDistrictSelected] = useState(detailData?.address?.split(', ')[2] || "");
    const [wardSelected, setWardSelected] = useState(detailData?.address?.split(', ')[1] || "");
    const [address, setAddress] = useState(detailData?.address || "");
    const [desc, setDesc] = useState(detailData?.desc || "");
    const [type, setType] = useState(detailData?.type || "");

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
            Alert.alert('Vui lòng nhập đầy đủ thông tin');
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
        <ImageBackground style={styles.container} source={require("../../assets/background.png")}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>

                <TouchableOpacity onPress={() => onClose()}>
                    <MaterialIcons name={"arrow-back"} size={30} color={"#000"} />
                </TouchableOpacity>
                <Text style={styles.title}>Chi tiết báo cáo</Text>
            </View>

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
                style={[styles.input, { height: 60}]}
                placeholder="Số nhà, tên đường,..."
                value={address}
                onChangeText={(text) => setAddress(text)}
            />
            <TextInput
                style={[styles.input, { height: 110}]}
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
        </ImageBackground>
    );
};

export default SubmitReportDetail;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
        justifyContent:'space-between'
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        borderColor: '#ccc',
        borderWidth: 1,
        padding: 10,
        marginBottom: 15,
        borderRadius:10,
        textAlignVertical:'top'
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
        backgroundColor: '#3669a4',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
