import express from "express";
import {
    createUserWithDefaultPassword,
    updateUser,
    softDeleteUser,
    getActiveUsers
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/active", getActiveUsers);

router.post("/", createUserWithDefaultPassword);
router.put("/:id", updateUser);
router.delete("/delete/:id", softDeleteUser);

export default router;