import { NextRequest, NextResponse } from 'next/server';
import { textIndexing } from '@/lib/services/indexing';

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();
    
    if (!text) {
      return NextResponse.json({ error: 'No text provided.' }, { status: 400 });
    }

    console.log("Indexing raw text");
    const result = await textIndexing(text);
    console.log("Indexing done");

    return NextResponse.json({
      message: "Text indexed successfully!",
      collectionName: `Text stored in ${process.env.COLLECTION_NAME}`,
      chunksCreated: result.chunkCount
    });

  } catch (error) {
    console.error("Error indexing text:", error);
    return NextResponse.json({ error: "Failed to index text." }, { status: 500 });
  }
}
