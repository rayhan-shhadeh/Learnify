import React, { useState } from 'react';
import { View, Text, Modal, TextInput, Button, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Calendar } from 'react-native-calendars';
import Back from '../Back'
import NavBar from '../NavBar'
import * as Animatable from 'react-native-animatable';
import { FontAwesome } from '@expo/vector-icons';

const CalendarScreen = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [events, setEvents] = useState<{ [key: string]: { title: string; description: string; start: string; end: string }[] }>({});
  const [modalVisible, setModalVisible] = useState(false);
  const [eventDetails, setEventDetails] = useState({ title: '', description: '', start: '', end: '' });
  const [editMode, setEditMode] = useState(false);
  const [editKey, setEditKey] = useState<number | null>(null);

  // Handle Event Submission
  const handleSubmit = () => {
    if (editMode) {
      // Edit existing event
      const updatedEvents = { ...events };
      updatedEvents[selectedDate] = updatedEvents[selectedDate].map((event, index) =>
        index === editKey ? eventDetails : event
      );
      setEvents(updatedEvents);
      setEditMode(false);
    } else {
      // Add new event
      setEvents((prevEvents) => ({
        ...prevEvents,
        [selectedDate]: [...(prevEvents[selectedDate] || []), eventDetails],
      }));
    }
    setModalVisible(false);
    setEventDetails({ title: '', description: '', start: '', end: '' });
  };

  // Handle Delete Event
  const handleDelete = (index: number) => {
    const updatedEvents = { ...events };
    updatedEvents[selectedDate].splice(index, 1);
    if (updatedEvents[selectedDate].length === 0) {
      delete updatedEvents[selectedDate];
    }
    setEvents(updatedEvents);
  };

  // Handle Edit Event
  const handleEdit = (index: number) => {
    setEventDetails(events[selectedDate][index]);
    setEditMode(true);
    setEditKey(index);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Back title={''} onBackPress={() => {}}/>
      <Calendar
        onDayPress={(day: { dateString: string }) => {
          setSelectedDate(day.dateString);
          setModalVisible(true);
        }}
        markedDates={{
          ...Object.keys(events).reduce((acc: { [key: string]: { marked: boolean } }, date: string) => {
            acc[date] = { marked: true };
            return acc;
          }, {}),
          [selectedDate]: { selected: true, marked: true },
        }}
      />

      <FlatList
        data={events[selectedDate] || []}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <Animatable.View animation="fadeInUp" style={styles.eventItem}>
            <Text style={styles.eventTitle}>{item.title}</Text>
            <Text>{item.description}</Text>
            <Text>{new Date(item.start).toLocaleString()} - {new Date(item.end).toLocaleString()}</Text>
            <View style={styles.eventActions}>
              <TouchableOpacity onPress={() => handleEdit(index)}>
                <FontAwesome name="edit" size={24} color="blue" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(index)}>
                <FontAwesome name="trash" size={24} color="red" />
              </TouchableOpacity>
            </View>
          </Animatable.View>
        )}
      />

      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContent}>
          <TextInput
            placeholder="Title"
            value={eventDetails.title}
            onChangeText={(text) => setEventDetails({ ...eventDetails, title: text })}
            style={styles.input}
          />
          <TextInput
            placeholder="Description"
            value={eventDetails.description}
            onChangeText={(text) => setEventDetails({ ...eventDetails, description: text })}
            style={styles.input}
          />
          <TextInput
            placeholder="Start Time (YYYY-MM-DDTHH:MM:SS.SSSZ)"
            value={eventDetails.start}
            onChangeText={(text) => setEventDetails({ ...eventDetails, start: text })}
            style={styles.input}
          />
          <TextInput
            placeholder="End Time (YYYY-MM-DDTHH:MM:SS.SSSZ)"
            value={eventDetails.end}
            onChangeText={(text) => setEventDetails({ ...eventDetails, end: text })}
            style={styles.input}
          />
          <Button title="Save" onPress={handleSubmit} />
          <Button title="Cancel" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
      <NavBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  eventItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginVertical: 5,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  eventActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  modalContent: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 8,
    marginBottom: 16,
    borderRadius: 4,
  },
});

export default CalendarScreen;
