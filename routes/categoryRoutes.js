import express from 'express';
import { getCategory, createCategory, updateCategory, deleteCategory } from '../controllers/CategoryController.js';

const router = express.Router();

// Get all categories
router.get('/', getCategory);

// Get single category
router.get('/:id', getCategoryById);

// Create new category
router.post('/', createCategory);

// Update category
router.put('/:id', updateCategory);

// Delete category
router.delete('/:id', deleteCategory);

export default router;
