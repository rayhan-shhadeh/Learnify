import { transactionService } from '../services/transactionService.js';

export const transactionController = {
  async getTransactionsByUserId(req, res) {
    const { userId } = req.params;
    try {
      const transactions = await transactionService.getTransactionsByUserId(userId);
      res.status(200).json(transactions);
    } catch (error) {
      console.error('Get Transactions Error:', error.message);
      res.status(500).json({ message: 'Failed to retrieve transactions', error: error.message });
    }
  },
  async deleteTransaction(req, res) {
    const { transactionId } = req.params;
    try {
      await transactionService.deleteTransaction(transactionId);
      res.status(200).json({ message: 'Transaction deleted successfully' });
    } catch (error) {
      if (error.code === 'P2025') {
        res.status(404).json({ message: 'Transaction not found' });
      } else {
        console.error('Delete Transaction Error:', error.message);
        res.status(500).json({ message: 'Failed to delete transaction', error: error.message });
      }
    }
  },
  /*
  async getTransactionById(req, res) {
    const { transactionId } = req.params;
    try {
      const transaction = await transactionService.getTransactionById(transactionId);
      if (transaction) {
        res.status(200).json(transaction);
      } else {
        res.status(404).json({ message: 'Transaction not found' });
      }
    } catch (error) {
      console.error('Get Transaction By ID Error:', error.message);
      res.status(500).json({ message: 'Failed to retrieve transaction', error: error.message });
    }
  },
  */
};
