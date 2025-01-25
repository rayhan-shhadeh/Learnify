import React from "react";
import { View, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
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
      <View style={styles.header}>
        <Text style={styles.title}>Upgrade to Premium</Text>
      </View>
      {/* <View style={styles.content}>
        <Text style={styles.description}>
          Unlock exclusive features for premium users:
        </Text>
        <View style={styles.benefitsList}>
          <Text style={styles.benefit}>• Access premium content</Text>
          <Text style={styles.benefit}>• Enjoy an ad-free experience</Text>
          <Text style={styles.benefit}>• Get priority customer support</Text>
        </View>
        <Text style={styles.description}>Would you like to upgrade now?</Text>
      </View> */}
      <Card style={styles.card}>
        <Card.Content>
          <LottieView
            source={require("../../../assets/premium-crown.json")}
            autoPlay
            loop
            style={styles.animation}
          />
          <Text style={styles.title}>Upgrade to Premium</Text>
          <Text style={styles.description}>
            Unlock exclusive features for premium users:
          </Text>
          <Divider style={styles.divider} />
          <View style={styles.benefitsList}>
            <Text style={styles.benefit}>🌟 Access premium content</Text>
            <Text style={styles.benefit}>🚫 Enjoy an ad-free experience</Text>
            <Text style={styles.benefit}>📞 Get priority customer support</Text>
          </View>
          <Text style={styles.description}>Would you like to upgrade now?</Text>
        </Card.Content>
      </Card>
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
    backgroundColor: "#f4f9ff",
    justifyContent: "center",
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  card: {
    borderRadius: 16,
    paddingVertical: 20,
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
    marginVertical: 10,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    color: "#555",
    marginBottom: 15,
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
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  notNowButton: {
    borderColor: "#ccc",
    borderWidth: 1,
    flex: 0.45,
  },
  notNowButtonText: {
    fontSize: 16,
    color: "#555",
  },
  upgradeButton: {
    backgroundColor: "#1ca7ec",
    flex: 0.45,
  },
  upgradeButtonText: {
    fontSize: 16,
    color: "#fff",
  },
});
