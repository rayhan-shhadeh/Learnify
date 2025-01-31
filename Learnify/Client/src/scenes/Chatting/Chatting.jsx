import React, { useState, useEffect, useRef } from "react";
import {
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Typography,
  Modal,
  Box,
} from "@mui/material";
import { io } from "socket.io-client";
import axios from "../../api/axios";
import { jwtDecode } from "jwt-decode";
import Icon from "@mui/icons-material/AddCircleOutline";
import { MessageRounded } from "@mui/icons-material";

const SOCKET_URL = `http://localhost:8080`;
const socket = io(SOCKET_URL, {
  transports: ["websocket"],
  withCredentials: true,
});

const Chatting = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState("");
  const [userData, setUserData] = useState(null);
  const [userPhoto, setUserPhoto] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const fadeAnim = useRef(0);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const storedUserId = localStorage.getItem("currentUserId");
        setUserId(storedUserId || "");

        if (!token) {
          alert("Token not found");
          return;
        }

        const decoded = jwtDecode(token);
        setUserId(decoded?.id || "");

        const response = await axios.get(`users/getme/1`);
        const data = response.data.data;
        setUserData(data);
        setUserPhoto(data.photo);
      } catch (error) {
        console.error("Error fetching user data", error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (!socket.connected) {
      socket.emit("join", { groupId: 1});
    }

    socket.on("receiveMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off("receiveMessage");
      socket.emit("leave", { groupId:1});
    };
  }, []);

  const handleSendMessage = async () => {
    if (message.trim()) {
      const messageData = {
        text: message,
        senderId: 1,
        groupId: 1,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, messageData]);
      socket.emit("sendMessage", messageData);

      await axios.post(`messages/savemessage`, {
        text: messageData.text,
        senderId:1,
        groupId: 1,
      });

      setMessage("");
    }
  };

  const renderMessage = (item) => {
    const isSender = item.senderId === userId;

    return (
      <ListItem
        key={item.id}
        style={{
          display: "flex",
          flexDirection: isSender ? "row-reverse" : "row",
          alignItems: "center",
          margin: "10px 0",
        }}
      >
        <Avatar src={userPhoto} alt="User" style={{ margin: "0 10px" }} />
        <Box
          style={{
            padding: "10px",
            borderRadius: "10px",
            backgroundColor: isSender ? "#4caf50" : "#f1f1f1",
            color: isSender ? "white" : "black",
          }}
        >
          <Typography variant="body1">{userData?.username}</Typography>
          <Typography variant="body2">{item.text}</Typography>
          <Typography variant="caption" style={{ fontSize: "0.8em" }}>
            {new Date(item.timestamp).toLocaleTimeString()}
          </Typography>
        </Box>
      </ListItem>
    );
  };
    return (
        <Box style={{ padding: "20px", backgroundColor: "#f1f1f1" }}>
          <Typography variant="h4" gutterBottom style={{backgroundColor: "#fff", padding: "10px", borderRadius: "10px"}}>
    <MessageRounded
                style={{ marginRight: "10px", color: "#1ca7ec", marginBottom: "-6px" }}
     />
     Chat
      </Typography>
      <List>
        {messages.map((item) => renderMessage(item))}
      </List>
      <Box style={{ display: "flex", alignItems: "center", marginTop: "10px" }}>
        <TextField
          fullWidth
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          variant="outlined"
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSendMessage}
          style={{ marginLeft: "10px" }}
        >
          Send
        </Button>
      </Box>

      <Modal open={modalVisible} onClose={() => setModalVisible(false)}>
        <Box
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "10px",
          }}
        >
          <Typography variant="h6">Modal Content</Typography>
          <Button onClick={() => setModalVisible(false)}>Close</Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default Chatting;
