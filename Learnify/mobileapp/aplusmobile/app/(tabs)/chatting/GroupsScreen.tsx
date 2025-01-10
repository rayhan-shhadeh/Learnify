import React, { useState, useEffect } from "react";
import {
  Alert,
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Modal,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import NavBar from "../NavBar";
import { ScrollView } from "react-native-gesture-handler";
import Back from "../Back";
import { useRouter } from "expo-router";
import API from "../../../api/axois";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { io } from "socket.io-client";
import Header from "../header/Header";
const SOCKET_URL = "http://192.168.68.59:8080";
const socket = io(SOCKET_URL, {
  transports: ["websocket"],
  withCredentials: true,
});
export default function GroupsScreen() {
  const router = useRouter();
  interface Group {
    id: string;
    name: string;
    role: string;
    message: string;
    date: string;
    avatar: any;
  }

  const [isGroupModalVisible, setGroupModalVisible] = useState(false);
  const [groups, setGroups] = useState<Group[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [currentGroupId, setCurrentGroupId] = useState<{
    groupId: string;
  } | null>(null);
  const [groupName, setGroupName] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [userIds, setUserIds] = useState<string[]>([]);
  const [groupDescription, setGroupDescription] = useState("");
  const [currentUserId, setCurrentUserId] = useState("");
  interface User {
    id: string;
    username: string;
  }
  const handleGroupRender = (groupId: string) => {
    // const passGroupId = groupId;
    socket.emit("join", {
      groupId: groupId,
    });

    router.push({
      pathname: `/(tabs)/chatting/Chatting`,
      params: { passGroupId: groupId },
    });
  };

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const userId = await AsyncStorage.getItem("currentUserId");
        const response = await API.get(`/api/group/getgroupforuser/${userId}`);
        if (userId) {
          setCurrentUserId(userId);
        }
        console.log("Full response:", response); // Log the full response for debugging

        // Access the array inside response.data.data
        if (Array.isArray(response.data.data)) {
          const transformedGroups = response.data.data.map((item: any) => ({
            id: item.group_.groupId.toString(),
            name: item.group_.name,
            role: item.group_.adminId === userId ? "Admin" : "Member", // check if the user is an admin
            message: item.group_.description || "No recent messages",
            date: "Today",
            avatar: {
              uri: `https://via.placeholder.com/50/${Math.floor(
                Math.random() * 16777215
              )
                .toString(16)
                .padStart(6, "0")}/FFFFFF?text=${encodeURIComponent(
                item.group_.name.charAt(0)
              )}`,
            }, // Dynamically generate avatar color
          }));

          setGroups(transformedGroups);
          console.log(transformedGroups);
          Alert.alert("Groups fetched successfully");
        } else {
          console.error("Response data is not an array:", response.data.data);
          Alert.alert("No groups found or data format issue");
        }
      } catch (error) {
        console.error("Error fetching groups:", error);
        Alert.alert("Failed to fetch groups");
      }
    };

    fetchGroups();

    const fetchUsers = async () => {
      try {
        const response = await API.get("/api/getallusers").then((response) => {
          const users = response.data.data;
          setUsers(users);
          setFilteredUsers(users);
        });
      } catch (error) {
        console.error("Error fetching users:", error);
        Alert.alert("Failed to fetch users");
      }
    };

    fetchUsers();
  }, []);
  // Handle search term change
  const handleSearch = (term: string) => {
    setSearchTerm(term);

    // Check if `users` is an array before filtering
    if (Array.isArray(users)) {
      const filtered = users.filter((user) =>
        user.username.toLowerCase().includes(term.toLowerCase())
      );
      const userIds = users.map((user) => user.id);
      setFilteredUsers(filtered);
      setUserIds(userIds);
    } else {
      console.error("Users data is not an array");
    }
  };

  // Handle selecting a user to add to the group
  const handleSelectUser = (user: User) => {
    // Add logic to add user to the group
    Alert.alert("User Selected", `You have selected ${user.username}`);
  };
  const handleGroupGeneration = () => {
    socket.emit("join", {
      groupId: currentGroupId?.groupId,
      name: groupName,
    });
    if (currentGroupId) {
      setGroupName(currentGroupId.groupId);
    }
  };
  const handleCreateGroup = async () => {
    try {
      const response = await API.post("/api/group/newgroup", {
        name: groupName,
        description: groupDescription,
        adminId: parseInt(currentUserId),
        isPrivate: isPublic,
        // userIds: userIds.map((id) => parseInt(id, 10)),
      });
      console.log("Group created successfully:", response);
      setGroupName(response.data.name);
      setGroupModalVisible(false);
    } catch (error) {
      console.error("Error creating group:", error);
      Alert.alert("Failed to create group");
    }
  };

  const renderGroupItem = ({
    item,
  }: {
    item: {
      id: string;
      name: string;
      role: string;
      message: string;
      date: string;
      avatar: any;
    };
  }) => (
    <TouchableOpacity
      style={styles.groupItem}
      onPress={() => handleGroupRender(item.id)}
    >
      <Image source={item.avatar} style={styles.avatar} />
      <View style={styles.textContainer}>
        <View style={styles.nameRow}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.role}>{item.role}</Text>
        </View>
        <Text style={styles.message}>{item.message}</Text>
        <Text style={styles.date}>{item.date}</Text>
      </View>
    </TouchableOpacity>
  );
  const renderGroupeModal = () => (
    <Modal
      animationType="slide"
      transparent
      visible={isGroupModalVisible}
      onRequestClose={() => setGroupModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Icon
            name="close"
            size={24}
            color="#333"
            onPress={() => setGroupModalVisible(false)}
          />
          <Text style={styles.modalTitle}>Create new Group</Text>
          <Text style={styles.name}> Group Name:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter group name"
            value={groupName}
            onChangeText={setGroupName}
          />
          <Text style={styles.name}> Select Group Members:</Text>
          <View style={{ padding: 10 }}>
            <TextInput
              style={styles.searchBar}
              placeholder="Search for a user by username"
              value={searchTerm}
              onChangeText={handleSearch}
              placeholderTextColor="#A7A7A7"
            />
            {searchTerm.length > 0 &&
              (filteredUsers.length > 0 ? (
                <FlatList
                  data={filteredUsers}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={{
                        padding: 5,
                        borderBottomWidth: 1,
                        borderBottomColor: "#ccc",
                        borderRadius: 5,
                      }}
                      onPress={() => {
                        handleSelectUser(item);
                        setUserIds((prevUserIds) => [...prevUserIds, item.id]);
                        setSearchTerm("");
                      }}
                    >
                      <Text>{item.username}</Text>
                    </TouchableOpacity>
                  )}
                />
              ) : (
                <Text>No users found</Text>
              ))}
          </View>
          <Text style={styles.name}> Group Description: </Text>
          <TextInput
            style={styles.input}
            placeholder="Enter group description"
            value={groupDescription}
            onChangeText={setGroupDescription}
          />
          <Text style={styles.name}> Group Type:</Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginVertical: 10,
            }}
          >
            <TouchableOpacity
              style={styles.radioButton}
              onPress={() => setIsPublic(true)}
            >
              <View
                style={
                  isPublic
                    ? styles.radioButtonSelected
                    : styles.radioButtonUnselected
                }
              />
              <Text style={styles.radioButtonText}>Public</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.radioButton}
              onPress={() => setIsPublic(false)}
            >
              <View
                style={
                  !isPublic
                    ? styles.radioButtonSelected
                    : styles.radioButtonUnselected
                }
              />
              <Text style={styles.radioButtonText}>Private</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={handleCreateGroup} style={styles.button}>
            <Text>Create Group</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Icon name="message" size={28} color="#6B6B6B" />
          <Text style={styles.headerTitle}>Message</Text>
          <TouchableOpacity onPress={() => setGroupModalVisible(true)}>
            <Icon
              name="add"
              size={28}
              color="#6B6B6B"
              style={styles.newGroup}
            />
          </TouchableOpacity>
        </View>
        {renderGroupeModal()}

        {/* Search Bar */}
        <View style={{ padding: 20 }}>
          <TextInput
            style={styles.searchBar}
            placeholder="Search for a user by username"
            value={searchTerm}
            onChangeText={handleSearch}
            placeholderTextColor="#A7A7A7"
          />
          {searchTerm.length > 0 &&
            (filteredUsers.length > 0 ? (
              <FlatList
                data={filteredUsers}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={{
                      padding: 10,
                      borderBottomWidth: 1,
                      borderBottomColor: "#ccc",
                      borderRadius: 5,
                    }}
                    onPress={() => handleSelectUser(item)}
                  >
                    <Text>{item.username}</Text>
                  </TouchableOpacity>
                )}
              />
            ) : (
              <Text>No users found</Text>
            ))}
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          <Text style={[styles.tab, styles.activeTab]}>Active</Text>
          {/* <Text style={styles.tab}>Archived</Text> */}
        </View>

        {groups.length === 0 ? (
          <Text style={styles.noGroups}>No groups found</Text>
        ) : (
          <FlatList
            data={groups}
            renderItem={renderGroupItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.groupsList}
          />
        )}
      </View>
      <NavBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F9",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // Add this line
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: "#F7F7F9",
    elevation: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4A4A4A",
    paddingLeft: 10,
  },
  searchBar: {
    height: 40,
    width: "100%",
    backgroundColor: "#F1F1F1",
    borderRadius: 20,
    // marginHorizontal: 20,
    paddingHorizontal: 15,
    // marginVertical: 10,
    fontSize: 14,
    color: "#333",
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
  },
  tab: {
    fontSize: 16,
    marginHorizontal: 20,
    paddingBottom: 5,
    color: "#B4B4B4",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#4A90E2",
    color: "#4A90E2",
  },
  groupsList: {
    paddingHorizontal: 20,
  },
  groupItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  roleBadge: {
    backgroundColor: "#E7F6FF",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginLeft: 10,
  },
  role: {
    fontSize: 12,
    color: "#4A90E2",
    fontWeight: "bold",
  },
  message: {
    fontSize: 14,
    color: "#6B6B6B",
    marginTop: 5,
  },
  date: {
    fontSize: 12,
    color: "#B4B4B4",
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: "#F7F7F9",
    paddingBottom: 70, // Add padding to avoid overlap with NavBar
  },
  noGroups: {
    fontSize: 16,
    color: "#6B6B6B",
    textAlign: "center",
    marginTop: 20,
  },
  newGroup: {
    marginLeft: "auto", // Add this line
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  radioLabel: {
    fontSize: 16,
    color: "#333",
  },
  radioButtonSelected: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#4A90E2",
  },
  radioButtonUnselected: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#333",
  },
  radioButtonText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#333",
  },
  button: {
    backgroundColor: "#4A90E2",
    padding: 10,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 10,
    color: "#fff",
  },
});
