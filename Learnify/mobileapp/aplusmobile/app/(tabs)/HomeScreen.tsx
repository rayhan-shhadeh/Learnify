import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  Modal,
  Alert,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";
import { useRouter } from "expo-router";
import NavBar from "./NavBar";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import API from "../../api/axois";

import { SafeAreaView } from "react-native-safe-area-context";
import { Icon } from "react-native-paper";
import Header from "../(tabs)/header/Header";
const HomePage = () => {
  const router = useRouter();
  const [isPremium, setIsPremium] = useState<boolean>();
  useEffect(() => {
    const initialize = async () => {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        router.push("/(tabs)/auth/signin");
        return;
      }
      const decoded: { id: string } | null = jwtDecode<{ id: string }>(token);
      console.log(decoded?.id);
      //preimium flag
      const userData = await API.get(`/api/users/getme/${decoded?.id}`);
      const userFlag = userData.data.data.flag;
      userFlag === 1 ? setIsPremium(true) : setIsPremium(false);
    };
    initialize();
  }, []);
  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => setModalVisible(!isModalVisible);

  return (
    <>
      <LinearGradient
        colors={["#ddf3f5", "#f7f7f7", "#fbfbfb", "#9ad9ea"]}
        style={styles.container}
      >
        <Header />
        <SafeAreaView style={styles.scrollContainer}>
          {/* Header Section */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Welcome to</Text>
            <View style={styles.logoContainer}>
              <Animatable.Image
                animation="zoomIn"
                delay={500}
                source={require("../../assets/images/a-plus-4.gif")}
                style={styles.logo}
              />
            </View>
          </View>
          {/* Main Grid Section */}
          <View style={styles.grid}>
            {cardData.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => router.push(item.route)}
                style={styles.card}
                activeOpacity={0.9}
              >
                <Animatable.View
                  animation="bounceIn"
                  delay={item.delay}
                  duration={800}
                  style={styles.cardContent}
                >
                  <MaterialCommunityIcons
                    name={item.icon as any}
                    style={styles.icons}
                    size={40}
                  />
                  <View style={styles.cardTextContainer}>
                    <Text style={styles.cardTitle}>{item.title}</Text>
                    <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
                  </View>
                </Animatable.View>
              </TouchableOpacity>
            ))}
          </View>
        </SafeAreaView>

        <TouchableOpacity style={styles.floatingButtonLeft}>
          <Image
            source={require("../../assets/images/diamond-unscreen.gif")}
            style={{ width: 80, height: 80 }}
          />
        </TouchableOpacity>
        {isPremium && (
          <TouchableOpacity
            style={styles.floatingButtonLeft}
            onPress={() => {
              router.push("/(tabs)/Payment/PremiumScreen");
            }}
          >
            <Image
              source={require("../../assets/images/diamond-unscreen.gif")}
              style={{ width: 80, height: 80 }}
            />
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.floatingButton}>
          <MaterialCommunityIcons
            onPress={toggleModal}
            name="progress-question"
            size={60}
            color="#1ca7ec"
          />
        </TouchableOpacity>
        <Text style={styles.aiText}>
          This App contains AI{"\n"} Generated contents
        </Text>

        {/* How to Use Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={toggleModal}
        >
          <View style={styles.modalOverlay}>
            <Animatable.View
              animation="fadeInUp"
              duration={500}
              style={styles.modalContent}
            >
              <Text style={styles.modalTitle}>How to Use?</Text>
              <Text style={styles.modalText}>
                <MaterialCommunityIcons
                  name="file-upload"
                  size={20}
                  color="#1ca7ec"
                />
                Upload your study materials in the <Text>Learn</Text> section.
              </Text>
              <Text style={styles.modalText}>
                <MaterialCommunityIcons
                  name="file-eye"
                  size={20}
                  color="#1ca7ec"
                />{" "}
                Click on File name to view the contents.
              </Text>
              <Text style={styles.modalText}>
                <MaterialCommunityIcons
                  name="file-check-outline"
                  size={20}
                  color="#1ca7ec"
                />{" "}
                Generate Flashcards, Quizzes, and Key terms to start learning.
              </Text>
              <Text style={styles.modalText}>
                <MaterialCommunityIcons
                  name="file-document"
                  size={20}
                  color="#1ca7ec"
                />{" "}
                Use the <Text>Practice</Text> section to reinforce learning.
              </Text>
              <Text style={styles.modalText}>
                <MaterialCommunityIcons
                  name="search-web"
                  size={20}
                  color="#1ca7ec"
                />
                Explore or Learn new decks for more resources.
              </Text>

              <Pressable style={styles.closeButton} onPress={toggleModal}>
                <Text style={styles.closeButtonText}>Close</Text>
              </Pressable>
            </Animatable.View>
          </View>
        </Modal>

        <NavBar />
      </LinearGradient>
    </>
  );
};
type RouteType =
  | "/(tabs)/quiz/QuizMainScreen"
  | "/(tabs)/MultiFilePracticeScreen"
  | "/Learn/LearnMainScreen"
  | "/(tabs)/ExplorePage";

const cardData: {
  title: string;
  subtitle: string;
  icon: string;
  route: RouteType;
  delay: number;
}[] = [
  {
    title: "Quizzes",
    subtitle: "Let's Study",
    icon: "book-open-outline",
    route: "/(tabs)/quiz/QuizMainScreen",
    delay: 200,
  },
  {
    title: "Practice",
    subtitle: "Learn",
    icon: "lightning-bolt-outline",
    route: "/(tabs)/MultiFilePracticeScreen",
    delay: 300,
  },
  {
    title: "Learn",
    subtitle: "New Decks?",
    icon: "cards-outline",
    route: "/Learn/LearnMainScreen",
    delay: 400,
  },
  {
    title: "Explore",
    subtitle: "What's New?",
    icon: "search-web",
    route: "/(tabs)/ExplorePage",
    delay: 500,
  },
];

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
  },
  scrollContainer: {
    paddingLeft: 20,
    paddingRight: 20,
  },
  header: {
    alignItems: "center",
    // marginVertical: 10,
  },
  headerTitle: {
    marginTop: -50,
    fontSize: 28,
    fontWeight: "bold",
    color: "#3b81b9",
  },
  logoContainer: {
    marginTop: 3,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    backgroundColor: "#1ca7ec",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    alignItems: "center",
    shadowColor: "#052659",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 10,
  },
  cardContent: {
    alignItems: "center",
  },
  cardTextContainer: {
    marginTop: 12,
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#C1E8FF",
  },
  floatingButton: {
    position: "absolute",
    right: 20,
    bottom: 90,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    marginTop: 20,
  },
  floatingButtonLeft: {
    position: "absolute",
    left: 10,
    bottom: 90,
    justifyContent: "flex-start",
    alignSelf: "flex-start",
    // overflow: "hidden",
    zIndex: 1,
    flex: 1,
    marginTop: 20,
  },

  icons: {
    color: "#fff",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    textAlign: "left",
    alignSelf: "center",
    alignContent: "center",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    width: "90%",
    alignItems: "center",
    textAlign: "left",
    elevation: 10,
    alignSelf: "center",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1ca7ec",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    color: "#555",
    marginBottom: 10,
    textAlign: "center",
  },
  closeButton: {
    backgroundColor: "#1ca7ec",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  aiText: {
    color: "#0077b6",
    fontWeight: "light",
    fontSize: 13,
    bottom: 90,
    position: "absolute",
    textAlign: "center",
    justifyContent: "center",
    alignSelf: "center",
    zIndex: 1,
    paddingRight: 25,
  },
});

export default HomePage;
