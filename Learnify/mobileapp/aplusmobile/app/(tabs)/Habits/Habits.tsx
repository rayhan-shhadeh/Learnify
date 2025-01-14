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
import API from "../../../api/axois";
import CheckBox from "react-native-check-box";
import Icon from "react-native-vector-icons/FontAwesome";
interface Habit {
  habitId: string;
  habitName: string;
  habitDescription: string;
  reminderTime: string;
}

const Habits = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [userId, setUserId] = useState<string>("");
  const [checkedHabits, setCheckedHabits] = useState<string[]>([]);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [updatedDescription, setUpdatedDescription] = useState("");
  const [updatedName, setUpdatedName] = useState("");
  const [updatedReminderTime, setUpdatedReminderTime] = useState("");
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);

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
    fetchHabits();
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

  const toggleCheckbox = (habitId: string) => {
    setCheckedHabits((prev) =>
      prev.includes(habitId)
        ? prev.filter((id) => id !== habitId)
        : [...prev, habitId]
    );
    const index = checkedHabits.indexOf(habitId);
    const response = API.put(`/api/habit/${habitId}`, {
      isCompleted: index === -1 ? true : false,
    });
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

  return (
    <View style={styles.container}>
      <ScrollView>
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
              <Text
                style={[
                  styles.habitName,
                  checkedHabits.includes(habit.habitId) && styles.strikethrough,
                ]}
              >
                {habit.habitName}
              </Text>
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
            <Text style={styles.habitDescription}>
              {habit.habitDescription}
            </Text>
            <Text style={styles.reminderTime}>
              Reminder: {new Date(habit.reminderTime).toLocaleString()}
            </Text>
          </Animatable.View>
        ))}
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
    paddingLeft: 20,
    paddingRight: 20,
  },
  habitCard: {
    backgroundColor: "#fff",
    padding: 20,
    marginBottom: 15,
    borderRadius: 10,
    elevation: 3,
  },
  habitRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  habitName: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
    marginLeft: 10,
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
  },
  reminderTime: {
    fontSize: 12,
    color: "#999",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    borderRadius: 10,
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
