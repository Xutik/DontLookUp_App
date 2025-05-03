import { MongoClient } from "mongodb";
import { MONGO_URI } from "./config.js";

const URI = process.env.MONGO_URI || MONGO_URI;

// MongoDB connection function
export const connectToMongo = async () => {
  const client = new MongoClient(URI);
  await client.connect();
  return client;
};
