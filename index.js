import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import adminRoutes from "./routes/adminRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import Admin from "./models/AdminModel.js";
import connectDB from "./config/db.js";

dotenv.config();

const app = express();

// Database connection
connectDB();

// Middleware
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Routes
app.use("/api/admin", adminRoutes);
app.use("/api/product", adminRoutes);
app.use("/api/category", adminRoutes);
app.use("/api/pages", adminRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);

// Admin seeding logic
(async () => {
  const email = "info@modera.co.ke";
  const password = "3r14F65gMv";
  const existing = await Admin.findOne({ email });
  if (!existing) {
    const admin = new Admin({ email, password });
    await admin.save();
    console.log("Seeded default admin: info@modera.co.ke");
  }
})();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
