import React from 'react';
import { View, Button, Alert } from 'react-native';
import Back from './(tabs)/Back';
import { useRouter } from 'expo-router';

const TestAPI = () => {
  const router = useRouter();
  const testServerConnection = async () => {
    try {
      const response = await fetch('http://192.168.68.53:8080/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'rayhanshhadeh@gmail.com',
          password: 'mypassword',
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', `Server response: ${JSON.stringify(data)}`);
      } else {
        Alert.alert('Error', `Server error: ${data.message || 'Unknown error'}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      Alert.alert('Error', `Connection failed: ${errorMessage}`);
    }
  };

  return (
    <>
    <View>
      <Back title={''} onBackPress={() => {router.back}} />
    </View>
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Test Server Connection" onPress={testServerConnection} />
    </View>
    </>
  );
};

export default TestAPI;
