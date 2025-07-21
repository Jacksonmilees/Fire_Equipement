import express from "express";

import upload from "../middleware/upload.js";

import {
  forgotPassword,
  loginAdmin,
  resetPassword,
  signupAdmin,
} from "../controllers/AdminController.js";
import {
  createProduct,
  deleteProduct,
  getCategoryById,
  getProduct,
  getProductById,
  updateProduct,
} from "../controllers/ProductController.js";

import {
  createCategory,
  deleteCategory,
  getCategory,
  updateCategory,
} from "../controllers/CategoryController.js";

const router = express.Router();

router.post("/signup", signupAdmin);
router.post("/login", loginAdmin);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);

// Products
router.post("/products", upload.array("images", 5), createProduct);
router.get("/all-products", getProduct);
router.get("/get-products/:id", getProductById);
router.put("/products/:id", upload.array("images"), updateProduct);
router.delete("/products/:id", deleteProduct);

// Categories
router.get("/all-categories", getCategory);
router.get("/categories/:id", getCategoryById);
router.post("/categories", createCategory);
router.put("/categories/:id", updateCategory);
router.delete("/categories/:id", deleteCategory);

// Pages

// router.get("/stats", getPages);
// router.post("/pages", createPage);
// router.put("pages/:id", updatePage);
// router.delete("/pages/:id", deletePage);

export default router;
