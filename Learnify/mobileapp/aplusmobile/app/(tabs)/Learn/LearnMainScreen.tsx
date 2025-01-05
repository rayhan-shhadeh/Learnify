import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import {useRouter} from "expo-router";
import NavBar from '../../(tabs)/NavBar';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../../../components/store/auth-context';
const LearnMainScreen = () => {
  const authCtx = useContext(AuthContext);
  const router = useRouter();
  return (

    <SafeAreaView style= {{flex:1}}>
      <LinearGradient
      colors={['#f7f7f7','#fbfbfb', '#9ad9ea']}
      style={styles.container}
      >
     
      <TouchableOpacity style={styles.notificationButton}>
          <MaterialCommunityIcons name="bell-outline" size={24} color="#111517" />
        </TouchableOpacity>
       
 
     

      {/* Main Grid */}
      <View style={styles.grid}>
        {/* Quizzes Card */}
    
        <TouchableOpacity onPress={() => router.push("/(tabs)/FilesScreen")}  style={styles.card} > 
        <Animatable.View animation="fadeInUp" delay={200} duration={800}>
          <View style={styles.cardTextContainer}>
          <MaterialCommunityIcons name="cards-outline" size={24} color="#fff" />
            <Text style={styles.cardTitle}>Files</Text>
            <Text style={styles.cardSubtitle}></Text>
          </View>
        </Animatable.View>    
        </TouchableOpacity>    
        <TouchableOpacity onPress={() => router.push("/(tabs)/CoursesScreen")} style={styles.card} > 
          <Animatable.View animation="fadeInUp" delay={200} duration={800}>         
          <View style={styles.cardTextContainer}>
          <MaterialCommunityIcons name="search-web" size={24} color="#fff" />
            <Text style={styles.cardTitle}>Courses</Text>
            <Text style={styles.cardSubtitle}>  </Text>
          </View>
        </Animatable.View>
        </TouchableOpacity>
      </View>
  
    <NavBar/>
    </LinearGradient>
        </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: 'transparent', // Deep blue for the background
    padding: 16,
    flex: 1,
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
boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
    elevation: 10,
    alignContent: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    flexDirection: 'column',
  },
  cardTextContainer: {
    marginTop: 8,
    alignItems: 'center',
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


export default LearnMainScreen;
