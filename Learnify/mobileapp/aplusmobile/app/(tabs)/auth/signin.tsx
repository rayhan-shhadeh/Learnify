import React, { useContext, useState } from "react";
import {
  Image,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  LayoutAnimation,
} from "react-native";
import { useRootNavigationState, useRouter } from "expo-router";
import API, { LOCALHOST } from "../../../api/axois";
import { jwtDecode } from "jwt-decode";
import LoadingOverlay from "../../../components/ui/LoadingOverlay";
import { AuthContext } from "../../../components/store/auth-context";
import { createUser } from "../../../utils/auth";
import AuthContent from "@/components/Auth/AuthContent";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SignIn = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const authCtx = useContext(AuthContext);

  async function signupHandler({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) {
    setIsAuthenticating(true);
    try {
    } catch (error) {
      Alert.alert(
        "Authentication failed",
        "Could not create user, please check your input and try again later."
      );
      setIsAuthenticating(false);
    }
  }
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in both fields.");
      return;
    }
    try {
      const response = await fetch(`http://${LOCALHOST}:8080/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });
      const data = await response.json();
      if (response.status === 200) {
        const token = JSON.stringify(data.token);
        authCtx.authenticate(token);
        Alert.alert("Success", "Login successful.");
        await AsyncStorage.setItem("token", token);
        const decoded: any = jwtDecode(token);
        const currentUserId = decoded.id.toString();
        await AsyncStorage.setItem("currentUserId", currentUserId);
        console.log("Current User ID: ", currentUserId);
        if (data.user.flag === 1) {
          const response = await fetch(
            `http://${LOCALHOST}:8080/api/user/transactions/${currentUserId}`,
            { method: "GET" }
          );
          const transaction = await response.json();
          if (transaction) {
            const transactionId = transaction.transactionId;
            const endsAtDate = new Date(transaction.endsAt);
            const today = new Date();
            if (endsAtDate < today) {
              console.log("Subscription expired. Updating premium status...");
              const updateResponse = await fetch(
                `http://${LOCALHOST}:8080/api/updatePremiumStatus/${currentUserId}`,
                {
                  method: "PATCH",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ flag: 0 }),
                }
              );
              if (updateResponse.ok) {
                console.log("User premium status updated successfully.");
                await fetch(
                  `http://${LOCALHOST}:8080/api/transaction/${transactionId}`,
                  { method: "DELETE" }
                );
              } else {
                console.error(
                  "Failed to update premium status:",
                  await updateResponse.text()
                );
              }
            } else {
              console.log("Subscription is still active.");
            }
          }
        }
        router.push("/(tabs)/HomeScreen");
      } else {
        Alert.alert("Error", `Please enter valid credentials: ${data.message}`);
      }
    } catch (error: any) {
      console.log("Login Error: ", error);
      const errorMessage =
        error?.response?.data?.message ??
        (error instanceof Error ? error.message : "Unknown error");
      Alert.alert("Error", `Connection failed: ${errorMessage}`);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../../../assets/images/a-plus-4.gif")}
        style={styles.logo}
      />
      <Text style={styles.title}>Login to your account</Text>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Email"
          placeholderTextColor="#647987"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Password"
          placeholderTextColor="#647987"
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
          // secureTextEntry
        />
      </View>

      <TouchableOpacity onPress={() => router.push("/TestAPI")}>
        <Text style={styles.forgotPassword}>Forgot password?</Text>
      </TouchableOpacity>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Log in</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.signUpButton}
          onPress={() => router.push("/(tabs)/auth/signup")}
        >
          <Text style={styles.signUpButtonText}>New user? Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  backArrow: {
    position: "absolute",
    top: 40,
    left: 20,
  },
  backArrowIcon: {
    fontSize: 24,
    color: "#111517",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#111517",
    marginBottom: 20,
  },
  inputContainer: {
    width: "90%",
    marginBottom: 12,
  },
  input: {
    backgroundColor: "#f0f3f4",
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#111517",
  },
  forgotPassword: {
    color: "#647987",
    fontSize: 14,
    textDecorationLine: "underline",
    marginTop: 5,
  },
  buttonContainer: {
    marginTop: 20,
    width: "90%",
  },
  loginButton: {
    backgroundColor: "#1f93e0",
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  loginButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  signUpButton: {
    backgroundColor: "transparent",
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#111517",
    borderWidth: 1,
  },
  signUpButtonText: {
    color: "#111517",
    fontWeight: "bold",
    fontSize: 16,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
});

export default SignIn;
