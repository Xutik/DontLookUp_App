import express from "express";
import cors from "cors";
import { initAuth } from "./auth_utils.js";
import routes from "./routes.js";

// Create Express app
const app = express();

// Apply middleware
// CORS configuration to allow only localhost:3000
const corsOptions = {
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Apply the CORS middleware with the restrictive options
app.use(cors(corsOptions));
app.use(express.json());

// Initialize authentication
const initializeApp = async () => {
  // Set up authentication
  const users = await initAuth();
  app.locals.users = users;

  // Register all routes
  app.use(routes);

  // Start the server
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Express server running on port ${PORT}`);
  });
};

// Start the application
initializeApp().catch(error => {
  console.error("Failed to initialize the application:", error);
  process.exit(1);
});

export default app;
