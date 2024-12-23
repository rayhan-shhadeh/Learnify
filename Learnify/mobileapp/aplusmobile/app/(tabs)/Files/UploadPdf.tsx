// import React, { useState } from 'react';

// import { View, Text, StyleSheet, TextInput, TouchableOpacity, Button, Alert } from 'react-native';

// import * as FileSystem from 'expo-file-system';

// import * as DocumentPicker from 'expo-document-picker';


// const App = () => {

//   const [selectedFile, setSelectedFile] = useState(null);

//   const [fileName, setFileName] = useState('');

// const [fileSize, setFileSize] = useState('');
//   const [uploading, setUploading] = useState(false);
//   const [uploaded, setUploaded] = useState(false);


//   const pickDocument = async () => {

//     try {

//       const result = await DocumentPicker.getDocumentAsync({});

//       if (result.type === 'success') {

//         setSelectedFile(result);

//         setFileName(result.name);

//       }

//     } catch (error) {

//       Alert.alert('Error', 'Failed to pick a document');

//     }

//   };


//   const uploadFile = async () => {

//     if (!selectedFile) {

//       Alert.alert('Error', 'Please select a file first');

//       return;

//     }


//     setUploading(true);

//     const uri = selectedFile.uri;


//     const formData = new FormData();

//     formData.append('file', {

//       uri,

//       name: fileName,

//       type: selectedFile.mimeType,

//     });


//     try {

//       const response = await fetch('YOUR_API_ENDPOINT', {

//         method: 'POST',

//         body: formData,

//         headers: {

//           'Content-Type': 'multipart/form-data',

//         },

//       });


//       const responseData = await response.json();

//       Alert.alert('Success', 'File uploaded successfully');

//     } catch (error) {

//       Alert.alert('Error', 'Failed to upload the file');

//     } finally {

//       setUploading(false);

//     }

//   };


//   return (

//     <View style={styles.container}>

//       <Text style={styles.title}>Upload File</Text>

//       <TouchableOpacity onPress={pickDocument} style={styles.button}>

//         <Text style={styles.buttonText}>Select File</Text>

//       </TouchableOpacity>

//       {fileName ? <Text style={styles.fileName}>{fileName}</Text> : null}

//       <Button title={uploading ? 'Uploading...' : 'Upload File'} onPress={uploadFile} disabled={uploading} />

//     </View>

//   );

// };


// const styles = StyleSheet.create({

//   container: {

//     flex: 1,

//     justifyContent: 'center',

//     alignItems: 'center',

//     padding: 16,

//   },

//   title: {

//     fontSize: 24,

//     marginBottom: 20,

//   },

//   button: {

//     backgroundColor: '#007BFF',

//     padding: 10,

//     borderRadius: 5,

//     marginBottom: 10,

//   },

//   buttonText: {

//     color: '#FFFFFF',

//     fontSize: 16,

//   },

//   fileName: {

//     marginVertical: 10,

//     fontSize: 16,

//   },

// });


// export default App;