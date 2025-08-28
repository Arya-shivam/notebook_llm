import { Router } from "express";
import multer from "multer";
import { uploadPdfFile , uploadWebsite, uploadYoutube} from "../controllers/uploadController.js"

const router = Router();

// Configure multer to use memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


// Route to handle file upload, indexing, and storage
router.post('/file', upload.single('document'), uploadPdfFile);
router.post('/website',uploadWebsite);
router.post('/ytube',uploadYoutube)
// router.post('/text',TextIndexing)


export default router;
