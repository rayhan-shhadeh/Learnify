import { cardService } from "../services/cardService.js";

export const cardController = {
  async getCardsByUserID(req, res) {
    const { userId } = req.params;
    try {
      const cards = await cardService.getCardsByUserID(userId);
      res.status(200).json(cards);
    } catch (error) {
      console.error('Get Cards Error:', error.message);
      res.status(500).json({ message: 'Failed to retrieve cards', error: error.message });
    }
  },
  async deleteCard(req, res) {
    const { cardId } = req.params;
    try {
      await cardService.deleteCard(cardId);
      res.status(200).json({ message: 'Card deleted successfully' });
    } catch (error) {
      if (error.code === 'P2025'){
        res.status(404).json({ message: 'Card not found' });
      } else {
        console.error('Delete Card Error:', error.message);
        res.status(500).json({ message: 'Failed to delete card', error: error.message });
      }
    }
  },
  async getCardById(req, res) {
    const { cardId } = req.params;
    try {
      const card = await cardService.getCardById(cardId);
      if (card) {
        res.status(200).json(card);
      } else {
        res.status(404).json({ message: 'Card not found' });
      }
    } catch (error) {
      console.error('Get Card By ID Error:', error.message);
      res.status(500).json({ message: 'Failed to retrieve card', error: error.message });
    }
  }
};
