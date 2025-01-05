import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  StyleSheet,
} from "react-native";

const SOCKET_URL = "http://192.168.68.59:8080";
const socket = io(SOCKET_URL, {
  transports: ["websocket"],
  withCredentials: true,
});

const Chat = () => {
  const [messages, setMessages] = useState<{ name: string; message: string }[]>(
    []
  );
  const [roomId, setRoomId] = useState("");
  const [roomText, setRoomText] = useState("");
  const [name, setName] = useState("");
  const [inputMessage, setInputMessage] = useState("");

  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected");
    });
    socket.on("message", (msg) => {
      console.log("message: sent ", msg);
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    socket.on("notification", (msg) => {
      Alert.alert(msg);
    });
  }, []);

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      const newMessage = {
        name: name,
        message: inputMessage,
      };

      socket.emit("messageRoom", {
        room: roomId,
        message: newMessage,
      });
      setInputMessage("");
    }
  };

  const handleRoomGeneration = () => {
    if (roomText === "" || name === "") {
      Alert.alert("Missing Information", "Please enter your name and room ID");
      return;
    }
    socket.emit("join", {
      room: roomText,
      name: name,
    });
    setRoomId(roomText);
  };

  const renderItem = ({
    item,
  }: {
    item: { name: string; message: string };
  }) => (
    <View
      style={[
        styles.messageItem,
        {
          alignSelf: item.name === name ? "flex-end" : "flex-start",
        },
      ]}
    >
      <Text style={styles.messageAuthor}>{item.name}:</Text>
      <Text style={styles.messageContent}>{item.message}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {roomId === "" ? (
        <View style={styles.roomContainer}>
          <Text style={styles.header}>Join Chat Room</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
          />
          <TextInput
            style={styles.input}
            value={roomText}
            onChangeText={setRoomText}
            placeholder="Enter Room ID"
          />
          <TouchableOpacity
            onPress={handleRoomGeneration}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Join Room</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.messageArea}>
          <Text>Welcome to {roomId}</Text>
          <FlatList
            data={messages}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
          />
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.messageInput}
              value={inputMessage}
              onChangeText={setInputMessage}
              placeholder="Type a message"
            />
            <TouchableOpacity onPress={handleSendMessage} style={styles.button}>
              <Text style={styles.buttonText} onPress={handleSendMessage}>
                Send
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#130055",
  },
  roomContainer: {
    alignItems: "center",
  },
  header: {
    fontSize: 24,
    marginBottom: 16,
    color: "white",
  },
  input: {
    width: 300,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
    borderRadius: 4,
    backgroundColor: "white",
  },
  button: {
    backgroundColor: "#4caf50",
    padding: 12,
    borderRadius: 4,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  messageArea: {
    flex: 1,
    marginTop: 16,
  },
  messageItem: {
    marginVertical: 8,
    padding: 12,
    borderRadius: 4,
    backgroundColor: "#4caf50",
  },
  messageAuthor: {
    fontWeight: "bold",
    color: "white",
  },
  messageContent: {
    color: "white",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
  },
  messageInput: {
    flex: 1,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginRight: 8,
    paddingLeft: 8,
    borderRadius: 4,
    backgroundColor: "white",
  },
});

export default Chat;
