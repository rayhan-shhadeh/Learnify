import React, { useContext, useState } from "react";
import {
  Image,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useRootNavigationState, useRouter } from "expo-router";
import API from "../../../api/axois";
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
      const response = await API.post(`http://192.168.68.61:8080/api/login`, {
        email: email,
        password: password,
      });
      const data = await response.data;

      if (response.status === 200) {
        const token = JSON.stringify(data.token);
        authCtx.authenticate(token);
        Alert.alert("Success");
        await AsyncStorage.setItem("token", token);
        const decoded: any = jwtDecode(token);
        const currentUserId = decoded.id.toString();
        await AsyncStorage.setItem("currentUserId", currentUserId);
        console.log("Current User ID: ", currentUserId);
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
          secureTextEntry={false}
          // secureTextEntry
        />
      </View>

      <TouchableOpacity onPress={() => router.push("/(tabs)/TestComponent")}>
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
