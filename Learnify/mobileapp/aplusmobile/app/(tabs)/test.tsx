// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
// } from "react-native";
// import { Modal, Portal, Provider } from "react-native-paper";
// import { motion } from "framer-motion";
// import { Dropdown } from "react-native-material-dropdown";

// const FlashcardsGenerator = () => {
//   const [visible, setVisible] = useState(false);
//   const [topic, setTopic] = useState("");
//   const [level, setLevel] = useState("");
//   const [showDropDown, setShowDropDown] = useState(false);

//   const levels = [
//     { label: "Beginner", value: "beginner" },
//     { label: "Intermediate", value: "intermediate" },
//     { label: "Advanced", value: "advanced" },
//   ];

//   const openModal = () => setVisible(true);
//   const closeModal = () => setVisible(false);

//   const handleGenerate = () => {
//     // Logic for generating flashcards
//     console.log("Flashcards Topic:", topic);
//     console.log("Flashcards Level:", level);
//     closeModal();
//   };

//   return (
//     <Provider>
//       <View style={styles.container}>
//         {/* Animated Generate Button */}
//         <motion.div
//           whileHover={{ scale: 1.1 }}
//           whileTap={{ scale: 0.9 }}
//           style={styles.generateButtonWrapper}
//         >
//           <TouchableOpacity style={styles.generateButton} onPress={openModal}>
//             <Text style={styles.generateButtonText}>Generate Flashcards</Text>
//           </TouchableOpacity>
//         </motion.div>

//         {/* Modal for Input */}
//         <Portal>
//           <Modal
//             visible={visible}
//             onDismiss={closeModal}
//             contentContainerStyle={styles.modalContainer}
//           >
//             <Text style={styles.modalTitle}>Create New Flashcards</Text>

//             {/* Topic Input */}
//             <TextInput
//               style={styles.input}
//               placeholder="Enter Flashcards Topic"
//               value={topic}
//               onChangeText={setTopic}
//             />

//             {/* Level Dropdown */}
//             <Dropdown
//               label="Select Difficulty Level"
//               data={levels}
//               value={level}
//               onChangeText={setLevel}
//               containerStyle={styles.dropdown}
//             />

//             {/* Generate Button */}
//             <TouchableOpacity
//               style={styles.modalButton}
//               onPress={handleGenerate}
//             >
//               <Text style={styles.modalButtonText}>Generate</Text>
//             </TouchableOpacity>
//           </Modal>
//         </Portal>
//       </View>
//     </Provider>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#f5f5f5",
//   },
//   generateButtonWrapper: {
//     width: "80%",
//     alignItems: "center",
//   },
//   generateButton: {
//     backgroundColor: "#4CAF50",
//     paddingVertical: 15,
//     paddingHorizontal: 30,
//     borderRadius: 25,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 5,
//     elevation: 8,
//   },
//   generateButtonText: {
//     color: "#fff",
//     fontSize: 18,
//     fontWeight: "bold",
//     textAlign: "center",
//   },
//   modalContainer: {
//     backgroundColor: "#fff",
//     padding: 20,
//     marginHorizontal: 20,
//     borderRadius: 15,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.2,
//     shadowRadius: 8,
//     elevation: 10,
//   },
//   modalTitle: {
//     fontSize: 20,
//     fontWeight: "bold",
//     marginBottom: 15,
//     textAlign: "center",
//     color: "#333",
//   },
//   input: {
//     height: 50,
//     borderColor: "#ccc",
//     borderWidth: 1,
//     borderRadius: 10,
//     paddingHorizontal: 15,
//     marginBottom: 15,
//     fontSize: 16,
//   },
//   dropdown: {
//     marginBottom: 20,
//   },
//   modalButton: {
//     backgroundColor: "#2196F3",
//     paddingVertical: 12,
//     paddingHorizontal: 25,
//     borderRadius: 10,
//     alignItems: "center",
//   },
//   modalButtonText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
// });

// export default FlashcardsGenerator;
