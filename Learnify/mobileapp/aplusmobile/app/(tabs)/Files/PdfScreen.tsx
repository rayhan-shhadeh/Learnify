import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import axios from 'axios'; // Assuming you're using Axios for API calls
import { useLocalSearchParams } from 'expo-router';
import API from '../../../api/axois';

interface PdfViewerProps {
  fileId: string;
}

const PdfViewer: React.FC<PdfViewerProps> = ({ fileId }) => {
  const {passedFileId} = useLocalSearchParams();
  
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchPdfUrl = async () => {
      fileId=passedFileId.toString();
      console.log(fileId);
      try {
        console.log();
        setLoading(true);
        const response = await API.get(`/api/file/${fileId}`);
        setPdfUrl(response.data.fileURL);
        
      } catch (err) {
        console.error('Error fetching PDF URL:', err);
        setError('Failed to load the PDF. Please try again.'+ pdfUrl);
      } finally {
        setLoading(false);
      }
    };
    fetchPdfUrl();
  }, [fileId]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading PDF...</Text>
      </View>
    );
  }
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }
  if (!pdfUrl) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No URL available to display.</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <WebView source={{ uri: pdfUrl }} style={styles.webview} />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default PdfViewer;
