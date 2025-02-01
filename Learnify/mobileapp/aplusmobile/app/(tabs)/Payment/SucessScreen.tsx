import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import { useRouter } from 'expo-router';

const SuccessScreen = () => {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      router.push('/(tabs)/HomeScreen'); // Redirect after animation
    }, 3000);
  }, []);

  return (
    <View style={styles.container}>
      <LottieView
        source={require('../../../assets/payment-success.json')}
        autoPlay
        loop={false}
        style={styles.lottie}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  lottie: {
    width: 500,
    height: 500,
  },
});

export default SuccessScreen;
