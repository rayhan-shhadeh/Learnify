import React, { useState, useEffect } from "react";
import {
  Alert,
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Button,
  Image
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/FontAwesome5";
import { useRouter } from "expo-router";
import NavBar from "./NavBar";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";
import Back from "./Back";
import { SafeAreaView } from "react-native-safe-area-context";
import { Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import API from "../../api/axois";
import * as DocumentPicker from "expo-document-picker";
import { Picker } from "@react-native-picker/picker";
import { useLocalSearchParams } from "expo-router";
import axios from "axios";
import Header from "./header/Header";

const FilesScreen = () => {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [modalVisible, setModalVisible] = useState(false);
  const [fileName, setFileName] = useState("");
  const [fileDeadline, setFileDeadline] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [files, setFiles] = useState<any[]>([]);
  const [courses, setmyCourses] = useState<any[]>([]);
  const [courseId, setCourseId] = useState(46);
  const [newFile, setNewFile] = useState<FileObject>();
  const [initialDeadline, setInitialDeadline] = useState(
    new Date(new Date().setDate(new Date().getDate() + 14))
  );
  const [uploadStatus, setUploadStatus] = useState(false);
  const [coursesArray, setCoursesArray] = useState([{ id: 1, name: "tala" }]);
  const [selectedFileId, setSelectedFileId] = useState<string>();
  const [searchQuery, setSearchQuery] = useState("");
  const [fetchedFiles, setFetchedFiles] = useState<any[]>([]);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  const [currentFile, setCurrentFile] = useState<{ fileId: string } | null>(
    null
  );
  const [editedFileId, setEditedFileId] = useState("");
  const [sortCriteria, setSortCriteria] = useState<string>("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [fileChoicesVisible, setFileChoicesVisible] = useState(false);
  const sortOptions = [
    { label: <Icon name="sort" size={20} color="#778899" />, value: "" },
    {
      label: <Icon name="sort-alpha-up-alt" size={20} color="#778899" />,
      value: "name-asc",
    },
    {
      label: <Icon name="sort-amount-up-alt" size={20} color="#778899" />,
      value: "deadline-asc",
    },
    {
      label: <Icon name="sort-amount-down-alt" size={20} color="#778899" />,
      value: "deadline-desc",
    },
  ];

  const handleDateChange = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate;
    const todaysDate = new Date();
    if (currentDate && currentDate > todaysDate) {
      setFileDeadline(todaysDate.toISOString());
    } else {
      alert("Please select a future date");
    }
    setShowDatePicker(Platform.OS === "ios");
    setSelectedDate(selectedDate);
    setShowDatePicker(false);
    if (currentDate) {
      setFileDeadline(currentDate.toISOString());
    }
  };
  useEffect(() => {
    const initialize = async () => {
      try {
        // Fetch courses
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          Alert.alert("Error", "Token not found");
          return;
        }
        let userId = null;
        try {
          const decoded: { id: string } | null = jwtDecode<{ id: string }>(
            token
          );
          if (!decoded?.id) {
            Alert.alert("Error", "Invalid token structure");
            return;
          }
          userId = decoded.id;
          setUserId(userId);
        } catch (decodeError) {
          Alert.alert("Error", "Failed to decode token");
          return;
        }
        console.log("User ID:", userId);
        // Fetch user's courses
        const coursesResponse = await API.get(`/api/user/courses/${userId}`);
        if (coursesResponse.status !== 200) {
          Alert.alert("Error", "Failed to fetch courses");
          return;
        }
        const fetchedCourses = coursesResponse.data;
        setmyCourses(fetchedCourses); // Update courses state
        // Map courses to array for Picker
        const coursesArrayRes = fetchedCourses.map((course: any) => ({
          id: course.courseId,
          name: course.courseName,
        }));
        setCoursesArray(coursesArrayRes);
        console.log("Fetched courses:", coursesArrayRes);
        // Fetch files for each course
        const filesData = await Promise.all(
          fetchedCourses.map(async (course: any) => {
            try {
              const fileResponse = await API.get(
                `/api/user/course/files/${course.courseId}`
              );
              if (fileResponse.status === 200) {
                return fileResponse.data;
              } else {
                console.warn(
                  `Failed to fetch files for course ${course.courseId}`
                );
                return [];
              }
            } catch (fileError) {
              console.error(
                `Error fetching files for course ${course.courseId}:`,
                fileError
              );
              return [];
            }
          })
        );
        // Flatten the files array and update state
        setFiles(filesData.flat());
        setFetchedFiles(filesData.flat());
        console.log("Fetched files:", filesData.flat());
      } catch (error) {
        console.error("Initialization error:", error);
        Alert.alert("Error", "An error occurred while initializing data");
      }
    };
    initialize();
  }, []); // Runs on mount only

  const handlefileDelete = async (fileId: string) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Error", "Token not found");
        return;
      }
      const response = await API.delete(`/api/file/delete/${fileId}`);
      if (response.status !== 200) {
        Alert.alert("Error", "Failed to delete file");
        return;
      }
      Alert.alert("Success", "File deleted successfully");
    } catch (error) {
      Alert.alert("Error", "An error occurred while deleting file");
    }
  };
  const handleFileView = (fileId: string) => {
    const activeTab: string = "PDF"; //"PDF" | "Flashcards" | "KeyTerms"
    const passedFileId = fileId;
    router.push({
      pathname: `/Files/PdfScreen`,
      params: { passedFileId, activeTab },
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
    setNewFile: React.Dispatch<React.SetStateAction<FileObject | undefined>>
  ): Promise<void> => {
    try {
      // Step 1: Pick a file
      const pickedFile = await DocumentPicker.getDocumentAsync({
        type: "application/pdf", // Restrict to PDF files
      });
      console.log(pickedFile);
      // Check if the user canceled file selection
      if (pickedFile.canceled) {
        Alert.alert("File Selection Canceled");
        return;
      }
      // Extract the file details from the assets array
      const file = pickedFile.assets[0];
      if (!file) {
        Alert.alert("Error", "No file selected.");
        return;
      }
      const { uri, name, size, mimeType } = file;
      // Step 2: Validate file type and size
      if (mimeType !== "application/pdf") {
        Alert.alert("Invalid File Type", "Please select a valid PDF file.");
        return;
      }
      if (size && size > 5 * 1024 * 1024) {
        // 5 MB limit
        Alert.alert(
          "File Too Large",
          "The selected file exceeds the 5MB size limit."
        );
        return;
      }
      // Handle Android-specific URI format
      let fileUri = uri;
      if (Platform.OS === "android" && uri.startsWith("content://")) {
        fileUri = `file://${decodeURIComponent(uri)}`;
      }
      // Step 3: Create FormData
      const formData = new FormData();
      formData.append("file", {
        uri: fileUri,
        name,
        type: mimeType,
      } as any);
      formData.append("fileName", name);
      formData.append("courseId", courseId);
      formData.append("fileDeadline", fileDeadline);
      // Step 4: Upload the file to the server
      const response = await API.post(`/api/file/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
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
      setSelectedFileId(newFile.id.toString());
      setFileDeadline(fileDeadline);
      console.log(selectedFileId);
      if (!fileName) {
        setFileName(newFile.fileName);
      }
      setUploadStatus(true);
      Alert.alert("Success", "File uploaded successfully!");
    } catch (error: any) {
      // Handle errors gracefully
      console.error("Error uploading file:", error.message || error);
      Alert.alert(
        "Error",
        "An error occurred while uploading the file. Please try again."
      );
    }
  };

  const handleSave = async (fileDeadlineVal: Date): Promise<void> => {
    setModalVisible(false);
    try {
      // Update file details on the server
      const response = await API.put(`/api/file/${selectedFileId}`, {
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
      Alert.alert(
        "Error",
        "An error occurred while saving the file. Please try again."
      );
    }
  };

  const handleInputChange = (value: string) => {
    setSearchQuery(value);
    if (!value) {
      setFiles(fetchedFiles);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      const regex = new RegExp(searchQuery, "i");
      const filteredFiles = fetchedFiles.filter((file) => {
        return regex.test(file.fileName);
      });
      setFiles(filteredFiles);
    } else {
      setFiles(fetchedFiles);
    }
  };

  const handleOpenFileChoices = (fileId: string) => {
    setSelectedFileId(fileId);
    setFileChoicesVisible(true);
  };

  const handleChoiceSelection = (choice: string) => {
    setFileChoicesVisible(false);
    if (choice === "Study") {
      router.push({
        pathname: `/Files/PdfScreen`,
        params: { passedFileId: selectedFileId },
      });
    } else if (choice === "Practice") {
      const passedFileId = selectedFileId;
      router.push({
        pathname: "/(tabs)/StudyFlashcardsScreen",
        params: { passedFileId: passedFileId },
      });
    } else if (choice === "Quiz") {
      router.push({
        pathname: "/(tabs)/quiz/Quiz",
        params: {
          passedFileId: selectedFileId,
          passedIsFromAllFilesPage: "all",
          passedCourseId: "",
        },
      });
    }
  };

  const renderEditFileModal = () => (
    <Modal
      visible={isEditModalVisible}
      transparent={true}
      animationType="slide"
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TextInput
            style={styles.input}
            placeholder="File Name"
            value={newFileName}
            onChangeText={setNewFileName}
          />
          <Button
            title="Save"
            onPress={() =>
              currentFile?.fileId && editFile(currentFile.fileId, newFileName)
            }
          />
          <Button
            title="Cancel"
            color="red"
            onPress={() => setIsEditModalVisible(false)}
          />
        </View>
      </View>
    </Modal>
  );

  const openEditModal = async (fileId: string) => {
    try {
      console.log("Editing file with ID:", fileId);
      const data = await API.get(`/api/file/${fileId}`);
      const fileData = data.data;
      const mappedFile = {
        fileId: fileData.fileId,
        fileName: fileData.courseName,
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

  const editFile = async (fileId: string, newFileName: string) => {
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
      closeEditModal();
      Alert.alert("Success", "File edited successfully");
    } catch (error) {
      console.error("Error editing file:", error);
      Alert.alert("Error", "An error occurred while editing the file");
    }
  };
  const handleSort = (criteria: string) => {
    console.log("criteria is" + criteria);
    setSortCriteria(criteria);
    console.log("Hi from sort");
    const sortedFiles = [...files].sort((a, b) => {
      if (criteria === "deadline-asc") {
        return (
          new Date(a.fileDeadline).getTime() -
          new Date(b.fileDeadline).getTime()
        );
      } else if (criteria === "deadline-desc") {
        return (
          new Date(b.fileDeadline).getTime() -
          new Date(a.fileDeadline).getTime()
        );
      } else if (criteria === "name-asc") {
        return a.fileName.localeCompare(b.fileName);
      }
      return 0;
    });
    console.log(sortedFiles);
    setFiles(sortedFiles);
  };
  const FileCard = ({
    title,
    fileDeadline,
    fileId,
  }: {
    title: string;
    uri: string;
    fileDeadline: string;
    fileId: string;
  }) => {
    console.log("file card" + fileId);
    return (
      <LinearGradient colors={["#1CA7EC", "#1CA7EC"]} style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.filerow}>
            <Text
              style={styles.cardTitle}
              onPress={() => handleFileView(fileId)}
            >
              {title}
            </Text>
            <Text style={styles.deadline}>
              {new Date(fileDeadline).toISOString().split("T")[0]}
            </Text>
          </View>
          <View style={styles.iconContainer}>
            <TouchableOpacity onPress={() => handleOpenFileChoices(fileId)}>
              <FontAwesome
                name="book"
                size={20}
                color="#fff"
                style={styles.icon}
              />
            </TouchableOpacity>
            {/*             
            <TouchableOpacity onPress={() => handleFileView(fileId)}>
            <FontAwesome name="eye" size={20} color="url(#grad)"  />
            </TouchableOpacity>
            */}
            <TouchableOpacity onPress={() => handlefileDelete(fileId)}>
              <FontAwesome
                name="trash"
                size={20}
                color="#fff"
                style={styles.icon}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => openEditModal(fileId)}
              style={styles.icon}
            >
              <FontAwesome name="edit" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    );
  };

  const renderAddFileModal = () => {
    const displayDate = selectedDate
      ? selectedDate.toDateString()
      : initialDeadline.toDateString();
    return (
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
          <View style={styles.modalheadercontainer}>
              <Image
                source={require("../../assets/images/add.png")}
                style={{ width: 27, height: 27, marginRight: 10, marginBottom:16 }}
                resizeMode="contain"
              />
              <Text style={styles.modalTitle}>Add New File</Text>
          </View>

            <Animatable.View animation="fadeInUp" duration={1400}>
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                style={styles.dateInput}
              >
                <Text style={styles.dateText}>{displayDate}</Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={selectedDate || new Date(initialDeadline)}
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
                />
              )}
            </Animatable.View>
            {/* Course Dropdown */}
            <Picker
              selectedValue={courseId}
              onValueChange={(itemValue, itemIndex) => {
                setCourseId(itemValue);
              }}
              style={styles.picker}
            >
              {coursesArray.map((course) => (
                <Picker.Item
                  key={course.id}
                  label={course.name}
                  value={course.id}
                />
              ))}
            </Picker>
            <TouchableOpacity
              style={styles.addFileButton}
              onPress={() =>
                handleUploadFile(
                  courseId.toLocaleString(),
                  new Date(displayDate).toISOString(),
                  setFiles,
                  setNewFile
                )
              }
            >
              <Text style={styles.addButtonText}>Upload File</Text>
            </TouchableOpacity>
            {/* Save Button (Conditional) */}
            <Button
              title="Save"
              onPress={() => {
                handleSave(new Date(displayDate)),
                  setShowDatePicker(false),
                  setFileDeadline(""),
                  setFileName(""),
                  setSelectedDate(undefined),
                  setUploadStatus(false),
                  setModalVisible(false);
              }}
              disabled={!uploadStatus}
            />
            <Button
              title="Cancel"
              color="red"
              onPress={() => {
                setShowDatePicker(false),
                  setFileDeadline(""),
                  setFileName(""),
                  setSelectedDate(undefined),
                  setUploadStatus(false),
                  setModalVisible(false);
              }}
            />
          </View>
        </View>
      </Modal>
    );
  };
  const renderChoicesModal = () => (
    <Modal
      visible={fileChoicesVisible}
      animationType="fade"
      transparent={true}
      onRequestClose={() => setFileChoicesVisible(false)}
    >
      <View style={styles.choiceModalContainer}>
        <View style={styles.choiceModal}>
          <TouchableOpacity
            style={styles.choiceButton}
            onPress={() => handleChoiceSelection("Study")}
          >
            <Text style={styles.choiceButtonText}>Study</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.choiceButton}
            onPress={() => handleChoiceSelection("Practice")}
          >
            <Text style={styles.choiceButtonText}>Practice</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.choiceButton}
            onPress={() => handleChoiceSelection("Quiz")}
          >
            <Text style={styles.choiceButtonText}>Quiz</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setFileChoicesVisible(false)}
          >
            <Text style={styles.closeButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <>
      <View style={{ backgroundColor: "#fff", zIndex: 0 }}>
        <Header />
      </View>
      <View style={styles.header}>
        <Icon name="folder" size={27} color="#778899" />
        <Text style={styles.headerText}> My files</Text>
      </View>
      <View style={styles.container}>
        <TouchableOpacity style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={(value) => {
              setSearchQuery(value);
              handleInputChange(value);
            }}
            placeholder="Search for files"
            returnKeyType="search"
            onSubmitEditing={() => {
              handleSearch();
            }}
          />
        </TouchableOpacity>
        {/* Dropdown Trigger */}
        <TouchableOpacity
          style={styles.dropdownList}
          onPress={() => setShowDropdown(!showDropdown)}
        >
          <Text style={styles.dropdownTriggerText}>
            {sortCriteria ? (
              sortOptions.find((option) => option.value === sortCriteria)?.label
            ) : (
              <Icon name="sort-amount-up-alt" size={20} color="#778899" />
            )}
          </Text>
        </TouchableOpacity>

        {showDropdown && (
          <View style={styles.dropdownList}>
            {sortOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={styles.dropdownItem}
                onPress={() => {
                  setSortCriteria(option.value);
                  setShowDropdown(false); // Close dropdown after selection
                  handleSort(option.value);
                }}
              >
                <Text style={styles.dropdownItemText}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Sort Button */}
        {/* <TouchableOpacity
                onPress={() => handleSort(sortCriteria)}
                disabled={!sortCriteria} // Disable button if no criteria is selected
              >
                <Text>Sort</Text>
              </TouchableOpacity> */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.addButtonText}>Add File</Text>
        </TouchableOpacity>
        {renderAddFileModal()}
        <Animatable.View animation="fadeInUp" delay={200} duration={800}>
          <View style={{ marginBottom: 1500, flex: 1 }}>
            <FlatList
              style={styles.fileList}
              data={files} // Adjust this based on the course structure
              renderItem={({ item }) => (
                <FileCard
                  fileId={item.fileId}
                  title={item.fileName}
                  uri={item.fileURL}
                  fileDeadline={item.fileDeadline}
                />
              )}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={{ paddingBottom: 10 }}
            />
          </View>
        </Animatable.View>
      </View>
      <NavBar />
      {isEditModalVisible && renderEditFileModal()}
      {fileChoicesVisible && renderChoicesModal()}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    zIndex: 1,
    position: "absolute",
    top: 30,
    left: 105,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    backgroundColor: "#fff",
  },
  fileList: {
    paddingBottom: 500,
  },
  card: {
    flex: 1,
    padding: 15,
    borderRadius: 18,
    marginBottom: 10,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: "column",
    justifyContent: "space-between",
  },
  filerow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignContent: "flex-start",
    width: "100%",
    paddingHorizontal: 10,
  },
  addButton: {
    backgroundColor: "#778899",
    padding: 15,
    borderRadius: 18,
    alignItems: "center",
    marginBottom: 10,
    paddingEnd: 10,
  },
  addFileButton: {
    backgroundColor: "#778899",
    padding: 15,
    borderRadius: 18,
    alignItems: "center",
    marginBottom: 10,
    paddingEnd: 10,
    marginTop: 100,
  },

  addButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    //'rgba(0, 0, 0, 0.5)'
    overflow: "hidden",
  },
  modalContent: {
    backgroundColor: "white",
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 18,
    width: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  input: {
    borderWidth: 0.2,
    borderColor: "#ddd",
    borderRadius: 5,
    backgroundColor: "#f6f6f6",
    color: "#000",
    padding: 10,
    marginBottom: 10,
    width: "93%",
    alignSelf: "center",
  },
  deadline: {
    borderWidth: 0.2,
    borderColor: "#ddd",
    borderRadius: 5,
    backgroundColor: "#f6f6f6",
    color: "#000",
    padding: 5,
    marginBottom: 10,

    justifyContent: "flex-end",
  },
  headercontainer: {
    flexDirection: "row",
    fontSize: 40,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: 25,
    left: 140,
  },

  dateInput: {
    height: 40,
    borderColor: "#1CA7EC",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  dateText: {
    color: "#647987",
    fontSize: 14,
    marginVertical: 10,
    marginTop: 10,
  },
  picker: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  selectedText: {
    fontSize: 16,
    marginTop: 20,
    color: "#333",
    marginBottom: 10,
  },
  modalInput: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  sortContainer: {
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 58,
    position: "absolute",
    right: 30,
    top: -10,
    width: 40,
  },
  dropdownTrigger: {
    width: "100%",
    height: 50,
    borderColor: "gray",
    borderWidth: 0.3,
    borderRadius: 20,
    justifyContent: "center",
    marginBottom: 10,
    overflow: "hidden",
    zIndex: 999,
  },
  dropdownTriggerText: {
    fontSize: 16,
    color: "black",
    zIndex: 9999,
  },
  dropdownListText: {
    fontSize: 16,
    color: "black",
    zIndex: 9999,
  },
  dropdownList: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    zIndex: 55,
    width: "18%",
  },
  dropdownItem: {
    padding: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    borderRadius: 17,
    paddingTop: 10,
    marginVertical: 5,
    zIndex: 55,
  },
  dropdownItemText: {
    color: "#000",
    fontSize: 16,
    zIndex: 55,
  },
  // dropdownList: {
  //   backgroundColor: "white",
  //   borderWidth: 1,
  //   borderColor: "gray",
  //   borderRadius: 5,
  //   padding: 8,
  //   zIndex: 88,
  //   marginTop: 5,
  // },
  // dropdownItem: {
  //   padding: 10,
  //   borderBottomWidth: 1,
  //   borderBottomColor: "gray",
  //   zIndex: 99999,
  //   overflow: "hidden",
  // },
  // dropdownItemText: {
  //   fontSize: 16,
  //   color: "black",
  //   zIndex: 999,
  //   overflow: "hidden",
  // },
  modalHeader: { fontSize: 20, fontWeight: "bold", marginBottom: 16 },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    paddingHorizontal: 8,
    marginBottom: 10,
    marginTop: 10,
    width: "80%",
  },
  searchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  searchButton: {
    backgroundColor: "#1CA7EC",
    borderRadius: 10,
    borderBlockColor: "white",
    alignItems: "center",
    marginBottom: 16,
    height: 30,
    width: "80%",
    overflow: "hidden",
    zIndex: 1,
  },
  searchButtonText: { color: "white", fontWeight: "bold", width: "100%" },
  fileItem: {
    padding: 12,
    backgroundColor: "#1CA7EC",
    borderRadius: 5,
    marginVertical: 8,
  },
  fileName: { color: "white", fontSize: 16, fontWeight: "bold" },
  closeButton: {
    backgroundColor: "#DC3545",
    padding: 12,
    borderRadius: 18,
    alignItems: "center",
    marginTop: 10,
  },
  closeButtonText: {
     color: "white", 
     fontWeight: "bold" },
  choiceModalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  choiceModal: {
    width: "80%",
    padding: 16,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  choiceModalHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  choiceButton: {
    width: "100%",
    padding: 12,
    backgroundColor: "#1CA7EC",
    borderRadius: 18,
    marginVertical: 8,
    alignItems: "center",
  },
  choiceButtonText: { color: "white", fontWeight: "bold" ,    fontSize:18
   },
  icon: {
    marginLeft: 10,
    marginRight: 10,
  },
  modalheadercontainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    paddingBlock: 20,
  },

});

export default FilesScreen;
