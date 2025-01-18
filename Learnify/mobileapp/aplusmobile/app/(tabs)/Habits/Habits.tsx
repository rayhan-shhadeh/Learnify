import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TextInput,
  TouchableOpacity,
} from "react-native";
import * as Animatable from "react-native-animatable";
import API, { LOCALHOST } from "../../../api/axois";
import CheckBox from "react-native-check-box";
import Icon from "react-native-vector-icons/FontAwesome";
import { StreakProvider, useStreak } from "../hooks/StreakContext";
import StreakFire from "../streak/StreakFire";
import CalendarPicker from "react-native-calendar-picker";
import { Calendar } from "react-native-calendars";
import { useRouter } from "expo-router";

interface Habit {
  habitId: string;
  habitName: string;
  habitDescription: string;
  reminderTime: string;
}

const Habits = () => {
  const [markedDates, setMarkedDates] = useState<{ [key: string]: any }>({});
  const [habits, setHabits] = useState<Habit[]>([]);
  const [userId, setUserId] = useState<string>("");
  const [checkedHabits, setCheckedHabits] = useState<string[]>([]);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [updatedDescription, setUpdatedDescription] = useState("");
  const [updatedName, setUpdatedName] = useState("");
  const [coloredHabits, setcoloredHabits] = useState([]);
  const [updatedReminderTime, setUpdatedReminderTime] = useState("");
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [year, setHabitYear] = useState("");
  const [month, setMonth] = useState("");
  const [habitName, setHabitName] = useState("");
  const router = useRouter();
  const fetchHabitData = async (habitId: string) => {
    try {
      const response = await fetch(
        `http://${LOCALHOST}:8080/api/trackHabit/monthlyTracker/${habitId}?year=2025&month=1`
      );
      const data = await response.json();

      // Transform API response into markedDates format
      const dates: { [key: string]: any } = {};
      data.forEach((item: { trackDate: string; completeStatus: number }) => {
        const date = item.trackDate.split("T")[0]; // Get YYYY-MM-DD
        dates[date] = {
          startingDay: true,
          endingDay: true,
          color: item.completeStatus === 1 ? "#1fd655" : "#e0e0e0",
          textColor: item.completeStatus === 1 ? "white" : "#757575",
        };
      });

      setMarkedDates(dates);
    } catch (error) {
      console.error("Error fetching habit data:", error);
    }
  };

  //fetchHabitData();

  const fetchHabits = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem("currentUserId");
      const response = await API.get(`/api/habit/all/${storedUserId}`); // Fetch habits for the current user

      const data = await response.data;
      setHabits(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchHabitData = async () => {
      try {
        const response = await fetch(
          `http://${LOCALHOST}:8080/api/trackHabit/monthlyTracker/3?year=2025&month=1`
        );
        const data = await response.json();

        // Transform API response into markedDates format
        const dates: { [key: string]: any } = {};
        data.forEach((item: { trackDate: string; completeStatus: number }) => {
          const date = item.trackDate.split("T")[0]; // Get YYYY-MM-DD
          dates[date] = {
            startingDay: true,
            endingDay: true,
            color: item.completeStatus === 1 ? "#1fd655" : "#e0e0e0",
            textColor: item.completeStatus === 1 ? "white" : "#757575",
          };
        });

        setMarkedDates(dates);
      } catch (error) {
        console.error("Error fetching habit data:", error);
      }
    };

    fetchHabitData();
  }, []);
  useEffect(() => {
    fetchHabits();
    fetchMonthlyHabits();
  }, []); // Fetch habits once when component mounts

  // Delete a habit
  const deleteHabit = async (id: string) => {
    try {
      const response = await API.delete(`/api/habit/${id}`);
      if (response.status === 200) {
        fetchHabits();
      } else {
        Alert.alert("Error", "Failed to delete habit.");
      }
    } catch (error) {
      console.error("Error deleting habit:", error);
    }
  };
  // const { streak, incrementStreak } = useStreak();
  const [visible, setVisible] = useState(false);
  // const handleCompleteHabit = () => {
  //   incrementStreak();
  //   setVisible(true);
  // };
  const handleCompleteHabit = async (habitId: string) => {
    try {
      // Add your logic to handle completing a habit
      const response = API.post(`/api/trackHabit/isComplete/${habitId}`, {
        trackDate: new Date().toISOString(),
        isCompleted: true,
      });
      setMonth(new Date().getMonth().toString());
      setHabitYear(new Date().getFullYear().toString());
      console.log(`Habit ${habitId} completed`);
      Alert.alert(
        "Habit Completed",
        "Good job! Keep it up!",
        (await response).data.trackDate
      );
      fetchHabitData(habitId);
    } catch (error) {
      console.error("Error completing habit:", error);
    }
  };

  const handleUncompleteHabit = async (habitId: string) => {
    try {
      // Add your logic to handle uncompleting a habit
      const response = API.post(`/api/trackHabit/isComplete/${habitId}`, {
        trackDate: new Date().toISOString(),
        isCompleted: false,
      });

      Alert.alert(
        "Habit Uncompleted",
        "Don't worry, you got this!",
        (await response).data.trackDate
      );
      fetchHabitData(habitId);
      console.log(`Habit ${habitId} uncompleted`);
    } catch (error) {
      console.error("Error uncompleting habit:", error);
    }
  };

  const toggleCheckbox = (habitId: string) => {
    setCheckedHabits((prev) =>
      prev.includes(habitId)
        ? prev.filter((id) => id !== habitId)
        : [...prev, habitId]
    );
    const index = checkedHabits.indexOf(habitId);
    try {
      if (index === -1) {
        handleCompleteHabit(habitId);
      } else {
        handleUncompleteHabit(habitId);
      }
    } catch (error) {
      console.error("Error completing habit:", error);
    }
    // handleCompleteHabit();
  };

  const openEditModal = (habit: Habit) => {
    setSelectedHabit(habit);
    setUpdatedName(habit.habitName);
    setUpdatedDescription(habit.habitDescription);
    setEditModalVisible(true);
  };

  const closeEditModal = () => {
    setEditModalVisible(false);
    setSelectedHabit(null);
  };

  const handleSaveHabit = async () => {
    if (selectedHabit) {
      try {
        const updatedHabit = {
          ...selectedHabit,
          habitName: updatedName,
          habitDescription: updatedDescription,
        };
        const response = await API.put(
          `/api/habit/${selectedHabit.habitId}`,
          updatedHabit
        );
        if (response.status === 200) {
          fetchHabits();
          closeEditModal();
        } else {
          Alert.alert("Error", "Failed to update habit.");
        }
      } catch (error) {
        console.error("Error updating habit:", error);
      }
    }
  };
  const fetchMonthlyHabits = async () => {
    const habitId = 3; // Replace with the actual user ID
    const year = 2025;
    const month = 1;

    try {
      const response = await fetch(
        `http://${LOCALHOST}:8080/api/trackHabit/monthlyTracker/3?year=2025&month=1`
      );

      if (response.status !== 201) {
        throw new Error("Failed to fetch habits data");
      }

      const data = await response.json();
      const completedDays = data
        .filter(
          (habit: { completeStatus: number; trackDate: string }) =>
            habit.completeStatus === 1
        )
        .map((habit: { trackDate: string }) =>
          new Date(habit.trackDate).getDate()
        );
      setcoloredHabits(completedDays);

      console.log(data); // Handle the data as needed
      // Alert.alert("Monthly habits fetched", completedDays.toString());
      // days output
      console.log("completed days", completedDays);
    } catch (error) {
      console.error("Error fetching habits:", error);
    }
  };
  // const getCustomDateStyles = (date: Date) => {
  //   if (date.getDay() === 0) {
  //     // Sunday
  //     return {
  //       date,
  //       style: { backgroundColor: "red", borderRadius: 20 },
  //       textStyle: { color: "white" },
  //     };
  //   }
  //   return {
  //     date,
  //     style: { backgroundColor: "red", color: "green", borderRadius: 20 },
  //     textStyle: {},
  //   };
  // };
  // const customDatesStyles = (date: Date) => {
  //   if (date.toISOString() === "2025-01-15") {
  //     return {
  //       date,
  //       style: { backgroundColor: "blue" },
  //       textStyle: { color: "white" },
  //     }; // Styling for a specific date
  //   }
  //   return {
  //     date,
  //     style: {},
  //     textStyle: {},
  //   }; // No styles for other dates
  //};
  return (
    // <StreakProvider>
    <View style={styles.container}>
      <View style={{ marginVertical: 5 }}>
        {/* <CalendarPicker
          onDateChange={(date) => console.log("Selected date:", date)}
          customDatesStyles={(date) => {
            const dateString = date.toISOString().split("T")[0];
            return markedDates[dateString]
              ? markedDates[dateString]
              : {
                  date,
                };
          }}
          selectedDayStyle={{ backgroundColor: "green" }}
          selectedDayTextColor="white"
          todayBackgroundColor="#f2e6ff"
          todayTextStyle={{ color: "black" }}
        /> */}
        <Calendar
          markingType={"period"}
          markedDates={markedDates}
          theme={{
            calendarBackground: "#f5f5f5",
            textSectionTitleColor: "#2e7d32",
            dayTextColor: "#000000",
            textDisabledColor: "#d9e1e8",
            arrowColor: "#2e7d32",
            todayTextColor: "#ff5722",
            textDayFontWeight: "300",
            textMonthFontWeight: "500",
            textDayHeaderFontWeight: "500",
            textMonthFontSize: 10,
            textDayHeaderFontSize: 8,
            radius: 50,
            selectedDayBackgroundColor: "#2e7d32",
            selectedDayTextColor: "#ffffff",
            textDayStyle: { margin: 5 },
            textDayFontSize: 10,
          }}
          style={{
            borderRadius: 50,
            padding: -50,
            margin: -8,
            transform: [{ scale: 1 }],
            width: "100%",
          }} // Zoom out the calendar}}
        />
      </View>
      <ScrollView>
        {/* Monthly habits will be fetched in useEffect */}
        {habits.map((habit, index) => (
          <Animatable.View
            key={habit.habitId}
            style={styles.habitCard}
            animation="fadeInUp"
            delay={index * 100}
          >
            <View style={styles.habitRow}>
              <CheckBox
                isChecked={checkedHabits.includes(habit.habitId)}
                onClick={() => toggleCheckbox(habit.habitId)}
                checkedImage={
                  <Icon name="check-square" size={20} color={"#5ced73"} />
                }
                unCheckedImage={<Text>⬜</Text>}
              />
              <TouchableOpacity
                style={{ flexDirection: "row", zIndex: 1, flex: 1 }}
                onPress={() => {
                  fetchHabitData(habit.habitId);
                  setHabitName(habit.habitName);
                }}
              >
                <Text
                  style={[
                    styles.habitName,
                    checkedHabits.includes(habit.habitId) &&
                      styles.strikethrough,
                  ]}
                >
                  {habit.habitName}
                </Text>
              </TouchableOpacity>

              <Text
                style={styles.editIcon}
                onPress={() => openEditModal(habit)}
              >
                ✏️
              </Text>
              <Animatable.Text
                animation="bounceIn"
                delay={index * 100 + 50}
                style={{ marginLeft: 10 }}
                onPress={() => deleteHabit(habit.habitId)}
              >
                <Text style={{ color: "#4a90e2" }}>🗑️</Text>
              </Animatable.Text>
            </View>
            <Text style={styles.habitRowTwo}>
              <Text style={styles.habitDescription}>
                {habit.habitDescription}
              </Text>
            </Text>
            <Text style={styles.reminderTime}>
              Reminder: {/*  view only the reminder hour not all date */}
              {new Date(habit.reminderTime)
                .toLocaleString()
                .slice(11)
                .slice(1, 7)}
            </Text>
          </Animatable.View>
        ))}
        {/* <StreakFire
            streak={streak}
            visible={visible}
            onFinish={() => setVisible(false)}
          /> */}
      </ScrollView>

      {isEditModalVisible && (
        <Modal
          transparent
          animationType="slide"
          visible={isEditModalVisible}
          onRequestClose={closeEditModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Icon name="close" size={24} onPress={closeEditModal} />
              <Icon
                name="wpforms"
                size={40}
                style={{
                  paddingBottom: 10,
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                  alignSelf: "center",
                  color: "#4a90e2",
                }}
              />
              <Text style={styles.modalTitle}>Edit Habit</Text>
              <TextInput
                style={styles.input}
                value={updatedName}
                onChangeText={setUpdatedName}
                placeholder="Habit Name"
              />
              <TextInput
                style={styles.input}
                value={updatedDescription}
                onChangeText={setUpdatedDescription}
                placeholder="Habit Description"
                multiline
              />
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleSaveHabit}
                >
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={closeEditModal}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  habitCard: {
    backgroundColor: "#e0f3f7",
    padding: 20,
    marginBottom: 15,
    borderRadius: 20,
    elevation: 3,
    shadowColor: "#333",
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    height: 150,
  },
  habitRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  habitRowTwo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  habitName: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
    marginLeft: 5,
    color: "#333",
  },
  strikethrough: {
    textDecorationLine: "line-through",
    color: "#999",
  },
  editIcon: {
    fontSize: 18,
    color: "#4a90e2",
    marginLeft: 10,
  },
  habitDescription: {
    fontSize: 14,
    color: "#666",
    marginVertical: 5,
    justifyContent: "space-between",
    alignContent: "space-between",
  },
  reminderTime: {
    fontSize: 12,
    color: "#999",
    justifyContent: "flex-end",
    textAlign: "right",
    right: 0,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  saveButton: {
    backgroundColor: "#4a90e2",
    padding: 10,
    borderRadius: 8,
  },
  saveButtonText: {
    color: "#fff",
  },
  cancelButton: {
    backgroundColor: "#ccc",
    padding: 10,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: "#333",
  },
});

export default Habits;
