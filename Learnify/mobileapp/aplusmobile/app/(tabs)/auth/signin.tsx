import React, { useState } from "react";
import { Image, View, Text, TextInput, TouchableOpacity, StyleSheet , Alert} from "react-native";
import {useRootNavigationState, useRouter} from "expo-router";
import API from "../../../api/axois";
import {jwtDecode} from 'jwt-decode';
import axios from "axios";

const SignIn = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const navigationState = useRootNavigationState(); // Check navigation readiness
    if (!email || !password) {
      Alert.alert("Error", "Please fill in both fields.");
      return;
    }
    try {
      const response = await fetch('http://192.168.68.57:8080/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', `Server response: ${JSON.stringify(data)}`);
        const token = data.token;
        const decoded = jwtDecode(token);
        console.log(decoded);
        // Check if navigation is ready
      if (navigationState?.key) {
        router.push("/(tabs)/HomeScreen");
      } else {
        console.warn("Navigation is not yet ready");
      }

      } else {
        Alert.alert('Error', `Server error: ${data.message || 'Unknown error'}`);
      }
     

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      Alert.alert('Error', `Connection failed: ${errorMessage}`);
    }
  };
  

  return (
    <View style={styles.container} >
      <Image source={require('../../../assets/images/a-plus-4.gif')} style={styles.logo} />
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

      <TouchableOpacity>
        <Text style={styles.forgotPassword}>Forgot password?</Text>
      </TouchableOpacity>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.loginButton} onPress= {handleLogin}>
          <Text style={styles.loginButtonText}>Log in</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.signUpButton} onPress={() => router.push("/(tabs)/auth/signup")}>
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
