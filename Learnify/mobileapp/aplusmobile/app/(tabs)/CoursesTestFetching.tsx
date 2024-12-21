import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useCourses } from '../(tabs)/hooks/CoursesContext';

const FilesScreen = () => {
  const { courses }: { courses: { id: string; courseName: string }[] } = useCourses();

  return (
    <View style={styles.container}>
      <Text>Files Screen</Text>
      {courses.map((course) => (
        <View key={course.id}>
          <Text>{course.courseName}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FilesScreen;
