import 'dotenv/config';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
// import { OpenAIEmbeddings } from '@langchain/openai';
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { QdrantVectorStore } from '@langchain/qdrant';
import { PuppeteerWebBaseLoader } from "@langchain/community/document_loaders/web/puppeteer";
import { YoutubeLoader } from "@langchain/community/document_loaders/web/youtube";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

export async function indexFile(fileBuffer, fileName) {

    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'pdf-'));
    const tempFilePath = path.join(tempDir, fileName);
    await fs.writeFile(tempFilePath, fileBuffer);

  try {
    const loader = new PDFLoader(tempFilePath);

  // Page by page load the PDF file
  const docs = await loader.load();

  // Ready the client OpenAI Embedding Model
 const embeddings = new GoogleGenerativeAIEmbeddings({
        apiKey: process.env.GEMINI_API_KEY, // Use your Google API key
        modelName: "embedding-001", // The model for Gemini embeddings
    });

  const docsWithMeta = docs.map(doc => ({
  ...doc,
  metadata: { ...doc.metadata, fileName }
}));

  const vectorStore = await QdrantVectorStore.fromDocuments(docsWithMeta, embeddings, { 
    url: process.env.QDRANT_URL,
    collectionName: process.env.COLLECTION_NAME,
  });

  console.log('Indexing of documents done...');
  } catch (error) {
    console.error('Error indexing documents:', error);
  }
}

export async function websiteIndexing(url){
  const loader = new PuppeteerWebBaseLoader(url, {
            launchOptions: {
                headless: true,
                args: ["--no-sandbox", "--disable-setuid-sandbox"],
                timeout: 60000, // Increase timeout to 60 seconds (60000 ms)
                ignoreDefaultArgs: ["--disable-extensions"], // Run in the background without opening a browser window
            },
            gotoOptions: {
                waitUntil: "domcontentloaded", // Wait until the initial HTML document is loaded and parsed
            },
        });

        const docs = await loader.load(); // This returns an array of Document objects
        console.log("Content loaded successfully.");

        // --- Step 2: Chunk the documents ---
        const textSplitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200,
        });
        const chunks = await textSplitter.splitDocuments(docs);
        console.log(`${chunks.length} chunks created.`);

        // --- Step 3: Embed and Store in Qdrant ---
        const embeddings = new GoogleGenerativeAIEmbeddings({
        apiKey: process.env.GEMINI_API_KEY, // Use your Google API key
        modelName: "embedding-001", // The model for Gemini embeddings
          });
        const collectionName = process.env.COLLECTION_NAME;
        console.log(`Storing in Qdrant collection: ${collectionName}`);
        
    

        const vectorStore = await QdrantVectorStore.fromDocuments(chunks, embeddings, { 
            url: process.env.QDRANT_URL,
            collectionName: process.env.COLLECTION_NAME,
          });

        console.log('Indexing of documents done...');
}

export async function YoutubeIndexing(url){
    const loader = YoutubeLoader.createFromUrl(url, {
    language: "en",
    addVideoInfo: true,
  });

    const docs = await loader.load();
    console.log("Transcript loaded successfully.");
    // --- Step 2: Chunk the documents ---
    const textSplitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200,
        });
    const chunks = await textSplitter.splitDocuments(docs);
    console.log(`${chunks.length} chunks created.`);

    // --- Step 3: Embed and Store in Qdrant ---
    // Create a unique collection name from the video ID
    // --- Step 3: Embed and Store in Qdrant ---
    const embeddings = new GoogleGenerativeAIEmbeddings({
      apiKey: process.env.GEMINI_API_KEY, // Use your Google API key
      modelName: "embedding-001", // The model for Gemini embeddings
    });
    const collectionName = process.env.COLLECTION_NAME;
    console.log(`Storing in Qdrant collection: ${collectionName}`);

     const vectorStore = await QdrantVectorStore.fromDocuments(chunks, embeddings, { 
            url: process.env.QDRANT_URL,
            collectionName: process.env.COLLECTION_NAME,
      });
    console.log('Indexing of Youtube video done...');


}

