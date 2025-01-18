import React, { useContext, useState } from "react";
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
import Icon from "react-native-vector-icons/FontAwesome";
import * as ImagePicker from "expo-image-picker";
import * as Animatable from "react-native-animatable";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker"; // For the dropdown menu
import { useRootNavigationState, useRouter } from "expo-router";
import requestPhotoLibraryPermission from "../../../utils/permissions";
import { AuthContext } from "../../../components/store/auth-context";
import API from "../../../api/axois";
import axios from "axios";

const internationalMajors = [
  "Computer Science",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Business Administration",
  "Psychology",
  "Biology",
  "Medicine",
  "Architecture",
  "Law",
  "Economics",
];

const Signup = () => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const authCtx = useContext(AuthContext);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>(undefined);
  const [major, setMajor] = useState("");
  const [photo, setPhoto] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showMajorPicker, setShowMajorPicker] = useState(false);
  const flag = 1;
  const subscription = 1;
  const router = useRouter();
  const handleChoosePhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      if (result.assets && result.assets.length > 0) {
        setPhoto(result.assets[0].uri);
      }
    }
    // if (Platform.OS === "android") {
    //   await requestPhotoLibraryPermission();
    // }

    // launchImageLibrary(
    //   {
    //     mediaType: "photo",
    //     includeBase64: false,
    //     quality: 0.8,
    //   },
    //   (response) => {
    //     if (response.didCancel) {
    //       console.log("User cancelled image picker");
    //     } else if (response.errorMessage) {
    //       console.error("Image picker error: ", response.errorMessage);
    //       Alert.alert("Error", "Could not select image. Please try again.");
    //     } else if (response.assets && response.assets.length > 0) {
    //       setPhoto(response.assets[0].uri || "");
    //     } else {
    //       console.warn("No image selected");
    //     }
    //   }
    // );
  };

  const handleDateChange = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || dateOfBirth;
    setShowDatePicker(Platform.OS === "ios");
    setDateOfBirth(currentDate);
  };

  const displayDate = dateOfBirth ? dateOfBirth.toDateString() : "Select Date";

  const signUp = async () => {
    const formData = new FormData();

    // Append form data
    formData.append("email", "hayasam@gmail.com");
    formData.append("username", "Haya Samaaneh");
    formData.append("password", "mypassword");
    formData.append("dateOfBirth", "1997-10-5");
    formData.append("flag", "1");
    formData.append("subscription", "1");
    formData.append("major", "computer Engineer");

    // Append file (assuming it's in your project)
    const photoUri = "file:///path-to-your-image/profile.png"; // Replace with the actual file path
    const response = await fetch(photoUri);
    const blob = await response.blob();
    formData.append("photo", blob, "profile.png");

    try {
      const response = await axios.post(
        "http://192.168.68.61:8080/api/signup",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Success:", response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error:", error.response?.data || error.message);
      } else {
        if (error instanceof Error) {
          console.error("Error:", error.message);
        } else {
          console.error("Error:", error);
        }
      }
    }
  };
  const handleSignUp = async () => {
    const navigationState = useRootNavigationState(); // Check navigation readiness
    setIsAuthenticating(true);

    try {
      const response = await API.post("/api/signup", {
        email: "new@gmail.com",
        username: " fullName",
        password: "password",
        dateOfBirth: "2000-12-15", // Format date as 'YYYY-MM-DD'
        flag: 1,
        subscription: 1,
        major: "Computer Science",
        photo: "photo",
      });
      const data = response.data;
      if (data.success) {
        Alert.alert("Success", "Account created successfully");
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
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      Alert.alert("Error", `Connection failed: ${errorMessage}`);
    }
  };

  return (
    <View style={styles.container}>
      <Animatable.View animation="fadeInUp" duration={1400}>
        <TouchableOpacity
          onPress={handleChoosePhoto}
          style={styles.photoContainer}
        >
          {photo ? (
            <Image source={{ uri: photo }} style={styles.photo} />
          ) : (
            <Icon name="user-circle" size={100} color="#5f83b1" />
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
        <TextInput
          placeholder="Full Name"
          placeholderTextColor="#647987"
          style={styles.input}
          value={fullName}
          onChangeText={setFullName}
        />
        <TextInput
          placeholder="Email"
          placeholderTextColor="#647987"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          placeholder="Password"
          placeholderTextColor="#647987"
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          style={styles.dateInput}
        >
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
        <TouchableOpacity
          onPress={() => setShowMajorPicker(!showMajorPicker)}
          style={styles.input}
        >
          <Text style={styles.dateText}>{major || "Select Major"}</Text>
        </TouchableOpacity>
        {showMajorPicker && (
          <Picker
            selectedValue={major}
            onValueChange={(itemValue) => setMajor(itemValue)}
          >
            {internationalMajors.map((m, idx) => (
              <Picker.Item key={idx} label={m} value={m} />
            ))}
          </Picker>
        )}
      </KeyboardAvoidingView>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.primaryButton} onPress={signUp}>
          <Text style={styles.primaryButtonText}>Create Account</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => router.push("/(tabs)/auth/signin")}
        >
          <Text style={styles.dateText}>Already a user?</Text>
          <Text style={styles.secondaryButtonText}>Log in</Text>
        </TouchableOpacity>
      </View>
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
    alignItems: "center",
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
    borderColor: "#1CA7EC",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  dateText: {
    color: "#647987",
  },
});

export default Signup;
