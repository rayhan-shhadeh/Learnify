import React, { useState } from "react";
import { Image, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import {router, useRouter} from "expo-router";
import API from '../../../api/axois';

const SignIn = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Error", "Please fill in both fields.");
      return;
    }
  
    try {
      const response = await API.post("/login", { username, password });
      // Handle successful login (e.g., store token, navigate to homepage)
      Alert.alert("Success", "Login successful!");
      router.push("/HomeScreen");
    } catch (error) {
      // Handle login error
      console.error(error);
      Alert.alert("Error", "Login failed. Please check your credentials.");
    }
  };
  
  return (
    <View
      style={styles.container}
    >
      <Image source={require('../../../assets/images/a-plus-4.gif')} style={styles.logo} />
      <Text style={styles.title}>Login to your account</Text>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Username"
          placeholderTextColor="#647987"
          style={styles.input}
          value={username}
          onChangeText={setUsername}
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Password"
          placeholderTextColor="#647987"
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      <TouchableOpacity>
        <Text style={styles.forgotPassword}>Forgot password?</Text>
      </TouchableOpacity>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Log in</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.signUpButton} onPress={() => router.push("/auth/signup")}>
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
