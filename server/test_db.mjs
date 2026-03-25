import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async () => {
  try {
    console.log("Testing connection to Atlas...");
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`SUCCESS: MongoDB Connected: ${conn.connection.host}`);
    process.exit(0);
  } catch (error) {
    console.error("FAILURE: MongoDB connection error:", error.message);
    process.exit(1);
  }
};

connectDB();
