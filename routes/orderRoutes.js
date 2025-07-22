import express from "express";
import { createOrder, getAllOrders, getOrderById, updateOrderStatus, deleteOrder } from "../controllers/OrderController.js";
import authenticateAdmin from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", createOrder); // customer checkout
router.get("/", authenticateAdmin, getAllOrders);
router.get("/:id", authenticateAdmin, getOrderById);
router.put("/:id/status", authenticateAdmin, updateOrderStatus);
router.delete("/:id", authenticateAdmin, deleteOrder);

export default router; 