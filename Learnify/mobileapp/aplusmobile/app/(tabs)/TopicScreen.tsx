import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import API from "../../api/axois";
import { LOCALHOST } from '@/api/axois';

const TopicScreen = () => {
  const [flippedCards, setFlippedCards] = useState<{ [key: string]: boolean }>(
    {}
  );
  let { userId, searchTopic, level,exploreFlashcards } = useLocalSearchParams();
  const flashcards = JSON.parse(exploreFlashcards as string);
  const [isPremium, setIsPremium] = useState<boolean>();

  useEffect(() => {
    console.log("level in topic sreen is :"+level );
    const initialize = async () => {
      //preimium flag
      const userData = await API.get(`/api/users/getme/${userId}`);
      const userFlag = userData.data.flag;
      userFlag === 2 ? setIsPremium(true) : setIsPremium(false);
      setIsPremium(true);
    };
    initialize();
  }, []);

  const handleFlip = (id: string) => {
      setFlippedCards((prev) => ({
        ...prev,
        [id]: !prev[id],
      }));
  };
  let count = 0;
  const renderItem = ({
    item,
  }: {
    item: {
      ExploreFlashcardId: string;
      ExploreFlashcardQ: string;
      ExploreFlashcardA: string;
    };
  }) => {
    count++;
    const isLocked = !isPremium && count > 5;
    const isFlipped = flippedCards[item.ExploreFlashcardId];

    return (
      <TouchableOpacity
        onPress={() => handleFlip(item.ExploreFlashcardId)}
        activeOpacity={0.9}
        style={styles.cardContainer}
      >
        <View style={[styles.card, isLocked && styles.lockedCard]}>
          {isLocked ? (
            <View style={styles.lockedContent}>
              {/* <Ionicons name="lock-closed-outline" size={40} color="#888" /> */}
              <Image
                source={require("../../assets/images/lock.png")}
                style={{ width: 50, height: 50 }}
              />
            </View>
          ) : (
            <Text style={styles.cardText}>
              {isFlipped ? item.ExploreFlashcardA : item.ExploreFlashcardQ}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Flashcards for {searchTopic}</Text>
      <FlatList
        data={flashcards}
        keyExtractor={(item) => item.ExploreFlashcardId}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
      {
        isPremium?(
          <TouchableOpacity 
          onPress={() => router.push(
            {pathname:"/(tabs)/LinkListScreen",params: {searchTopic,level}})}>
          <Text style={styles.nextButton}>
            Explore more
          </Text>
        </TouchableOpacity>
        ):
        (<Text>upgrade to premium</Text>)
      }
    </View>
  );
};

const screenWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  nextButton: {
    alignSelf: 'center',
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 50,
  },
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: "#F0F4F8",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  cardContainer: {
    marginVertical: 10,
    alignItems: "center",
  },
  card: {
    width: screenWidth * 0.9,
    height: 150,
    borderRadius: 12,
    backgroundColor: "#85c4e4",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  cardText: {
    fontSize: 18,
    fontWeight: "500",
    textAlign: "center",
  },
  lockedCard: {
    backgroundColor: "#ddd",
    opacity: 0.6,
  },
  lockedContent: {
    alignItems: "center",
    justifyContent: "center",
  },
});

export default TopicScreen;
