import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList,Alert } from 'react-native';
import { ProgressBar, RadioButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import Back from '../Back';
import {useRouter} from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
//import { useCourses } from '../../(tabs)/hooks/CoursesContext';
import {jwtDecode} from 'jwt-decode';
import API from '../../../api/axois';
import { Platform } from 'react-native';

const router = useRouter();
const [dateofbirth, setDateOfBirth] = useState<Date | undefined>(undefined);
const [modalVisible, setModalVisible] = useState(false);
const [fileName, setFileName] = useState('');
const [fileDeadline, setFileDeadline] = useState('');
const [fileToUpload, setFileToUpload] = useState(null);
const [showDatePicker, setShowDatePicker] = useState(false);
const [userId, setUserId] = useState<string | null>(null);
const [fileURL, setFileURL] = useState('');
//const { mycourses } = useCourses();  // Get the courses from context
const [files, setFiles] = useState<any[]>([]);
const [courses, setmyCourses] = useState<any[]>([]);
const [courseTag, setCourseTag] = useState('');


// const handleDateChange = (event: any, selectedDate: Date | undefined) => {
//   const currentDate = selectedDate;
//   const todaysDate = new Date();
//   if (currentDate && currentDate > todaysDate) {
//     setFileDeadline(currentDate.toISOString());
//   } else {
//     alert('Please select a future date');
//   }
//   setShowDatePicker(Platform.OS === 'ios');
//   setDateOfBirth(currentDate);
// };
// useEffect(() => {
//   const fetchFiles = async () => {
//     try {
//       const filesData: any[] = [];
//       // Loop through each course ID and fetch the associated files
//       for (const course of mycourses) {
//         const courseId = course.courseId; // Use the course ID from context
//         const response = await API.get(`/api/user/course/files/${courseId}`);
//         if (response.status === 200) {
//           const filesForCourse = await response.data;
//           filesData.push(...filesForCourse); // Append the files to the array
//         } else {
//           Alert.alert('Error', `Failed to fetch files for course ${courseId}`);
//         }
//       }
//       setFiles(filesData); // Set all files in state
//     } catch (error) {
//       Alert.alert('Error', 'An error occurred while fetching files');
//     }
//   };

//   if (mycourses.length > 0) {
//     fetchFiles();  // Only fetch files if courses are available in context
//   }
// }, [mycourses]);

// const fetchCourses = async () => {
//   try {
//     const token = await AsyncStorage.getItem('token');
//     if (!token) {
//       Alert.alert('Error', 'Token not found');
//       return;
//     }
    
//     const decoded: { id: string } | null = jwtDecode<{ id: string }>(token);
//     setUserId(decoded?.id ?? null); // Adjust this based on the token structure
    
//     const response = await API.get(`/api/user/courses/${decoded?.id}`);
//     if ( response.status !== 200) {
//       Alert.alert('Error', 'Failed to fetch courses');
//       return;
//     }
//     Alert.alert('Success', 'Courses fetched successfully');
//     const data = await response.data;

//     setmyCourses(data);
//     mycourses.map((course) => {
//       console.log(course.courseName);
//     }
//     );
//   } catch (error) {
//     Alert.alert('Error', 'An error occurred while fetching courses');
//   }
// };
// const handlegeneratequiz = async (fileId: string) => {
// try {
//   const token = await AsyncStorage.getItem('token');
//   if (!token) {
//     Alert.alert('Error', 'Token not found');
//     return;
//   }
//   const response = await API.post(`/api/file/generateQuiz/${fileId}`,{
//     numOfQuestions: 5,
//     level: "Inermediate"
//   });

//   if (response.status !== 200) {
//     Alert.alert('Error', 'Failed to generate quiz');
//     return;
//   }
//   Alert.alert('Success', 'Quiz generated successfully');
// } catch (error) {
//   Alert.alert('Error', 'An error occurred while deleting file');
// }
// }


export default function QuizScreen() {
  const [selectedOption, setSelectedOption] = useState('A');
  const [checked, setChecked] = useState('A');
  const router = useRouter();

  const options = [
    { id: 'A', label: 'Uruguay' },
    { id: 'B', label: 'Brazil' },
    { id: 'C', label: 'Italy' },
    { id: 'D', label: 'Germany' },
  ];

  const renderOption = ({ item }: { item: { id: string; label: string } }) => (
    <TouchableOpacity
      style={[
        styles.optionContainer,
        checked === item.id && styles.rightoption,
      ]}
      onPress={() => setChecked(item.id)}
    >
      <RadioButton
        value={item.id}
        status={checked === item.id ? 'checked' : 'unchecked'}
        onPress={() => setChecked(item.id)}
      />
      <Text style={styles.optionText}>{item.label}</Text>
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={['#ddf3f5', '#f7f7f7', '#fbfbfb', '#9ad9ea']} style={styles.linearcontainer}> 
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity  onPress={() => router.back}>
            <Icon name="arrow-left" size={24} color="white" style={styles.back} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Question 3/10</Text>
        <Icon name="bookmark" size={24} color="white" />
      </View>
      <View style={styles.maincard}>
      <View style={styles.card}>
        <Text style={styles.questionText}>
          This is a question from the generated quiz{`
          `}what's the right answer?
        </Text>
      </View>
      <ProgressBar progress={0.3} color={'#62D9A2'} style={styles.progressBar} />
      <Text style={styles.timer}>00:12</Text>

      <FlatList
        data={options}
        renderItem={renderOption}
        keyExtractor={(item) => item.id}
        style={styles.optionList}
      />
    </View>
    </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    width: '100%',
    height: '100%',
  },
  header: {
    backgroundColor: '#1CA7EC',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  maincard:{
    marginTop: 10,
    marginBottom: 10,
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#48bbfa',
    width: 300,
    height:550,
    borderRadius: 40,
  },
  card: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 20,
    elevation: 3,
    height: 150,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  questionText: {
    fontSize: 16,
    color: '#333',
  },
  progressBar: {
    marginHorizontal: 20,
    marginTop: 10,
    width: 290,
    height: 6,
    borderRadius: 20,
  },
  timer: {
    alignSelf: 'flex-end',
    paddingRight: 30,
    marginVertical: 5,
    fontSize: 14,
    color: '#fff',
  },
  optionList: {
    marginHorizontal: 20,
    marginTop: 10,
    width: '90%',
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 10,
    borderRadius: 20,
    elevation: 2,
  },
  optionText: {
    fontSize: 16,
    marginLeft: 10,
  },
  rightoption: {
    backgroundColor: '#DFF6E3',
    borderColor: '#62D9A2',
    borderWidth: 1,
  },  
  wrongoption: {
    backgroundColor: '#f09393',
    borderColor: '#c10a0a',
    borderWidth: 1,
  },
  linearcontainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',

  },
  back: {
    color: 'white',
  }
});
