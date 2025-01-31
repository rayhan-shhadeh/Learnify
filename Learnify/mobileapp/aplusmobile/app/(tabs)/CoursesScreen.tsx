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
  ScrollView,
  Image,
} from "react-native";
import Header from "../(tabs)/header/Header";
import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/FontAwesome";
import { useRouter } from "expo-router";
import NavBar from "./NavBar";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";
import Back from "./Back";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import API from "../../api/axois";
import { useLocalSearchParams } from "expo-router";
const randomGradient = (): [string, string, ...string[]] => {
  const colors: [string, string, ...string[]][] = [
    ["#4c669f", "#3b5998", "#192f6a"],
    ["#ffffff", "#5F83B1"],
    ["#21277B", "#9AD9EA"],
    ["#9AD9EA", "#006A67"],
    ["#92e1ff", "#4682b4"],
    ["#5f9ea0", "#ffffff"],
    ["#778899", "#5F83B1"],
    ["#708090", "#5F83B1"],
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

const CoursesScreen = () => {
  const [mycourses, setmyCourses] = useState<any[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const router = useRouter();
  const [dateofbirth, setDateOfBirth] = useState<Date | undefined>(undefined);
  const [modalVisible, setModalVisible] = useState(false);
  const [fileName, setFileName] = useState("");
  const [fileDeadline, setFileDeadline] = useState("");
  const [fileToUpload, setFileToUpload] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [files, setFiles] = useState();
  const [fileURL, setFileURL] = useState("");
  const [courses, setCourses] = useState<any[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [courseName, setCourseName] = useState("");
  const [courseTag, setCourseTag] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [currentCourse, setCurrentCourse] = useState<{ id: string } | null>(
    null
  );
  const [newCourseName, setNewCourseName] = useState("");
  const [newCourseDescription, setNewCourseDescription] = useState("");
  const [newCourseTag, setNewCourseTag] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [fetchedCourses, setFetchedCourses] = useState<
    { name: string; description: string; tag: string; id: string }[]
  >([]);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  //const [passedCourseTitle,setPassedCourseTitle]  =useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          Alert.alert("Error", "Token not found");
          router.push("/(tabs)/auth/signin");
          return;
        }
        const decoded: { id: string } | null = jwtDecode<{ id: string }>(token);
        setUserId(decoded?.id ?? null);
        const response = await API.get(`/api/user/courses/${decoded?.id}`);
        if (response.status !== 200) {
          Alert.alert("Error", "Failed to fetch courses");
          return;
        }
        const data = await response.data;
        const mappedCourses = data.map((course: any) => ({
          id: course.courseId,
          name: course.courseName,
          description: course.courseDescription,
          tag: course.courseTag,
        }));
        setCourses(mappedCourses);
        setFetchedCourses(mappedCourses);
        setmyCourses(mappedCourses);
      } catch (error) {
        Alert.alert("Error", "An error occurred while fetching courses");
      }
    };
    fetchCourses();
  }, []);

  const addNewCourse = async () => {
    try {
      if (!courseName) {
        Alert.alert("Error", "name is required");
        return;
      }
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Error", "Token not found");
        return;
      }
      const decoded: { id: string } | null = jwtDecode<{ id: string }>(token);
      setUserId(decoded?.id ?? null); // Adjust this based on the token structure
      console.log("user Id : " + userId);
      const response = await API.post(`/api/course`, {
        courseName: courseName,
        courseDescription: courseDescription,
        courseTag: courseTag,
        user_: {
          connect: {
            userId: decoded?.id,
          },
        },
      });

      Alert.alert("Success", "New course added successfully");
      const data = await response.data;
      setCourses([...courses, data]); // Add new course to the list of courses
      setmyCourses([...mycourses, data]);
    } catch (error) {
      Alert.alert("Error", "An error occurred while adding new course");
    }
  };

  const handleCancelAdd = () => {
    setCourseName("");
    setCourseTag("");
    setCourseDescription("");
    setModalVisible(false);
  };
  const deleteCourse = async (courseId: string) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Error", "Token not found");
        return;
      }
      const decoded: { id: string } | null = jwtDecode<{ id: string }>(token);
      setUserId(decoded?.id ?? null); // Adjust this based on the token structure
      const response = await API.delete(`/api/course/${courseId}`);
      if (response.status !== 200) {
        Alert.alert("Error", "Failed to delete course");
        return;
      }
      const newCourses = courses.filter((course) => course.id !== courseId);
      setCourses(newCourses);
      setCourses((prevCourses) =>
        prevCourses.filter((course) => course.id !== courseId)
      );
    } catch (error) {
      Alert.alert("Error", "An error occurred while deleting course");
    }
    Alert.alert("Deleted", "Course deleted successfully");
  };

  const openEditModal = async (courseId: string) => {
    setIsEditModalVisible(true);
    const courseData = await API.get(`/api/course/${courseId}`);
    setCurrentCourse(courseData.data);
    const mappedCourse = {
      id: courseData.data.courseId,
      title: courseData.data.courseName,
      description: courseData.data.courseDescription,
      tag: courseData.data.courseTag,
    };
    setCurrentCourse(mappedCourse);
    setNewCourseName(courseData.data.courseName);
    setNewCourseDescription(courseData.data.courseDescription);
    setNewCourseTag(courseData.data.courseTag);
  };

  const closeEditModal = () => {
    setIsEditModalVisible(false);
    setCurrentCourse(null);
  };

  const editCourse = async (
    courseId: string,
    newCourseName: string,
    newCourseDescription: string,
    newCourseTag: string
  ) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Error", "Token not found");
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
          },
        },
      });
      if (response.status !== 200) {
        Alert.alert("Error", "Failed to edit course");
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
      });
      setCourses(newCourses);
      closeEditModal();
    } catch (error) {
      Alert.alert("Error", "An error occurred while editing course");
    }
    Alert.alert("Edited", "Course edited successfully");
  };
  const debounce = (func: Function, delay: number) => {
    let timer: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };
  const handleSearch = debounce(() => {
    if (searchQuery.trim()) {
      const regex = new RegExp(searchQuery, "i");
      const filteredCourses = fetchedCourses.filter(
        (course) => regex.test(course.name) || regex.test(course.description)
      );
      setCourses(filteredCourses);
    } else {
      setCourses(fetchedCourses);
    }
  }, 300);
  const handleSearch1 = () => {
    if (searchQuery.trim()) {
      const regex = new RegExp(searchQuery, "i");
      const filteredCourses = fetchedCourses.filter(
        (course) => regex.test(course.name) || regex.test(course.description)
      );
      setCourses(filteredCourses);
    }
  };

  const handleInputChange = (value: string) => {
    setSearchQuery(value);
    handleSearch1();
  };
  const handleFilterSelect = (filter: string) => {
    setSelectedFilter(filter);
    setShowDropdown(false);
    if (filter) {
      const regex = new RegExp(filter, "i");
      const filtered = courses.filter((course) => regex.test(course.tag));
      setCourses(filtered);
    } else {
      setCourses(fetchedCourses);
    }
  };
  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  const handleClearFilter = () => {
    setSelectedFilter("");
    setCourses(fetchedCourses);
  };

  const tags = [...new Set(courses.map((course) => course.tag))];

  const FileCard = ({
    title,
    description,
    tag,
    courseId,
  }: {
    title: string;
    description: string;
    tag: string;
    courseId: string;
  }) => {
    const passedCourseId = courseId;
    return (
      <LinearGradient colors={["#1CA7EC", "#1CA7EC"]} style={styles.card}>
        <View style={styles.cardHeader}>
          <Text
            style={styles.cardTitle}
            onPress={() =>
              router.push({
                pathname: "/(tabs)/CourseFilesScreen",
                params: { title, passedCourseId },
              })
            }
          >
            {title}
          </Text>
          <Text style={styles.cardDescription}>{description}</Text>
          <Text style={styles.cardTag}>{tag}</Text>
          <View style={styles.iconContainer}>
            <TouchableOpacity
              onPress={() => {
                console.log("llaaaaaaa"), openEditModal(courseId);
              }}
            >
              <FontAwesome name="edit" size={20} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteCourse(courseId)}>
              <FontAwesome name="trash" size={20} color="#000" />
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
              <Image
                source={require("../../assets/images/add.png")}
                style={{ width: 27, height: 27, marginRight: 10 }}
                resizeMode="contain"
              />
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
            <Button
              title="Save"
              onPress={() => {
                addNewCourse();
                handleCancelAdd();
              }}
            />
            <Button
              title="Cancel"
              color="red"
              onPress={() => handleCancelAdd()}
            />
          </View>
        </View>
      </Modal>
    );
  };

  const renderEditModal = () => {
    return (
      <Modal
        visible={isEditModalVisible}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalheadercontainer}>
              <Image
                source={require("../../assets/images/edit.png")}
                style={{ width: 27, height: 27, marginRight: 10 }}
                resizeMode="contain"
              />
              <Text style={styles.modalTitle}>Edit Course</Text>
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
            <Button
              title="Save"
              onPress={() =>
                currentCourse?.id &&
                editCourse(
                  currentCourse.id,
                  newCourseName,
                  newCourseDescription,
                  newCourseTag
                )
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
  };

  return (
    <>
      <Header />

      <View style={styles.container}>
        <View style={styles.headercontainer}>
          <Image
            source={require("../../assets/images/folder-unscreen.gif")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.header}> My Courses</Text>
        </View>
        <View style={styles.searchBar}>
          <TextInput
            style={styles.input}
            value={searchQuery}
            onChangeText={(value) => {
              setSearchQuery(value);
              handleInputChange(value);
            }}
            placeholder="Search for courses"
            returnKeyType="search"
            onSubmitEditing={() => {
              handleSearch();
            }}
          />
          {/* Dropdown Button */}
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={toggleDropdown}
          >
            <Image
              source={require("../../assets/images/filter.png")}
              style={{
                width: 20,
                height: 20,
                backgroundColor: "transparent",
              }}
            />
          </TouchableOpacity>
        </View>
        <View>
          {/* "X" Button to Clear Filter */}
          {selectedFilter ? (
            <TouchableOpacity
              style={styles.clearFilterButton}
              onPress={handleClearFilter}
            >
              <Text style={styles.clearFilterText}>X   {selectedFilter}</Text>
            </TouchableOpacity>
          ) : null}
          {/* Dropdown List */}
          {showDropdown && (
            <View style={styles.dropdownList}>
              {tags.map((tag) => (
                <TouchableOpacity
                  key={tag}
                  style={styles.dropdownItem}
                  onPress={() => handleFilterSelect(tag)}
                >
                  <Text style={styles.dropdownItemText}>{tag}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
        <FlatList
          style={styles.fileList}
          data={courses} // Adjust this based on the course structure
          renderItem={({ item }) => (
            <FileCard
              title={item.name}
              tag={item.tag}
              description={item.description}
              courseId={item.id}
            />
          )}
          keyExtractor={(item, index) => index.toString()}
          numColumns={2}
          key={"_"}
          columnWrapperStyle={{
            justifyContent: "space-between", // Space out the items evenly in a row
            marginBottom: 10,

            paddingBlock: 10,
          }}
          showsVerticalScrollIndicator={true} // Optional: Hide the scrollbar for a cleaner look
        />
      </View>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>Add a new Course</Text>
      </TouchableOpacity>
      {renderAddFileModal()}
      {renderEditModal()}
      <NavBar />
    </>
  );
};

const styles = StyleSheet.create({
  logo: {
    width: 40,
    height: 40,
  },
  container: {
    backgroundColor: "#f5f5f5",
    paddingLeft: 20,
    paddingRight: 20,
    marginBottom: "70%",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    justifyContent: "center",
    paddingLeft: 10,
  },
  fileList: {
    display: "flex",
    shadowColor: "#000",
    shadowOffset: { width: 3, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    marginBottom: 35,
  },
  cardHeader: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 100,
    paddingBlock: 10,
  },
  addButton: {
    backgroundColor: "#778899",
    padding: 15,
    borderRadius: 18,
    alignItems: "center",
    marginBottom: 80,
    marginHorizontal: 20,
    bottom: 10,
    position: "absolute",
    alignSelf: "center",
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
    backgroundColor: "rgba(219, 223, 227, 0.5)",
    //'rgba(0, 0, 0, 0.5)'
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 18,
    width: "80%",
    marginHorizontal: "10%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 15,
    color: "#073152",
    marginBottom: 10,
  },
  headercontainer: {
    flexDirection: "row",
    fontSize: 40,
    justifyContent: "center",
    alignItems: "center",
    paddingRight: 90,
    paddingVertical: 5,
    position: "absolute",
    left: 100,
    top: -60,
    zIndex: 1,
  },
  modalheadercontainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    paddingBlock: 20,
  },

  back: {
    position: "absolute",
    left: 16,
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
  },
  cardDescription: {
    color: "#ccf9e3",
    fontSize: 10,
    marginTop: 5,
  },
  cardTag: {
    color: "#242424",
    fontSize: 12,
    marginTop: 5,
    fontWeight: "bold",
  },
  card: {
    flex: 1,
    padding: 15,
    borderRadius: 30,
    marginBottom: 10,
    justifyContent: "space-evenly",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 5,
    height: 150,
    width: 150,
    marginLeft: 4,
    marginRight: 4,
  },
  searchBar: {
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
    padding: 5,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  searchText: {
    color: "#888",
  },
  dropdownButton: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: "#1CA7EC",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    width: 40,
    alignSelf: "flex-end",
    justifyContent: "space-between",
  },
  dropdownButtonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  dropdownList: {
    backgroundColor: "#fff",
    borderRadius: 5,
    elevation: 5,
    marginBottom: 10,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  dropdownItemText: {
    fontSize: 16,
    color: "#333",
  },
  clearButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    color: "#fff",
  },
  clearButtonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    flex: 1,
  },
  courseItem: {
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
    marginBottom: 10,
    elevation: 2,
  },
  courseName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  courseTag: {
    fontSize: 14,
    color: "#666",
  },
  clearFilterButton: {
    marginTop:10 ,
    backgroundColor: "#FF80B0",
    padding: 8,
    borderRadius: 5,
  },
  clearFilterText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CoursesScreen;