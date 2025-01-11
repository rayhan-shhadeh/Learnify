import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

const KeyTermsScreen = () => {
  const [activeKey, setActiveKey] = useState<number | null>(null);

  const keyTerms = [
    {
      id: 1,
      term: "React",
      definition: "A JavaScript library for building user interfaces.",
    },
    {
      id: 2,
      term: "State",
      definition: "A built-in React object to hold data.",
    },
  ];

  const toggleDefinition = (id: number) => {
    setActiveKey((prev) => (prev === id ? null : id));
  };

  return (
    <FlatList
      data={keyTerms}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View>
          <TouchableOpacity onPress={() => toggleDefinition(item.id)}>
            <Text>{item.term}</Text>
          </TouchableOpacity>
          {activeKey === item.id && <Text>{item.definition}</Text>}
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f8f9fa",
  },
  searchBar: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  keyTermContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  keyTermText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  definitionContainer: {
    overflow: "hidden",
  },
  definitionText: {
    fontSize: 14,
    color: "#555",
    marginTop: 8,
  },
  fileName: {
    fontSize: 12,
    color: "#777",
    marginTop: 4,
  },
  listContainer: {
    paddingBottom: 16,
  },
});

export default KeyTermsScreen;
