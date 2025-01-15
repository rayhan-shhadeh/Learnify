import { flashcardService } from '../services/flashcardService.js';
import { fileService } from '../services/fileService.js';
import {deletePDF,downloadPDF} from '../functions/pdfHandling.js';
import {OpenAIPromptHandling } from '../functions/openAIPromptHandling.js';
import {createJSONFlashcard} from '../functions/createJsonObject.js'
import {isArrayOfJSONObjects} from '../functions/validateFormat.js'

const myPath = "C:\\Users\\rshha\\Documents\\VSCode\\projects\\Graduation-v7\\Learnify\\Server\\TempPDFs\\";
export const flashcardController = {
    async generateSmartFlashcard(req, res) {
        try {
            const file = await fileService.getFileById(req.params.fileid);
            //file info
            const fileId = file.fileId;
            const filename = file.fileName;
            const fileurl = file.fileURL;
            /*
            const pagesDetailes = req.body.allPages ? 
            "form all pages" : 
            "from the content from page "+req.body.startPage+" to page "+req.body.endPage+" inclusive.";
            //prepare prompt and fullpath for openAI function
            const prompt = 'Create flashcards '+pagesDetailes+' in the attached file.'
            +" Cover important informations in the pages without loss or duplication, at least one flashcard from each slide.don't include any key term and its defiftion"
            +'With a ' +req.body.complexity +'complexity level and a ' +req.body.length+ 'card length';
            +'one flashcard from each slide.'
            +`In the following format as an array of JSON objects with QA pairs,including the slide number 
            where each card is generated. Use this format: [{"Q": "What is today?", "A": "Tuesday", "page": 1},...]
            without any additional text, comments, quotes, before or after the json object, no formatting, 
            quotes, only the json array between [].`
            */
            const pagesDetailes = req.body.allPages ? 
            "all pages" : 
            req.body.startPage != req.body.endPage ?
            "only pages from page "+req.body.startPage+" to page "+req.body.endPage+"iclusive": 
            "only from page " +req.body.startPage;
            const prompt = 
            `Create flashcards based on the content provided in ${pagesDetailes} in the attached file. 
            Cover all important information from each page without loss or duplication, ensuring at least one flashcard is created from each slide. 
            Do not include key terms and their definitions as flashcards.
            Generate the flashcards with a complexity level of ${req.body.complexity} and a card length of ${req.body.length}. 
            Ensure one flashcard is included from each slide, and present the results in the following format: 
            an array of JSON objects with question-answer (QA) pairs, including the slide number where each card is generated. 
            The format should strictly be: [{"Q": "What is today?", "A": "Tuesday", "page": 1}, ...]. 
            Do not add any additional text, comments, quotes, or formatting outside the JSON array.`+"and without ```json";
            //console.log(prompt);
            const fullPath = myPath+filename;
            //download pdf, send to openAI, delete pdf
            await downloadPDF(fileurl , myPath ,filename);//url, savePath, filename
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
