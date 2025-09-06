import { NextRequest, NextResponse } from 'next/server';
import { websiteIndexing } from '@/lib/services/indexing';

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    
    if (!url) {
      return NextResponse.json({ error: 'No URL provided.' }, { status: 400 });
    }

    console.log(`Loading content from website URL: ${url}...`);
    
    console.log("Indexing website content...");
    await websiteIndexing(url);
    console.log("Indexing done.");

    console.log("Website content indexed successfully.");
    return NextResponse.json({
      message: "Website indexed successfully!",
      collectionName: `${url} content stored in ${process.env.COLLECTION_NAME}`,
    });

  } catch (error) {
    console.error("Error indexing website:", error);
    return NextResponse.json({ error: "Failed to index website." }, { status: 500 });
  }
}
