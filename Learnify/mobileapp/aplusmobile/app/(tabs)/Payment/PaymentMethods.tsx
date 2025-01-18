import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'expo-router';
import { LOCALHOST } from '@/api/axois';
import { useNavigation } from '@react-navigation/native';

interface Card {
  id: string;
  type: string;
  last4: string;
  logo: string | null;
}

const PaymentMethodsScreen: React.FC = () => {
  const navigate = useNavigation();
  const router = useRouter();
  const [cardData, setCardData] = useState<Card[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>();
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  const fetchCardData = async (): Promise<void> => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'Token not found');
        router.push('/(tabs)/auth/signin');
        return;
      }
      const decoded: { id: string } | null = jwtDecode<{ id: string }>(token);
      setUserId(decoded?.id ?? '12');
      console.log(decoded?.id);
      setLoading(true);
      const response = await fetch(`http://${LOCALHOST}:8080/api/user/cards/${decoded?.id}`);
      const data: {
        cardId: number;
        cardNumber: string;
        cardHolderName: string;
        cvc: string;
        expirationMonth: number;
        expirationYear: number;
        cardType: string;
        userid: number;
      }[] = await response.json();
      const transformedData: Card[] = data.map((card) => ({
        id: card.cardId.toString(),
        type: card.cardType,
        last4: card.cardNumber.slice(-4),
        logo:
          card.cardType === 'Visa'
            ? 'https://seeklogo.com/images/V/visa-logo-6F4057663D-seeklogo.com.png'
            : card.cardType === 'MasterCard'
            ? 'https://seeklogo.com/images/M/mastercard-logo-18A5B70CBA-seeklogo.com.png'
            : card.cardType === 'Discover'
            ? 'https://seeklogo.com/images/D/discover-card-logo-7B7C5FCBA2-seeklogo.com.png'
            : null,
      }));

      setCardData(transformedData);
    } catch (error) {
      console.error('Error fetching card data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCardData();
  }, []);

  const renderCardItem = ({ item }: { item: Card }) => (
    <View
      style={[
        styles.cellContainer,
        selectedCardId === item.id && styles.selectedCardContainer,
      ]}
    >
      <View style={styles.cardItem}>
        <TouchableOpacity
          onPress={() => setSelectedCardId(item.id)}
          style={styles.radioContainer}
        >
          <View
            style={[
              styles.radioOuterCircle,
              selectedCardId === item.id && styles.radioSelected,
            ]}
          >
            {selectedCardId === item.id && <View style={styles.radioInnerCircle} />}
          </View>
        </TouchableOpacity>
        <Image source={{ uri: item.logo || '' }} style={styles.cardLogo} />
        <Text style={styles.cardNumber}>**** **** **** {item.last4}</Text>
        <TouchableOpacity onPress={() => handleDeleteCard(item.id)}>
          <Icon name="trash" size={20} color="#999" />
        </TouchableOpacity>
      </View>
    </View>
  );
    const handleDeleteCard = async (cardId: string) => {
    try {
      const response = await fetch(`http://${LOCALHOST}:8080/api/card/${cardId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setCardData((prevData) => prevData.filter((card) => card.id !== cardId));
        if (selectedCardId === cardId) {
          setSelectedCardId(null);
        }
      } else {
        Alert.alert('Error', 'Failed to delete the card');
      }
    } catch (error) {
      console.error('Error deleting card:', error);
      Alert.alert('Error', 'An unexpected error occurred');
    }
  };

  const handlePayment = async () => {
    if (!selectedCardId) {
      Alert.alert('Error', 'No card selected.');
      return;
    }
    try {
      // Fetch the card details by cardId
      const cardResponse = await fetch(`http://${LOCALHOST}:8080/api/card/${selectedCardId}`);
      const cardDetails = await cardResponse.json();
      if (!cardResponse.ok) {
        Alert.alert('Error', cardDetails.message || 'Failed to fetch card details.');
        return;
      }
      const payload = {
        cardholderName: cardDetails.cardHolderName,
        cardNumber: cardDetails.cardNumber,
        cvv: cardDetails.cvc,
        expirationMonth: cardDetails.expirationMonth,
        expirationYear: cardDetails.expirationYear,
      };
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'Token not found');
        router.push('/(tabs)/auth/signin');
        return;
      }
      const decoded: { id: string } | null = jwtDecode<{ id: string }>(token);
      const userId = decoded?.id ?? '12';
      const response = await fetch(`http://${LOCALHOST}:8080/api/payment/process-payment/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (response.ok) {
        Alert.alert('Success', `Transaction successful!\nTransaction ID: ${result.transactionId}`);
        try {
          const premiumResponse = await fetch(`http://${LOCALHOST}:8080/api/updatePremiumStatus/${userId}`, {
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
        switch (result.message) {
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
            Alert.alert('Error', `Transaction failed: ${result.error || 'Please try again later.'}`);
            break;
          default:
            Alert.alert('Error', `An unexpected error occurred: ${result.message}`);
        }
      }
    } catch (error) {
      console.error('Payment Error:', error);
      Alert.alert('Error', 'Something went wrong. Please try again later.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment Cards</Text>
      <View style={styles.header}>
          <Text style={styles.headerText}>15$/month</Text>
        </View>

      <View style={styles.cardContainer}>
        <View style={styles.header}>
          <Icon name="credit-card" size={20} color="#0056D2" />
          <Text style={styles.headerText}>Credit Cards</Text>
        </View>

        <FlatList
          data={cardData}
          renderItem={renderCardItem}
          keyExtractor={(item) => item.id}
          style={styles.cardList}
        />


        <TouchableOpacity
          style={styles.addCardButton}
          onPress={() => {
            router.push('/(tabs)/Payment/CardDetailsScreen');
          }}
        >
          <Icon name="plus" size={20} color="#0056D2" />
          <Text style={styles.addCardText}>Add card</Text>
        </TouchableOpacity>

      </View>
      {selectedCardId && (
          <TouchableOpacity
            style={styles.payNowButton}
            onPress={handlePayment}
          >
            <Text style={styles.payNowButtonText}>Pay Now</Text>
          </TouchableOpacity>
        )}

    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#f5f5f5',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#0056D2',
      textAlign: 'center',
      marginVertical: 20,
      marginBottom: 20,
    },
    cardContainer: {
      backgroundColor: '#fff',
      borderRadius: 12,
      padding: 20,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 5,
      borderWidth: 1,
      borderColor: '#f2f2f2',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
    },
    headerText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#333',
      marginLeft: 10,
    },
    cardList: {
      marginBottom: 20,
    },
    cellContainer: {
      backgroundColor: '#f0f8ff',
      borderRadius: 50,
      padding: 15,
      marginBottom: 15,
      elevation: 3,
      flexDirection: 'row',
      alignItems: 'center',
    },
    selectedCardContainer: {
      borderWidth: 2,
      borderColor: '#0056D2', // Blue border for selected card
    },
    cardItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      flex: 1,
    },
    cardLogo: {
      width: 40,
      height: 25,
      resizeMode: 'contain',
    },
    cardNumber: {
      flex: 1,
      fontSize: 16,
      color: '#333',
      marginLeft: 15,
    },
    radioContainer: {
      marginRight: 15,
    },
    radioOuterCircle: {
      width: 20,
      height: 20,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: '#0056D2',
      justifyContent: 'center',
      alignItems: 'center',
    },
    radioInnerCircle: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: '#0056D2',
    },
    radioSelected: {
      borderColor: '#0056D2',
    },
    addCardButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 20,
      paddingHorizontal: 15,
      borderRadius: 50,
      backgroundColor: '#f0f8ff',
    },
    addCardText: {
      marginLeft: 10,
      fontSize: 16,
      color: '#0056D2',
      fontWeight: '600',
    },
    payNowButton: {
      backgroundColor: '#0056D2',
      borderRadius: 50,
      paddingVertical: 15,
      marginTop: 30,
      alignSelf: 'center',
      alignItems: 'center',
      width: 200,
    },
    payNowButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    }
});

export default PaymentMethodsScreen;
