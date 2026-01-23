const express = require("express");
const router = express.Router();
const db = require("../config/db");
const jwt = require("jsonwebtoken");
const { hashPassword, comparePassword } = require("../utils/hash");
const { JWT_SECRET } = require("../middleware/auth");

// Register
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Input validation
    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters long" });
    }
    
    const hashed = await hashPassword(password);
    db.run("INSERT INTO users (username, password) VALUES (?, ?)", [username, hashed], function(err) {
      if (err) {
        // Check for unique constraint violation
        if (err.message.includes("UNIQUE constraint failed")) {
          return res.status(409).json({ error: "Username already exists" });
        }
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ status: "user_created", id: this.lastID });
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Input validation
    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }
    
    if (!JWT_SECRET) {
      return res.status(500).json({ error: "JWT_SECRET is not configured" });
    }
    
    db.get("SELECT * FROM users WHERE username=?", [username], async (err, user) => {
      if (err) {
        return res.status(500).json({ error: "Database error" });
      }
      
      if (!user) {
        return res.status(400).json({ error: "Invalid credentials" });
      }
      
      try {
        const match = await comparePassword(password, user.password);
        if (!match) {
          return res.status(400).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: "1h" });
        res.json({ 
          token,
          username: user.username,
          password: password
        });
      } catch (error) {
        res.status(500).json({ error: "Internal server error" });
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
