import 'dotenv/config';
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai"; 
import { QdrantVectorStore } from "@langchain/qdrant";
import { OpenAI } from 'openai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const client = new OpenAI({
    apiKey: GEMINI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

const chatWithDatabase = async(req,res)=>{
    const {user_query}=req.body; // user query is the question
    
    try {
        const embeddings = new GoogleGenerativeAIEmbeddings({
        apiKey: process.env.GEMINI_API_KEY, // Use your Google API key
        modelName: "embedding-001", // The model for Gemini embeddings
    });

    const vectorStore = await QdrantVectorStore.fromExistingCollection(
             embeddings , { 
            url : process.env.QDRANT_URL,
            collectionName : process.env.COLLECTION_NAME
        },
    )

    const vectorSearch = vectorStore.asRetriever(
        {
            k:3 // k is the number of documents to return
        }
    )

    const relevantDocs = await vectorSearch.invoke(user_query)

    const SYSTEM_PROMPT=`
        YOU ARE AN AI ASSISTANT WITH DEEP KNOWLEDGE BASED ON THE DATA PROVIDED IN THE CONTEXT.
        YOUR TASK IS TO ANSWER USER QUERY FROM THE DATA PROVIDED WITHIN THE CONTEXT ALONG WITH SOURCES
        LIKE PAGE NUMBER IF TAKEN FROM PDF, WEBSITE URL IF TAKEN FROM WEBSITE.
        IF YOU DO NOT FIND THE ANSWER IN THE CONTEXT, SIMPLY RESPOND WITH NOT AVAILABLE IN CONTEXT

        ANSWER ONLY BASED ON THE AVAIABLE CONTEXT FROM DATABASE ONLY

        CONTEXT:
        ${JSON.stringify(relevantDocs)}

        OUTPUT FORMAT:
        RETURN ANS FROM CONTEXT
        DON'T WRITE PAGE NUMBER LIKE THIS ->  {This information can be found on **page 1**.}
        DON'T RETURN IN MARKDOWN FORMAT 

    `


    const response = await client.chat.completions.create({
            // stateless model have no memory [ zero shot]
            model: "gemini-2.5-pro",
            messages: [
                {role:"system",content:SYSTEM_PROMPT},
                {role:"user", content: user_query },
                
    
            ],
        });

    return res.status(200).send(response.choices[0].message.content);
    } catch (error) {
        console.error("Error occurred while processing chat:", error);
        return res.status(500).send("Internal Server Error");
    }
}

export {chatWithDatabase};