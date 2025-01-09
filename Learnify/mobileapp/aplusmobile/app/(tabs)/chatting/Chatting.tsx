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
} from "react-native";
import { io } from "socket.io-client";
import { useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { KeyboardAvoidingView } from "react-native";
import API from "../../../api/axois";
import Icon from "react-native-vector-icons/FontAwesome";
import Icon2 from "react-native-vector-icons/FontAwesome5";
import { useRouter } from "expo-router";
const SOCKET_URL = "http://172.23.114.43:8080";
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
      setMessage("");
    }
  };

  const renderItem = ({
    item,
  }: {
    item: { senderId: any; id: string; text: string; timestamp: string };
  }) => {
    const isSender = item.senderId === userId;
    return (
      <View
        style={[
          styles.messageContainer,
          isSender ? styles.senderMessage : styles.receiverMessage,
        ]}
      >
        <Text style={styles.messageText}>{item.text}</Text>
        <Text style={styles.timestamp}>
          {new Date(item.timestamp).toLocaleTimeString()}
        </Text>
      </View>
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
            // renderItem({item: message});
          }}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
  senderMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#DCF8C6", // Light green for sender
  },
  receiverMessage: {
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
  },
});
