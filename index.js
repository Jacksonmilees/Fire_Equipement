import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import adminRoutes from "./routes/adminRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import connectDB from "./config/db.js";
import authenticateAdmin from "./middleware/authMiddleware.js";
import Admin from "./models/AdminModel.js";

dotenv.config();

const app = express();

// Database connection
connectDB();

// Middleware
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Routes
// Admin routes (protected)
app.use("/api/admin", authenticateAdmin, adminRoutes);
app.use("/api/users", authenticateAdmin, userRoutes);
app.use("/api/orders", authenticateAdmin, orderRoutes);

// Public routes
app.use("/api/product", adminRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/pages", adminRoutes);

// Admin seeding logic
(async () => {
  try {
    const email = "info@modera.co.ke";
    const password = "3r14F65gMv";
    const existing = await Admin.findOne({ email });
    if (!existing) {
      const admin = new Admin({ email, password });
      await admin.save();
      console.log("Seeded default admin: info@modera.co.ke");
    }
  } catch (error) {
    console.error("Error seeding admin:", error);
  }
})();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
