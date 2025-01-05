import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput , Image} from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';
import NavBar from '../NavBar';
import Back from '../Back';
export default function HabitsScreen() {
  const [habits, setHabits] = useState([
    { id: '1', name: 'Morning Run', completed: false },
    { id: '2', name: 'Read 10 pages', completed: true },
  ]);
  const [newHabit, setNewHabit] = useState('');

  const toggleHabitCompletion = (id: string) => {
    setHabits((prevHabits) =>
      prevHabits.map((habit) =>
        habit.id === id ? { ...habit, completed: !habit.completed } : habit
      )
    );
  };

  const addHabit = () => {
    if (newHabit.trim()) {
      const newHabitObj = {
        id: String(habits.length + 1),
        name: newHabit,
        completed: false,
      };
      setHabits([...habits, newHabitObj]);
      setNewHabit('');
    }
  };

  const renderHabit = ({ item }: { item: { id: string; name: string; completed: boolean } }) => (
    <TouchableOpacity
      style={styles.habitContainer}
      onPress={() => toggleHabitCompletion(item.id)}
    >
      <Text style={[styles.habitText, item.completed && styles.completedHabit]}>
        {item.name}
      </Text>
      {item.completed && <Icon name="check" size={20} color="green" />}
    </TouchableOpacity>
  );

  return (
    
    <LinearGradient colors={['#ddf3f5', '#f7f7f7', '#fbfbfb', '#9ad9ea']} style={styles.linearcontainer}>
      <View style={styles.container}>
        <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center',   borderRadius: 10, elevation: 2,}}>
        <Text style={styles.header}>My Habits</Text>
        </View>
        <View style={{ marginVertical: 20, flex: 1 }}>
        <CalendarPicker
            onDateChange={(date) => console.log(date)}
            textStyle={{ color: 'black' }}
        />
        </View>
        <View style={{ marginVertical: 20,marginTop:50, flex: 1 }}>
        <FlatList style={styles.myhabit}
                data={habits}
                renderItem={renderHabit}
                keyExtractor={(item) => item.id}
                /> 
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Add new habit"
            value={newHabit}
            onChangeText={setNewHabit}
          />
          <TouchableOpacity style={styles.addButton} onPress={addHabit}>
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
      </View>
        <NavBar/>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    marginLeft: 10,
  },
  habitContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    marginVertical: 8,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 2,
  },
  habitText: {
    fontSize: 18,
  },
  completedHabit: {
    textDecorationLine: 'line-through',
    color: 'gray',
  },
  inputContainer: {
    flexDirection: 'row',
    marginTop: 20,
    alignItems: 'center',
    marginBottom: 50,
    marginLeft: 10,
    marginRight: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: '#1CA7EC',
    padding: 12,
    borderRadius: 8,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  linearcontainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  myhabit: {
    borderRadius: 30,
  },
});
