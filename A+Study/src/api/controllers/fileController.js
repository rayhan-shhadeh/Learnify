import {fileService } from '../services/fileService.js';
export const fileController = {
    async updateFileDetails(req, res) {
        try {
            const updatedFile = await fileService.updateFileDetails(req.params.fileId, req.body);
            if (!updatedFile) {
                return res.status(404).json({ error: 'file not found' });
            }
            res.json(updatedFile);
        } catch (error) {
            res.status(500).json({ error: 'Error updating file' });
            console.log(error);
        }
    },

    async getFlashcardsByFileId(req, res) {
        try {
            const fileId = req.params.fileId;
            console.log(fileId);
            const flashcard = await fileService.getFlashcardsByFileId(fileId);
            if (!flashcard) {
                return res.status(404).json({ error: 'Flash card not found' });
            }
            res.status(200).json(flashcard);
        } catch (error) {
            res.status(500).json({ error: 'Error retrieving flash card' });
            console.log(error);
        }
    },
    async getKeytermsByFileId(req, res) {
        try {
            const fileId = req.params.fileId;
            const Keyterm = await fileService.getKeytermsByFileId(fileId);
            if (!Keyterm) {
                return res.status(404).json({ error: 'term not found' });
            }
            res.status(200).json(Keyterm);
        } catch (error) {
            res.status(500).json({ error: 'Error retrieving term' });
            console.log(error);
        }
    },
    async getFilesByName(req,res){
        try {
            const Name = req.params.fileName;
            const file = await fileService.getfilesByName(Name);
            if (!file) {
                return res.status(404).json({ error: 'no files' });
            }
            res.status(200).json(file);
        }catch(error){
            res.status(500).json({ error: 'Error' });
            console.log(error);
        }
    },

}