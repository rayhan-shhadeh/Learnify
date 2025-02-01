import { LOCALHOST } from '@/api/axois';
import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";

const AddCardScreen = () => {
  const router =useRouter()
  const [cardNumber, setCardNumber] = React.useState<string>();
  const [cardType, setCardType] = React.useState('');
  const [cardholderName, setCardholderName] = React.useState('');
  const [cvv, setCvv] = React.useState('');
  const [expirationMonth, setExpirationMonth] = React.useState('');
  const [expirationYear, setExpirationYear] = React.useState('');
  const [userId,setUserId] = React.useState<string>();
  const [isFormValid,setIsFormValid]=React.useState(false);
    useEffect(() => {
    const initialize = async () => {
    const token = await AsyncStorage.getItem("token");
        if (!token) {
          Alert.alert("Error", "Token not found");
          router.push("/(tabs)/auth/signin");
          return;
        }
        const decoded: { id: string } | null = jwtDecode<{ id: string }>(token);
        setUserId(decoded?.id ?? '12');
        console.log(decoded?.id);
        initialize();
    }
    }, []);

  const detectCardType = (cardNumber:string) => {
    const visaRegex = /^4[0-9]{0,15}$/;
    const masterRegex = /^5[1-5][0-9]{0,14}$/;
    const discoverRegex = /^6(?:011|5[0-9]{2})[0-9]{0,12}$/;
    if (visaRegex.test(cardNumber)) {
      return 'Visa';
    }
    if (masterRegex.test(cardNumber)) {
      return 'MasterCard';
    }
    if (discoverRegex.test(cardNumber)) {
      return 'Discover';
    }
    return '';
  };

  const handleCardNumberChange = (cardNumber:string) => {
    setCardNumber(cardNumber);
    const detectedType = detectCardType(cardNumber);
    setCardType(detectedType);
  };

  const handlePayment = async () => {
    if (!cardholderName || !cardNumber || !cvv || !expirationMonth || !expirationYear) {

      Alert.alert('Error', 'All fields are required.');
      return;
    }
    setIsFormValid(true);
    const token = await AsyncStorage.getItem("token");

    if (!token) {
      Alert.alert("Error", "Token not found");
      router.push("/(tabs)/auth/signin");
      return;
    }
  
    const decoded: { id: string } | null = jwtDecode<{ id: string }>(token);
    const userId = decoded?.id ?? '12'; // Use userId directly
    console.log('Decoded User ID:', userId);
  
    if (!userId) {
      Alert.alert("Error", "Invalid user ID");
      return;
    }
    
    const payload = {
      cardholderName,
      cardNumber,
      cvv,
      expirationMonth: parseInt(expirationMonth, 10),
      expirationYear: parseInt(expirationYear, 10) + 2000,
    };
    try {
      const response = await fetch(`http://${LOCALHOST}:8080/api/payment/process-payment/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (response.ok) {
        Alert.alert('Success', `Transaction successful!\nTransaction ID: ${data.transactionId}`);
        try {
          const premiumResponse = await fetch(`http://${LOCALHOST}:8080/api/updatePremiumStatus/12`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ flag: 1 }),
          });
          const premiumData = await premiumResponse.json();
          if (premiumResponse.ok) {
            Alert.alert('Success', 'Your account has been upgraded to premium!');
            router.replace("/(tabs)/HomeScreen");
          } else {
            Alert.alert('Error', premiumData.message || 'Failed to upgrade your account.');
          }
        } catch (premiumError) {
          Alert.alert('Error', 'An error occurred while updating your account to premium.');
          console.error('Premium Update Error:', premiumError);
        }
      } else {
        switch (data.message) {
          case 'Card already saved':
            console.log('Card already saved');
            Alert.alert('Error', 'This card is already saved in the system.');
            break;
          case 'All fields are required':
            Alert.alert('Error', 'Please fill in all the required fields.');
            break;
          case 'Invalid card number':
            Alert.alert('Error', 'The card number you entered is invalid.');
            break;
          case 'Invalid CVV':
            Alert.alert('Error', 'The CVV code is invalid.');
            break;
          case 'Card is expired':
            Alert.alert('Error', 'The card you entered has expired.');
            break;
          case 'Unsupported card type':
            Alert.alert('Error', 'The card type is not supported.');
            break;
          case 'Transaction failed':
            Alert.alert('Error', `Transaction failed: ${data.error || 'Please try again later.'}`);
            break;
          default:
            Alert.alert('Error', `An unexpected error occurred: ${data.message}`);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please check your connection and try again.');
      console.error('Payment Error:', error);
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.cardContainer}>
        <View style={styles.iconTitleContainer}>
          <Icon name="credit-card" size={35} color="#1ca7ec" style={styles.icon} />
          <Text style={styles.cardTitle}>Card Details</Text>
        </View>
        <Text style={styles.label}>Cardholder Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Cardholder Name"
          placeholderTextColor="#9aa0b5"
          value={cardholderName}
          onChangeText={setCardholderName}
        />
        <Text style={styles.label}>Card Number</Text>
        <TextInput
            style={styles.input}
            placeholder="1234 5678 9012 3456"
            keyboardType="numeric"
            placeholderTextColor="#9aa0b5"
            value={cardNumber}
            maxLength={16}
            onChangeText={handleCardNumberChange}
        />
         <View style={styles.row}>
          <View style={styles.halfInputContainer}>
            <Text style={styles.label}>Expiration Date</Text>
            <View style={styles.expirationContainer}>
              <TextInput
                style={styles.expirationInput}
                placeholder="MM"
                maxLength={2}
                keyboardType="numeric"
                placeholderTextColor="#9aa0b5"
                value={expirationMonth}
                onChangeText={setExpirationMonth}
              />
              <Text style={styles.separator}>/</Text>
              <TextInput
                style={styles.expirationInput}
                placeholder="YY"
                maxLength={2}
                keyboardType="numeric"
                placeholderTextColor="#9aa0b5"
                value={expirationYear}
                onChangeText={setExpirationYear}
              />
            </View>
          </View>
          <View style={styles.halfInputContainer}>
            <Text style={styles.label}>CVV</Text>
            <TextInput
              style={styles.input}
              placeholder="CVV"
              secureTextEntry
              keyboardType="numeric"
              maxLength={3}
              placeholderTextColor="#9aa0b5"
              value={cvv}
              onChangeText={setCvv}
            />
          </View>
        </View>
        <Text style={styles.infoText}>
          Card will be saved for future transactions.
        </Text>

      </View>

      {(cardholderName &&cardNumber && cvv && expirationMonth &&expirationYear)&&
        <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
          <Text style={styles.payButtonText}>Pay Now</Text>
        </TouchableOpacity>
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#37678F',
    textAlign: 'center',
    marginVertical: 20,
  },
  cardContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 20,
    marginTop: 100
  },
  iconTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  icon: {
    marginRight: 10,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#37678F',
  },
  detectedCardContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  cardBackgroundImage: {
    width: '100%',
    height: 150,
    borderRadius: 12,
  },
  cardDetailsOverlay: {
    position: 'absolute',
    top: 20,
    left:70,
  },
  cardDetailsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#123455'
  },
  label: {
    fontSize: 14,
    color: '#333333',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d9d9d9',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: '#333',
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInputContainer: {
    width: '48%',
  },
  expirationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d9d9d9',
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  expirationInput: {
    width: '45%',
    fontSize: 16,
    color: '#333',
    paddingVertical: 10,
  },
  separator: {
    fontSize: 16,
    color: '#333',
    paddingHorizontal: 5,
  },
  payButton: {
    backgroundColor: '#1ca7ec',
    borderRadius: 50,
    paddingVertical: 15,
    marginTop: 30,
    alignSelf: 'center',
    alignItems: 'center',
    width: 200,
  },
  payButtonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: 'bold',
    borderRadius: 18
  },
  infoText: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginVertical: 10,
  },
  
});

export default AddCardScreen;
