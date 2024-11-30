import {topicService} from '../services/topicService.js'
import {exploreflashcardsService} from '../services/exploreflashcardsService.js';
import {generateExploreFlashcard} from '../functions/GoogleGenerativeAI.js';
import {createJSONTopic,createJSONExploreFlashcard} from '../functions/createJsonObject.js';
import {isArrayOfJSONObjects,isArrayOfStrings} from '../functions/validateFormat.js'
import {OpenAI} from '../functions/openAIPromptHandling.js'

let currentTopic = "";
export const exploreController={
    async searchTopic(req,res){
        try {
            const topicName = req.params.topicName;
            const level = req.body.level;
            const topic = await topicService.getTopicByName(topicName);
            currentTopic = topic ; 
            if(!topic || Object.keys(topic).length === 0 ){
                const topicData = createJSONTopic(topicName);
                const createdTopic = await topicService.createTopic(topicData);

                const response = await generateExploreFlashcard(topicName,level);
                const jsonArrayResponse = JSON.parse(response);
                if(!isArrayOfJSONObjects(jsonArrayResponse)){
                    throw new Error("Somthing went wrong in response from gemini flash model!");
                }
                jsonArrayResponse.forEach(exploreflashcard => {
                    const JSONExploreFlashcard = createJSONExploreFlashcard(exploreflashcard.Q, exploreflashcard.A,createdTopic.topicId);
                    exploreflashcardsService.createExploreFlashcard(JSONExploreFlashcard);
                 });
                res.status(200).json(response);
            }
            else if (topic){
                const exploreflashcards = await exploreflashcardsService.getExploreFlashcardsByTopicId(topic.topicId);
                if(!exploreflashcards || Object.keys(exploreflashcards).length === 0 ){
                    topicService.deleteTopic(topic.topicId);
                    res.status(500).json("try again");
                }
                else{
                    res.status(200).json(exploreflashcards);
                }
            }
        }catch(error){
            console.log(error);
            res.status(500).json({ error: 'Error' });
        }
    },

    async suggestedTopics(req, res) {
    try{
        const majorName = req.params.majorName;//based on user
        const prompt="give me 15 important intermediate level topics to explore for a user study major of"
        +majorName
        +"return it in format of array of string be carefull without additional text befor and after like :"
        +"topic1,toic2,topic3,......"
        +"without ```json``` or any additional text";
        const suggestedTopics = await OpenAI(prompt);
        const topicsArray = suggestedTopics.split(",");
        if(!isArrayOfStrings(topicsArray)){
            throw new Error("Something went wrong in response from openai api!");
        }
        res.status(200).json(suggestedTopics);
    }catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while processing topics." });
    }
    },   
     
    async exploreMore(req, res) {
        try{
            const prompt="please give 10 top trusted resources for learning this topic:" + req.params.topicName 
            //req.params.topicName will be fixed to be currentTopic
            +"return it in format of array of string be carefull without additional text befor and after like :"
            +"www.resource1.com,www.resource2.edu,www.resource3.org,......";
            const resources = await OpenAI(prompt);
            const resourcesArray = resources.split(",");
            if(!isArrayOfStrings(resourcesArray)){
                throw new Error("Something went wrong in response from openai api!");
            }
            res.status(200).json(resources);
        }catch (error) {
            console.log(error);
            res.status(500).json({ error: "An error occurred while processing topics." });
        }
    }     
}
