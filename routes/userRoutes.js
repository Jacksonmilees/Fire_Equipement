import express from "express";
import { registerUser, loginUser, getAllUsers, getUserById, updateUser, deleteUser } from "../controllers/UserController.js";
import authenticateAdmin from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/", authenticateAdmin, getAllUsers);
router.get("/:id", authenticateAdmin, getUserById);
router.put("/:id", authenticateAdmin, updateUser);
router.delete("/:id", authenticateAdmin, deleteUser);

export default router; 