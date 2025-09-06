import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { QdrantVectorStore } from "@langchain/qdrant";
import { openai } from "@ai-sdk/openai";
import { streamText, convertToModelMessages } from "ai";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Validate messages array
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response("Invalid messages format", { status: 400 });
    }

    // Get the last user message
    const userMessage = messages[messages.length - 1];
    console.log("Full user message object:", JSON.stringify(userMessage, null, 2));

    // Extract user query from different possible formats
    let user_query: string;

    if (userMessage?.content) {
      // Standard format with content property
      user_query = userMessage.content;
    } else if (userMessage?.parts && Array.isArray(userMessage.parts)) {
      // Assistant-ui format with parts array
      const textPart = userMessage.parts.find((part: any) => part.type === 'text');
      user_query = textPart?.text || '';
    } else {
      console.error("Unknown message format:", userMessage);
      return new Response("Invalid message format", { status: 400 });
    }

    // Validate user query
    if (!user_query || typeof user_query !== 'string') {
      console.error("Invalid user query:", user_query);
      return new Response("Invalid user message", { status: 400 });
    }

    console.log("Extracted user query:", user_query);
    console.log("User query type:", typeof user_query);
    console.log("User query length:", user_query.length);

    // Check for required environment variables
    if (!process.env.GEMINI_API_KEY) {
      return new Response("GEMINI_API_KEY is not configured", { status: 500 });
    }

    if (!process.env.QDRANT_URL || !process.env.COLLECTION_NAME) {
      return new Response("Qdrant configuration is missing. Please set QDRANT_URL and COLLECTION_NAME environment variables.", { status: 500 });
    }

    console.log("Starting vector search for query:", user_query);

    const embeddings = new GoogleGenerativeAIEmbeddings({
      apiKey: process.env.GEMINI_API_KEY,
      modelName: "embedding-001",
    });

    const vectorStore = await QdrantVectorStore.fromExistingCollection(
      embeddings, {
        url: process.env.QDRANT_URL,
        collectionName: process.env.COLLECTION_NAME
      },
    );

    const vectorSearch = vectorStore.asRetriever({
      k: 3 // k is the number of documents to return
    });

    const relevantDocs = await vectorSearch.invoke(user_query);
    const context = relevantDocs.map(doc => doc.pageContent).join('\n\n');

    console.log("Vector search completed, found", relevantDocs.length, "documents");

    const SYSTEM_PROMPT = `
    You are a helpful assistant that answers questions based on the provided context.
    Use the following context to answer the user's question:

    Context:
    ${context}

    If the context doesn't contain relevant information to answer the question,
    say "I don't have enough information in the provided context to answer that question."
    `;

    // Create messages array for the AI SDK
    const aiMessages = [
      { role: "system" as const, content: SYSTEM_PROMPT },
      { role: "user" as const, content: user_query }
    ];

    console.log("Sending to OpenAI with context length:", context.length);

    const result = streamText({
      model: openai("gpt-4o"),
      messages: aiMessages,
    });

    return result.toUIMessageStreamResponse();

  } catch (error) {
    console.error("Error occurred while processing chat:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
