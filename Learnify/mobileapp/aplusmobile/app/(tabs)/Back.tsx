import { useRouter } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface CustomToolbarProps {
  title: string;
  onBackPress: () => void;
}

const Back: React.FC<CustomToolbarProps> = ({ title, onBackPress }) => {
  const router = useRouter();
  return (
    <View style={styles.toolbar}>
      <TouchableOpacity onPress={()=> router.back()} style={styles.backButton}>
        <Text style={styles.backText}>◀</Text>
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.rightPlaceholder} />
    </View>
  );
};

const styles = StyleSheet.create({
  toolbar: {
    height: 60,
    backgroundColor: '#transparent',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    justifyContent: 'space-between',
    backgroundBlendMode: 'transparent',
  },
  backButton: {
    padding: 5,
    backgroundColor: 'transparent',
  },
  backText: {
    color: '#1CA7EC',
    fontSize: 20,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  rightPlaceholder: {
    width: 30, // Placeholder for future icons or elements
  },
});

export default Back;
