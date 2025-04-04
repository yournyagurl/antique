import express from "express";
import { sendEnquiry, subscribeToNewsletter } from "../controllers/email.controller";

const router = express.Router();

router.post("/subscribe", subscribeToNewsletter)
router.post("/send-enquiry", sendEnquiry)