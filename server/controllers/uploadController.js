import 'dotenv/config';
import { indexFile , websiteIndexing, YoutubeIndexing } from '../services/indexing.js';
import { uploadToCloudinary } from '../services/Cloudinary.js';



const uploadPdfFile = async (req, res) => {
    // 1. A more robust check for the uploaded file at the beginning.
    if (!req.file) {
        return res.status(400).send("No file was uploaded."); // Use 400 and return.
    }

    try {
        const fileBuffer = req.file.buffer;
        const fileName = req.file.originalname;

        // This line is removed as it's incorrect in ESM and unnecessary with memory storage.
        // const filePath = path.join(__dirname, '../uploads', fileName);

        console.log("Indexing file...");
        await indexFile(fileBuffer, fileName);
        console.log("Indexing done.");

        console.log('Uploading original file to Cloudinary...');
        const result = await uploadToCloudinary(fileBuffer, {
            folder: 'pdf_sources',
            resource_type: 'raw',
            // Use the fileName as the public_id
            public_id: fileName,
        });
        console.log('Upload to Cloudinary complete.');

        res.status(200).json({
            message: 'File indexed and stored successfully!',
            collectionName: `${fileName} stored in ${process.env.COLLECTION_NAME}`, // It's good practice to return the name
            cloudinaryUrl: result.secure_url // Also return the URL from Cloudinary
        });

    } catch (error) {
        console.error("Error processing file:", error);
        res.status(500).json({ message: "An error occurred on the server." });
    }
};

// --- Your other empty functions ---
const uploadWebsite = async (req, res) => {
    const {url} = req.query ;
    if(!url){
        return res.status(400).send("No URL provided.");
    }
     try {
        // --- Step 1: Load content using PuppeteerWebBaseLoader ---
        console.log(`Loading dynamic content from ${url} with Puppeteer...`);
        
        // --- Step 2: Index the content ---
        console.log("Indexing dynamic content...");
        await websiteIndexing(url);
        console.log("Indexing done.");

        // --- Step 3: Return success response ---

        console.log("Dynamic website content indexed successfully.");
        res.status(200).json({
            message: "Dynamic website indexed successfully!",
            collectionName:`${url} content stored in ${process.env.COLLECTION_NAME}`,
        });

    } catch (error) {
        console.error("Error indexing dynamic website:", error);
        res.status(500).json({ error: "Failed to index dynamic website." });
    }
};


const uploadYoutube = async (req, res) => {
    const {url} = req.query ;
    if(!url){
        return res.status(400).send("No URL provided.");
    }
    try {
        // --- Step 1: Load content using YoutubeLoader ---
        console.log(`Loading content from YouTube URL: ${url}...`);
        
        // --- Step 2: Index the content ---
        console.log("Indexing YouTube content...");
        await YoutubeIndexing(url); // You need to implement this function
        console.log("Indexing done.");

        // --- Step 3: Return success response ---

        console.log("YouTube content indexed successfully.");
        res.status(200).json({
            message: "YouTube video indexed successfully!",
            collectionName:`${url} content stored in ${process.env.COLLECTION_NAME}`,
        });

    }
    catch (error) {
        console.error("Error indexing YouTube video:", error);
        res.status(500).json({ error: "Failed to index YouTube video." });
    }

};


const TextIndexing = async (req, res) => {};

export {uploadPdfFile,
        uploadWebsite,
        uploadYoutube,
 };