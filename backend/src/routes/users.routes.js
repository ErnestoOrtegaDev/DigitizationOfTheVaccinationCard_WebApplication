import express from "express";
import userController from "../controllers/users.controller.js";

const router = express.Router();

router.post("/", userController.createUserWithDefaultPassword);
router.put("/:id", userController.updateUser);
router.delete("/soft/:id", userController.softDeleteUser);
router.delete("/hard/:id", userController.hardDeleteUser);

export default router;