import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { SafeAreaView, Text, TouchableOpacity,Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

interface PdfViewerProps {
  pdfUrl: string;
  page: string;
}

const PageViewer: React.FC<PdfViewerProps> = ({ pdfUrl, page }) => {
  const pdfViewerHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.min.js"></script>
      <style>
        canvas { width: 100%; border: 1px solid black; }
      </style>
    </head>
    <body>
      <canvas id="pdfCanvas"></canvas>
      <script>
        const url = '${pdfUrl}';
        const loadingTask = pdfjsLib.getDocument(url);
        loadingTask.promise.then(pdf => {
          pdf.getPage(${page}).then(page => {
            const scale = 1.5;
            const viewport = page.getViewport({ scale: scale });
            const canvas = document.getElementById('pdfCanvas');
            const context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            page.render({ canvasContext: context, viewport: viewport });
          });
        }).catch(error => {
          document.body.innerHTML = '<p>Error loading PDF: ' + error.message + '</p>';
        });
      </script>
    </body>
    </html>
  `;

  return (
    <View style={styles.containerPDF}>
      <WebView 
        originWhitelist={['*']}
        source={{ html: pdfViewerHTML }}
        style={styles.webview}
      />
    </View>
  );
};

const viewPageScreen = () => {
  //questionORterm,answerORdefinition,pdfUrl,page,KF
  const containerSize = width < height / 2 ? { width, height: height / 2 } : { width, height };
  const { questionORterm, answerORdefinition, pdfUrl, page ,passedFileId,KF} = useLocalSearchParams();
  const QuestionORterm = questionORterm || "No question provided.";
  const AnswerORdefinition = answerORdefinition || "No answer available.";
  const PdfUrl = pdfUrl?.toString();
  const Page = page ? page.toString() :'1' ;
  const activeTab = (KF=='F')? 'Flashcards':'KeyTerms';
  const router = useRouter();

  const handleButtonPress = () => {
    router.replace({
      pathname: `/(tabs)/Files/PdfScreen`,
      params: {passedFileId,activeTab},
    });
  };

  return (
    <SafeAreaView style={[styles.container, containerSize]}>
      {/* Header with title */}
      <View style={styles.header}>
        <Text style={styles.title}>Reference</Text>
      </View>
      {/* Flashcard Section */}
      <View style={styles.flashcardContainer}>
        <View style={styles.flashcardCard}>
          <View style={styles.flashcardContent}>
            <Text style={styles.flashcardTitle}>{QuestionORterm}</Text>
            <Text style={styles.flashcardDescription}>{AnswerORdefinition}</Text>
          </View>
        </View>
      </View>
      {/* PDF Viewer */}
      <View style={[styles.pdfViewerContainer, { flex: 0.6 }]}>
        <PageViewer pdfUrl={PdfUrl} page={Page} />
      </View>
      {/* Button Stuck to Bottom */}
      <TouchableOpacity style={styles.stickyButton} onPress={handleButtonPress}>
        <Text style={styles.buttonText}>Back to Study</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f4f4f9',
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: '#4A90E2',
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  flashcardContainer: {
    marginVertical: 20,
    paddingHorizontal: 16,
  },
  flashcardCard: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  flashcardContent: {
    marginBottom: 10,
  },
  flashcardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  flashcardDescription: {
    fontSize: 16,
    color: '#555555',
    marginTop: 5,
  },
  pdfViewerContainer: {
    flex: 1,
    marginHorizontal: 16,
    marginBottom: 20,
    backgroundColor: '#e9e9f0',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3,
  },
  stickyButton: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#4A90E2',
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
    containerPDF: {
      flex: 1,
    },
    webview: {
      flex: 1,
    },
  
});

export default viewPageScreen;
