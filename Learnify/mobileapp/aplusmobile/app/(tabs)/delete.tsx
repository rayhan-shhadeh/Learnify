import React, { useState } from 'react';
import { View, StyleSheet, Button, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Calendar as BigCalendar } from 'react-native-big-calendar';
import DateTimePicker from '@react-native-community/datetimepicker';
import Modal from 'react-native-modal';
import dayjs from 'dayjs';
import Back from './Back';
import NavBar from './NavBar';
import API from '../../api/axois';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {jwtDecode} from 'jwt-decode';
// Mock Events Data
const initialEvents = [
  {
    title: 'Meeting with Sarah',
    start: dayjs().set('hour', 10).toDate(), // Today at 10:00 AM
    end: dayjs().set('hour', 11).toDate(), // Today at 11:00 AM
    color: '#FF6347',
  },
  {
    title: 'Workout Session',
    start: dayjs().set('date', dayjs().date() + 1).set('hour', 18).toDate(), // Tomorrow at 6:00 PM
    end: dayjs().set('date', dayjs().date() + 1).set('hour', 19).toDate(), // Tomorrow at 7:00 PM
    color: '#1E90FF',
  },
];

export default function CalendarScreen() {
  const [events, setEvents] = useState(initialEvents);
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('week');
  const [modalVisible, setModalVisible] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    start: new Date(),
    end: new Date(),
  });
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const handleAddEvent = async () => {
    if (!newEvent.title || !newEvent.description) {
      Alert.alert('Error', 'Please fill all the fields');
      return;
    }
        const token = await AsyncStorage.getItem('token');
    if (!token) {
      Alert.alert('Error', 'Please login to add events');
      return;
    }
 const decoded: { id: string } | null = jwtDecode<{ id: string }>(token);

    // Add new event to server
    const response =  API.post('/api/event', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        eventTitle: newEvent.title,
        eventStart: newEvent.start,
        eventEnd: newEvent.end,
        eventDescription: newEvent.description,
        allDay: 0,
        user_: {
          connect: {
            userId: decoded.id, // Replace with dynamic user ID if applicable
          },
        },
      }),
    })
     // .then((response) => response.json())
      .then((data) => {
        setEvents((prevEvents) => [
          ...prevEvents,
          {
            title: newEvent.title,
            start: new Date(newEvent.start.toISOString()),
            end: new Date(newEvent.end.toISOString()),
            description: newEvent.description,
            color: '#87CEEB',
          },
        ]);
        Alert.alert('Success', 'Event added successfully!');
        setModalVisible(false);
        setNewEvent({ title: '', description: '', start: new Date(), end: new Date() });
      })
      .catch((error) => {
        console.error('Error:', error);
        Alert.alert('Error', 'Failed to add the event');
      });
  };

  return (
    <View style={styles.container}>
      <Back title={''} onBackPress={() => {}}/>
      <BigCalendar
        events={events}
        height={600}
        mode={viewMode}
        eventCellStyle={(event) => ({
          backgroundColor: event.color || '#ADD8E6',
          borderRadius: 5,
        })}
        onPressCell={() => setModalVisible(true)} // Open modal on cell press
        onPressEvent={(event) => Alert.alert(`Event: ${event.title}`)}
      />

      {/* View Mode Buttons */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
        <Button title="Day" onPress={() => setViewMode('day')} />
        <Button title="Week" onPress={() => setViewMode('week')} />
        <Button title="Month" onPress={() => setViewMode('month')} />
      </View>

      {/* Modal for Adding Events */}
      <Modal
        isVisible={modalVisible}
        onBackdropPress={() => setModalVisible(false)}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        backdropOpacity={0.5}
        style={styles.modal}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Add New Event</Text>

          <TextInput
            style={styles.input}
            placeholder="Event Title"
            value={newEvent.title}
            onChangeText={(text) => setNewEvent((prev) => ({ ...prev, title: text }))}
          />
          <TextInput
            style={styles.input}
            placeholder="Description"
            value={newEvent.description}
            onChangeText={(text) => setNewEvent((prev) => ({ ...prev, description: text }))}
          />

          {/* Start Date Picker */}
          <TouchableOpacity onPress={() => setShowStartPicker(true)}>
            <Text style={styles.datePicker}>
              Start: {dayjs(newEvent.start).format('YYYY-MM-DD HH:mm')}
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

          {/* End Date Picker */}
          <TouchableOpacity onPress={() => setShowEndPicker(true)}>
            <Text style={styles.datePicker}>
              End: {dayjs(newEvent.end).format('YYYY-MM-DD HH:mm')}
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
            <Button title="Add Event" onPress={handleAddEvent} />
            <Button title="Cancel" onPress={() => setModalVisible(false)} color="red" />
          </View>
        </View>
      </Modal>
      <NavBar  />
    </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 10,
    paddingBottom:50
    
  },
  modal: {
    justifyContent: 'center',
    margin: 0,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    marginBottom: 50,
    paddingBottom: 30,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#CCC',
    marginBottom: 10,
    padding: 5,
  },
  datePicker: {
    color: '#007BFF',
    marginVertical: 10,
    
  },
  buttonContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

