import express from "express";
import { sendEnquiry, subscribeToNewsletter } from "../controllers/email.controller.js";

const router = express.Router();

router.post("/subscribe", subscribeToNewsletter)
router.post("/send-enquiry", sendEnquiry)

export default router