import 'dotenv/config';
import { indexFile } from '../services/indexing.js';
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
            collectionName: fileName, // It's good practice to return the name
            cloudinaryUrl: result.secure_url // Also return the URL from Cloudinary
        });

    } catch (error) {
        console.error("Error processing file:", error);
        res.status(500).json({ message: "An error occurred on the server." });
    }
};

// --- Your other empty functions ---
const urlIndexing = async (req, res) => {
    const url = req.body

    


};


const YoutubeIndexing = async (req, res) => {};
const TextIndexing = async (req, res) => {};

export { uploadPdfFile,
        urlIndexing
 };