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
import * as DocumentPicker from 'expo-document-picker';
import { Picker } from '@react-native-picker/picker';
import { useLocalSearchParams } from 'expo-router';
import axios from 'axios';

const courseFilesScreen = () => {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [modalVisible, setModalVisible] = useState(false);
  const [fileName, setFileName] = useState('');
  const [fileDeadline, setFileDeadline] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const { mycourses} = useCourses();
  const [files, setFiles] = useState<any[]>([]);
  const [courses, setmyCourses] = useState<any[]>([]);
  const [courseId,setCourseId] = useState(46);
  const [newFile, setNewFile] = useState();
  const [initialDeadline,setInitialDeadline] = useState(new Date(new Date().setDate(new Date().getDate() + 14)));
  const [uploadStatus,setUploadStatus]=useState(false);
  const [coursesArray,setCoursesArray]=useState([{id:1,name:'tala'}]);
  const [selectedFileId,setSelectedFileId]=useState<bigint>(BigInt(0));
  const [searchQuery, setSearchQuery] = useState("");
  const [fetchedFiles,setFetchedFiles]= useState<any[]>([]);
  const [isEditModalVisible,setIsEditModalVisible]= useState(false);
  const [newFileName, setNewFileName]= useState('');
  const [currentFile,setCurrentFile] = useState<{ fileId: string } | null>(null)
  const [editedFileId,setEditedFileId]= useState('');
  const { title,passedCourseId } = useLocalSearchParams();
  const [sortCriteria, setSortCriteria] = useState<string>("");
  const handleDateChange = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate;
    const todaysDate = new Date();
    if (currentDate && currentDate > todaysDate) {
      setFileDeadline(todaysDate.toISOString());
    } else {
      alert('Please select a future date');
    }
    setShowDatePicker(Platform.OS === 'ios');
    setSelectedDate(selectedDate);
    setShowDatePicker(false)
    if(currentDate){
    setFileDeadline(currentDate.toISOString());
    }
  };
  
  useEffect(() => {
    const initialize = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          Alert.alert('Error', 'Token not found');
          return;
        }
        let userId = null;
        try {
          const decoded: { id: string } | null = jwtDecode<{ id: string }>(token);
          if (!decoded?.id) {
            Alert.alert('Error', 'Invalid token structure');
            return;
          }
          userId = decoded.id;
          setUserId(userId);
        } catch (decodeError) {
          Alert.alert('Error', 'Failed to decode token');
          return;
        }
        console.log('User ID:', userId);
        // Fetch user's courses
        const coursesResponse = await API.get(`/api/user/courses/${userId}`);
        if (coursesResponse.status !== 200) {
          Alert.alert('Error', 'Failed to fetch courses');
          return;
        }

        const fetchedCourses = coursesResponse.data;
        setmyCourses(fetchedCourses);
        const coursesArrayRes = fetchedCourses.map((course: any) => ({
          id: course.courseId,
          name: course.courseName,
        }));
        setCoursesArray(coursesArrayRes);
        console.log('Fetched courses:', coursesArrayRes);

        console.log("hi from course files page : "+ passedCourseId);
        const coursefilesResponse = await API.get(`api/user/course/files/${passedCourseId}`);
        if (coursefilesResponse.status !== 200) {
          Alert.alert('Error', 'Failed to fetch files');
          return;
        }
        const fetchedCourseFiles = coursefilesResponse.data;
        setFiles(fetchedCourseFiles.flat());
        setFetchedFiles(fetchedCourseFiles.flat());
        console.log('Fetched files:', fetchedCourseFiles.flat());
      } catch (error) {
        console.error('Initialization error:', error);
        Alert.alert('Error', 'An error occurred while initializing data');
      }
    };
    initialize();
  }, [courseId]);
    
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
    params: { uri } 
  });
};

interface FileObject {
  id: bigint;
  fileName: string;
  fileDeadline: Date;
  fileURL: string;
}

