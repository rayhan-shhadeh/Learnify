import OpenAIApi from 'openai';
import Configuration from 'openai';
import fs from "fs";

export  async function OpenAIPromptHandling(filePath,prompt){
    const client = new OpenAIApi(new Configuration({
      apiKey:OPENAI_API_KEY
    }));
    // Create an assistant
    const pdfAssistant = await client.beta.assistants.create({
      model: "gpt-4o",
      description: "An assistant to extract the contents of PDF files.",
      tools: [{ type: "file_search" }],
      name: "PDF assistant",
    });
    // Create a thread
    const thread = await client.beta.threads.create();
    // Upload the file
    const file = await client.files.create({
      file: fs.createReadStream(filePath),
      purpose: "assistants",
    });
    // Add a message with the file attachment
    const message = await client.beta.threads.messages.create(
      thread.id,
      { role: "user", content: prompt,  
      attachments : [
        {
          file_id: file.id,
          tools: [{ type: "file_search" }],
        },
      ]}
    );
    console.log(message);
    // Run the thread and wait for the result
    const run = await client.beta.threads.runs.createAndPoll(thread.id,{
      assistant_id: pdfAssistant.id,
      include: ["step_details.tool_calls[*].file_search.results[*].content"],     
    });
    if (run.status !== "completed") {
      throw new Error("Run failed:" + run.status);
    }
    // Fetch the messages
    const messagesCursor = await client.beta.threads.messages.list(thread.id, {
      thread_id: thread.id, 
      role: "user"
    });
    const response = JSON.stringify(messagesCursor, null, 2);
    const jsonObject = JSON.parse(response);
    const json = jsonObject.body.data[0].content[0].text.value;

    return json ;
}

export  async function OpenAI(prompt) {
    const client = new OpenAIApi(new Configuration({
      apiKey:OPENAI_API_KEY
    }));
    // Create an assistant
    const assistant = await client.beta.assistants.create({
      model: "gpt-4o",
      description: "An assistant to handle user prompts.",
      name: "Prompt Assistant",
    });
    // Create a thread
    const thread = await client.beta.threads.create();
    // Add a message with the user-provided prompt
    const message = await client.beta.threads.messages.create(
    thread.id,
    { 
      role: "user", 
      content: prompt
    }
    );
    console.log("Message created:", message);
    // Run the thread and wait for the result
    const run = await client.beta.threads.runs.createAndPoll(thread.id, {
      assistant_id: assistant.id
    });
    if (run.status !== "completed") {
      throw new Error("Run failed:" + run.status);
    }
    // Fetch the messages
    const messagesCursor = await client.beta.threads.messages.list(thread.id, {
      thread_id: thread.id
    });
    const response = JSON.stringify(messagesCursor, null, 2);
    const jsonObject = JSON.parse(response);
    const json = jsonObject.body.data[0].content[0].text.value;
    return json;
}
