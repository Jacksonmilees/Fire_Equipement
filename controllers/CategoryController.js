import Category from "../models/CategoryModel.js";

const getCategory = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name, slug } = req.body;
    
    // Validate required fields
    if (!name) {
      return res.status(400).json({ message: 'Category name is required' });
    }
    if (!slug) {
      return res.status(400).json({ message: 'Category slug is required' });
    }
    
    // Convert slug to number
    const slugNum = Number(slug);
    
    // Validate slug is a valid number
    if (isNaN(slugNum)) {
      return res.status(400).json({ message: 'Slug must be a valid number' });
    }
    
    // Check if category with this name already exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ message: 'Category with this name already exists' });
    }
    
    // Check if category with this slug already exists
    const existingSlug = await Category.findOne({ slug: slugNum });
    if (existingSlug) {
      return res.status(400).json({ message: 'Category with this slug already exists' });
    }
    
    const category = new Category({
      name,
      slug: slugNum,
      subcategories: []
    });
    
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    console.error('Category creation error:', err);
    res.status(400).json({ 
      message: 'Failed to create category', 
      error: err.message 
    });
  }
};

const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(category);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export { getCategory, getCategoryById, createCategory, updateCategory, deleteCategory, getAllCategories };
