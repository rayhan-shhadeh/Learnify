import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Modal,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton,
  Alert,
} from "@mui/material";
import { Delete, AddCircle, Search } from "@mui/icons-material";
import axios from "../../api/axios";
import { io } from "socket.io-client";

const SOCKET_URL = `http://localhost:8080`;
const socket = io(SOCKET_URL, {
  transports: ["websocket"],
  withCredentials: true,
});

const GroupsScreen = () => {

  const [groups, setGroups] = useState([]);
  const [isGroupModalVisible, setGroupModalVisible] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const userId = localStorage.getItem("currentUserId");
        const response = await axios.get(`group/getgroupforadmin/1`);
        setGroups(response.data.data || []);
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    };

    fetchGroups();
  }, []);

  const handleGroupRender = (groupId) => {
    socket.emit("join", { groupId });
    navigate(`/chat/1`);
  };

  const handleCreateGroup = async () => {
    try {
      const userId = localStorage.getItem("currentUserId");
      const response = await axios.post("group/newgroup", {
        name: groupName,
        description: groupDescription,
        adminId:1,
        isPrivate: false,
      });
      setGroups((prev) => [...prev, response.data]);
      setGroupModalVisible(false);
    } catch (error) {
      console.error("Error creating group:", error);
    }
  };

  const handleDeleteGroup = async (groupId) => {
    try {
      await axios.delete(`delete-group/${groupId}`);
      setGroups((prev) => prev.filter((group) => group.id !== groupId));
    } catch (error) {
      console.error("Error deleting group:", error);
    }
  };

  return (
    <Box padding={3}>
      <Typography variant="h4" gutterBottom>
        Groups
      </Typography>
      <Box display="flex" justifyContent="space-between" marginBottom={2} style={{ width: "%100" }}
 >
        <TextField
          variant="outlined"
          placeholder="Search Groups"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <Search />,
          }}
          style={{ width:900 }}
        />
        <Button
          variant="contained"
          color="primary"
          style={{backgroundColor: "#1ca7ec"}}
          startIcon={<AddCircle />}
          onClick={() => setGroupModalVisible(true)}
        >
          Create Group
        </Button>
      </Box>

      <List>
        {groups
          .filter((group) =>
            group.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((group) => (
            <ListItem key={group.id}>
              <ListItemAvatar>
                <Avatar>{group.name.charAt(0).toUpperCase()}</Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={group.name}
                secondary={`Role: Admin`}
              />
              <IconButton
                edge="end"
                color="error"
                onClick={() => handleDeleteGroup(group.id)}
              >
                <Delete />
              </IconButton>
            </ListItem>
          ))}
      </List>

      <Modal open={isGroupModalVisible} onClose={() => setGroupModalVisible(false)}>
        <Box
          padding={4}
          bgcolor="background.paper"
          margin="auto"
          display="flex"
          flexDirection="column"
          maxWidth={400}
          borderRadius={2}
        >
          <Typography variant="h6" gutterBottom>
            Create New Group
          </Typography>
          <TextField
            label="Group Name"
            fullWidth
            margin="normal"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
          <TextField
            label="Description"
            fullWidth
            margin="normal"
            multiline
            rows={3}
            value={groupDescription}
            onChange={(e) => setGroupDescription(e.target.value)}
          />
          <Button
          style={{backgroundColor: "#1ca7ec"}}
            variant="contained"
            color="primary"
            onClick={handleCreateGroup}
            sx={{ marginTop: 2 }}
          >
            Create
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default GroupsScreen;
