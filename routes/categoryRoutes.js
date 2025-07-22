import express from 'express';
import { getCategory, getCategoryById, createCategory, updateCategory, deleteCategory } from '../controllers/CategoryController.js';

const router = express.Router();

// Get all categories
router.get('/', getCategory);

// Get single category
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new category
router.post('/', createCategory);

// Update category
router.put('/:id', updateCategory);

// Delete category
router.delete('/:id', deleteCategory);

export default router;
