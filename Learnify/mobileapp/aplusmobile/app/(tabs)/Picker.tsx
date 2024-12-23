import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import {useCourses} from './hooks/CoursesContext';
const DropdownExample = () => {
  const [selectedItem, setSelectedItem] = useState<string>('');
  const { mycourses } = useCourses();  // Get the courses from context
  // Sample data to show in the dropdown

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select a fruit:</Text>
      
      <Picker
        selectedValue={selectedItem}
        onValueChange={(itemValue) => setSelectedItem(itemValue)}
        style={styles.picker}
      >
        {mycourses.map((course, index) => (
          <Picker.Item label={course.label} value={course.value} key={course.value} />
        ))}
      </Picker>

      {selectedItem ? (
        <Text style={styles.selectedText}>Selected Item: {selectedItem}</Text>
      ) : (
        <Text style={styles.selectedText}>No item selected</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
  picker: {
    width: 200,
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 20,
  },
  selectedText: {
    fontSize: 16,
    marginTop: 20,
    color: '#333',
  },
});

export default DropdownExample;
