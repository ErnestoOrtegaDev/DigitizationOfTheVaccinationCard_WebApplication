import express from "express";
import {
  createPatient,
  getPatientsByCreator,
  getPatientById,
  updatePatient,
  deletePatient,
} from "../controllers/patient.controller.js";

const router = express.Router();

router.post("/", createPatient);
router.get("/user/:userId", getPatientsByCreator);
router.get("/:id", getPatientById);
router.put("/:id", updatePatient);
router.delete("/:id", deletePatient);

export default router;
