import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";
import { useRouter } from "expo-router";
import NavBar from "./NavBar";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";

const HomePage = () => {
  const router = useRouter();

  return (
    <LinearGradient
      colors={["#ddf3f5", "#f7f7f7", "#fbfbfb", "#9ad9ea"]}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
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
      </ScrollView>

      <TouchableOpacity style={styles.floatingButton}>
        <MaterialCommunityIcons name="plus-circle" size={60} color="#1ca7ec" />
      </TouchableOpacity>

      <NavBar />
    </LinearGradient>
  );
};

type RouteType =
  | "/(tabs)/quiz/QuizMainScreen"
  | "/(tabs)/StudyFlashcardsScreen"
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
    route: "/(tabs)/StudyFlashcardsScreen",
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
    flexGrow: 1,
    width: "100%",
    height: "100%",
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
  },
  header: {
    alignItems: "center",
    marginVertical: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#488db4",
  },
  logoContainer: {
    marginTop: 10,
  },
  logo: {
    width: 120,
    height: 120,
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
  },
  icons: {
    color: "#fff",
  },
});

export default HomePage;
