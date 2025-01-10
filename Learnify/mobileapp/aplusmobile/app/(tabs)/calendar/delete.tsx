import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import { Calendar as BigCalendar } from "react-native-big-calendar";
import DateTimePicker from "@react-native-community/datetimepicker";
import Modal from "react-native-modal";
import dayjs from "dayjs";
import Header from "../header/Header";
import NavBar from "../NavBar";
import API from "../../../api/axois";
import AsyncStorage from "@react-native-async-storage/async-storage";
const [userId, setUserId] = useState<string | null>(null);
const initialEvents = [
  {
    title: "Meeting with Sarah",
    start: dayjs().set("hour", 10).toDate(),
    end: dayjs().set("hour", 11).toDate(),
    color: "#FF6347",
  },
  {
    title: "Workout Session",
    start: dayjs()
      .set("date", dayjs().date() + 1)
      .set("hour", 18)
      .toDate(),
    end: dayjs()
      .set("date", dayjs().date() + 1)
      .set("hour", 19)
      .toDate(),
    color: "#1E90FF",
  },
];

export default function CalendarScreen() {
  const [events, setEvents] = useState(initialEvents);
  const [viewMode, setViewMode] = useState<"day" | "week" | "month">("week");
  const [modalVisible, setModalVisible] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    start: new Date(),
    end: new Date(),
  });
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  useEffect(() => {
    const fetchUserId = async () => {
      const userId = await AsyncStorage.getItem("userId");
      setUserId(userId);

      if (!userId) {
        return; // Guard condition to prevent premature execution
      }
    };

    fetchUserId();
    // Function to handle creating a new event
    const handleCreateEvent = async (start: Date, end: Date) => {
      const newEvent = {
        eventTitle: "try New Event ", // Change this dynamically if needed
        eventStart: start.toISOString(),
        eventEnd: end.toISOString(),
        eventDescription: "A newly created event.",
        allDay: 0,
        user_: {
          connect: {
            userId: 2,
          },
        },
      };
      // 172.23.129.135
      try {
        const response = await fetch(
          `http://192.168.68.59:8081/api/event/${userId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newEvent),
            mode: "cors", // Ensure CORS mode is enabled
          }
        );

        if (response.ok) {
          Alert.alert("Success", "Event created successfully!");
          setEvents((prevEvents) => [
            ...prevEvents,
            {
              title: newEvent.eventTitle,
              start: start,
              end: end,
              color: "#32CD32", // Add color to differentiate
            },
          ]);
        } else {
          Alert.alert("Error", "Failed to create the event.");
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        Alert.alert("Error", `Something went wrong: ${errorMessage}`);
      }
    };
    const start = new Date(); // Replace with appropriate start date
    const end = new Date(start.getTime() + 60 * 60 * 1000); // Replace with appropriate end date (1 hour later)
    handleCreateEvent(start, end);
  }, [userId]);

  const handleAddEvent = async () => {
    if (!newEvent.title || !newEvent.description) {
      Alert.alert("Error", "Please fill all the fields");
      return;
    }
    setEvents((prevEvents) => [
      ...prevEvents,
      {
        ...newEvent,
        start: new Date(newEvent.start),
        end: new Date(newEvent.end),
        color: "#87CEEB",
      },
    ]);
    const response = await API.post("/api/events", newEvent);
    if (response.status !== 200) {
      Alert.alert("Error", "Failed to add event.");
      return;
    }

    Alert.alert("Success", "Event added successfully!");
    setModalVisible(false);
    setNewEvent({
      title: "",
      description: "",
      start: new Date(),
      end: new Date(),
    });
  };

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.header}>
        <Text style={styles.headerText}>Calendar</Text>
      </View>
      <BigCalendar
        events={events}
        height={600}
        mode={viewMode}
        eventCellStyle={(event) => ({
          backgroundColor: event.color || "#ADD8E6",
          borderRadius: 8,
        })}
        onPressCell={() => setModalVisible(true)}
        onPressEvent={(event) => Alert.alert(`Event: ${event.title}`)}
      />

      <View style={styles.viewModeButtons}>
        {(["day", "week", "month"] as Array<"day" | "week" | "month">).map(
          (mode) => (
            <TouchableOpacity
              key={mode}
              style={[
                styles.modeButton,
                viewMode === mode && styles.activeModeButton,
              ]}
              onPress={() => setViewMode(mode)}
            >
              <Text
                style={[
                  styles.modeButtonText,
                  viewMode === mode && styles.activeModeButtonText,
                ]}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </Text>
            </TouchableOpacity>
          )
        )}
      </View>

      <Modal
        isVisible={modalVisible}
        onBackdropPress={() => setModalVisible(false)}
        animationIn="zoomIn"
        animationOut="zoomOut"
        backdropOpacity={0.7}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Add New Event</Text>
          <TextInput
            style={styles.input}
            placeholder="Event Title"
            value={newEvent.title}
            onChangeText={(text) =>
              setNewEvent((prev) => ({ ...prev, title: text }))
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Description"
            value={newEvent.description}
            onChangeText={(text) =>
              setNewEvent((prev) => ({ ...prev, description: text }))
            }
          />

          <TouchableOpacity onPress={() => setShowStartPicker(true)}>
            <Text style={styles.datePicker}>
              Start: {dayjs(newEvent.start).format("YYYY-MM-DD HH:mm")}
            </Text>
          </TouchableOpacity>
          {showStartPicker && (
            <DateTimePicker
              value={newEvent.start}
              mode="datetime"
              display="default"
              onChange={(event, date) => {
                setShowStartPicker(false);
                if (date) setNewEvent((prev) => ({ ...prev, start: date }));
              }}
            />
          )}

          <TouchableOpacity onPress={() => setShowEndPicker(true)}>
            <Text style={styles.datePicker}>
              End: {dayjs(newEvent.end).format("YYYY-MM-DD HH:mm")}
            </Text>
          </TouchableOpacity>
          {showEndPicker && (
            <DateTimePicker
              value={newEvent.end}
              mode="datetime"
              display="default"
              onChange={(event, date) => {
                setShowEndPicker(false);
                if (date) setNewEvent((prev) => ({ ...prev, end: date }));
              }}
            />
          )}

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.addButton} onPress={handleAddEvent}>
              <Text style={styles.addButtonText}>Add Event</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.addButton, styles.cancelButton]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.addButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <NavBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    padding: 10,
  },
  header: {
    zIndex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    justifyContent: "center",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  viewModeButtons: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginVertical: 50,
  },
  modeButton: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: "#E0E0E0",
  },
  activeModeButton: {
    backgroundColor: "#1E90FF",
  },
  modeButtonText: {
    color: "#555",
  },
  activeModeButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  modalContent: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: "#CCC",
    marginBottom: 15,
    padding: 5,
  },
  datePicker: {
    color: "#1E90FF",
    marginVertical: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 40,
  },
  addButton: {
    padding: 10,
    backgroundColor: "#1E90FF",
    borderRadius: 20,
    flex: 1,
    alignItems: "center",
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "#FF6347",
  },
  addButtonText: {
    color: "#FFF",
    fontWeight: "600",
  },
});
