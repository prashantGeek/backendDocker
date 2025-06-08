import mongoose from "mongoose";

export default async function connectDB() {
  try {
    await mongoose.connect("mongodb://admin:secret@localhost:27017/mongo?authSource=admin", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1); // Exit the process if DB connection fails
  }
}


