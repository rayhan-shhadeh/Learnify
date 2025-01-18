import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  Alert,
  Modal,
  Image,
} from "react-native";
import CalendarPicker from "react-native-calendar-picker";
import Icon from "react-native-vector-icons/FontAwesome";
import { LinearGradient } from "expo-linear-gradient";
import NavBar from "../NavBar";
import Header from "../header/Header";
import API from "../../../api/axois";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import Habits from "./Habits";
import LottieView from "lottie-react-native";

export default function HabitsScreen() {
  const [habits, setHabits] = useState<
    { habitId: number; habitName: string; habitStatus: boolean }[] | undefined
  >([]);
  const [newHabit, setNewHabit] = useState("");
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState("");
  const [habitName, setHabitName] = useState("");
  const [reminderTime, setReminderTime] = useState("");
  const [habitDescription, setHabitDescription] = useState("");
  const [habitStatus, setHabitStatus] = useState(false);
  const [createdAt, setCreatedAt] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const today = new Date();
  const [date, setDate] = useState(today);
  const [mode, setMode] = useState("date");

  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const customDatesStyles = [];
  let day = new Date(startOfMonth);
  while (day.getMonth() === today.getMonth()) {
    customDatesStyles.push({
      date: new Date(day),
      // Random colors
      style: {
        backgroundColor:
          "#" +
          ("00000" + ((Math.random() * (1 << 24)) | 0).toString(16)).slice(-6),
      },
      textStyle: { color: "black" }, // sets the font color
      containerStyle: [], // extra styling for day container
      allowDisabled: true, // allow custom style to apply to disabled dates
    });
    day.setDate(day.getDate() + 1);
  }
  useEffect(() => {
    if (userId) fetchHabits();
  }, [userId]);

  // Fetch habits from the backend
  const fetchHabits = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem("currentUserId");
      if (!storedUserId) {
        Alert.alert("Error", "User ID not found.");
        return;
      }
      setUserId(storedUserId);
      setLoading(true);
      const response = await API.get(`/api/habit/all/${storedUserId}`);
      const data = response.data;
      setHabits(data);
      setLoading(false);
    } catch (error) {
      if (error instanceof Error) {
        console.error(
          "Error fetching habits:",
          (error as any).response?.data || error.message
        );
      } else {
        console.error("Error fetching habits:", error);
      }
      Alert.alert("Error", "Failed to fetch habits. Please try again.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  // Add a new habit
  const addHabit = async () => {
    const newHabitObj = {
      habitName: habitName,
      habitDescription: habitDescription,
      reminderTime: reminderTime.toString(),
      createdAt: new Date().toISOString(),
      user_: {
        connect: { userId: parseInt(userId) },
      },
    };
    try {
      const response = await API.post(`/api/habit`, newHabitObj);

      if (response.status === 200 || response.status === 201) {
        fetchHabits();
        setNewHabit("");
      }
    } catch (error) {
      console.error("Error adding habit:", error);
    }
  };

  // Toggle habit completion
  const toggleHabitCompletion = async (id: number) => {
    try {
      const habit = habits?.find((h) => h.habitId === id);
      if (habit) {
        const updatedHabit = { ...habit, habitStatus: !habit.habitStatus };
        const response = await API.put(`/api/habit/${id}`, {
          habitName: updatedHabit.habitName,
          // habitStatus: updatedHabit.habitStatus,
          user_: {
            connect: { userId: parseInt(userId) },
          },
        });
        if (response.status === 200) {
          fetchHabits();
        } else {
          Alert.alert("Error", "Failed to update habit.");
        }
      }
    } catch (error) {
      console.error("Error updating habit:", error);
    }
  };

  // Delete a habit
  const deleteHabit = async (id: number) => {
    try {
      const response = await API.delete(`/api/habit/${userId}`);
      if (response.status === 200) {
        fetchHabits();
      } else {
        Alert.alert("Error", "Failed to delete habit.");
      }
    } catch (error) {
      console.error("Error deleting habit:", error);
    }
  };

  // Render a habit item
  const renderHabit = ({
    item,
  }: {
    item: { habitId: number; habitName: string; habitStatus: boolean };
  }) => (
    <View style={styles.habitContainer}>
      <TouchableOpacity
        onPress={() => toggleHabitCompletion(item.habitId)}
        style={{ flex: 1 }}
      >
        <Text
          style={[styles.habitText, item.habitStatus && styles.completedHabit]}
        >
          {item.habitName}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => deleteHabit(item.habitId)}>
        <Icon name="trash" size={20} color="red" />
      </TouchableOpacity>
    </View>
  );

  return (
    <LinearGradient
      colors={["#ddf3f5", "#f7f7f7", "#fbfbfb", "#9ad9ea"]}
      style={styles.linearcontainer}
    >
      <Header />

      <View style={styles.container}>
        <Text style={styles.header}>Habits</Text>

        {/* <FlatList
          style={[styles.myhabit]}
          data={habits}
          renderItem={renderHabit}
          keyExtractor={(item) => item.habitId}
          refreshing={loading}
          onRefresh={fetchHabits}
        /> */}
        <Habits />
        <TouchableOpacity
          style={styles.addHabitButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.addButtonText}>Add Habit</Text>
        </TouchableOpacity>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <LottieView
                style={styles.logo}
                source={require("../../../assets/brain.json")}
                autoPlay
                loop
              />
              <Text style={styles.habitText}> Habit name:</Text>
              <TextInput
                style={styles.input}
                placeholder="Habit Name"
                value={habitName}
                onChangeText={setHabitName}
              />
              <Text style={styles.habitText}> Habit description:</Text>

              <TextInput
                style={styles.input}
                placeholder="Habit Description"
                value={habitDescription}
                onChangeText={setHabitDescription}
              />
              <Text style={styles.habitText}> Reminder time:</Text>
              <DateTimePicker
                testID="dateTimePicker"
                value={reminderTime ? new Date(reminderTime) : new Date()}
                mode="time"
                display="default"
                onChange={(event, selectedDate) => {
                  setReminderTime(new Date().toISOString() || "");
                }}
                style={styles.datetime}
              />
              <View style={styles.addcontainer}>
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => {
                    addHabit();
                    setModalVisible(false);
                  }}
                >
                  <Text style={styles.addButtonText}>Add</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
      <NavBar />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    top: 0,
    marginTop: -10,
  },
  header: {
    fontSize: 24,
    textAlign: "center",
  },
  habitContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: "transparent",
    borderRadius: 10,
    elevation: 2,
  },
  habitText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  completedHabit: {
    textDecorationLine: "line-through",
    color: "gray",
  },
  inputContainer: {
    flexDirection: "row",
    marginTop: 20,
    alignItems: "center",
    marginBottom: 50,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    color: "#333",
    height: 60,
    padding: 20,
    borderRadius: 8,
    marginRight: 10,
    marginBlock: 5,
  },
  addButton: {
    backgroundColor: "#1CA7EC",
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    alignContent: "center",
    textAlign: "center",
    width: "40%",
  },
  addHabitButton: {
    backgroundColor: "#1CA7EC",
    padding: 12,
    borderRadius: 8,
    marginVertical: 15,
    marginBottom: 50,
    width: "80%",
    alignSelf: "center",
    alignContent: "center",
    textAlign: "center",

    height: 50,
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: "Roboto",
    fontSize: 18,
  },
  linearcontainer: {
    flex: 1,
  },
  addcontainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  myhabit: {
    flex: 1,
    zIndex: 1,
    marginTop: 20,
    borderRadius: 30,
    marginVertical: 20,
    marginBottom: 20,
    overflow: "hidden",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
  },
  modalHeader: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  cancelButton: {
    backgroundColor: "red",
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    width: "40%",
  },
  cancelButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  logo: {
    width: 200,
    height: 200,
    alignSelf: "center",
    marginBottom: 10,
    top: -20,
  },
  datetime: {
    width: "100%",
    borderRadius: 8,
    marginTop: 10,
  },
});
