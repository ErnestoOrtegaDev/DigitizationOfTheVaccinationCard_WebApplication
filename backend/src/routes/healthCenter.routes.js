import { Router } from "express";
import {
  createHealthCenter,
  getActiveHealthCenters,
  getHealthCenterById,
  updateHealthCenter,
  deleteHealthCenter,
} from "../controllers/healthCenter.controller.js";

const router = Router();

router.post("/", createHealthCenter);
router.get("/", getActiveHealthCenters);
router.get("/:id", getHealthCenterById);
router.put("/:id", updateHealthCenter);
router.delete("/:id", deleteHealthCenter);

export default router;
