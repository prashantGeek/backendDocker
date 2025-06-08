import mongoose from "mongoose";

export default async function connectDB() {
  try {
    await mongoose.connect("mongodb+srv://prashant:12345@cluster0.r1hqhjv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1); // Exit the process if DB connection fails
  }
}


