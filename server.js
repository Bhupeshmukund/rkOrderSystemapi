// server.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// ====================================
// 🧠 MongoDB Connection
// ====================================

const uri = "mongodb+srv://bhupeshv668_db_user:LMjQjVphTcm599A0@rkcluster0.0mq3pfb.mongodb.net/rkOrderSystem?retryWrites=true&w=majority&appName=Cluster0";

console.log("🔍 Attempting MongoDB connection...");

mongoose.connect(uri, {
  dbName: "rkOrderSystem",
  serverSelectionTimeoutMS: 15000, // wait up to 15s before timing out
})
  .then(() => {
    console.log("✅ MongoDB connected successfully!");
    startServer();
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });

// Debug listeners
mongoose.connection.on("disconnected", () => console.warn("⚠️ MongoDB disconnected"));
mongoose.connection.on("error", (err) => console.error("💥 MongoDB error:", err));

// ====================================
// 📦 Mongoose Schema
// ====================================
const sizeSchema = new mongoose.Schema(
  { name: { type: String, required: true, unique: true } },
  { timestamps: true }
);

const Size = mongoose.model("Size", sizeSchema); // capitalized model name

// ====================================
// 🚀 API Routes
// ====================================

// ➕ Create Size
app.post("/api/sizes", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Size name is required" });

    const exists = await Size.findOne({ name });
    if (exists) return res.status(409).json({ message: "Size already exists" });

    const newSize = new Size({ name });
    await newSize.save();
    res.status(201).json({ message: "Size added successfully", size: newSize });
  } catch (error) {
    console.error("❌ Error in POST /api/sizes:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// 📋 Get All Sizes
app.get("/api/sizes", async (req, res) => {
  try {
    const sizes = await Size.find().sort({ createdAt: -1 });
    res.json(sizes);
  } catch (error) {
    console.error("❌ Error in GET /api/sizes:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✏️ Update Size
app.put("/api/sizes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Size name is required" });

    const updated = await Size.findByIdAndUpdate(id, { name }, { new: true });
    if (!updated) return res.status(404).json({ message: "Size not found" });

    res.json({ message: "Size updated successfully", size: updated });
  } catch (error) {
    console.error("❌ Error in PUT /api/sizes/:id:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// 🗑️ Delete Size
app.delete("/api/sizes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Size.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Size not found" });

    res.json({ message: "Size deleted successfully" });
  } catch (error) {
    console.error("❌ Error in DELETE /api/sizes/:id:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ====================================
// ⚡ Start Server (only after DB connects)
// ====================================
function startServer() {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}
