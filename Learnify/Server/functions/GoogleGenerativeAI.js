import { GoogleGenerativeAI} from "@google/generative-ai";

export async function generateExploreFlashcard(topic,level){
    const genAI = new GoogleGenerativeAI("AIzaSyB2lWnCIpnFZR1ADxWw1VGRa0VwjycJ6GI");
    const model = genAI.getGenerativeModel({model:"gemini-1.5-flash"});
    const prompt = "Generate 10 flashcards about topic of"+topic+"for"+level+"level return as JSON FORMAT QA LIKE :"+
    '{"Q":"....","A":"...."} make sure without ```json```';
    const result = await model.generateContent(prompt);
    console.log (result.response.text());
    return result.response.text();
}
