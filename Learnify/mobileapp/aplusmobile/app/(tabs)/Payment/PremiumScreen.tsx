import React from "react";
import { View, StyleSheet, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Button, Card, Text, Divider } from "react-native-paper";
import LottieView from "lottie-react-native";
import Header from "../header/Header";

const PaymentScreen: React.FC = () => {
  const router = useRouter();
  const navigation = useNavigation();

  const handleNotNow = () => {
    navigation.goBack();
  };

  const handleUpgradeNow = () => {
    Alert.alert("Upgrade", "Thank you for upgrading to premium!");
    router.replace("/(tabs)/Payment/PaymentMethods");
  };

  return (
    <View style={styles.container}>
      <Header />
      
      {/* Gradient Background Container */}
      <LinearGradient 
        colors={["#e0f7ff", "#ffffff"]} 
        style={styles.gradientContainer}
      >
        <Card style={styles.card}>
          <Card.Content>
            <LottieView
              source={require("../../../assets/premium-crown.json")}
              autoPlay
              loop
              style={styles.animation}
            />
            <Text style={styles.title}>Upgrade to Premium</Text>
            <Text style={styles.price}>$10 / Month</Text>
            <Text style={styles.description}>
              Unlock exclusive features
            </Text>
            <Divider style={styles.divider} />
            
            <View style={styles.benefitsList}>
              <Text style={styles.benefit}>🌟 Unlimited Flashcards</Text>
              <Text style={styles.benefit}>🌟 Unlimited Key terms</Text>
              <Text style={styles.benefit}>🌟 Unlimited Quizzes</Text>
              <Text style={styles.benefit}>🌟 More explore flashcards</Text>
            </View>

            <Text style={styles.description}>Would you like to upgrade now?</Text>
          </Card.Content>
        </Card>
      </LinearGradient>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <Button
          mode="outlined"
          onPress={handleNotNow}
          style={styles.notNowButton}
          labelStyle={styles.notNowButtonText}
        >
          Not Now
        </Button>
        <Button
          mode="contained"
          onPress={handleUpgradeNow}
          style={styles.upgradeButton}
          labelStyle={styles.upgradeButtonText}
        >
          Upgrade Now
        </Button>
      </View>
    </View>
  );
};

export default PaymentScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 20,
  },
  gradientContainer: {
    borderRadius: 20,
    padding: 20,
    marginVertical: 20,
    elevation: 4, 
  },
  card: {
    borderRadius: 20,
    paddingVertical: 20,
    backgroundColor: "rgba(255, 255, 255, 0.95)", // Slight transparency for a soft effect
  },
  animation: {
    width: 150,
    height: 150,
    alignSelf: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
    marginBottom: 5,
  },
  price: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    color: "#333",
    marginBottom: 5,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    color: "#555",
    marginBottom: 8,
  },
  divider: {
    marginVertical: 10,
  },
  benefitsList: {
    marginVertical: 10,
    paddingLeft: 10,
  },
  benefit: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: "500",
    color: "#444",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 0,
  },
  notNowButton: {
    borderColor: "#1ca7ec",
    borderWidth: 1,
    flex: 0.45,
    borderRadius: 10,
  },
  notNowButtonText: {
    fontSize: 16,
    color: "#1ca7ec",
  },
  upgradeButton: {
    backgroundColor: "#1ca7ec",
    flex: 0.45,
    borderRadius: 10,
  },
  upgradeButtonText: {
    fontSize: 16,
    color: "#fff",
  },
});
