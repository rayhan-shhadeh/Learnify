import React from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import NavBar from './NavBar';
import { ScrollView } from 'react-native-gesture-handler';
import Back from './Back';
import { useRouter} from 'expo-router';

const groupsData = [
  { id: '1', name: 'Ahmad', role: 'Nutritionist', message: "How's your diet looking today?", date: '03 FEB', avatar: require('../../assets/images/male1.jpg') },
  { id: '2', name: 'Sarah', role: 'Coach', message: "🌟✨ We haven't seen you!", date: '03 FEB', avatar: require('../../assets/images/female1.jpg') },
  { id: '3', name: 'farah', role: 'Trainer', message: "It's been a while we've seen...", date: '03 FEB', avatar: require('../../assets/images/female2.jpg') },
  { id: '4', name: 'hala', role: 'Support', message: 'Please remember to log your...', date: '03 FEB', avatar: require('../../assets/images/female3.jpg') },
];

export default function GroupsScreen() {
    const router = useRouter();
  const renderGroupItem = ({ item }: { item: { id: string; name: string; role: string; message: string; date: string; avatar: any } }) => (
    <TouchableOpacity style={styles.groupItem} onPress={() => {router.push("/(tabs)/Chatting")} }>
      <Image source={item.avatar} style={styles.avatar} />
      <View style={styles.textContainer}>
        <View style={styles.nameRow}>
          <Text style={styles.name}>{item.name}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.role}>{item.role.toUpperCase()}</Text>
          </View>
        </View>
        <Text style={styles.message} numberOfLines={1}>
          {item.message}
        </Text>
      </View>
      <Text style={styles.date}>{item.date}</Text>
    </TouchableOpacity>
  );

  return (
    
    <SafeAreaView style={{flex:1}}>

<Back title={''} onBackPress={function (): void {
              throw new Error('Function not implemented.');
          } }/>
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
    {/* <Icon name="menu" size={28} color="#6B6B6B" /> */}
        <Text style={styles.headerTitle}>Message</Text>
      </View>

      {/* Search Bar */}
      {/* <TextInput style={styles.searchBar} placeholder="Search conversation" placeholderTextColor="#A7A7A7" /> */}

      {/* Tabs */}
      <View style={styles.tabs}>
        <Text style={[styles.tab, styles.activeTab]}>Active</Text>
        {/* <Text style={styles.tab}>Archived</Text> */}
      </View>

      {/* Groups List */}
      <FlatList
        data={groupsData}
        renderItem={renderGroupItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.groupsList}
      />
    </View>
    <NavBar/>
    </SafeAreaView>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F9',
    
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: '#F7F7F9',
    elevation: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 20,
    color: '#4A4A4A',
  },
  searchBar: {
    height: 40,
    backgroundColor: '#F1F1F1',
    borderRadius: 10,
    marginHorizontal: 20,
    paddingHorizontal: 15,
    marginVertical: 10,
    fontSize: 14,
    color: '#333',
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  tab: {
    fontSize: 16,
    marginHorizontal: 20,
    paddingBottom: 5,
    color: '#B4B4B4',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#4A90E2',
    color: '#4A90E2',
  },
  groupsList: {
    paddingHorizontal: 20,
  },
  groupItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  roleBadge: {
    backgroundColor: '#E7F6FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginLeft: 10,
  },
  role: {
    fontSize: 12,
    color: '#4A90E2',
    fontWeight: 'bold',
  },
  message: {
    fontSize: 14,
    color: '#6B6B6B',
    marginTop: 5,
  },
  date: {
    fontSize: 12,
    color: '#B4B4B4',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#F7F7F9',
    paddingBottom: 70, // Add padding to avoid overlap with NavBar
  },
});
