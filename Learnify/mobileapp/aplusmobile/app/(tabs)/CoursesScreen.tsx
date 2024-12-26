import React, { useState, useEffect } from 'react';
import { Alert, View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Button, ScrollView } from 'react-native';
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
import API from '../../api/axois';
import {useCourses} from './hooks/CoursesContext';
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

const CoursesScreen = () => {
  const { mycourses, setmyCourses, selectedCourseId, setSelectedCourseId } = useCourses();
  const router = useRouter();
  const [dateofbirth, setDateOfBirth] = useState<Date | undefined>(undefined);
  const [modalVisible, setModalVisible] = useState(false);
  const [fileName, setFileName] = useState('');
  const [fileDeadline, setFileDeadline] = useState('');
  const [fileToUpload, setFileToUpload] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [files, setFiles] = useState();
  const [fileURL, setFileURL] = useState('');
  const [courses, setCourses] = useState<any[]>([]); 
  const [userId, setUserId] = useState<string | null>(null);
  const [courseName, setCourseName] = useState('');
  const [courseTag, setCourseTag] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [currentCourse, setCurrentCourse] = useState<{ id: string } | null>(null);
  const [newCourseName, setNewCourseName] = useState('');
  const [newCourseDescription, setNewCourseDescription] = useState('');
  const [newCourseTag, setNewCourseTag] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          Alert.alert('Error', 'Token not found');
          router.push('/(tabs)/auth/signin');
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
        setCourses(data); // Set courses to state
        //Alert.alert('Courses', JSON.stringify(data));
        setmyCourses(data);
        mycourses.map((course) => {
          console.log(course.courseName);
        }
        );
      } catch (error) {
        Alert.alert('Error', 'An error occurred while fetching courses');
      }
    };
    fetchCourses();
    

  }, []) ;
  const handleCourseSelect = (courseId: string) => {
    setSelectedCourseId(courseId);  // Set the selected course ID in the context
    router.push('/(tabs)/FilesScreen');  // Navigate to the files screen when a course is selected
  };
  const addNewCourse = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'Token not found');
        return;
      }
      // if (! newCourseName.trim() ||  ! newCourseDescription.trim() || !newCourseTag.trim()) {
      //   Alert.alert('Error', 'Please fill in all fields');
      //   return;
      // }
      const decoded: { id: string } | null = jwtDecode<{ id: string }>(token);
      setUserId(decoded?.id ?? null); // Adjust this based on the token structure
      const response = await  API.post(`/api/course`, {
          courseName: courseName,
          courseDescription: courseDescription,
          courseTag: courseTag,
          user_: {
            connect: {
              userId: decoded?.id,
            }
          }
      });
      if ( response.status !== 200) {
        Alert.alert('Error', 'Failed to add new course');        
        return;
      }
      Alert.alert('Success', 'New course added successfully');
      const data = await response.data;
      setCourses([...courses, data]); // Add new course to the list of courses
      setmyCourses([...mycourses, data]);
      // setCourses([...courses, { id: Date.now().toString(), title: newCourseName, description: newCourseDescription, tag: newCourseTag }]);
      // setNewCourseName('');
      // setNewCourseDescription('');
      // setNewCourseTag('');
      setModalVisible(false);
    } catch (error) {
      Alert.alert('Error', 'An error occurred while adding new course');
    }
    };
    //addNewCourse();
  const deleteCourse = async (courseId: string) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) { 
        Alert.alert('Error', 'Token not found');
        return;
      }
      const decoded: { id: string } | null = jwtDecode<{ id: string }>(token);
      setUserId(decoded?.id ?? null); // Adjust this based on the token structure
      const response = await  API.delete(`/api/course/${courseId}`);
      if ( response.status !== 200) {
        Alert.alert('Error', 'Failed to delete course');
        return;
      }
      const newCourses = courses.filter((course) => course.id !== courseId);
      setCourses(newCourses);
      setCourses((prevCourses) => prevCourses.filter(course => course.id !== courseId));
    } catch (error) {
      Alert.alert('Error', 'An error occurred while deleting course');
    }
    Alert.alert('Deleted', 'Course deleted successfully');
 
  };

const openEditModal = () => {
  setIsEditModalVisible(true);
};

