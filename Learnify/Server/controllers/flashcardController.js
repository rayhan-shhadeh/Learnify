import { flashcardService } from '../services/flashcardService.js';
import { fileService } from '../services/fileService.js';
import {deletePDF,downloadPDF} from '../functions/pdfHandling.js';
import {OpenAIPromptHandling } from '../functions/openAIPromptHandling.js';
import {createJSONFlashcard} from '../functions/createJsonObject.js'
import {isArrayOfJSONObjects} from '../functions/validateFormat.js'

export const flashcardController = {
    async generateSmartFlashcard(req, res) {
        try {
            const file = await fileService.getFileById(req.params.fileid);
            //file info
            const fileId = file.fileId;
            const filename = file.fileName;
            const fileurl = file.fileURL;
            //prepare prompt and fullpath for openAI function
            const prompt = 'Create flashcards for the attached file, focus on important infrormation.' + 
            'in the following format as an array of JSON objects with QA pairs,' 
            +'including the slide number where each card is generated. Use this format:'
            +'[{"Q": "What is today?", "A": "Tuesday", "page": 1},...]'
            +'without any additional text, comments, quotes, before or after the json object, no formatting, quotes, only the json array between [].'
            +"Generate flashcards that covered important informations in file without loss or duplication. don't include any key term and its defiftion."
            +"one flashcard from each slide."
            +'With a ' +req.body.complexity +
            +'complexity level and a ' +req.body.length+ 'card length';
             const fullPath = process.env.SAVE_PATH+filename;
            //download pdf, send to openAI, delete pdf
            await downloadPDF(fileurl , process.env.SAVE_PATH ,filename);//url, savePath, filename
            const response = await OpenAIPromptHandling(fullPath,prompt);//filename,prompt
            await deletePDF(fullPath);
            //parse the response to deal with it as json
            console.log(response);
            const jsonArrayResponse = JSON.parse(response);
            //validate format as array of json objects
            if(!isArrayOfJSONObjects(jsonArrayResponse)){
                throw new Error("Something went wrong in response from openai api!");
            }
            //store flashcards in db
            const flashcardPromises = jsonArrayResponse.map(async (flashcard) => {
                const JSONflashcard = createJSONFlashcard("flashcard"+fileId,flashcard.Q,flashcard.A,fileId, flashcard.page,1);
                const createdFlahcard = await flashcardService.createFlashcard(JSONflashcard);
                return createdFlahcard;
            });
            await Promise.all(flashcardPromises);
            //get complete flashcards from db (with thier ids)
            const flashcardsResponse = await fileService.getFlashcardsByFileId(fileId);
            //response
            res.status(201).json(flashcardsResponse);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Error creating flash card' });
        }
    },

    async createFlashcard(req, res) {
        try {
            const newFlashCard = await flashcardService.createFlashcard(req.body);
            res.status(201).json(newFlashCard);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Error creating flash card' });
        }
    },

    async updateFlashcard(req, res) {
        try {
            const updatedFlashCard = await flashcardService.updateFlashcard(req.params.id, req.body);
            if (!updatedFlashCard) {
                return res.status(404).json({ error: 'Flash card not found' });
            }
            res.json(updatedFlashCard);
        } catch (error) {
            res.status(500).json({ error: 'Error updating flash card' });
        }
    },

    async deleteFlashcard(req, res) {
        try {
            const deletedFlashCard = await flashcardService.deleteFlashcard(req.params.id);
            if (!deletedFlashCard) {
                return res.status(404).json({ error: 'Flashcard not found' });
            }
            res.json({ message: 'Flashcard deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Error deleting flashcard' });
        }
    },

    async getFlashcardById(req, res) {
        try {
            const flashcardId = req.params.id;
            const flashcard = await flashcardService.getFlashcardById(flashcardId);
            if (!flashcard) {
                return res.status(404).json({ error: 'Flash card not found' });
            }
            res.status(200).json(flashcard);
        } catch (error) {
            res.status(500).json({ error: 'Error retrieving flash card' });
        }
    },

    async getFlashcardByQorA(req, res) {
        try {
            const QorA = req.params.QorA;
            const flashcard = await flashcardService.getFlashcardByQorA(QorA);
            if (!flashcard) {
                return res.status(404).json({ error: 'Flash card not found' });
            }
            res.status(200).json(flashcard);
        } catch (error) {
            res.status(500).json({ error: 'Error retrieving flash card' });
            console.log(error);

        }
    }
};