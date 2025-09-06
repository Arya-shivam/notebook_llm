import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { QdrantVectorStore } from '@langchain/qdrant';
import { PuppeteerWebBaseLoader } from "@langchain/community/document_loaders/web/puppeteer";
import { YoutubeLoader } from "@langchain/community/document_loaders/web/youtube";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { Document } from '@langchain/core/documents';

export async function indexFile(fileBuffer: Buffer, fileName: string) {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'pdf-'));
  const tempFilePath = path.join(tempDir, fileName);
  await fs.writeFile(tempFilePath, fileBuffer);

  try {
    const loader = new PDFLoader(tempFilePath);
    const docs = await loader.load();

    const embeddings = new GoogleGenerativeAIEmbeddings({
      apiKey: process.env.GEMINI_API_KEY!,
      modelName: "embedding-001",
    });

    const docsWithMeta = docs.map(doc => ({
      ...doc,
      metadata: { ...doc.metadata, fileName }
    }));

    const vectorStore = await QdrantVectorStore.fromDocuments(docsWithMeta, embeddings, { 
      url: process.env.QDRANT_URL!,
      collectionName: process.env.COLLECTION_NAME!,
    });

    console.log('Indexing of documents done...');
    
    // Clean up temp file
    await fs.unlink(tempFilePath);
    await fs.rmdir(tempDir);
  } catch (error) {
    console.error('Error indexing documents:', error);
    throw error;
  }
}

export async function websiteIndexing(url: string) {
  const loader = new PuppeteerWebBaseLoader(url, {
    launchOptions: {
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      timeout: 60000,
      ignoreDefaultArgs: ["--disable-extensions"],
    },
    gotoOptions: {
      waitUntil: "domcontentloaded",
    },
  });

  const docs = await loader.load();
  console.log("Content loaded successfully.");

  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });
  const chunks = await textSplitter.splitDocuments(docs);
  console.log(`${chunks.length} chunks created.`);

  const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GEMINI_API_KEY!,
    modelName: "embedding-001",
  });
  
  const collectionName = process.env.COLLECTION_NAME!;
  console.log(`Storing in Qdrant collection: ${collectionName}`);

  const vectorStore = await QdrantVectorStore.fromDocuments(chunks, embeddings, { 
    url: process.env.QDRANT_URL!,
    collectionName: process.env.COLLECTION_NAME!,
  });

  console.log('Indexing of documents done...');
}

export async function YoutubeIndexing(url: string) {
  const loader = YoutubeLoader.createFromUrl(url, {
    language: "en",
    addVideoInfo: true,
  });

  const docs = await loader.load();
  console.log("YouTube content loaded successfully.");

  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });
  const chunks = await textSplitter.splitDocuments(docs);
  console.log(`${chunks.length} chunks created.`);

  const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GEMINI_API_KEY!,
    modelName: "embedding-001",
  });

  const collectionName = process.env.COLLECTION_NAME!;
  console.log(`Storing in Qdrant collection: ${collectionName}`);

  const vectorStore = await QdrantVectorStore.fromDocuments(chunks, embeddings, {
    url: process.env.QDRANT_URL!,
    collectionName: process.env.COLLECTION_NAME!,
  });

  console.log('Indexing of Youtube video done...');
}

export async function textIndexing(text: string) {
  try {
    const doc = new Document({
      pageContent: text,
      metadata: {
        source: 'text-input',
        type: 'text'
      }
    });

    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    const chunks = await textSplitter.splitDocuments([doc]);
    console.log(`${chunks.length} chunks created.`);

    console.log(`Storing in Qdrant collection: ${process.env.COLLECTION_NAME}`);

    const embeddings = new GoogleGenerativeAIEmbeddings({
      apiKey: process.env.GEMINI_API_KEY!,
      modelName: "embedding-001",
    });

    const vectorStore = await QdrantVectorStore.fromDocuments(chunks, embeddings, {
      url: process.env.QDRANT_URL!,
      collectionName: process.env.COLLECTION_NAME!,
    });

    console.log("Raw text indexed successfully.");
    return {
      success: true,
      chunkCount: chunks.length
    };

  } catch (error) {
    console.error("Error occurred while indexing text:", error);
    throw error;
  }
}
