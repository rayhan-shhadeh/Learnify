import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Button, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Calendar as BigCalendar } from 'react-native-big-calendar';
import Back from './Back';
import NavBar from './NavBar';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';
import Modal from 'react-native-modal';
import dayjs from 'dayjs';
import Cookies from 'js-cookie';
import jwtDecode from 'jwt-decode';
import {useRouter} from 'expo-router';


const initialEvents = [
  {
    title: 'Meeting with Sarah',
    start: dayjs().set('hour', 10).toDate(), // Today at 10:00 AM
    end: dayjs().set('hour', 11).toDate(),   // Today at 11:00 AM
    color: '#FF6347',
  },
  {
    title: 'Workout Session',
    start: dayjs().set('date', dayjs().date() + 1).set('hour', 18).toDate(), // Tomorrow at 6:00 PM
    end: dayjs().set('date', dayjs().date() + 1).set('hour', 19).toDate(),   // Tomorrow at 7:00 PM
    color: '#1E90FF',
  },
];

export default function CalendarScreen() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('week');
  const [events, setEvents] = useState(initialEvents);
  const [modalVisible, setModalVisible] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

// Initialize user and set userId
useEffect(() => {
  const initializeUser = async () => {
    const token = Cookies.get('token');
    console.log('Retrieved Token:', token);
    if (token) {
      try {
        console.log('Decoding token... from courses Page');
        const decoded = jwtDecode<{ id: string }>(token);
        setUserId(decoded.id); // Adjust this based on the token structure
        console.log('Decoded Token:', decoded);
      } catch (error) {
        console.error('Failed to decode token:', error);
        
      }
    } else {
      console.log('No token found.');
    }
  };
  initializeUser();
}, []);

useEffect(() => {
  if (!userId) {
    return; // Guard condition to prevent premature execution
  }
  // Function to handle creating a new event
  const handleCreateEvent = async (start: Date, end: Date) => {
    const newEvent = {
      eventTitle: 'try New Event ', // Change this dynamically if needed
      eventStart: start.toISOString(),
      eventEnd: end.toISOString(),
      eventDescription: 'A newly created event.',
      allDay: 0,
      user_: {
        connect: {
          userId: 2,
        },
      },
    };
    // 172.23.129.135
    try {
      const response = await fetch(`http://192.168.68.57:8081/api/event/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEvent),
        mode: 'cors', // Ensure CORS mode is enabled
      });

      if (response.ok) {
        Alert.alert('Success', 'Event created successfully!');
        setEvents((prevEvents) => [
          ...prevEvents,
          {
            title: newEvent.eventTitle,
            start: start,
            end: end,
            color: '#32CD32', // Add color to differentiate
          },
        ]);
      } else {
        Alert.alert('Error', 'Failed to create the event.');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      Alert.alert('Error', `Something went wrong: ${errorMessage}`);
    }
  };
  const start = new Date(); // Replace with appropriate start date
  const end = new Date(start.getTime() + 60 * 60 * 1000); // Replace with appropriate end date (1 hour later)
  handleCreateEvent(start, end);
}, [userId]);

  function handleCreateEvent(start: Date, end: Date) {
  }

  return (
    <View style={styles.container}>
        <Back title={''} onBackPress={() => {}}/>
      <BigCalendar
        events={events}
        height={600}
        mode={viewMode}
        eventCellStyle={(event) => ({
          backgroundColor: event.color || '#1CA7EC',
          borderRadius: 5,
        })}
        onPressEvent={(event) => alert(`Event: ${event.title}`)}
        onPressCell={(date) => {
          // Set default start and end times for new events
          const start = dayjs(date).set('hour', 9).toDate(); // 9:00 AM
          const end = dayjs(date).set('hour', 10).toDate(); // 10:00 AM
          handleCreateEvent(start, end);
        }}
      />

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 50 }}>
        <Button title="Day" onPress={() => setViewMode('day')} />
        <Button title="Week" onPress={() => setViewMode('week')} />
        <Button title="Month" onPress={() => setViewMode('month')} />
      </View>
        <NavBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 10,
  },
});
