import React, { useState, useEffect } from 'react';
import { Alert, View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Button } from 'react-native';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import {jwtDecode} from 'jwt-decode';
import { useCourses } from './hooks/CoursesContext';  // Import the useCourses hook
import API from '../../api/axois';
import DocumentPicker from 'react-native-document-picker';
import { Picker } from '@react-native-picker/picker';

const FilesScreen = () => {
  const router = useRouter();
  const [dateofbirth, setDateOfBirth] = useState<Date | undefined>(undefined);
  const [modalVisible, setModalVisible] = useState(false);
  const [fileName, setFileName] = useState('');
  const [fileDeadline, setFileDeadline] = useState('');
  const [fileToUpload, setFileToUpload] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [fileURL, setFileURL] = useState('');
  const { mycourses } = useCourses();  // Get the courses from context
  const [files, setFiles] = useState<any[]>([]);
const [courses, setmyCourses] = useState<any[]>([]);
  const [courseTag, setCourseTag] = useState('');

  
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
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const filesData: any[] = [];
        // Loop through each course ID and fetch the associated files
        for (const course of mycourses) {
          const courseId = course.courseId; // Use the course ID from context
          const response = await API.get(`/api/user/course/files/${courseId}`);
          if (response.status === 200) {
            const filesForCourse = await response.data;
            filesData.push(...filesForCourse); // Append the files to the array
          } else {
            Alert.alert('Error', `Failed to fetch files for course ${courseId}`);
          }
        }
        setFiles(filesData); // Set all files in state
      } catch (error) {
        Alert.alert('Error', 'An error occurred while fetching files');
      }
    };

    if (mycourses.length > 0) {
      fetchFiles();  // Only fetch files if courses are available in context
    }
  }, [mycourses]);

  const fetchCourses = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'Token not found');
        return;
      }
      
      const decoded: { id: string } | null = jwtDecode<{ id: string }>(token);
      setUserId(decoded?.id ?? null); // Adjust this based on the token structure
      
      const response = await API.get(`/api/user/courses/${decoded?.id}`);
      if ( response.status !== 200) {
        Alert.alert('Error', 'Failed to fetch courses');
        return;
      }
      Alert.alert('Success', 'Courses fetched successfully');
      const data = await response.data;

      setmyCourses(data);
      mycourses.map((course) => {
        console.log(course.courseName);
      }
      );
    } catch (error) {
      Alert.alert('Error', 'An error occurred while fetching courses');
    }
  };
const handlefileDelete = async (fileId: string) => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      Alert.alert('Error', 'Token not found');
      return;
    }
    const response = await API.delete(`/api/file/delete/${fileId}`);
    if (response.status !== 200) {
      Alert.alert('Error', 'Failed to delete file');
      return;
    }
    Alert.alert('Success', 'File deleted successfully');
  } catch (error) {
    Alert.alert('Error', 'An error occurred while deleting file');
  }
}
const handleFileView = (uri: string) => {
  router.push({
    pathname: `/Files/PdfScreen`,
    params: { uri }, // Pass the file URL to the PDF screen
  });
};
const handlefilegenerateflashcards = (fileId: string) => {
  router.push({
    pathname: `/(tabs)/FlashcardsScreen`,
    params: { fileId },
  });
};

  const FileCard = ({ title, uri ,fileDeadline , fileId}: { title: string, uri: string , fileDeadline:string , fileId:string} ) => {
    return (
      <LinearGradient colors={['#1CA7EC', '#1CA7EC']} style={styles.card}>
       
        <View style={styles.cardHeader} >
          <Text style={styles.cardTitle}  onPress={() => router.push("/(tabs)/FlashcardsScreen")}>{title}</Text>
          <Text style={styles.cardTitle} >{fileDeadline.split("T")[0]}</Text>
          
          <View style={styles.iconContainer}>
            <TouchableOpacity onPress={() => handleFileView(uri)}>
            <FontAwesome name="eye" size={20} color="url(#grad)"  />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handlefileDelete(fileId)}>
            <FontAwesome name="trash" size={20} color="url(#grad)" />
            </TouchableOpacity>
          

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
              <View>
                <FlatList
                  style={styles.fileList}
                  data={files} // Adjust this based on the course structure
                  renderItem={({ item }) => (
                    <FileCard fileId={item.fileId}  title={item.fileName} uri={item.fileURL} fileDeadline={item.fileDeadline} />
                  )}
                  keyExtractor={(item, index) => index.toString()}
                  contentContainerStyle={styles.fileList}
                />
              </View>
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
    flexDirection: 'column',
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
    justifyContent: 'space-around',
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
    color: '#000',
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
  },  picker: {
    width: 200,
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 20,
  },
  selectedText: {
    fontSize: 16,
    marginTop: 20,
    color: '#333',
  },
});

export default FilesScreen;

