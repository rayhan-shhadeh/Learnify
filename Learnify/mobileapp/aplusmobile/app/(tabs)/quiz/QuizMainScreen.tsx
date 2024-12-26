import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList , Image} from 'react-native';
import { ProgressBar, RadioButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useRouter} from "expo-router";
import { LinearGradient } from 'expo-linear-gradient';
import { Video, ResizeMode } from 'expo-av';

export default function QuizMainScreen() {
    const router = useRouter();
    const [selectedValue, setSelectedValue] = useState('first');
    const [quizHistory, setQuizHistory] = useState([]);
      const [status, setStatus] = React.useState({});
      const video = React.useRef(null);
   
    return (
        <LinearGradient colors={['#c1e8ff', '#ffff', '#1CA7EC']} style={styles.linearcontainer}>

        <View style={styles.container}>
        <Image source={require('../../../assets/quiz-unscreen.gif')} style={styles.icon} />
            <TouchableOpacity style={styles.button} onPress={() => {router.push("/(tabs)/quiz/Quiz")}}> 
                <Text style={styles.buttonText}>Start New Quiz</Text>
                <Icon name="plus" size={50} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.quizhistory}>
            <Text style={styles.cardText}>Quiz History</Text>
            <Icon name="history" size={25} color="#1CA7EC" />
            </TouchableOpacity>
            <FlatList
                data={quizHistory}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.cardText}>{item}</Text>
                    </View>
                )}
                keyExtractor={(item) => item}
            />
        </View>
        </LinearGradient>

        
    );
    
}

const styles = StyleSheet.create({
    container: {
        marginTop: 30,
        flex: 1,
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
       
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        margin: 10,
    },
    button: {
        backgroundColor: '#1CA7EC',
        padding: 10,
        borderRadius: 50,
        width: 200,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBlock: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
    },
    card: {
        backgroundColor: '#F5F5F5',
        padding: 10,
        margin: 10,
        borderRadius: 5,
    },
    cardText: {
        fontSize: 20,
        marginRight: 10,
    
    },
    linearcontainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    quizhistory: {
        flex: 1,
        backgroundColor: 'transparent',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        marginTop: 40,
        alignContent: 'flex-start',
        alignSelf: 'flex-start',
        marginLeft: 10,

        
    },
    icon:{
        width: 100,
        height: 200,
        borderRadius: 20,
        margin: 10,
        flex: 1,
        alignItems: 'center',

       
    }
});

