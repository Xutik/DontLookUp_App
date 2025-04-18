// authentication utilities
import bcrypt from "bcrypt";

// Auth setup
const saltRounds = 10;
const scientistPasswordPlain = "scientist";
const observerPasswordPlain = "observer";

// Initialize auth data
export const initAuth = async () => {
  // Hash passwords asynchronously
  const scientistHashedPassword = await bcrypt.hash(scientistPasswordPlain, saltRounds);
  const observerHashedPassword = await bcrypt.hash(observerPasswordPlain, saltRounds);

  // Store in a simple array for demonstration; use a DB for real apps
  return [
    { role: "scientist", hash: scientistHashedPassword },
    { role: "observer", hash: observerHashedPassword },
  ];
};
