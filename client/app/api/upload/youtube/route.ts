import { NextRequest, NextResponse } from 'next/server';
import { YoutubeIndexing } from '@/lib/services/indexing';

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    
    if (!url) {
      return NextResponse.json({ error: 'No URL provided.' }, { status: 400 });
    }

    console.log(`Loading content from YouTube URL: ${url}...`);
    
    console.log("Indexing YouTube content...");
    await YoutubeIndexing(url);
    console.log("Indexing done.");

    console.log("YouTube content indexed successfully.");
    return NextResponse.json({
      message: "YouTube video indexed successfully!",
      collectionName: `${url} content stored in ${process.env.COLLECTION_NAME}`,
    });

  } catch (error) {
    console.error("Error indexing YouTube video:", error);
    return NextResponse.json({ error: "Failed to index YouTube video." }, { status: 500 });
  }
}