const handleUploadFile = async (
  courseId: string,
  fileDeadline: string,
  setFiles: React.Dispatch<React.SetStateAction<FileObject[]>>,
  setNewFile: React.Dispatch<React.SetStateAction<FileObject | null>>,
): Promise<void> => {
  try {
    // Step 1: Pick a file
    const pickedFile = await DocumentPicker.getDocumentAsync({
      type: 'application/pdf', // Restrict to PDF files
    });
    console.log(pickedFile);
    // Check if the user canceled file selection
    if (pickedFile.canceled) {
      Alert.alert('File Selection Canceled');
      return;
    }
    // Extract the file details from the assets array
    const file = pickedFile.assets[0];
    if (!file) {
      Alert.alert('Error', 'No file selected.');
      return;
    }
    const { uri, name, size, mimeType } = file;
    // Step 2: Validate file type and size
    if (mimeType !== 'application/pdf') {
      Alert.alert('Invalid File Type', 'Please select a valid PDF file.');
      return;
    }
    if (size && size > 5 * 1024 * 1024) { // 5 MB limit
      Alert.alert('File Too Large', 'The selected file exceeds the 5MB size limit.');
      return;
    }
    // Handle Android-specific URI format
    let fileUri = uri;
    if (Platform.OS === 'android' && uri.startsWith('content://')) {
      fileUri = `file://${decodeURIComponent(uri)}`;
    }
    // Step 3: Create FormData
    const formData = new FormData();
    formData.append('file', {
      uri: fileUri,
      name,
      type: mimeType,
    } as any);
    formData.append('fileName', name);
    formData.append('courseId', passedCourseId.toString()); // Convert bigint to string
    formData.append('fileDeadline', fileDeadline);
    // Step 4: Upload the file to the server
    const response = await API.post(
      `/api/file/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    // Step 5: Handle response and update state
    const newFile: FileObject = {
      id: BigInt(response.data.fileId), // Ensure the ID is in bigint format
      fileName: name,
      fileDeadline: new Date(fileDeadline),
      fileURL: response.data.fileURL,
    };
    // Update state with the new file
    setFiles((prevFiles) => [...prevFiles, newFile]);
    setNewFile(newFile);
    setSelectedFileId(newFile.id);
    setFileDeadline(fileDeadline);
    console.log(selectedFileId);
    if(!fileName){
      setFileName(newFile.fileName)
    }
    setUploadStatus(true);
    Alert.alert('Success', 'File uploaded successfully!');
  } catch (error: any) {
    // Handle errors gracefully
    console.error('Error uploading file:', error.message || error);
    Alert.alert('Error', 'An error occurred while uploading the file. Please try again.');
  }
};

const handleSave = async (fileDeadlineVal: Date): Promise<void> => {
  setModalVisible(false);
  try {
    // Update file details on the server
    const response =await API.put(`/api/file/${selectedFileId}`, {
      fileName: fileName, // Ensure the correct field names
      fileDeadline: new Date(fileDeadlineVal).toISOString(),
    });
    setNewFile(response.data);
    // Update the file in the local state
    setFiles((prevFiles) =>
      prevFiles.map((file) =>
        String(file.id) === String(selectedFileId) ? { ...newFile } : file
      )
    );
    // Optional: If you need to update a fetchedFiles state
    setFiles((prevFiles) =>
      prevFiles.map((file) =>
        String(file.id) === String(selectedFileId) ? { ...newFile } : file
      )
    );
    Alert.alert("Success", "File details updated successfully!");
  } catch (error) {
    console.error("Error saving file after upload:", error);
    Alert.alert("Error", "An error occurred while saving the file. Please try again.");
  }
}

const handleInputChange = (value:string) => {
  setSearchQuery(value);
  if (!value) {
    setFiles(fetchedFiles);
  }
};

const handleSearch = () => {
  if (searchQuery.trim()) {
    const regex = new RegExp(searchQuery, "i");
    const filteredFiles  = fetchedFiles.filter((file) => {
    return (
      regex.test(file.fileName )
    );
    });
    setFiles(filteredFiles);
  } else {
    setFiles(fetchedFiles);
  }
};
    const openEditModal = async (fileId: string) => {
      try {
        console.log("Editing file with ID:", fileId);
        const data = await API.get(`/api/file/${fileId}`);
        const fileData = data.data;
        const mappedFile ={
          fileId: fileData.fileId,
          fileName : fileData.courseName,
        };
        setCurrentFile(mappedFile);
        setNewFileName(fileData.fileName);
        setEditedFileId(fileId);
        setIsEditModalVisible(true);
      } catch (error) {
        console.error("Error fetching file details for editing:", error);
        Alert.alert("Error", "An error occurred while fetching file details.");
      }
    };
    
    const closeEditModal = () => {
  setIsEditModalVisible(false);
  setCurrentFile(null);
  };
  
const editFile = async (
  fileId: string,
  newFileName: string,
) => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      Alert.alert("Error", "Token not found");
      return;
    }
    const decoded: { id: string } | null = jwtDecode<{ id: string }>(token);
    setUserId(decoded?.id ?? null);
    // Send PUT request to update the file
    const response = await API.put(`/api/file/${fileId}`, {
      fileName: newFileName,
    });
    if (response.status !== 200) {
      Alert.alert("Error", "Failed to edit file");
      return;
    }
    // Update the file locally in the state
    const updatedFiles = files.map((file) => {
      if (file.id === fileId) {
        return {
          ...file,
          fileName: newFileName,
        };
      }
      return file;
    });
    setFiles(updatedFiles);
    closeEditModal(); // Close modal or UI after successful update
    Alert.alert("Success", "File edited successfully");
  } catch (error) {
    console.error("Error editing file:", error);
    Alert.alert("Error", "An error occurred while editing the file");
  }
};

const handleSort = (criteria:string) => {
  console.log("criteria is"+criteria);
  setSortCriteria(criteria);
  console.log("gi from sort");
  const sortedFiles = [...files].sort((a, b) => {
    if (criteria === "deadline-asc") {
      return new Date(a.fileDeadline).getTime() - new Date(b.fileDeadline).getTime(); 
    } else if (criteria === "deadline-desc") {
      return new Date(b.fileDeadline).getTime() - new Date(a.fileDeadline).getTime();
    } else if (criteria === "name-asc") {
      return a.fileName.localeCompare(b.fileName); 
    }
    return 0;
  });
  console.log(sortedFiles);
  setFiles(sortedFiles);
  };

  const FileCard = ({ title, uri ,fileDeadline , fileId}: { title: string, uri: string , fileDeadline:string , fileId:string} ) => {
    console.log("file card"+fileId);
    return (
    
      <LinearGradient colors={['#1CA7EC', '#1CA7EC']} style={styles.card}>
       
        <View style={styles.cardHeader} >
          <Text style={styles.cardTitle}  onPress={() => router.push("/(tabs)/FlashcardsScreen")}>{title}</Text>
          <Text style={styles.cardTitle} >{new Date(fileDeadline).toISOString().split("T")[0]}</Text>
          
          <View style={styles.iconContainer}>
            <TouchableOpacity onPress={() => handleFileView(uri)}>
            <FontAwesome name="eye" size={20} color="url(#grad)"  />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handlefileDelete(fileId)}>
            <FontAwesome name="trash" size={20} color="url(#grad)" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => openEditModal(fileId)}>
                  <FontAwesome name="edit" size={20} color="#000" />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    );
  };

  const renderAddFileModal = () => {
    const displayDate = selectedDate ? selectedDate.toDateString() :initialDeadline.toDateString();
    return (
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>File Details</Text>
            <TextInput
              style={styles.input}
              placeholder="File Name"
              value={fileName}
              onChangeText={setFileName}
            />
            <View>
              <Text style={styles.dateText}>  File Deadline</Text>
            </View>
            <Animatable.View animation="fadeInUp" duration={1400}>
              <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateInput}>
                <Text style={styles.dateText}>{displayDate}</Text>
              </TouchableOpacity>
              {showDatePicker&& (
                <DateTimePicker
                  value={selectedDate || new Date(initialDeadline) }
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
                />
              )}
            </Animatable.View>
          {/* Course Dropdown */}
          <Picker
            selectedValue={courseId}
            onValueChange={(itemValue, itemIndex) => setCourseId(itemValue)}
            style={styles.picker}
          >
            {
            coursesArray.map((course) => (
              <Picker.Item key={course.id} label={course.name} value={course.id} />
            ))
            }
          </Picker>
            <Button title="Upload File" onPress={() => handleUploadFile(courseId,new Date(displayDate).toISOString(),setFiles, setNewFile )} />
          {/* Save Button (Conditional) */}
          <Button
            title="Save"
            onPress={() => {handleSave(new Date(displayDate)),setShowDatePicker(false),setFileDeadline(''),setFileName(''),setSelectedDate(undefined),setUploadStatus(false),setModalVisible(false)}}
            disabled={!uploadStatus}
          />
            <Button title="Cancel" color="red" onPress={() => {setShowDatePicker(false),setFileDeadline(''),setFileName(''),setSelectedDate(undefined),setUploadStatus(false),setModalVisible(false)}} />
          </View>
        </View>
      </Modal>
    );
  };
  const renderEditFileModal = () => (
    <Modal visible={isEditModalVisible} transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TextInput
            style={styles.input}
            placeholder="File Name"
            value={newFileName}
            onChangeText={setNewFileName}
          />
          <Button
            title="Save Changes"
            onPress={() =>
              currentFile?.fileId && editFile(currentFile.fileId, newFileName)
            }
          />
          <Button title="Cancel" color="red" onPress={() => setIsEditModalVisible(false)} />
        </View>
      </View>
    </Modal>
  );
  
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
                <Text style={styles.header}>{title +" "}files</Text>
              </View>
              <input
        type="text"
        value={searchQuery}
        onChange={(e) => handleInputChange(e.target.value)}
        placeholder="Search for files"
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSearch();
        }}
      />
                <View style={styles.sortContainer}>
                  <Picker
                    selectedValue={sortCriteria}
                    onValueChange={(itemValue) => setSortCriteria(itemValue)}
                    style={styles.picker}
                  >
                    <Picker.Item label="Sort By" value="" />
                    <Picker.Item label="Name (A-Z)" value="name-asc" />
                    <Picker.Item label="Deadline (Soonest First)" value="deadline-asc" />
                    <Picker.Item label="Deadline (Latest First)" value="deadline-desc" />
                  </Picker>
                  <Button
                    title="Sort"
                    onPress={() => handleSort(sortCriteria)}
                    disabled={!sortCriteria} // Disable button if no criteria is selected
                  />
                </View>
      
              <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
                <Text style={styles.addButtonText}>Add File</Text>
              </TouchableOpacity>
              {renderAddFileModal()}
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
            </View>
          </LinearGradient>
        <NavBar />
      </SafeAreaView>
      {isEditModalVisible && renderEditFileModal()}
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
  modalInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: 10,
    paddingHorizontal: 20,
  }
  
});

export default courseFilesScreen;

