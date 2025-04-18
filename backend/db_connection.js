import { MongoClient } from "mongodb";
import { MONGO_URI } from "./config.js";

// MongoDB connection function
export const connectToMongo = async () => {
  const client = new MongoClient(MONGO_URI);
  await client.connect();
  return client;
};
