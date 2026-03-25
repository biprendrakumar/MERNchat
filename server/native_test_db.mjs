import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const uri = process.env.MONGODB_URI;

async function run() {
  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 20000,
  });
  try {
    console.log("Connecting with native driver to:", uri.replace(/:([^@]+)@/, ":****@"));
    await client.connect();
    console.log("Connected successfully with native driver!");
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (err) {
    console.error("Native connection failed!");
    console.error("Error Name:", err.name);
    console.error("Error Message:", err.message);
  } finally {
    await client.close();
    process.exit(0);
  }
}
run();
