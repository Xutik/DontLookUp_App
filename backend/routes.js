import bcrypt from "bcrypt";
import { Router } from "express";
import { connectToMongo } from "./db_connection.js";
import { DB_NAME } from "./config.js";

const router = Router();

// Home route
router.get("/", (req, res) => {
  res.send("Hello friend!");
});

// ================ OBJECT ROUTES ==================

// Get paginated objects with search capability
router.get("/objects/paginate", async (req, res) => {
  let client;
  try {
    client = await connectToMongo();
    const db = client.db(DB_NAME);
    const collisionCollection = db.collection("collision");

    // Get pagination parameters from query string
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";

    // Calculate skip value based on page and limit
    const skip = (page - 1) * limit;

    // Build query object
    let queryObj = {};

    // Add search filter if search parameter is provided
    if (search.trim() !== "") {
      queryObj.name = { $regex: search, $options: "i" }; // Case-insensitive search
    }

    // Get total count for pagination metadata with search filter applied
    const total = await collisionCollection.countDocuments(queryObj);

    // Get paginated data with search filter and sorted by isEditable
    const objects = await collisionCollection
      .find(queryObj)
      .sort({ isEditable: -1 }) // Sort by isEditable, true values first
      .skip(skip)
      .limit(limit)
      .toArray();

    // Calculate total pages
    const totalPages = Math.ceil(total / limit);

    // Return paginated data with metadata
    res.json({
      data: objects,
      metadata: {
        currentPage: page,
        itemsPerPage: limit,
        totalItems: total,
        totalPages: totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        search: search, // Include search term in response
      },
    });
  } catch (error) {
    console.error("Error fetching paginated data:", error);
    res.status(500).json({ error: "Failed to fetch paginated data" });
  } finally {
    if (client) await client.close();
  }
});

// Get all objects
router.get("/objects", async (req, res) => {
  let client;
  try {
    client = await connectToMongo();
    const db = client.db(DB_NAME);
    const collisionCollection = db.collection("collision");
    const all = await collisionCollection.find({}).toArray();
    res.json(all);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  } finally {
    if (client) await client.close();
  }
});

// Search objects by name
router.get("/object/:name", async (req, res) => {
  let client;
  try {
    client = await connectToMongo();
    const db = client.db(DB_NAME);
    const objectsCollection = db.collection("collision");

    let name = req.params.name;
    const matchingObjects = await objectsCollection.find({ name: { $regex: name, $options: "i" } }).toArray();

    res.json(matchingObjects);
  } catch (error) {
    console.error("Error fetching objects by name:", error);
    res.status(500).json({ error: "Failed to fetch objects by name" });
  } finally {
    if (client) await client.close();
  }
});

// Delete object
router.delete("/delete/:name", async (req, res) => {
  let client;
  try {
    client = await connectToMongo();
    const db = client.db(DB_NAME);
    const objectsCollection = db.collection("collision");

    // First check if the object exists and is editable
    const objectToDelete = await objectsCollection.findOne({
      name: req.params.name,
    });

    if (!objectToDelete) {
      return res.status(404).json({ error: "Object not found" });
    }

    if (objectToDelete.isEditable === false) {
      return res.status(403).json({
        error: "Permission denied. This object cannot be deleted.",
      });
    }

    const deleteResult = await objectsCollection.deleteOne({
      name: req.params.name,
    });

    res.json({
      message: "Successfully deleted",
      deletedCount: deleteResult.deletedCount,
    });
  } catch (error) {
    console.error("Error deleting object:", error);
    res.status(500).json({ error: "Failed to delete object" });
  } finally {
    if (client) await client.close();
  }
});

// Update object
router.put("/update/:name", async (req, res) => {
  let client;
  try {
    client = await connectToMongo();
    const db = client.db(DB_NAME);
    const objectsCollection = db.collection("collision");

    const { name } = req.params;
    const { date, distance, relativeVelocity, impact, range, diameter } = req.body;

    // First check if the object exists and is editable
    const objectToUpdate = await objectsCollection.findOne({ name });

    if (!objectToUpdate) {
      return res.status(404).json({
        message: `Object with name '${name}' not found.`,
      });
    }

    if (objectToUpdate.isEditable === false) {
      return res.status(403).json({
        message: "Permission denied. This object cannot be modified.",
      });
    }

    const today = new Date();
    const providedDate = new Date(date);

    if (providedDate <= today) {
      return res.status(400).json({
        message: "Date must be greater than today's date to update properties.",
      });
    }

    const updateResult = await objectsCollection.updateOne(
      { name },
      {
        $set: {
          date,
          distance,
          relativeVelocity,
          impact,
          range,
          diameter,
        },
      }
    );

    res.json({
      message: "Successfully updated",
      modifiedCount: updateResult.modifiedCount,
    });
  } catch (error) {
    console.error("Error updating object:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  } finally {
    if (client) await client.close();
  }
});

// Create object
router.post("/create", async (req, res) => {
  let client;
  try {
    client = await connectToMongo();
    const db = client.db(DB_NAME);
    const objectsCollection = db.collection("collision");

    const { name, date, distance, relativeVelocity, impact, range, diameter } = req.body;

    if (!name || !date || !distance || !relativeVelocity || !impact || !range || !diameter) {
      return res.status(400).json({
        message: "All fields (name, date, distance, relativeVelocity, impact, range, diameter) are required.",
      });
    }

    const today = new Date();
    const providedDate = new Date(date);
    if (providedDate <= today) {
      return res.status(400).json({
        message: "Date must be greater than today's date to create new object.",
      });
    }

    const existingObject = await objectsCollection.findOne({ name });
    if (existingObject) {
      return res.status(409).json({
        message: `Object with name '${name}' already exists. Use PUT to update.`,
      });
    }

    const insertResult = await objectsCollection.insertOne({
      name,
      date,
      distance,
      relativeVelocity,
      impact,
      range,
      diameter,
      isEditable: true,
    });

    res.status(201).json({
      message: "Successfully created",
      insertedId: insertResult.insertedId,
    });
  } catch (error) {
    console.error("Error creating object:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  } finally {
    if (client) await client.close();
  }
});

// ================= AUTH ROUTES ==================

// Login endpoint
router.post("/login", async (req, res) => {
  const { password } = req.body;
  const users = req.app.locals.users;

  // Check password against both hashes
  for (const user of users) {
    const match = await bcrypt.compare(password, user.hash);
    if (match) {
      return res.status(200).json({
        message: "Login successful",
        role: user.role,
        ok: true,
      });
    }
  }

  // If no match
  return res.status(401).json({
    message: "Invalid credentials",
  });
});

export default router;
