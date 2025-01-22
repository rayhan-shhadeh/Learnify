import braintree from 'braintree';
import { detectCardType } from '../functions/payment.js';
import { createJSONCard, createJSONTransaction } from '../functions/createJsonObject.js';
import { paymentService } from '../services/paymentService.js';
import { statisticsService } from '../services/statisticsService.js';
export const paymentController = {
  async processPayment(req, res) {
    const userId = parseInt(req.params.userId);
    const { cardholderName, cardNumber, cvv, expirationMonth, expirationYear } = req.body;
    const amount = 15;
    // Validate required fields
    if (!cardholderName || !cardNumber || !cvv || !expirationMonth || !expirationYear) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    // Card number validation
    const cardNumberRegex = /^[0-9]{13,19}$/;
    if (!cardNumberRegex.test(cardNumber)) {
      return res.status(400).json({ message: 'Invalid card number' });
    }
    // CVV validation
    const cvvRegex = /^[0-9]{3,4}$/;
    if (!cvvRegex.test(cvv)) {
      return res.status(400).json({ message: 'Invalid CVV' });
    }
    // Expiration date validation
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    if (
      expirationYear < currentYear ||
      (expirationYear === currentYear && expirationMonth < currentMonth)
    ) {
      return res.status(400).json({ message: 'Card is expired' });
    }    
    // Detect card type
    const cardType = detectCardType(cardNumber);
    if (!cardType) {
      return res.status(400).json({ message: 'Unsupported card type' });
    }
    // Initialize Braintree gateway
    const gateway = new braintree.BraintreeGateway({
      environment: braintree.Environment.Sandbox,
      merchantId: '22843gqz4qgzndtw',
      publicKey: 'm93r9cxtq8kn3pz3',
      privateKey: 'd1450265cac577e8f39be3904475db07',
    });
    try {
      // Process transaction
      const result = await gateway.transaction.sale({
        amount: amount.toFixed(2), // Ensure amount is formatted correctly
        paymentMethodNonce: 'fake-valid-nonce',
        creditCard: {
          cardholderName,
          number: cardNumber,
          cvv,
          expirationMonth,
          expirationYear,
        },
        options: {
          submitForSettlement: true,
        },
      });
      if (result.success) {
        // Handle successful transaction
        const jsonCard = createJSONCard(cardNumber,cardholderName,cvv, expirationMonth,expirationYear,cardType,userId);
        let newDate = new Date();
        newDate.setDate(currentDate.getDate() + 30);
        
        const createdCard = await paymentService.createCard(jsonCard);
        const jsonTransaction = createJSONTransaction(result.transaction.id,userId,createdCard.cardId,amount,new Date(),newDate);
        console.log(jsonTransaction);
        await paymentService.createTransaction(jsonTransaction);
        return res.status(200).json({
          message: 'Transaction successful',
          transactionId: result.transaction.id,
          cardNumber: createdCard.cardId,
        });
      } else {
        // Handle failed transaction
        const errorDetails = result.errors
          ? result.errors.deepErrors()
          : 'Unknown error';
        return res.status(500).json({
          message: 'Transaction failed',
          error: result.message || errorDetails,
        });
      }
    } catch (error) {
      // Handle unexpected errors
      console.error('Payment Error:', error);
      return res.status(500).json({
        message: 'An error occurred while processing payment',
        error: error.message,
      });
    }
  },
  async reachLimit  (req, res) {
    try {
      const { userId } = req.params;
      const falshcardsCount = await statisticsService.getFlashcardsCount(userId);
      const keytermsCount =  await statisticsService.getKeytermsCount(userId); 
      const quizzesCount =  await statisticsService.getQuizzesCount(userId); 
      const totalCount = falshcardsCount + keytermsCount + quizzesCount;
      const limit = 0;
      res.status(200).json(totalCount>limit);
    } catch (error) {
      console.error('Error in generatingLimit:', error);
      res.status(500).json({ error: 'An error occurred while checking the content limit.' });
    }
  }
};
