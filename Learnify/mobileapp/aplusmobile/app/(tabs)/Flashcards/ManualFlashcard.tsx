// CreateFlashcardScreen.js
import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet ,Image} from 'react-native';
import axios from 'axios';
import API from '@/api/axois';
import { useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
const CreateFlashcardScreen = () => {
  const [flashcardName, setFlashcardName] = useState('');
  const [flashcardQ, setFlashcardQ] = useState('');
  const [flashcardA, setFlashcardA] = useState('');
  const [fileId, setFileId] = useState('');
  const [message, setMessage] = useState('');
  const randomGradient = (): [string, string, ...string[]] => {
    const colors: [string, string, ...string[]][] = [
      ['#4c669f', '#3b5998', '#192f6a'],
      ['#6a11cb', '#2575fc'],
      ['#00c6ff', '#0072ff'],
      ['#43cea2', '#185a9d'],
      ['#ff758c', '#ff7eb3'],
      ['#5f83b1','#7BD5F5'],
      ['#787FF6', '#4ADEDE'],
      ['#1CA7EC', '#1F2F98'],
      ['#ffffff', '#5F83B1'],
      ['#21277B', '#9AD9EA'],
      ['#9AD9EA', '#006A67'],
      ['#92e1ff', '#4682b4'],
      ['#5f9ea0', '#ffffff'],
      ['#778899', '#5F83B1'],
      ['#708090', '#5F83B1']];
    return colors[Math.floor(Math.random() * colors.length)];
    };


  const handleCreateFlashcard = async () => {
    const flashcardData = {
      flashcardName,
      flashcardQ,
      flashcardA,
      file: {
        connect: {
          fileId: parseInt(fileId), // Ensure fileId is an integer
        },
      },
    };

    try {
      const response = await API.post('/api/flashcard', flashcardData);
      setMessage('Flashcard created successfully!');
      console.log(response.data);
    } catch (error) {
      console.error(error);
      setMessage('Error creating flashcard.');
    }
  };

  return (
    <LinearGradient colors={randomGradient()} style={styles.container}>
        <View style={styles.innerContainer}>
            <Text style={styles.title}>Create Flashcard</Text>
            <Image source={require('../../../assets/images/manualflashcard.gif')} style={styles.logo} />
            <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Flashcard Name"
        value={flashcardName}
        onChangeText={setFlashcardName}
      />
      <TextInput
        style={styles.input}
        placeholder="Question"
        value={flashcardQ}
        onChangeText={setFlashcardQ}
      />
      <TextInput
        style={styles.input}
        placeholder="Answer"
        value={flashcardA}
        onChangeText={setFlashcardA}
      />
      <TextInput
        style={styles.input}
        placeholder="File ID"
        value={fileId}
        onChangeText={setFileId}
        keyboardType="numeric"
      />
      <Button title="Create Flashcard" onPress={handleCreateFlashcard} />
      {message ? <Text style={styles.message}>{message}</Text> : null}
        </View>
   
    </View>
  

</LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  message: {
    marginTop: 20,
    fontSize: 16,
    color: 'green',
  },
  innerContainer: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: 'white',
    width: '100%',
    height: '100%',
  },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginVertical: 20,
    },
    logo:{
        width: 100,
        height: 100,
        alignSelf: 'center',
        marginBottom: 20,
    }
});

export default CreateFlashcardScreen;