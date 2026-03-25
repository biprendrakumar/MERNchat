import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const test = async () => {
  try {
    console.log("Connecting to:", process.env.MONGODB_URI.replace(/:([^@]+)@/, ":****@"));
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log("Connected successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Connection failed!");
    console.error("Error Name:", err.name);
    console.error("Error Message:", err.message);
    if (err.reason) console.error("Reason:", err.reason);
    process.exit(1);
  }
};

test();
