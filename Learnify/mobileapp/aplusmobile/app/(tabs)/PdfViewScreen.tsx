// import React from 'react';
// import { View, Text, Button, StyleSheet } from 'react-native';
// import Pdf from 'react-native-pdf';
// import { useNavigation, useRoute } from '@react-navigation/native';

// const PdfViewScreen = () => {
//   const navigation = useNavigation();
//   const route = useRoute();
//   const { fileUri } = route.params;

//   return (
//     <View style={styles.container}>
//       <View style={styles.buttonContainer}>
//         <Button title="Flashcards" onPress={() => {}} />
//         <Button title="Keywords" onPress={() => {}} />
//         <Button title="Quiz" onPress={() => {}} />
//       </View>
//       <Pdf
//         source={{ uri: fileUri }}
//         style={styles.pdf}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//     backgroundColor: '#fff',
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 10,
//   },
//   pdf: {
//     flex: 1,
//     width: '100%',
//   },
// });

// export default PdfViewScreen;
