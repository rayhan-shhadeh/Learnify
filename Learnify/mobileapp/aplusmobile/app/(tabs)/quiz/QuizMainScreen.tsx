import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import NavBar from "../../(tabs)/NavBar";
import { ProgressBar } from "react-native-paper";
import axios from "axios";
import { useRouter } from "expo-router";
import API from "../../../api/axois";
import { useLocalSearchParams } from "expo-router";
import Icon from "react-native-vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import Header from "../../(tabs)/header/Header";
import * as Animatable from "react-native-animatable";
export default function QuizScreen() {
  const router = useRouter();
  const [isCourseModalVisible, setCourseModalVisible] = useState(false);
  const [isFileModalVisible, setFileModalVisible] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [files, setFiles] = useState<{ id: string; name: string }[]>([]);
  const [quizData, setQuizData] = useState<any[]>([]);
  const [username, setUsername] = useState<any>();
  const [lastQuiz, setLastQuiz] = useState<{
    title: string;
    successRate: number;
  } | null>(null);

  useEffect(() => {
    const initialize = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          Alert.alert("Error", "Token not found");
          router.push("/(tabs)/auth/signin");
          return;
        }
        const decoded: { id: string } | null = jwtDecode<{ id: string }>(token);
        const id = decoded.id;
        setUserId(id);

        const userData = await API.get(`/api/users/getme/${id}`);
        setUsername(userData.data.data.username);
        const response = await API.get(`/api/user/courses/${decoded?.id}`);
        if (response.status !== 200) {
          //Alert.alert("Error", "Failed to fetch courses");
          return;
        }
        const data = response.data;
        const mappedCourses = data.map((course: any) => ({
          id: course.courseId,
          name: course.courseName,
          description: course.courseDescription,
          tag: course.courseTag,
        }));
        setCourses(mappedCourses);
        const quizzes = await API.get(`/api/quiz/history/${id}`);
        if (response.status === 200) {
          const data = quizzes.data;
          if (data.quizzes && Array.isArray(data.quizzes)) {
            const mappedQuizzes = data.quizzes.map((quiz: any) => ({
              id: quiz.quizId,
              title: quiz.quizTitle,
              description: quiz.quizDescription,
              color: ["#1f2f98", "#7bd5f5"],
              successRate: quiz.score,
            }));
            setQuizData(mappedQuizzes);
            setLastQuiz(mappedQuizzes[0]);
            console.log(mappedQuizzes[0]);
          }
        }
      } catch (error) {
        //Alert.alert("Error", "An error occurred while fetching courses");
      }
    };
    initialize();
  }, []);

  const toggleFileSelection = (fileId: string) => {
    setSelectedFile(selectedFile === fileId ? null : fileId);
  };

  const handleOpenQuiz = (passedQuizId: string) => {
    const passedIsFromAllFilesPage = "history";
    router.push({
      pathname: "/(tabs)/quiz/QuizReviewScreen",
      params: { passedQuizId, passedIsFromAllFilesPage },
    });
  };

  const renderCourseItem = ({
    item,
  }: {
    item: { id: string; name: string };
  }) => (
    <TouchableOpacity
      style={styles.courseItem}
      onPress={() => handleCourseSelection(item)}
    >
      <Text style={styles.courseText}>{item.name}</Text>
    </TouchableOpacity>
  );

  const handleDeleteQuiz = async (quizId: string) => {
    try {
      const response = await API.delete(`/api/quiz/${quizId}`);
      if (response.status === 200) {
        setQuizData((prevQuizzes) =>
          prevQuizzes.filter((quiz) => quiz.id !== quizId)
        );
      } else {
        Alert.alert("Error", "Failed to delete quiz.");
      }
    } catch (error: any) {
      Alert.alert("Error", "An error occurred while deleting the quiz.");
    }
  };

  const handleCourseSelection = async (course: {
    id: string;
    name: string;
  }) => {
    try {
      setSelectedCourse(course.name);
      setCourseModalVisible(false);
      const response = await API.get(`/api/user/course/files/${course.id}`);
      if (response.status === 200) {
        const data = response.data;
        if (Array.isArray(data)) {
          const mappedFiles = data.map((file: any) => ({
            id: file.fileId,
            name: file.fileName,
          }));
          setFiles(mappedFiles);
        } else {
          Alert.alert("Error", "Invalid response format.");
        }
      } else {
        Alert.alert("Error", "Failed to fetch files for the selected course.");
      }
      setFileModalVisible(true);
    } catch (error) {
      Alert.alert(
        "Error",
        "An error occurred while fetching files for the selected course."
      );
    }
  };

  const renderFileItem = ({ item }: { item: { id: string; name: string } }) => (
    <TouchableOpacity
      style={[
        styles.fileItem,
        selectedFile === item.id && styles.fileItemSelected,
      ]}
      onPress={() => toggleFileSelection(item.id)}
    >
      <Text style={styles.fileText}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderCourseModal = () => (
    <Modal
      animationType="slide"
      transparent
      visible={isCourseModalVisible}
      onRequestClose={() => setCourseModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Icon
            name="close"
            size={24}
            color="red"
            onPress={() => setCourseModalVisible(false)}
          />
          <Text style={styles.modalTitle}>Select a Course</Text>
          <FlatList
            data={courses}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderCourseItem}
          />
        </View>
      </View>
    </Modal>
  );
  const renderFileModal = () => (
    <Modal
      animationType="slide"
      transparent
      visible={isFileModalVisible}
      onRequestClose={() => setFileModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Icon
            name="close"
            size={24}
            color="red"
            onPress={() => setFileModalVisible(false)}
          />
          <Text style={styles.modalTitle}>
            Select File from {selectedCourse}
          </Text>
          <FlatList
            data={files}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderFileItem}
          />
          <TouchableOpacity
            style={[styles.modalButton]}
            onPress={() => {
              if (selectedFile) {
                console.log("Selected file ID:", selectedFile);
                const passedFileId = selectedFile;
                const passedIsFromAllFilesPage = "home";
                router.push({
                  pathname: "/(tabs)/quiz/Quiz",
                  params: { passedFileId, passedIsFromAllFilesPage },
                });
              } else {
                Alert.alert("No File Selected", "Please select a file.");
              }
              setFileModalVisible(false);
            }}
          >
            <TouchableOpacity
              style={styles.modalButtonSelect}
              onPress={(item: any) => {
                handleOpenQuiz(item.id);
              }}
            >
              <Text style={styles.modalButtonText}>Confirm Selection</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const renderQuizItem = ({
    item,
  }: {
    item: {
      id: string;
      title: string;
      description: string;
      successRate: number;
      color: string[];
    };
  }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        handleOpenQuiz(item.id);
      }}
    >
      <LinearGradient
        colors={[...item.color] as [string, string, ...string[]]}
        style={styles.cardGradient}
      >
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardDesc}>{item.description}</Text>
        <Text style={styles.successRate}>Success: {item.successRate}%</Text>
        <TouchableOpacity
          style={styles.trashIconContainer}
          onPress={() => handleDeleteQuiz(item.id)}
        >
          <Icon name="trash" size={20} color="white" style={styles.trashIcon} />
        </TouchableOpacity>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#1f2f98", "#7bd5f5"]} style={styles.header}>
        <Header />
        {/* <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>Hello {username}!</Text>
          </View>
        </View> */}
        <View style={styles.recentQuiz}>
          <Text style={styles.recentQuizText}>Recent Quiz</Text>
          <Text style={styles.quizTitle}>
            {lastQuiz?.title || "No Quizzes Available"}
          </Text>
          <Text style={styles.quizScore}>
            {lastQuiz?.successRate != null ? `${lastQuiz.successRate}%` : ""}
          </Text>
        </View>
      </LinearGradient>
      <View style={styles.newQuizContainer}>
        {/* <Image
          source={require("../../../assets/images/quiz.png")}
          style={styles.icon}
        /> */}

        <TouchableOpacity
          style={styles.button}
          onPress={() => setCourseModalVisible(true)}
        >
          <Icon name="plus-circle" size={20} color="white" />
          <Text style={styles.buttonText}>Start New Quiz?</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.quizhistory}>
        <Icon name="history" size={25} color="#1CA7EC" />

        <Text style={styles.cardText}>Quiz History</Text>
      </TouchableOpacity>
      {renderCourseModal()}
      {renderFileModal()}
      <FlatList
        data={quizData}
        keyExtractor={(item) => item.id}
        renderItem={renderQuizItem}
        contentContainerStyle={styles.quizList}
      />
      <NavBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F4F4",
  },
  header: {
    height: 250,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  greeting: {
    top: -20,
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  subtitle: {
    color: "white",
    fontSize: 14,
  },
  recentQuiz: {
    top: -20,
    marginTop: 10,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    padding: 15,
    borderRadius: 20,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  recentQuizText: {
    color: "white",
    fontSize: 16,
    marginBottom: 5,
  },
  quizTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  quizScore: {
    color: "white",
    fontSize: 16,
  },
  quizList: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    marginBottom: 100,
  },
  card: {
    marginBottom: 20,
    marginStart: 10,
    borderRadius: 20,
    overflow: "hidden",
  },
  cardGradient: {
    padding: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  cardDesc: {
    fontSize: 14,
    color: "white",
    marginVertical: 10,
  },
  successRate: {
    fontSize: 14,
    color: "#f0f8ff",
    fontWeight: "600",
  },
  navBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 15,
    backgroundColor: "white",
  },
  trashIcon: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    margin: 10,
  },
  button: {
    marginBlockEnd: 1,
    backgroundColor: "#1CA7EC",
    borderRadius: 30,
    width: 200,
    height: 70,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    position: "relative",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    paddingLeft: 10,
    alignContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },

  cardText: {
    fontSize: 20,
    marginRight: 10,
    marginLeft: 10,
  },
  linearcontainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  quizhistory: {
    flex: 0,
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    alignSelf: "flex-start",
    marginTop: 5,
    marginLeft: 25,
    zIndex: 1,
  },
  icon: {
    width: 90,
    height: 90,
    borderRadius: 20,
    flex: 1,
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    paddingLeft: 40,
    marginLeft: 20,
    marginBottom: 10,
    zIndex: 1,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    paddingBottom: 50,
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  fileList: {
    maxHeight: 200,
    marginBottom: 15,
  },
  fileItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  fileItemSelected: {
    backgroundColor: "#e0f7fa",
  },
  fileText: {
    fontSize: 16,
    color: "#333",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    flex: 1,
    padding: 20,
    marginHorizontal: 5,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: "#1ca7ec",
  },
  modalButtonSelect: {
    borderRadius: 10,
    padding: 5,
    right: 0,
    bottom: 0,
    backgroundColor: "#1ca7ec",
    height: 40,
    width: 200,
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "#1CA7EC",
    // padding: 10,
    marginBottom: 20,
  },
  modalButtonText: {
    color: "#f6f6f6",
    fontSize: 18,
    fontWeight: "bold",
  },
  courseItem: {
    padding: 15,
    marginVertical: 5,
    backgroundColor: "#f0f8ff",
    borderRadius: 10,
    alignItems: "center",
  },
  courseText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#333",
  },
  newQuizContainer: {
    marginTop: 20,
    padding: 10,
    flex: 0,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
    alignSelf: "center",
    width: 300,
    height: 100,
  },
  titleContainer: {
    flex: 1,
    marginTop: 10,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
    width: 200,
    height: 200,
    top: 10,
  },
  trashIconContainer: {
    position: "absolute",
    top: 2,
    right: 3,
    padding: 5,
  },
});
