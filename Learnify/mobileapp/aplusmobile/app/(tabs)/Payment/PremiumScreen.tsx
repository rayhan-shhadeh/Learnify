import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
const PaymentScreen: React.FC = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const handleNotNow = () => {
    navigation.goBack(); 
  };
  const handleUpgradeNow = () => {
    Alert.alert('Upgrade', 'Thank you for upgrading to premium!');
    router.replace("/(tabs)/Payment/PaymentMethods");
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Upgrade to Premium</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.description}>
          Unlock exclusive features for premium users:
        </Text>
        <View style={styles.benefitsList}>
          <Text style={styles.benefit}>• Access premium content</Text>
          <Text style={styles.benefit}>• Enjoy an ad-free experience</Text>
          <Text style={styles.benefit}>• Get priority customer support</Text>
        </View>
        <Text style={styles.description}>Would you like to upgrade now?</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.notNowButton} onPress={handleNotNow}>
          <Text style={styles.notNowButtonText}>Not Now</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.upgradeButton} onPress={handleUpgradeNow}>
          <Text style={styles.upgradeButtonText}>Upgrade Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default PaymentScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 20,
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  description: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 15,
  },
  benefitsList: {
    marginBottom: 20,
    alignSelf: 'center',
  },
  benefit: {
    fontSize: 14,
    color: '#555',
    marginVertical: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  notNowButton: {
    flex: 1,
    backgroundColor: '#e0e0e0',
    paddingVertical: 12,
    borderRadius: 5,
    marginRight: 10,
    alignItems: 'center',
  },
  notNowButtonText: {
    fontSize: 16,
    color: '#555',
  },
  upgradeButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 5,
    marginLeft: 10,
    alignItems: 'center',
  },
  upgradeButtonText: {
    fontSize: 16,
    color: '#fff',
  },
});
