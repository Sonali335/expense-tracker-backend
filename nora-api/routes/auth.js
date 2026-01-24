const express = require("express");
const router = express.Router();
const { getByUsername, createUser } = require("../config/users-store");
const jwt = require("jsonwebtoken");
const { hashPassword, comparePassword } = require("../utils/hash");
const { JWT_SECRET } = require("../middleware/auth");

router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters long" });
    }

    const existingUser = await getByUsername(username);
    if (existingUser) {
      return res.status(409).json({ error: "Username already exists" });
    }

    const hashed = await hashPassword(password);
    const id = await createUser(username, hashed);
    res.status(201).json({ status: "user_created", id, username });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error.message || "An unexpected error occurred",
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }

    if (!JWT_SECRET) {
      return res.status(500).json({ error: "JWT_SECRET is not configured" });
    }

    const user = await getByUsername(username);
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    try {
      const match = await comparePassword(password, user.password);
      if (!match) {
        return res.status(400).json({ error: "Invalid credentials" });
      }

      const token = jwt.sign(
        { id: user.id, username: user.username },
        JWT_SECRET,
        { expiresIn: "1h" }
      );
      res.json({ token, username: user.username, id: user.id });
    } catch (error) {
      console.error("Login password comparison error:", error);
      res.status(500).json({
        error: "Internal server error",
        message: error.message || "An unexpected error occurred",
      });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error.message || "An unexpected error occurred",
    });
  }
});

module.exports = router;
