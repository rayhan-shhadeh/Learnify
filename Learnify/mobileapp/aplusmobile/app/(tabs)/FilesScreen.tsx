import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Button } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import NavBar from './NavBar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import Back from './Back'
import { SafeAreaView } from 'react-native-safe-area-context';
import { Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const files = [
  { id: '1', title: 'File 1', uri: 'file:///path/to/your/file2.pdf' },
  { id: '2', title: 'File 2', uri: 'file:///path/to/your/file2.pdf' },
  { id: '3', title: 'File 3', uri: 'file:///path/to/your/file3.pdf' },
];

const randomGradient = (): [string, string, ...string[]] => {
  const colors: [string, string, ...string[]][] = [
    ['#4c669f', '#3b5998', '#192f6a'],
    ['#ffffff', '#5F83B1'],
    ['#21277B', '#9AD9EA'],
    ['#9AD9EA', '#006A67'],
    ['#92e1ff', '#4682b4'],
    ['#5f9ea0', '#ffffff'],
    ['#778899', '#5F83B1'],
    ['#708090', '#5F83B1'],
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

const FilesScreen = () => {
  const router = useRouter();
  const [dateofbirth, setDateOfBirth] = useState<Date | undefined>(undefined);
  const [modalVisible, setModalVisible] = useState(false);
  const [fileName, setFileName] = useState('');
  const [fileDeadline, setFileDeadline] = useState('');
  const [courseTag, setCourseTag] = useState('');
  const [fileToUpload, setFileToUpload] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChange = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate;
    const todaysDate = new Date();
    if (currentDate && currentDate > todaysDate) {
      setFileDeadline(currentDate.toISOString());
    } else {
      alert('Please select a future date');
    }
    setShowDatePicker(Platform.OS === 'ios');
    setDateOfBirth(currentDate);
  };

  const FileCard = ({ title, uri }: { title: string, uri: string }) => {
    return (
      <LinearGradient colors={['#1CA7EC', '#1CA7EC']} style={styles.card}>
        <View style={styles.cardHeader} >
          <Text style={styles.cardTitle}  onPress={() => router.push("/(tabs)/FlashcardsScreen")}>{title}</Text>
          <View style={styles.iconContainer}>
            <FontAwesome name="eye" size={20} color="url(#grad)"  />
            <FontAwesome name="edit" size={20} color="url(#grad)" />
            <FontAwesome name="trash" size={20} color="url(#grad)" />
            {/* <svg width="0" height="0">
              <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#1ca7ec', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#1f2f98', stopOpacity: 1 }} />
              </linearGradient>
            </svg> */}
          </View>
        </View>
      </LinearGradient>
    );
  };

  const renderAddFileModal = () => {
    const displayDate = dateofbirth ? dateofbirth.toDateString() : 'Select Date';

    return (
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New File</Text>
            <TextInput
              style={styles.input}
              placeholder="File Name"
              value={fileName}
              onChangeText={setFileName}
            />
            <View>
              <Text style={styles.dateText}>  File Deadline:</Text>
            </View>
            <Animatable.View animation="fadeInUp" duration={1400}>
              <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateInput}>
                <Text style={styles.dateText}>{displayDate}</Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={dateofbirth || new Date()}
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
                />
              )}
            </Animatable.View>
            <TextInput
              style={styles.input}
              placeholder="Course Tag"
              value={courseTag}
              onChangeText={setCourseTag}
            />
            <Button title="Upload File" onPress={() => {/* handle file upload */}} />
            <Button title="Add File" onPress={() => setModalVisible(false)} />
            <Button title="Cancel" color="red" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <>
      <SafeAreaView style={{ flex: 1 , backgroundColor: '#f5f5f5' }}>
          <LinearGradient colors={['#f7f7f7','#fbfbfb', '#9ad9ea']}  >
            <TouchableOpacity style={styles.notificationButton}>
              <MaterialCommunityIcons name="bell-outline" size={24} color="#111517" />
            </TouchableOpacity>
            <View style={styles.container}>
              <View style={styles.headercontainer}>
                <Back title={''} onBackPress={() => {}} />
                <Icon name="folder" size={27} color="#778899" />
                <Text style={styles.header}>  My files</Text>
              </View>
              <Animatable.View animation="fadeInUp" delay={200} duration={800}>
                <FlatList
                  data={files}
                  renderItem={({ item }) => <FileCard title={item.title} uri={item.uri} />}
                  keyExtractor={(item) => item.id}
                  contentContainerStyle={styles.fileList}
                />
              </Animatable.View>
              <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
                <Text style={styles.addButtonText}>Add File</Text>
              </TouchableOpacity>
              {renderAddFileModal()}
            </View>
          </LinearGradient>
        <NavBar />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    justifyContent: 'center',
    paddingLeft: 10,
  },
  fileList: {
    flexGrow: 1,
  },
  card: {
    flex: 1,
    padding: 15,
    borderRadius: 18,
    marginBottom: 10,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 100,
  },
  addButton: {
    backgroundColor: '#778899',
    padding: 15,
    borderRadius: 18,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    //'rgba(0, 0, 0, 0.5)'
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 18,
    width: '80%',
    marginHorizontal: '10%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  headercontainer: {
    flexDirection: 'row',
    fontSize: 40,
  },
  notificationButton: {
    flex: 1,
    zIndex: 1,
    padding: 8,
    position: 'absolute',
    top: 16,
    right: 16,
  },
  back: {
    position: 'absolute',
    left: 16,
  },
  dateInput: {
    height: 40,
    borderColor: '#1CA7EC',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  dateText: {
    color: '#647987',
    fontSize: 14,
  },
});

export default FilesScreen;

