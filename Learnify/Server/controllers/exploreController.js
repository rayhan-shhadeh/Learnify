import {topicService} from '../services/topicService.js'
import {exploreflashcardsService} from '../services/exploreflashcardsService.js';
import {exploreHistoryService} from '../services/exploreHistoryService.js';
import {generateExploreFlashcard} from '../functions/GoogleGenerativeAI.js';
import {createJSONTopic,createJSONExploreFlashcard, createJSONHabitStatus, createJSONExploreHistory} from '../functions/createJsonObject.js';
import {isArrayOfJSONObjects,isArrayOfStrings} from '../functions/validateFormat.js'
import {OpenAI} from '../functions/openAIPromptHandling.js'
import { userService } from '../services/userService.js';
import { courseService } from '../services/courseService.js';

export const exploreController={
    async searchTopic(req,res){
        try {
            let exploreflashcards=[]
            let searchedTopicId;
            const topicName = req.params.topicName;
            const level = req.body.level;
            const userId = req.body.userId;
            const topic = await topicService.getTopicByNameAndLevel(topicName,level);
            if(!topic || Object.keys(topic).length === 0 ){
                const topicData = createJSONTopic(topicName,level);
                const createdTopic = await topicService.createTopic(topicData);
                createdTopic.topicId
                const response = await generateExploreFlashcard(topicName,level);
                const jsonArrayResponse = JSON.parse(response);
                if(!isArrayOfJSONObjects(jsonArrayResponse)){
                    throw new Error("Somthing went wrong in response from gemini flash model!");
                }
                jsonArrayResponse.forEach(exploreflashcard => {
                    const JSONExploreFlashcard = createJSONExploreFlashcard(exploreflashcard.Q, exploreflashcard.A,createdTopic.topiclevelId);
                    exploreflashcardsService.createExploreFlashcard(JSONExploreFlashcard);
                 });
                searchedTopicId= createdTopic.topicId;
                exploreflashcards = response ;
            }
            else if (topic){
                exploreflashcards = await exploreflashcardsService.getExploreFlashcardsByTopicId(topic.topiclevelId);
                if(!exploreflashcards || Object.keys(exploreflashcards).length === 0 ){
                    topicService.deleteTopic(topic.topiclevelId);
                    res.status(500).json("try again");
                    return;
                }
                searchedTopicId= topic.topiclevelId;
            }
            //const userId = 12;
            const JSONExploreHistory = createJSONExploreHistory(userId,searchedTopicId)
            await exploreHistoryService.createExploreHistory(JSONExploreHistory); 
            res.status(200).json(exploreflashcards);
            return;
        }catch(error){
            console.log(error);
            res.status(500).json({ error: 'Error' });
            return;
        }
    },

    async suggestedTopics(req, res) {
    try{
        const majorName = req.params.majorName;//based on user
        const prompt="give me 15 important intermediate level topics that suggested for a user study major of"
        +majorName+"to explore."
        +" Please return it in format of array of string be carefull without additional text befor and after like :"
        +"topic1,toic2,topic3,......"+"without [] or"+ '""'
        +" Without ```json``` or any additional text";
        const suggestedTopics = await OpenAI(prompt);
        const topicsArray = suggestedTopics.split(",");
        if(!isArrayOfStrings(topicsArray)){
            throw new Error("Something went wrong in response from openai api!");
        }
        res.status(200).json(topicsArray);
    }catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while processing topics." });
    }
    },   

    async relatedTopics(req, res) {
        try{
            const userId = req.params.userId;
            const userData = await userService.getUserData(userId);
            const majorName = userData.major;
            const coursesResponse = await courseService.getCoursesByUserId(userId);
            const courseNames = coursesResponse.map(course => course.courseName);
            const prompt="give me 10 important related and specific topics to explore new information for a user study major of "
            +majorName+" and taking these courses "+courseNames+" be carefull that the topices are logicly not covered in these courses. "
            +"Please return it in format of array of string be carefull without additional text befor and after like :"
            +"topic1,toic2,topic3,......"+"without [] or"+ '""'
            +"without ```json``` or any additional text";
            const relatedTopices = await OpenAI(prompt);
            const topicsArray = relatedTopices.split(",");
            if(!isArrayOfStrings(topicsArray)){
                throw new Error("Something went wrong in response from openai api!");
            }
            res.status(200).json(topicsArray);
        }catch (error) {
            console.error(error);
            res.status(500).json({ error: "An error occurred while processing topics." });
        }
    },   
    
    async popularTopics(req, res) {
        try{
            const prompt="give me 10 popular and trendy topics but not known very much"
            +". Please return it in format of array of string be carefull without additional text befor and after like :"
            +"topic1,toic2,topic3,......"+"without [] or"+ '""'
            +"without ```json``` or any additional text";
            const relatedTopices = await OpenAI(prompt);
            const topicsArray = relatedTopices.split(",");
            if(!isArrayOfStrings(topicsArray)){
                throw new Error("Something went wrong in response from openai api!");
            }
            res.status(200).json(topicsArray);
        }catch (error) {
            console.error(error);
            res.status(500).json({ error: "An error occurred while processing topics." });
        }
    },   

    async exploreMore(req, res) {
        try{
            const prompt="please give 10 top trusted resources for learning this topic:" + req.params.topicName 
            //req.params.topicName will be fixed to be currentTopic
            +"return it in format of array of strings be carefull without additional text befor and after like :"
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

