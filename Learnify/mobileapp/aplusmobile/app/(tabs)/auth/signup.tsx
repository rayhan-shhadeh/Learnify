import React, {useContext, useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import { launchImageLibrary } from 'react-native-image-picker';
import * as Animatable from "react-native-animatable";
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRootNavigationState, useRouter } from "expo-router";
import requestPhotoLibraryPermission from "../../../utils/permissions";
import { AuthContext } from '../../../components/store/auth-context';
import AuthContent from '../../../components/Auth/AuthContent';

const Signup = () => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const authCtx = useContext(AuthContext);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>(undefined);
  const [Major, setMajor] = useState('');
  const [photo, setPhoto] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const flag = 1;
  const subscription = 1;
  const router = useRouter();
  const handleChoosePhoto = async () => {
    if (Platform.OS === "android") {
      await requestPhotoLibraryPermission();
    }
  
    launchImageLibrary(
      {
        mediaType: "photo",
        includeBase64: false,
        quality: 0.8,
      },
      (response) => {
        if (response.didCancel) {
          console.log("User cancelled image picker");
        } else if (response.errorMessage) {
          console.error("Image picker error: ", response.errorMessage);
          Alert.alert("Error", "Could not select image. Please try again.");
        } else if (response.assets && response.assets.length > 0) {
          setPhoto(response.assets[0].uri || '');
        } else {
          console.warn("No image selected");
        }
      }
    );
  };
  

  const handleDateChange = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || dateOfBirth;
    setShowDatePicker(Platform.OS === 'ios');
    setDateOfBirth(currentDate);
  };

  const displayDate = dateOfBirth ? dateOfBirth.toDateString() : 'Select Date';

  const handleSignUp = async () => {
  
    const navigationState = useRootNavigationState(); // Check navigation readiness
    setIsAuthenticating(true);

    try {
      const response = await fetch('http://192.168.68.53:8080/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          username: fullName,
          password,
          dateOfBirth: dateOfBirth?.toISOString().split('T')[0], // Format date as 'YYYY-MM-DD'
          flag,
          subscription,
          Major,
          photo,
        }),
      });
      const data = await response.json();
      if (data.success) {
        Alert.alert('Success', 'Account created successfully');
        authCtx.authenticate(data.token);
        // Check if navigation is ready
      if (navigationState?.key) {
        router.push("/(tabs)/HomeScreen");
      } else {
        console.warn("Navigation is not yet ready");
      }
      }
      router.push("/(tabs)/HomeScreen");
      setIsAuthenticating(false);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      Alert.alert('Error', `Connection failed: ${errorMessage}`);
    }
  };

  return (
    <View style={styles.container}>
      <Animatable.View animation="fadeInUp" duration={1400}>
        <TouchableOpacity onPress={handleChoosePhoto} style={styles.photoContainer}>
          {photo ? (
            <Image source={{ uri: photo }} style={styles.photo} />
          ) : (
            <Icon name="user-circle" size={50} color="#5f83b1" />
          )}
        </TouchableOpacity>
      </Animatable.View>

      {/* Header */}
      <Animatable.View animation="fadeInDown" duration={1000}>
        <View style={styles.header}>
          <Text style={styles.title}>Sign up</Text>
        </View>
      </Animatable.View>

      {/* Input Fields */}
      <KeyboardAvoidingView behavior="padding" style={styles.inputSection}>
        <Animatable.View animation="fadeInUp" duration={1000}>
          <TextInput
            placeholder="Full Name"
            placeholderTextColor="#647987"
            style={styles.input}
            value={fullName}
            onChangeText={setFullName}
          />
        </Animatable.View>

        <Animatable.View animation="fadeInUp" duration={1200}>
          <TextInput
            placeholder="Email"
            placeholderTextColor="#647987"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
          />
        </Animatable.View>

        <Animatable.View animation="fadeInUp" duration={1400}>
          <TextInput
            placeholder="Password"
            placeholderTextColor="#647987"
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </Animatable.View>

        <Animatable.View animation="fadeInUp" duration={1400}>
          <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateInput}>
            <Text style={styles.dateText}>{displayDate}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={dateOfBirth || new Date()}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}
        </Animatable.View>

        <Animatable.View animation="fadeInUp" duration={1400}>
          <TextInput
            placeholder="Major"
            placeholderTextColor="#647987"
            style={styles.input}
            value={Major}
            onChangeText={setMajor}
          />
        </Animatable.View>
      </KeyboardAvoidingView>

      {/* Buttons */}
      <Animatable.View animation="fadeInUp" duration={1600}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.primaryButton} onPress={handleSignUp}>
            <Text style={styles.primaryButtonText}>Create Account</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={() => router.push("/(tabs)/auth/signin")}>
            <Text style={styles.dateText}>Already a user?</Text>
            <Text style={styles.secondaryButtonText}>Log in</Text>
          </TouchableOpacity>
        </View>
      </Animatable.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#ffffff",
  },
  header: {
    marginBottom: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111517",
  },
  inputSection: {
    width: "100%",
    marginBottom: 30,
  },
  input: {
    backgroundColor: "#f0f3f4",
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15,
    color: "#111517",
  },
  photoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
  },
  primaryButton: {
    backgroundColor: "#1f93e0",
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    width: 200,
    marginBottom: 10,
  },
  primaryButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  secondaryButton: {
    backgroundColor: "transparent",
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    width: 200,
    borderWidth: 1,
    borderColor: "#111517",
  },
  secondaryButtonText: {
    color: "#111517",
    fontWeight: "bold",
    fontSize: 16,
  },
  dateInput: {
    height: 40,
    borderColor: '#1CA7EC',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  dateText: {
    color: '#647987',
  },
});

export default Signup;
