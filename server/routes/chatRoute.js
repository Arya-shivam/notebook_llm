import { Router } from "express";
import {chatWithDatabase} from "../controllers/chatController.js";

const router = Router();

router.post("/message", chatWithDatabase);

export default router;
