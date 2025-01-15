import React, { useState, useEffect, useRef } from "react";
import {
  View,
  TextInput,
  Button,
  FlatList,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Modal,
  Alert,
  Animated,
  Image,
} from "react-native";
import { io } from "socket.io-client";
import { useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { KeyboardAvoidingView } from "react-native";
import API from "../../../api/axois";
import Icon from "react-native-vector-icons/FontAwesome";
import Icon2 from "react-native-vector-icons/FontAwesome5";
import { useRouter } from "expo-router";
import { jwtDecode } from "jwt-decode";
import { LOCALHOST } from "../../../api/axois";
const SOCKET_URL = `http://${LOCALHOST}:8080`;
const socket = io(SOCKET_URL, {
  transports: ["websocket"],
  withCredentials: true,
});

export default function Chatting() {
  const { passGroupId } = useLocalSearchParams();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<
    {
      id: string;
      text: string;
      senderId: any;
      groupId: any;
      timestamp: string;
    }[]
  >([]);
  const [userId, setUserId] = useState("");
  const [userData, setUserData] = useState<any>();
  const [userPhoto, setUserPhoto] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const router = useRouter();
  const [renderMessage, setRenderedMessage] = useState<
    {
      id: string;
      text: string;
      senderId: any;
      groupId: any;
    }[]
  >([]);
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const storedUserId = await AsyncStorage.getItem("currentUserId");
        setUserId(storedUserId || "");
        if (!token) {
          Alert.alert("Error", "Token not found");
          return;
        }

        const decoded: { id: string } | null = jwtDecode<{ id: string }>(token);
        setUserId(decoded?.id ?? null); // Adjust this based on the token structure

        const response = await API.get(`/api/users/getme/${decoded?.id}`);
        if (response.status !== 200) {
          Alert.alert("Error", "Failed to user data");
          return;
        }
        // Alert.alert("Success", "fetched data successfully");
        const data = await response.data.data;
        setUserData(data);
        setUserPhoto(data.photo);
        // Alert.alert(data.photo || "no image");
      } catch (error) {
        Alert.alert("Error", "An error occurred while fetching user data");
      }
    };

    fetchUserData();
  }, []);
  const handleAddFriend = async (friendId: string) => {
    try {
      const response = await API.post(`/api/group/${passGroupId}/add-user`, {
        userIds: [parseInt(friendId)],
      });
      if (response.status !== 200) {
        Alert.alert("Error", "Failed to add user to group");
        return;
      }
      Alert.alert("Success", "User added to group successfully");
    } catch (error) {
      Alert.alert("Error", "An error occurred while adding user to group");
    }
  };
  const handleLeaveGroup = async () => {
    try {
      const response = await API.delete(
        `/api/group/${passGroupId}/remove-user/${userId}`
      );
      if (response.status !== 200) {
        Alert.alert("Error", "Failed to leave group");
        return;
      }
      Alert.alert("Success", "Left group successfully");
    } catch (error) {
      Alert.alert("Error", "An error occurred while leaving group");
    }
  };
  const handleDeleteGroup = async () => {
    try {
      const response = await API.delete(`/api/delete-group/${passGroupId}`);
      if (response.status !== 200) {
        Alert.alert("Error", "Failed to delete group");
        return;
      }
      Alert.alert("Success", "Group deleted successfully");
    } catch (error) {
      Alert.alert("Error", "An error occurred while deleting group");
    }
  };
  const handleGetUsersInGroup = async () => {
    try {
      const response = await API.get(`/api/group/${passGroupId}/users`);
      if (response.status !== 200) {
        Alert.alert("Error", "Failed to get users in group");
        return;
      }
      Alert.alert("Success", "Fetched users in group successfully");
    } catch (error) {
      Alert.alert("Error", "An error occurred while fetching users in group");
    }
  };

  useEffect(() => {
    const fetchUserId = async () => {
      const userId = await AsyncStorage.getItem("currentUserId");
      setUserId(userId || "");
      return userId;
    };
    fetchUserId();
    if (!socket.connected) {
      socket.emit("join", { groupId: passGroupId });
    }

    // Listen for incoming messages
    socket.on("receiveMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off("receiveMessage");
      socket.emit("leave", { groupId: passGroupId });
    };
  }, [passGroupId]);

  const handleSendMessage = async () => {
    if (message.trim()) {
      const messageData = {
        text: message,
        senderId: userId,
        groupId: passGroupId,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, messageData]);
      socket.emit("sendMessage", messageData);

      const response = await API.post(
        "http://172.23.114.43:8080/api/messages/savemessage",
        {
          text: messageData.text,
          senderId: parseInt(messageData.senderId),
          groupId: parseInt(messageData.groupId.toString()),
        }
      );
      // setMessages((prev) => [...prev, messageData]);
      // setRenderedMessage((prev) => [...prev, messageData]);
      console.log("message saved, response", response);
      // const handleRenderMessage = async () => {
      //   const response = await API.get(
      //     `http://192.168.68.59:8080/api/messages/${passGroupId}`
      //   );
      //   console.log("response", response);
      //   setMessages(response.data);
      // };
    }
    setMessage("");
  };

  const renderItem = ({
    item,
  }: {
    item: { senderId: any; id: string; text: string; timestamp: string };
  }) => {
    const isSender = item.senderId === userId;
    return (
      <>
        <Image
          source={{ uri: userPhoto }}
          style={[
            styles.imageContainer,
            isSender ? styles.senderImage : styles.receiverImage,
          ]}
        />

        <View
          style={[
            styles.messageContainer,
            isSender ? styles.senderMessage : styles.receiverMessage,
          ]}
        >
          <Text style={styles.messageText}>{userData.username}</Text>
          <Text style={styles.messageText}>{item.text}</Text>
          <Text style={styles.timestamp}>
            {new Date(item.timestamp).toLocaleTimeString()}
          </Text>
        </View>
      </>
    );
  };
  const openModal = () => {
    setModalVisible(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };
  const closeModal = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
    });
  };
  return (
    <>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.headercontainer}>
          <TouchableOpacity onPress={() => router.back()}>
            <Icon name="arrow-left" size={24} color="#4A90E2" />
          </TouchableOpacity>
          <TouchableOpacity onPress={openModal}>
            <Icon name="th-list" size={24} color="#4A90E2" />
          </TouchableOpacity>
        </View>

        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.messageList}
        />
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={90}
        >
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Type a message..."
              value={message}
              onChangeText={(text) => setMessage(text)}
            />
            <TouchableOpacity
              style={styles.sendButton}
              onPress={() => {
                handleSendMessage();
                setMessage("");
                // renderItem({item: message});
              }}
            >
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </KeyboardAvoidingView>
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View style={styles.modalBackground}>
          <Animated.View style={[styles.modalContainer, { opacity: fadeAnim }]}>
            <Text style={styles.modalTitle}>Group Options</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                // Handle add user
                Alert.prompt(
                  "Add User",
                  "Enter the user ID to add:",
                  [
                    {
                      text: "Cancel",
                      style: "cancel",
                    },
                    {
                      text: "Add",
                      onPress: (userId) => handleAddFriend(userId || "1"),
                    },
                  ],
                  "plain-text"
                );
              }}
            >
              <Icon name="user-plus" size={20} color="#4A90E2" />
              <Text style={styles.modalButtonText}>Add User</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                // Handle leave group
                Alert.alert(
                  "Leave Group",
                  "Are you sure you want to leave the group?",
                  [
                    {
                      text: "Cancel",
                      style: "cancel",
                    },
                    {
                      text: "Leave",
                      onPress: handleLeaveGroup,
                    },
                  ]
                );
              }}
            >
              <Icon name="sign-out" size={20} color="#4A90E2" />
              <Text style={styles.modalButtonText}>Leave Group</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                // Handle delete group
                Alert.alert(
                  "Delete Group",
                  "Are you sure you want to delete the group?",
                  [
                    {
                      text: "Cancel",
                      style: "cancel",
                    },
                    {
                      text: "Delete",
                      onPress: handleDeleteGroup,
                    },
                  ]
                );
              }}
            >
              <Icon name="trash" size={20} color="#4A90E2" />
              <Text style={styles.modalButtonText}>Delete Group</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={closeModal}
            >
              <Text style={styles.modalCloseButtonText}>Close</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F7",
  },
  messageList: {
    flexGrow: 1,
    justifyContent: "flex-end",
  },
  messageContainer: {
    maxWidth: "70%",
    marginVertical: 5,
    padding: 10,
    borderRadius: 15,
  },
  imageContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    position: "absolute",
    marginTop: 40,
  },
  senderMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#DCF8C6", // Light green for sender
    marginRight: 50,
    marginLeft: 60,
  },
  receiverMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#EAEAEA", // Light grey for receiver
  },
  senderImage: {
    alignSelf: "flex-end",
    backgroundColor: "#DCF8C6", // Light green for sender
  },
  receiverImage: {
    alignSelf: "flex-start",
    backgroundColor: "#EAEAEA", // Light grey for receiver
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#DDD",
    backgroundColor: "#FFF",
    position: "relative",
    marginBottom: 10,
  },
  input: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    backgroundColor: "#F1F1F1",
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: "#4A90E2",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  sendButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  headercontainer: {
    margin: 10,
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  modalButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginVertical: 5,
    width: "100%",
    borderRadius: 5,
    backgroundColor: "#f0f0f0",
  },
  modalButtonText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#4A90E2",
  },
  modalCloseButton: {
    marginTop: 20,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#4A90E2",
  },
  modalCloseButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  timestamp: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
    alignSelf: "flex-end",
  },
});
