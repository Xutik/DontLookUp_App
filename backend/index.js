import express from "express";
import cors from "cors";
import { initAuth } from "./auth_utils.js";
import routes from "./routes.js";

const app = express();

// middleware 
// CORS configuration to allow only localhost:3000
const corsOptions = {
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());

const initializeApp = async () => {
  // Initialize authentication
  const users = await initAuth();
  app.locals.users = users;

  app.use(routes);

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Express server running on port ${PORT}`);
  });
};

initializeApp().catch(error => {
  console.error("Failed to initialize the application:", error);
  process.exit(1);
});

export default app;
