import 'dotenv/config';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
// import { OpenAIEmbeddings } from '@langchain/openai';
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { QdrantVectorStore } from '@langchain/qdrant';

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

