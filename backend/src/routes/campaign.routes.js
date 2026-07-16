import express from "express";
import { createCampaign, getCampaigns } from "../controllers/campaign.controller.js";

const router = express.Router();

router.get("/", getCampaigns);
router.post("/", createCampaign);

export default router;