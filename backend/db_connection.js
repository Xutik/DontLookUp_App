// database connection middleware
import { MongoClient } from "mongodb";
import { MONGO_URI, DB_NAME } from "./config.js";

// MongoDB connection function
export const connectToMongo = async () => {
  const client = new MongoClient(MONGO_URI);
  await client.connect();
  return client;
};

// Middleware to attach DB client to request
export const withDb = async (req, res, next) => {
  let client;
  try {
    client = await connectToMongo();
    req.dbClient = client;
    req.db = client.db(DB_NAME);
    next();
  } catch (error) {
    console.error("Database connection error:", error);
    res.status(500).json({ error: "Database connection failed" });
    if (client) await client.close();
  }
};
