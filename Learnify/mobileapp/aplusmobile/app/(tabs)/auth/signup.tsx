import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import { launchImageLibrary } from 'react-native-image-picker';
import * as Animatable from "react-native-animatable";
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from "expo-router";

const Signup = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dateofbirth, setDateOfBirth] = useState<Date | undefined>(undefined);
  const [major, setMajor] = useState('');
  const [photo, setPhoto] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  const handleChoosePhoto = () => {
    launchImageLibrary({
        mediaType: "photo"
    }, response => {
      if (response.assets && response.assets.length > 0) {
        setPhoto(response.assets[0].uri || '');
      }
    });
  };
  const handleDateChange = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || dateofbirth;
    setShowDatePicker(Platform.OS === 'ios');
    setDateOfBirth(currentDate);
  };
  
  const displayDate = dateofbirth ? dateofbirth.toDateString() : 'Select Date';
const router = useRouter();
  return (
    <View
      style={styles.container}
    >
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
              value={dateofbirth || new Date()}
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
            value={major}
            onChangeText={setMajor}
          />
        </Animatable.View>
        
      </KeyboardAvoidingView>

      {/* Buttons */}
      <Animatable.View animation="fadeInUp" duration={1600}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Create Account</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={()=>{router.push("/auth/signin")}} >
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
    width:200,
    marginBottom: 10,
  },
  primaryButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    borderBlockColor: "black",
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
