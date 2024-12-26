import React from 'react';
import { View, StyleSheet } from 'react-native';
import ReactNativePdf from 'react-native-pdf';

import { RouteProp } from '@react-navigation/native';

type PDFViewerScreenRouteProp = RouteProp<{ params: { pdfUrl: string } }, 'params'>;

const PDFViewerScreen = ({ route }: { route: PDFViewerScreenRouteProp }) => {
  const { pdfUrl } = route.params;

  return (
    <View style={{ flex: 1 }}>
      <ReactNativePdf
        source={{uri: pdfUrl, cache: true}}
        onLoadComplete={(numberOfPages, filePath) => {
          console.log(`number of pages: ${numberOfPages}`);
        }}
        onPageChanged={(page, numberOfPages) => {
          console.log(`current page: ${page}`);
        }}
        onError={(error) => {
          console.log(error);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default PDFViewerScreen;
