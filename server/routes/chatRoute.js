import { Router } from "express";
import {chatWithPdf} from "../controllers/chatController.js";

const router = Router();

router.post("/message", chatWithPdf);

export default router;
