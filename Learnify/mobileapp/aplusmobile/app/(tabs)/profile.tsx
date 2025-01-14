import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  Button,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import Back from "./Back";
import NavBar from "./NavBar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../../api/axois";
import { jwtDecode } from "jwt-decode";
import Lottie from "lottie-react";
import fireAnimation from "../../assets/fire.json";
import welcome from "../../assets/welcome.json";
import StreakFire from "../(tabs)/streak/StreakFire";
import { router, useRouter } from "expo-router";
import Header from "./header/Header";
import LottieView from "lottie-react-native";

export default function Profile() {
  const router = useRouter();
  const [userId, setUserId] = React.useState<string | null>(null);
  const [userData, setUserData] = React.useState<{
    username: string;
    photo: string;
  } | null>(null);
  const [profileImage, setProfileImage] = React.useState<string | null>(null);
  const [streak, setStreak] = useState(1);
  const [showStreakFire, setShowStreakFire] = useState(false);

  const increaseStreak = () => {
    setStreak(streak + 1);
    setShowStreakFire(true);
  };
  const handleAnimationEnd = () => {
    setShowStreakFire(false);
  };
  useEffect(() => {
    increaseStreak();
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          Alert.alert("Error", "Token not found");
          return;
        }

        const decoded: { id: string } | null = jwtDecode<{ id: string }>(token);
        setUserId(decoded?.id ?? null); // Adjust this based on the token structure

        const response = await API.get(`/api/users/getme/${decoded?.id}`);
        if (response.status !== 200) {
          Alert.alert("Error", "Failed to fetch user  info. ");
          return;
        }
        // Alert.alert("Success", "fetched data successfully");
        const data = await response.data.data;
        setUserData(data);
        setProfileImage(data.photo);
        // Alert.alert(data.photo || "no image");
      } catch (error) {
        Alert.alert("Error", "An error occurred while fetching user data");
      }
    };

    fetchUserData();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* <View style={styles.main}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => increaseStreak()}
        >
          <Text style={styles.actionText}>Streak</Text>
        </TouchableOpacity>
      </View> */}
      <StreakFire
        streak={streak}
        visible={showStreakFire}
        onFinish={handleAnimationEnd}
      />
      <Header />

      <View style={styles.header}>
        {/* <Image source={require('../../assets/images/a-plus-4.gif')} style={styles.logoImage} /> */}
        {/* <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.notificationButton}>
            <Icon name="bell" size={24} color="#647987" />
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        </View> */}
      </View>
      {/* Profile Image */}

      <View style={styles.main}>
        <View style={styles.welcomeSection}>
          {/* <TouchableOpacity style={styles.profileImageContainer}>
            {profileImage ? (
              <Image
                source={{ uri: profileImage }}
                style={styles.profileImage}
              />
            ) : (
              <Icon name="user-circle" size={32} color="#647987" />
            )}
          </TouchableOpacity>  */}
          <LottieView
            source={require("../../assets/welcome.json")}
            autoPlay
            loop={false}
            speed={1}
            style={styles.logoImage}
          />
          <Text style={styles.welcomeText}>
            Welcome back {userData?.username} !
          </Text>
          {/* <View style={styles.progressChartContainer}>
            <View style={styles.progressChart}>
              <Text style={styles.progressText}>78%</Text>
            </View>
          </View> */}
        </View>
        <Text style={styles.subText}>Keep up the great work</Text>

        {/* <View>
              <Text> Your info:</Text>
              <Text> {userData}</Text>
            </View> */}
        <View style={styles.streakSection}>
          <View style={styles.streakHeader}>
            {/* <Icon name="fire" size={24} color="#FFA500" />
            <Text style={styles.streakText}>15 Day Streak!</Text> */}
          </View>
          <View style={styles.streakDetails}>
            <View style={styles.streakDetail}>
              <Text style={styles.subTextDetail}>Tasks Today</Text>
              <Text style={styles.detailText}>4/6</Text>
            </View>
            <View style={styles.streakDetail}>
              <Text style={styles.subTextDetail}>Weekly Goal</Text>
              <Text style={styles.detailText}>85%</Text>
            </View>
          </View>
        </View>

        <ScrollView horizontal style={styles.actionsSection}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push("/(tabs)/FlashcardsScreen")}
          >
            <Icon name="plus" size={16} color="#fff" />
            <Text style={styles.actionText}>Create Flashcard</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButtonOutline}
            onPress={() => router.push("/(tabs)/quiz/QuizScreen")}
          >
            <Icon name="question-circle" size={16} color="#125488" />
            <Text style={styles.actionTextOutline}>Start Quiz</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButtonOutline}
            onPress={() => router.push("/(tabs)/Habits/HabitsScreen")}
          >
            <Icon name="tasks" size={16} color="#125488" />
            <Text style={styles.actionTextOutline}>Add Habit</Text>
          </TouchableOpacity>
        </ScrollView>

        <View style={styles.learningSection}>
          <Text style={styles.sectionTitle}>Continue Learning</Text>
          <ScrollView horizontal style={styles.coursesSection}>
            <View style={styles.courseCard}>
              <View style={styles.courseContent}>
                <Text style={styles.courseTitle}>Advanced Mathematics</Text>
                <View style={styles.progressBar}>
                  <View style={[styles.progress, { width: "45%" }]} />
                </View>
                <Text style={styles.subTextDetail}>45% Complete</Text>
              </View>
            </View>
            <View style={styles.courseCard}></View>
          </ScrollView>
        </View>
      </View>
      <NavBar />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f8f8f8",
    paddingBottom: 70,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  // logo: {
  //   fontFamily: 'Pacifico',
  //   fontSize: 24,
  //   color: '#2a93d5',
  // },
  logoImage: {
    width: 70,
    height: 70,
    alignContent: "center",
    justifyContent: "center",
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  notificationButton: {
    position: "relative",
    marginRight: 16,
    display: "flex",
    justifyContent: "center",
  },
  notificationDot: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    backgroundColor: "#FF0000",
    borderRadius: 4,
  },
  profileImageContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
    marginLeft: 8,
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  main: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  welcomeSection: {
    flexDirection: "row",
    // justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 8,
  },
  subText: {
    fontSize: 14,
    color: "#888",
    paddingLeft: 10,
    marginBottom: 8,
    marginLeft: 10,
    top: -15,
  },
  subTextDetail: {
    fontSize: 14,
    color: "#888",
    paddingLeft: 10,
    marginBottom: 8,
  },
  progressChartContainer: {
    width: 64,
    height: 64,
    justifyContent: "center",
    alignItems: "center",
  },
  progressChart: {
    width: "100%",
    height: "100%",
    borderRadius: 32,
    borderWidth: 4,
    borderColor: "#2a93d5",
    justifyContent: "center",
    alignItems: "center",
  },
  progressText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  streakSection: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  streakHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  streakText: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  streakDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  streakDetail: {
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    padding: 16,
    flex: 1,
    alignItems: "center",
  },
  detailText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  actionsSection: {
    flexDirection: "row",
    marginBottom: 16,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2a93d5",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  actionText: {
    color: "#fff",
    marginLeft: 8,
  },
  actionButtonOutline: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  actionTextOutline: {
    color: "#2a93d5",
    marginLeft: 8,
  },
  learningSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  coursesSection: {
    flexDirection: "row",
  },
  courseCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    overflow: "hidden",
    marginRight: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  courseImage: {
    width: 200,
    height: 100,
  },
  courseContent: {
    padding: 16,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: "#ddd",
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 8,
  },
  progress: {
    height: "100%",
    backgroundColor: "#2a93d5",
  },
  activitySection: {
    marginBottom: 16,
  },
  activityCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  navbar: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  navButton: {
    alignItems: "center",
  },
  navText: {
    fontSize: 12,
    color: "#2a93d5",
  },
  navTextInactive: {
    fontSize: 12,
    color: "#888",
  },
});
