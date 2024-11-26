import { keytermService } from '../services/keytermService.js';

export const keytermController = {
    async createKeyterm(req, res) {
        try {
            const newKeyterm = await keytermService.createKeyterm(req.body);
            res.status(201).json(newKeyterm);
        } catch (error) {
            res.status(500).json({ error: 'Error creating keyterm' });
        }
    },

    async updateKeyterm(req, res) {
        try {
            const updatedKeyterm = await keytermService.updateKeyterm(req.params.id, req.body);
            if (!updatedKeyterm) {
                return res.status(404).json({ error: 'Keyterm not found' });
            }
            res.json(updatedKeyterm);
        } catch (error) {
            res.status(500).json({ error: 'Error updating keyterm' });
        }
    },

    async deleteKeyterm(req, res) {
        try {
            const deletedKeyterm = await keytermService.deleteKeyterm(req.params.id);
            if (!deletedKeyterm) {
                return res.status(404).json({ error: 'Keyterm not found' });
            }
            res.json({ message: 'Keyterm deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Error deleting keyterm' });
        }
    },

    async getKeytermById(req, res) {
        try {
            const keytermId = req.params.id;
            const keyterm = await keytermService.getKeytermById(keytermId);
            if (!keyterm) {
                return res.status(404).json({ error: 'Keyterm not found' });
            }
            res.status(200).json(keyterm);
        } catch (error) {
            res.status(500).json({ error: 'Error retrieving keyterm' });
        }
    },
    async getKeytermByTermOrDef(req, res) {
        try {
            const termOrDef = req.params.termOrDef;
            const keyterm = await keytermService.getKeytermsByTermOrDef(termOrDef);
            if (!keyterm) {
                return res.status(404).json({ error: 'Keyterm not found' });
            }
            res.status(200).json(keyterm);
        } catch (error) {
            res.status(500).json({ error: 'Error retrieving keyterm' });
        }
    }

};
