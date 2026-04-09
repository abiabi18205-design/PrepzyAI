import express from "express";
import { sendContactMessage } from "../controllers/contact_controller.js";

const router = express.Router();

router.post("/", sendContactMessage);

export default router;
