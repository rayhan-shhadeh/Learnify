import {topicService} from '../services/topicService.js'
import {exploreflashcardsService} from '../services/exploreflashcardsService.js';
import {exploreHistoryService} from '../services/exploreHistoryService.js';
import {generateExploreFlashcard} from '../functions/GoogleGenerativeAI.js';
import {createJSONTopic,createJSONExploreFlashcard,createJSONExploreHistory} from '../functions/createJsonObject.js';
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
            console.log("level from server:"+level);
            const userId = req.body.userId;
            const topic = await topicService.getTopicByNameAndLevel(topicName,level);
            if(!topic || Object.keys(topic).length === 0 ){
                const topicData = createJSONTopic(topicName,level);
                const createdTopic = await topicService.createTopic(topicData);
                const response = await generateExploreFlashcard(topicName,level);
                const jsonArrayResponse = JSON.parse(response);
                if(!isArrayOfJSONObjects(jsonArrayResponse)){
                    throw new Error("Somthing went wrong in response from gemini flash model!");
                }
                await Promise.all(
                    jsonArrayResponse.map(async (exploreflashcard) => {
                        const JSONExploreFlashcard = createJSONExploreFlashcard(
                            exploreflashcard.Q,
                            exploreflashcard.A,
                            createdTopic.topiclevelId
                        );
                        const createdExploreFlashcard = await exploreflashcardsService.createExploreFlashcard(JSONExploreFlashcard);
                        exploreflashcards.push(createdExploreFlashcard);
                    })
                );
                searchedTopicId= createdTopic.topiclevelId;
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
            const JSONExploreHistory = createJSONExploreHistory(userId,searchedTopicId)
            await exploreHistoryService.createExploreHistory(userId,searchedTopicId,JSONExploreHistory); 
            res.status(200).json(exploreflashcards);
            return;
        }catch(error){
            console.log(error);
            res.status(500).json({ error: 'Error' });
            return;
        }
    },
    /*
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
    */
    async generateTopics(req, res) {
        try {
            const userId = req.params.userId;
            const userData = await userService.getUserData(userId);
            const majorName = userData.major;
            const coursesResponse = await courseService.getCoursesByUserId(userId);
            const courseNames = coursesResponse.map(course => course.courseName);
            const prompt = 
               `1. Suggested Topics: Give me 10 important intermediate-level topics suggested for a user studying 
                the major of ${majorName}.
                2. Related Topics: Provide 10 important related and specific topics for a user studying the major 
                of ${majorName} and taking these courses: ${courseNames.join(", ")}. 
                Ensure the topics are logically not covered in these courses.
                3. Popular Topics: List 10 popular and trendy topics that are not widely known.
                Please return the response in the following JSON format (without additional text
                before or after):
                {
                    "Suggested Topics": ["topic1", "topic2", "topic3", ...],
                    "Related Topics": ["topic1", "topic2", "topic3", ...],
                    "Popular Topics": ["topic1", "topic2", "topic3", ...]
                }
                , please be carefull about json format I am using this response in my application as a develeper
            `+'without ```json``` or any additional text';
            const apiResponse = await OpenAI(prompt);
            const parsedResponse = JSON.parse(apiResponse);
            if (!parsedResponse || !parsedResponse["Suggested Topics"] || !parsedResponse["Related Topics"] || !parsedResponse["Popular Topics"]) {
                throw new Error("Invalid response format from OpenAI API!");
            }
            if (
                !isArrayOfStrings(parsedResponse["Suggested Topics"]) ||
                !isArrayOfStrings(parsedResponse["Related Topics"]) ||
                !isArrayOfStrings(parsedResponse["Popular Topics"])
            ) {
                throw new Error("Response contains invalid topic data!");
            }
            res.status(200).json(parsedResponse);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "An error occurred while processing topics." });
        }
    },
    
    async exploreMore(req, res) {
        try{
            const topicName = req.params.topicName;
            const level = req.body.level;
            //console.log( "hi from explore more with level " + level );
            const prompt="Please give 10 top trusted resources for learning this topic:" 
            +topicName + "for user has "  + level +" level in this topic. "
            +"return it in format of array of JSON objects be carefull without additional text befor and after like :"
            +"[{'resourceName':'resource1','resourceLink':'www.resource1.com'}, {resourceName':'resource2','resourceLink':'www.resource2.com},......]"
            +" Without ```json``` or any additional text. "+
            "note: short names";
            const resources = await OpenAI(prompt);
            const jsonResources = JSON.parse(resources);
            if(!isArrayOfJSONObjects(jsonResources)){
                throw new Error("Something went wrong in response from openai api!");
            }
            res.status(200).json(jsonResources);
        }catch (error) {
            console.log(error);
            res.status(500).json({ error: "An error occurred while processing topics." });
        }
    }     
}

