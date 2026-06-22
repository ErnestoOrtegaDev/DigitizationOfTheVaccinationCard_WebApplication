import express from "express";
import {
  createPatient,
  getPatientsByCreator,
  getPatientById,
  updatePatient,
  deletePatient,
  getAllPatientsByCreator,
} from "../controllers/patient.controller.js";
const router = express.Router();

router.post("/", createPatient);
router.get("/user/:userId", getPatientsByCreator);
router.get("/:id", getPatientById);
router.put("/:id", updatePatient);
router.patch("/:id", deletePatient);
router.get("/user/:userId/all", getAllPatientsByCreator);

export default router;
