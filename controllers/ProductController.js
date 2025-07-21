import mongoose from "mongoose";
import Category from "../models/CategoryModel.js";
import Product from "../models/ProductModel.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const subcategories = await Product.distinct("subcategory", {
      category: id,
    });

    const products = await Product.find({ category: id }).lean();

    res.json({
      ...category.toObject(),
      subcategories,
      products,
    });
  } catch (err) {
    console.error(`[ERROR] Category fetch failed: ${err.message}`, {
      error: err,
      categoryId: req.params.id,
    });
    res.status(500).json({ message: "Server error" });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const product = await Product.findById(id).populate("category").lean();

    if (!product) {
      console.log(`Product not found: ${id}`);
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    console.error(`[ERROR] Product fetch failed: ${err.message}`, {
      error: err,
      productId: req.params.id,
    });
  }
};

const getProduct = async (req, res) => {
  try {
    const products = await Product.find().populate("category");
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

async function uploadBufferToCloudinary(buffer) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "products" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
}

const createProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      description,
      longDescription,
      stockStatus,
      category,
      specifications,
      certifications,
      subcategory,
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(category)) {
      return res.status(400).json({ message: "Invalid category ID format" });
    }
    const cat = await Category.findById(category);
    if (!cat) {
      return res.status(400).json({ message: "Category not found" });
    }

    // 3. Upload each file buffer to Cloudinary
    const imageUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        // await the upload promise
        const result = await uploadBufferToCloudinary(file.buffer);
        imageUrls.push(result.secure_url);
      }
    }

    const product = new Product({
      name,
      price,
      description,
      longDescription,
      stockStatus,
      category,
      subcategory,
      specifications,
      certifications,
      images: imageUrls,
    });

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error("Product Create Error:", err);
    res.status(400).json({ message: err.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      description,
      longDescription,
      stockStatus,
      category,
      specifications,
      certifications,
      subcategory,
    } = req.body;

    const productId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const imageUrls = [...product.images]; // keep existing images

    // If new files are uploaded, add them
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await uploadBufferToCloudinary(file.buffer);
        imageUrls.push(result.secure_url);
      }
    }

    product.name = name || product.name;
    product.price = price || product.price;
    product.description = description || product.description;
    product.longDescription = longDescription || product.longDescription;
    product.stockStatus = stockStatus || product.stockStatus;
    product.category = category || product.category;
    product.subcategory = subcategory || product.subcategory;
    product.specifications = specifications || product.specifications;
    product.certifications = certifications || product.certifications;
    product.images = imageUrls;

    const updatedProduct = await product.save();

    res.json(updatedProduct);
  } catch (err) {
    console.error("Update Product Error:", err);
    res.status(400).json({ message: err.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export {
  getProductById,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategoryById,
};
