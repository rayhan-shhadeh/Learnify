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
  const [userId, setUserId] = useState("");

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
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [showEditStartPicker, setShowEditStartPicker] = useState(false);
  const [showEditEndPicker, setShowEditEndPicker] = useState(false);
  const [editEvent, setEditEvent] = useState({
    title: "",
    description: "",
    start: new Date(),
    end: new Date(),
  });
  const [allevents, setAllEvents] = useState([]);
  useEffect(() => {
    handleGetEvents();
  }, []);
  const handleEditEvent = async (event: any) => {
    setEditEvent({
      title: event.title,
      description: event.description,
      start: event.start,
      end: event.end,
    });
    setEditModalVisible(true);

    // const userId = await AsyncStorage.getItem("currentUserId");
    // const token = await AsyncStorage.getItem("token");
    // if (!userId) {
    //   Alert.alert("Error", "You are not logged in.");
    //   return;
    // }
    // setUserId(userId);
    // try {
    //   const response = await API.put(`/api/event/${event.id}`, {
    //     eventTitle: event.title,
    //     eventStart: event.start.toISOString(),
    //     eventEnd: event.end.toISOString(),
    //     description: event.description,
    //     user_: {
    //       connect: {
    //         userId: userId ? parseInt(userId) : 1,
    //       },
    //     },
    //   });
    //   if (response.status === 200) {
    //     Alert.alert("Success", "Event updated successfully!");
    //     handleSaveEditEvent(event);
    //   } else {
    //     Alert.alert("Error", "Failed to update event.");
    //   }
    // } catch (error) {
    //   console.error(error);
    //   Alert.alert("Error", "An error occurred while updating the event.");
    // }
  };
  const handleDeleteEvent = async (event: any) => {
    try {
      const response = await API.delete(`/api/event/${event.id}`);
      if (response.status === 200) {
        Alert.alert("Success", "Event deleted successfully!");
        handleGetEvents();
      } else {
        Alert.alert("Error", "Failed to delete event.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "An error occurred while deleting the event.");
    }
  };
  const handleSaveEditEvent = async (event) => {
    if (!event.title || !event.description) {
      Alert.alert("Error", "Please fill in all the fields.");
      return;
    }

    const userId = await AsyncStorage.getItem("currentUserId");
    const requestBody = {
      eventTitle: editEvent.title,
      eventStart: editEvent.start.toISOString(),
      eventEnd: editEvent.end.toISOString(),
      eventDescription: editEvent.description,
      user_: {
        connect: {
          userId: userId ? parseInt(userId) : 1, // Replace with the actual user ID
        },
      },
    };
    Alert.alert("event id", event.id.toString());
    try {
      const response = await API.put(
        `/api/event/update/${event.id}`,
        requestBody
      );
      console.log("API Response:", response); // Debug log
      const status = response?.status || response?.data?.status;
      if (response.status === 200 || status === 201) {
        setEvents((prevEvents) => [
          ...prevEvents,
          {
            title: newEvent.title,
            description: newEvent.description,
            start: newEvent.start,
            end: newEvent.end,
            color: "#87CEEB",
          },
        ]);
        Alert.alert("Success", "Event updated successfully!");
        handleGetEvents();
        setEditModalVisible(false);
      } else {
        Alert.alert("Error", "Failed to edit event.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "An error occurred while updating the event.");
    }
  };

  const handleGetEvents = async () => {
    try {
      const userId = await AsyncStorage.getItem("currentUserId");
      const token = await AsyncStorage.getItem("token");
      if (!userId) {
        Alert.alert("Error", "You are not logged in.");
        return;
      }
      const response = await API.get(`/api/user/events/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        const fetchedEvents = response.data.map((event: any) => ({
          id: event.eventId,
          title: event.eventTitle,
          start: new Date(event.eventStart),
          end: new Date(event.eventEnd),
          color: "#87CEEB", // You can set color dynamically if needed
        }));
        setEvents(fetchedEvents);
      } else {
        Alert.alert("Error", "Failed to fetch events.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "An error occurred while fetching events.");
    }
  };

  const handleAddEvent = async () => {
    if (!newEvent.title || !newEvent.description) {
      Alert.alert("Error", "Please fill all the fields");
      return;
    }
    const userId = await AsyncStorage.getItem("currentUserId");
    const requestBody = {
      eventTitle: newEvent.title,
      eventStart: newEvent.start.toISOString(),
      eventEnd: newEvent.end.toISOString(),
      eventDescription: newEvent.description,
      user_: {
        connect: {
          userId: userId ? parseInt(userId) : 0, // Replace with the actual user ID
        },
      },
    };

    try {
      const response = await API.post("/api/event", requestBody);
      console.log("API Response:", response); // Debug log
      const status = response?.status || response?.data?.status;
      if (response.status === 200 || status === 201) {
        setEvents((prevEvents) => [
          ...prevEvents,
          {
            title: newEvent.title,
            description: newEvent.description,
            start: newEvent.start,
            end: newEvent.end,
            color: "#87CEEB",
          },
        ]);
        Alert.alert("Success", "Event added successfully!");
      } else {
        Alert.alert("Error", "Failed to add event.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "An error occurred while adding the event.");
    }

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
        onPressEvent={(event) => {
          Alert.alert(
            `Event: ${event.title}`,
            "Choose an action",
            [
              {
                text: "Edit",
                onPress: () => handleEditEvent(event),
              },
              {
                text: "Delete",
                onPress: () => handleDeleteEvent(event),
                style: "destructive",
              },
              {
                text: "Cancel",
                style: "cancel",
              },
            ],
            { cancelable: true }
          );
        }}
      />

      {/* Edit Event Modal */}
      <Modal
        isVisible={editModalVisible}
        onBackdropPress={() => setEditModalVisible(false)}
        animationIn="zoomIn"
        animationOut="zoomOut"
        backdropOpacity={0.7}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Edit Event</Text>
          <TextInput
            style={styles.input}
            placeholder="Event Title"
            value={editEvent.title}
            onChangeText={(text) =>
              setEditEvent((prev) => ({ ...prev, title: text }))
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Description"
            value={editEvent.description}
            onChangeText={(text) =>
              setEditEvent((prev) => ({ ...prev, description: text }))
            }
          />

          <TouchableOpacity onPress={() => setShowEditStartPicker(true)}>
            <Text style={styles.datePicker}>
              Start: {dayjs(editEvent.start).format("YYYY-MM-DD HH:mm")}
            </Text>
          </TouchableOpacity>
          {showEditStartPicker && (
            <DateTimePicker
              value={editEvent.start}
              mode="datetime"
              display="default"
              onChange={(event, date) => {
                setShowEditStartPicker(false);
                if (date) setEditEvent((prev) => ({ ...prev, start: date }));
              }}
            />
          )}

          <TouchableOpacity onPress={() => setShowEditEndPicker(true)}>
            <Text style={styles.datePicker}>
              End: {dayjs(editEvent.end).format("YYYY-MM-DD HH:mm")}
            </Text>
          </TouchableOpacity>
          {showEditEndPicker && (
            <DateTimePicker
              value={editEvent.end}
              mode="datetime"
              display="default"
              onChange={(event, date) => {
                setShowEditEndPicker(false);
                if (date) setEditEvent((prev) => ({ ...prev, end: date }));
              }}
            />
          )}

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => handleSaveEditEvent(editEvent)}
            >
              <Text style={styles.addButtonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.addButton, styles.cancelButton]}
              onPress={() => setEditModalVisible(false)}
            >
              <Text style={styles.addButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
              onPress={() => {
                setModalVisible(false);
                setEditEvent({
                  title: "",
                  description: "",
                  start: new Date(),
                  end: new Date(),
                });
              }}
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
    top: -55,
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
    marginVertical: 10,
  },
  modeButton: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: "#E0E0E0",
    marginBottom: 40,
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
    marginBottom: 50,
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
