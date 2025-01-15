import { keytermService } from '../services/keytermService.js';
import { fileService } from '../services/fileService.js';
import {downloadPDF,deletePDF} from '../functions/pdfHandling.js';
import {OpenAIPromptHandling}  from '../functions/openAIPromptHandling.js';
import {createJSONkeyterm} from '../functions/createJsonObject.js'
import {isArrayOfJSONObjects} from '../functions/validateFormat.js'
const myPath = "C:\\Users\\rshha\\Documents\\VSCode\\projects\\Graduation-v7\\Learnify\\Server\\TempPDFs\\";

export const keytermController = {
    async generateSmartKeyterms(req, res) {
        try {
            //file info
            const file = await fileService.getFileById(req.params.fileid);
            const fileid = file.fileId;
            const filename = file.fileName;
            const fileurl = file.fileURL;
            /*
            const pagesDetailes = req.body.allPages ? 
            "form all pages" : 
            "from the content from page "+req.body.startPage+" to page "+req.body.endPage;
            const prompt = 'Create keyterms and their definetions '+pagesDetailes+'in the attached file.'
            +' Cover important informations in the pages without loss or duplication, at least one key term from each slide.'
            +'With a ' +req.body.complexity +'complexity level and a ' +req.body.length+ 'definition length'
            +In the following format as an array of JSON objects with key/def pairs,including the slide number 
            where each card is generated. Use this format:[{"key": "Replication", "def": "it is a key concept 
            in cloud computing ....","page":1},............]'
            without any additional text, comments, quotes, before or after the json object, no formatting, 
            quotes, only the json array between [].
            */
            //pages
            const pagesDetailes = req.body.allPages ? 
            "all pages" : 
            "only pages from page "+req.body.startPage+" to page "+req.body.endPage+" inclusive. ";
            //prepare propmt and fullpath for openAI function
            const prompt =
            `Create key terms and their definitions based on the content provided in ${pagesDetailes} in the attached file.. 
            Cover important information in the pages without loss or duplication, ensuring at least one key term from each slide. 
            With a ${req.body.complexity} complexity level and a ${req.body.length} definition length. 
            In the following format as an array of JSON objects with key/definition pairs, including the slide number where each card is generated. 
            Use this format: [{"key": "Replication", "def": "it is a key concept in cloud computing ....", "page": 1}, ...]
            Without any additional text, comments, quotes, before or after the JSON object, no formatting, quotes, only the JSON array between [].`+"and without ```json";
            console.log(prompt);
            const fullPath = myPath+filename;
            //download pdf, send to openAI, delete pdf 
            await downloadPDF(fileurl , myPath,filename);//url, savePath, filename
            const response = await OpenAIPromptHandling(fullPath,prompt); //filename,prompt
            await deletePDF(fullPath);
            //parse response to deal with it as json
            console.log(response);
            const jsonArray = JSON.parse(response);
            //validate
            if(!isArrayOfJSONObjects(jsonArray)){
                throw new Error("Something went wrong in response from openai api!");
            }
            //store
            const keytermsPromises = jsonArray.map(async (keyterm) => {
                const JSONkeyterm= createJSONkeyterm(keyterm.key,keyterm.def,fileid,keyterm.page,1);
                const createdKeyterm = await keytermService.createKeyterm(JSONkeyterm);
                return createdKeyterm;
            });
            await Promise.all(keytermsPromises);
            //get complete keyterms from db (with thier ids) 
            const keytermsResponse = await fileService.getKeytermsByFileId(fileid);
            //response
            res.status(201).json(keytermsResponse);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Error creating keyterm' });
        }
    },

    async createKeyterm(req, res) {
        try {
            const newKeyterm = await keytermService.createKeyterm(req.body);
            res.status(201).json(newKeyterm);
        } catch (error) {
            console.log(error);
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
            console.log(error);
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
            console.log(error);
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
            console.log(error);
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
            console.log(error);
            res.status(500).json({ error: 'Error retrieving keyterm' });
        }
    }
};