const closeEditModal = () => {
  setIsEditModalVisible(false);
  setCurrentCourse(null);
};
  const editCourse = async (courseId: string, newCourseName: string, newCourseDescription: string, newCourseTag: string) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'Token not found');
        return;
      }
      const decoded: { id: string } | null = jwtDecode<{ id: string }>(token);
      setUserId(decoded?.id ?? null); // Adjust this based on the token structure
      const response = await API.put(`/api/course/${courseId}`, {
          courseName: newCourseName,
          courseDescription: newCourseDescription,
          courseTag: newCourseTag,
          user_: {
            connect: {
              userId: decoded?.id,
            }
          }
        });
      if (response.status !== 200) {
        Alert.alert('Error', 'Failed to edit course');
        return;
      }
      const newCourses = courses.map((course) => {
        if (course.id === courseId) {
          return {
            id: course.id,
            title: newCourseName,
            description: newCourseDescription,
            tag: newCourseTag,
          };
        }
        return course;
      }
      );
      setCourses(newCourses);
      closeEditModal();
    } catch (error) {
      Alert.alert('Error', 'An error occurred while editing course');
    }
    Alert.alert('Edited', 'Course edited successfully');
  }


  const FileCard = ({ title, description, tag , courseId}: { title: string, description: string , tag: string, courseId: string }) => {
    return (
      <LinearGradient colors={['#1CA7EC', '#1CA7EC']} style={styles.card}>
        <View style={styles.cardHeader} >
          <Text style={styles.cardTitle}  onPress={() => router.push("/(tabs)/FlashcardsScreen")}>{title}</Text>
          <Text style={styles.cardDescription}>{description}</Text>
          <Text style={styles.cardTag}>{tag}</Text>
          <View style={styles.iconContainer}>
          <TouchableOpacity onPress={openEditModal}>
            <FontAwesome name="edit" size={20} color="url(#grad)" />
            {/* <Button title="Edit Course" onPress={() =>{openEditModal}}/> */}
            </TouchableOpacity>            
            <TouchableOpacity onPress={() => deleteCourse(courseId)}>
            <FontAwesome name="trash" size={20} color="url(#grad)"  />
            </TouchableOpacity>

          </View>
        </View>
      </LinearGradient>
    );
  };

  const renderAddFileModal = () => {

    return (
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalheadercontainer}>
            <Icon name="plus" size={24} color="#1CA7EC"  />
            <Text style={styles.modalTitle}>Add New Course</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Course Name"
              value={courseName}
              onChangeText={setCourseName}
            />
                        <TextInput
              style={styles.input}
              placeholder="Course Description"
              value={courseDescription}
              onChangeText={setCourseDescription}
            />
            <TextInput
              style={styles.input}
              placeholder="Course Tag"
              value={courseTag}
              onChangeText={setCourseTag}
            />

            <Button title="Add Course" onPress={addNewCourse}/>
            <Button title="Cancel" color="red" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    );
  };

const renderEditModal = () => {
  return (
    <Modal visible={isEditModalVisible} transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalheadercontainer}>
          <Icon name="plus" size={24} color="#1CA7EC"  />
          <Text style={styles.modalTitle}>edit  Course</Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Course Name"
            value={newCourseName}
            onChangeText={setNewCourseName}
          />
            <TextInput
            style={styles.input}
            placeholder="Course Description"
            value={newCourseDescription}
            onChangeText={setNewCourseDescription}
          />
          <TextInput
            style={styles.input}
            placeholder="Course Tag"
            value={newCourseTag}
            onChangeText={setNewCourseTag}
          />

          <Button title="edit Course" onPress={() => currentCourse?.id && editCourse(currentCourse.id, newCourseName, newCourseDescription, newCourseTag)} />
          <Button title="Cancel" color="red" onPress={() =>setIsEditModalVisible(false)} />
        </View>
      </View>
    </Modal>
  );
};


  return (
    <>
          <LinearGradient colors={['#f7f7f7','#fbfbfb', '#9ad9ea']}  >
          <ScrollView>
            <TouchableOpacity style={styles.notificationButton}>
            <Back title={''} onBackPress={() => {}} />
              <MaterialCommunityIcons name="bell-outline" size={24} color="#111517" />
            </TouchableOpacity>
            <View style={styles.container}>
              <View style={styles.headercontainer}>
                <Icon name="list" size={27} color="#778899" />
                <Text style={styles.header}>  My Courses</Text>
              </View>
              <Animatable.View animation="fadeInUp" delay={200} duration={800} >
                <FlatList style={styles.fileList} 
                  data={courses} // Adjust this based on the course structure
                  
                  renderItem={({ item }) => (
                    <FileCard
                    title={item.courseName} 
                    tag={item.courseTag} 
                    description={item.courseDescription} 
                    courseId={item.courseId}
                     />
                  )}
                  keyExtractor={(item, index) => index.toString()}
                  contentContainerStyle={styles.fileList}
                />
              </Animatable.View>

              <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
                <Text style={styles.addButtonText}>Add a new Course</Text>
              </TouchableOpacity>
              {renderAddFileModal()}
              {renderEditModal()}
            </View>
            </ScrollView>
          </LinearGradient>
        <NavBar />
  
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    paddingLeft: 20,
    paddingRight: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    justifyContent: 'center',
    paddingLeft: 10,
  },
  fileList: {
    //flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,

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
    justifyContent: 'space-between',
    width: 100,
    paddingBlock: 10,
  },
  addButton: {
    backgroundColor: '#778899',
    padding: 15,
    borderRadius: 18,
    alignItems: 'center',
    marginBottom: 50,
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
    color: '#073152',
    
  },
  headercontainer: {
    flexDirection: 'row',
    fontSize: 40,
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 90,
    paddingVertical: 10,
  },
  modalheadercontainer:{
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
paddingBlock:20,
  },
  notificationButton: {
    flex: 1,
    zIndex: 1,
    position: 'relative',
    justifyContent:'space-between',
    alignItems:'center',
    flexDirection:'row',
    top: 19,
    paddingRight: 20,
    left: 20,
    marginBottom: 20,
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
  cardDescription: {
    color: '#ccf9e3',
    fontSize: 14,
    marginTop: 5,

  },
  cardTag: {
    color: '#242424',
    fontSize: 12,
    marginTop: 5,
    fontWeight: 'bold',
  },
  card: {
    flex: 1,
    padding: 15,
    borderRadius: 40,
    marginBottom: 10,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    height: 150,
  },
});

export default CoursesScreen;

