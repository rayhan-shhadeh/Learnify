import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { useRoute, RouteProp } from '@react-navigation/native';

type RouteParams = {
  someParam?: string;
};

const PdfScreen = () => {
    const route = useRoute<RouteProp<{ params: RouteParams }>>();
    const { someParam } = route.params || {};  // Default to an empty object
  
    return (
      <View>
        <Text>{someParam ? someParam : 'No param provided'}</Text>
      </View>
    );
  };
  

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerText: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});

export default PdfScreen;
