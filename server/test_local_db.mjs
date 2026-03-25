import mongoose from "mongoose";

const connectDB = async () => {
  try {
    console.log("Testing local MongoDB connection...");
    const conn = await mongoose.connect("mongodb://localhost:27017/chatapp");
    console.log(`SUCCESS: Local MongoDB Connected: ${conn.connection.host}`);
    process.exit(0);
  } catch (error) {
    console.error("FAILURE: Local MongoDB connection error:", error.message);
    process.exit(1);
  }
};

connectDB();
