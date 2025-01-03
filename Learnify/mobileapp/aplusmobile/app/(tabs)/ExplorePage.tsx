import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import NavBar from '../(tabs)/NavBar';
import Back from './Back';
import API from '../../api/axois';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

const randomGradient = (): [string, string, ...string[]] => {
  const colors: [string, string, ...string[]][] = [
    ['#4c669f', '#3b5998', '#192f6a'],
    ['#6a11cb', '#2575fc'],
    ['#00c6ff', '#0072ff'],
    ['#43cea2', '#185a9d'],
    ['#ff758c', '#ff7eb3'],
    ['#5f83b1', '#7BD5F5'],
    ['#787FF6', '#4ADEDE'],
    ['#1CA7EC', '#1F2F98'],
    ['#ffffff', '#5F83B1'],
    ['#21277B', '#9AD9EA'],
    ['#9AD9EA', '#006A67'],
    ['#92e1ff', '#4682b4'],
    ['#5f9ea0', '#ffffff'],
    ['#778899', '#5F83B1'],
    ['#708090', '#5F83B1'],
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

interface CardProps {
  title: string;
}

const Card: React.FC<CardProps> = ({ title }) => {
  const gradientColors = randomGradient();
  return (
    <TouchableOpacity style={styles.card}>
      <LinearGradient colors={gradientColors} style={styles.gradient}>
        <Text style={styles.cardText}>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const ExploreScreen = () => {
  const [popularTopics, setPopularTopics] = useState<string[]>([]);
  const [relatedTopics, setRelatedTopics] = useState<string[]>([]);
  const [suggestedTopics, setSuggestedTopics] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopics = async () => {
      setLoading(true);
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          Alert.alert('Error', 'Token not found');
          return;
        }

        let id = null;
        try {
          const decoded: { id: string } | null = jwtDecode<{ id: string }>(token);
          if (!decoded?.id) {
            Alert.alert('Error', 'Invalid token structure');
            return;
          }
          id = decoded.id;
          setUserId(id); // Update userId state
        } catch (decodeError) {
          Alert.alert('Error', 'Failed to decode token');
          return;
        }

        const userData = await API.get(`/api/users/getme/${id}`);
        const majorName = userData.data.major;

        const popularRes = await API.get('/api/exploreflashcards/popularTopices');
        const relatedRes = await API.get(`/api/exploreflashcards/relatedTopics/${id}`);
        const suggestedRes= await API.get(`/api/exploreflashcards/suggestedTopics/${majorName}`);
        
        setPopularTopics(popularRes.data);
        setRelatedTopics(relatedRes.data);
        setSuggestedTopics(suggestedRes.data);
      } catch (error) {
        console.error('Error fetching topics:', error);
        Alert.alert('Error', 'Failed to fetch topics. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1CA7EC" />
        <Text style={styles.loadingText}>Preparing Topics For you...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        <Back title={''} onBackPress={() => console.log('Back pressed')} /> Explore
      </Text>
      <View style={styles.searchBar}>
        <Text style={styles.searchText}>Search</Text>
      </View>

      {/* Suggested Topics */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Suggested</Text>
        <FlatList
          horizontal
          data={suggestedTopics}
          renderItem={({ item }) => <Card title={item} />}
          keyExtractor={(item, index) => `suggested-${index}`}
        />
      </View>

      {/* Related Topics */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Related</Text>
        <FlatList
          horizontal
          data={relatedTopics}
          renderItem={({ item }) => <Card title={item} />}
          keyExtractor={(item, index) => `related-${index}`}
        />
      </View>

      {/* Popular Topics */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Popular</Text>
        <FlatList
          horizontal
          data={popularTopics}
          renderItem={({ item }) => <Card title={item} />}
          keyExtractor={(item, index) => `popular-${index}`}
        />
      </View>
      <NavBar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  searchBar: {
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  searchText: {
    color: '#888',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  card: {
    width: 150,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9F9F9', // Light background to keep it clean and readable
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#1CA7EC', // Matches the primary theme color
    fontWeight: '500',
  },
});

export default ExploreScreen;
