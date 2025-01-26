import React, { useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
} from "react-native";
import Header from "../../(tabs)/header/Header";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";
import { useRouter } from "expo-router";
import NavBar from "../../(tabs)/NavBar";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthContext } from "../../../components/store/auth-context";
const LearnMainScreen = () => {
  const authCtx = useContext(AuthContext);
  const router = useRouter();
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header />
      <LinearGradient
        colors={["#f7f7f7", "#fbfbfb", "#9ad9ea"]}
        style={styles.container}
      >
        {/* Main Grid */}
        <View style={styles.grid}>
          {/* Quizzes Card */}

          <TouchableOpacity
            onPress={() => router.push("/(tabs)/FilesScreen")}
            style={styles.card}
          >
            <Animatable.View animation="fadeInUp" delay={200} duration={800}>
              <View style={styles.cardTextContainer}>
                <Image
                  source={require("../../../assets/images/pdf-unscreen.gif")}
                  style={styles.logo}
                />
                <Text style={styles.cardTitle}>Files</Text>
                <Text style={styles.cardSubtitle}></Text>
              </View>
            </Animatable.View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/CoursesScreen")}
            style={styles.card}
          >
            <Animatable.View animation="fadeInUp" delay={200} duration={800}>
              <View style={styles.cardTextContainer}>
                <Image
                  source={require("../../../assets/images/folder-unscreen.gif")}
                  style={styles.logo}
                />
                <Text style={styles.cardTitle}>Courses</Text>
                <Text style={styles.cardSubtitle}> </Text>
              </View>
            </Animatable.View>
          </TouchableOpacity>
        </View>

        <NavBar />
      </LinearGradient>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent", // Deep blue for the background

    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: "transparent",
    //  paddingBottom: 70, // Add padding to avoid overlap with NavBar
  },
  logocontainer: {
    alignItems: "center",
    marginTop: 5,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    fontSize: 40,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#488db4", // Light blue for contrast
    textAlign: "center",
  },

  grid: {
    flexDirection: "column",
    flexWrap: "wrap",
    justifyContent: "center",
    paddingHorizontal: 36,
  },
  card: {
    width: 300,
    height: 200,
    backgroundColor: "#1ca7ec", // Mid-tone blue for the cards
    borderRadius: 30,
    padding: 16,
    marginBottom: 16,
    alignItems: "center",
    elevation: 10,
    alignContent: "center",
    justifyContent: "center",
    alignSelf: "center",
    flexDirection: "column",
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardTextContainer: {
    marginTop: 8,
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff", // Dark text for contrast
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#C1E8FF", // Light blue for a cohesive theme
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: "contain",
    alignSelf: "center",
  },
  icons: {
    color: "#fff",
    alignContent: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
});

export default LearnMainScreen;
