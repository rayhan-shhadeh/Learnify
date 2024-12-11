import React from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Icons library
import {LinearGradient} from 'expo-linear-gradient'; // Gradient library
import { useRouter } from 'expo-router';
import NavBar from './NavBar';


const HomePage = () => {
    const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.greetingText}>Hello, Lindsey!</Text>
        <Text style={styles.locationText}>
          <Icon name="location-on" size={18} color="#ffffff" /> Boston, 02108
        </Text>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="What service are you looking for?"
            placeholderTextColor="#8B8B8B"
          />
          <Icon name="search" size={24} color="#8B8B8B" />
        </View>
      </View>

      {/* Services Grid */}
      <View style={styles.grid}>
        {[
          { title: 'Additions & Remodels', icon: 'home-repair-service' },
          { title: 'Cleaning', icon: 'cleaning-services' },
          { title: 'Painting', icon: 'format-paint' },
          { title: 'Heating', icon: 'whatshot' },
          { title: 'Plumbing', icon: 'plumbing' },
          { title: 'Electrical', icon: 'bolt' },
        ].map((item, index) => (
          <TouchableOpacity key={index} style={styles.gridItem}>
            <Icon name={item.icon} size={32} color="#26834A" />
            <Text style={styles.gridItemText}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Highlight Section */}
      <View style={styles.highlight}>
        <Image
          source={{ uri: 'https://via.placeholder.com/300x150' }} // Replace with the actual image
          style={styles.highlightImage}
        />
        <Text style={styles.highlightText}>Home Care Scheduler</Text>
        <TouchableOpacity style={styles.highlightButton}>
          <Icon name="arrow-forward" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Footer Navigation */}
      {/* <LinearGradient
        colors={['#ffffff', '#f5f5f5']}
        style={styles.footer}>
        <Icon name="home" size={28} color="#26834A" />
        <Icon name="calendar-today" size={28} color="#8B8B8B" />
        <Icon name="person" size={28} color="#8B8B8B" />
      </LinearGradient> */}
          <LinearGradient
      colors={['#0d87bf', "#E893C5",'#f5f5f5', '#efefef']}
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 70,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
      }}
    >
        <Icon name="home" size={28} color="#26834A" onPress={() => router.push("/")} />
        <Icon name="calendar-today" size={28} color="#8B8B8B" />
        <Icon name="person" size={28} color="#8B8B8B" />
      {/* Add footer icons or content here */}
    </LinearGradient>
    <NavBar />

    </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 16,
  },
  header: {
    backgroundColor: '#26834A',
    padding: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  greetingText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  locationText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 4,
  },
  searchContainer: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 16,
    paddingHorizontal: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
    color: '#000',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  gridItem: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  gridItemText: {
    color: '#000',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  highlight: {
    marginTop: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  highlightImage: {
    width: '60%',
    height: 100,
  },
  highlightText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#26834A',
    flex: 1,
    padding: 8,
  },
  highlightButton: {
    padding: 8,
    backgroundColor: '#26834A',
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
});

export default HomePage;
