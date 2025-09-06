import { NextRequest, NextResponse } from 'next/server';
import { indexFile } from '@/lib/services/indexing';
import { uploadToCloudinary } from '@/lib/services/cloudinary';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('document') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file was uploaded.' }, { status: 400 });
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const fileName = file.name;

    console.log("Indexing file...");
    await indexFile(fileBuffer, fileName);
    console.log("Indexing done.");

    console.log('Uploading original file to Cloudinary...');
    const result = await uploadToCloudinary(fileBuffer, {
      folder: 'pdf_sources',
      resource_type: 'raw',
      public_id: fileName,
    });
    console.log('Upload to Cloudinary complete.');

    return NextResponse.json({
      message: 'File indexed and stored successfully!',
      collectionName: `${fileName} stored in ${process.env.COLLECTION_NAME}`,
      cloudinaryUrl: result.secure_url
    });

  } catch (error) {
    console.error("Error processing file:", error);
    return NextResponse.json({ message: "An error occurred on the server." }, { status: 500 });
  }
}
