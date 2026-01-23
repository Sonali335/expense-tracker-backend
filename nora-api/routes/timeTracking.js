const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { authenticateToken } = require("../middleware/auth");

// POST /time_worked/timer/start
router.post("/timer/start", authenticateToken, (req, res) => res.json({ status: "timer_started" }));

// POST /time_worked/timer/stop
router.post("/timer/stop", authenticateToken, (req, res) => res.json({ status: "timer_stopped" }));

// POST /time_worked
// Request: { contact_id, date, hours, minutes, description }
// Response: { id, status }
router.post("/", authenticateToken, (req, res) => {
  const { contact_id, date, hours, minutes, description } = req.body;
  db.run("INSERT INTO time_worked (contact_id, date, hours, minutes, description) VALUES (?, ?, ?, ?, ?)",
    [contact_id, date, hours, minutes, description], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, status: "logged" });
    });
});

module.exports = router;
