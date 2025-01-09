import { GoogleGenerativeAI} from "@google/generative-ai";
export async function generateExploreFlashcard(topic,level){
    const genAI = new GoogleGenerativeAI("AIzaSyCHDj9TAn2cBcGU9umKgJYrJ2F0DWkuDPw");
    const model = genAI.getGenerativeModel({model:"gemini-1.5-flash"});
    const prompt = `Generate 10 flashcards about the topic "${topic}" for ${level} level. 
    The response should be a JSON array formatted as follows:
    [{
       "Q": "Question text", 
       "A": "Answer Text"
     },
     { "Q": "Question text", 
       "A": "Answer Text
     }
    ]
    Ensure the JSON is clean and properly formatted without any additional text, 
    ode block markers, or explanations. and without`+"```json```";
    const result = await model.generateContent(prompt);
    console.log (result.response.text());
    return result.response.text();
}
/*
    const prompt = "Generate 10 flashcards about topic of"+topic+"for"+
    level+"level return as JSON format of Q and A like :"+
    '{"Q":"....","A":"...."} make sure without ```json```.' 
    +'and carfull about formating because I am usig this'
    +'response in my application as a developer';
*/
//await generateExploreFlashcard("QOS","Advanced")