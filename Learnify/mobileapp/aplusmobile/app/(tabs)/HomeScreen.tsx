import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import {useRouter} from "expo-router";
import NavBar from './NavBar';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
const HomePage = () => {
  const router = useRouter();

  return (

      <LinearGradient
      colors={['#ddf3f5','#f7f7f7','#fbfbfb', '#9ad9ea']}
      style={styles.container}
      >

    <ScrollView contentContainerStyle={styles.scrollContainer}>
            {/* Header */}
      <View style={styles.header}>
      <Text style={styles.headerTitle}> Welcome to</Text>
          
           {/* Logo */}
           <View style={styles.logo}>
            <Image source={require('../../assets/images/a-plus-4.gif')} style={styles.logo} />
          </View>

      </View>

 
     

      {/* Main Grid */}
      <View style={styles.grid}>
        {/* Quizzes Card */}
        
        <TouchableOpacity onPress={() => router.push("/(tabs)/quiz/QuizMainScreen")} style={styles.card} > 
        <Animatable.View animation="fadeInUp" delay={200} duration={800}>
          <MaterialCommunityIcons name="book-open-outline"  style={styles.icons} size={24} color="#fff" />
          <View style={styles.cardTextContainer}>
            <Text style={styles.cardTitle}>Quizzes</Text>
            <Text style={styles.cardSubtitle}>Let's Study</Text>
          </View>
        </Animatable.View>
        </TouchableOpacity>
        {/* Flashcards Card */}
        <TouchableOpacity onPress={() => router.push("/(tabs)/StudyFlashcardsScreen")} style={styles.card} > 
          <Animatable.View animation="fadeInUp" delay={200} duration={800}>
            <View style={styles.cardTextContainer}>
            <MaterialCommunityIcons name="lightning-bolt-outline" size={24} color="#fff" />
              <Text style={styles.cardTitle}>Practice!</Text>
              <Text style={styles.cardSubtitle}>Learn</Text>
            </View>
          </Animatable.View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/Learn/LearnMainScreen")}  style={styles.card} > 
        <Animatable.View animation="fadeInUp" delay={200} duration={800}>
          <View style={styles.cardTextContainer}>
          <MaterialCommunityIcons name="cards-outline" size={24} color="#fff" />
            <Text style={styles.cardTitle}>Learn</Text>
            <Text style={styles.cardSubtitle}> New Decks?</Text>
          </View>
        </Animatable.View>    
        </TouchableOpacity>    
        <TouchableOpacity onPress={() => router.push("/(tabs)/ExplorePage")} style={styles.card} > 
          <Animatable.View animation="fadeInUp" delay={200} duration={800}>         
          <View style={styles.cardTextContainer}>
          <MaterialCommunityIcons name="search-web" size={24} color="#fff" />
            <Text style={styles.cardTitle}>Explore</Text>
            <Text style={styles.cardSubtitle}>What's new?</Text>
          </View>
        </Animatable.View>
        </TouchableOpacity>
      </View>

    </ScrollView>
    <NavBar/>

    </LinearGradient>
  );
};
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fdfdfd', // Deep blue for the background
    width: '100%',
    height: '100%',
backgroundBlendMode: 'screen',
 },
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: 'transparent',
    
  //  paddingBottom: 70, // Add padding to avoid overlap with NavBar
  },
  logocontainer: {
    alignItems: 'center',
    marginTop: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    fontSize: 40,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#488db4', // Light blue for contrast
    textAlign: 'center',
    },
    notificationButton: {
    padding: 8,
    position: 'absolute',
    top: 16,
    right: 16,
    },
    grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    },
    card: {
    width: '48%',
    backgroundColor: '#1ca7ec', // Mid-tone blue for the cards
    borderRadius: 30,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#052659', // Dark blue for the shadow
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 10,
    alignContent: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    flexDirection: 'column',
  },
  cardTextContainer: {
    marginTop: 8,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff', // Dark text for contrast
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#C1E8FF', // Light blue for a cohesive theme
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  icons: {
    color: '#fff',
    alignContent: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },

});


export default HomePage;
