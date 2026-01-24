const express = require("express");
const router = express.Router();
// Replaced SQLite db with DynamoDB docClient and helper functions
const { docClient, TABLES, generateId } = require("../config/db");
const { authenticateToken } = require("../middleware/auth");
const { PutCommand } = require("@aws-sdk/lib-dynamodb");

// POST /time_worked/timer/start
router.post("/timer/start", authenticateToken, (req, res) => res.json({ status: "timer_started" }));

// POST /time_worked/timer/stop
router.post("/timer/stop", authenticateToken, (req, res) => res.json({ status: "timer_stopped" }));

// POST /time_worked
// Request: { contact_id, date, hours, minutes, description }
// Response: { id, status }
// Replaced SQLite INSERT with DynamoDB PutCommand
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { contact_id, date, hours, minutes, description } = req.body;
    
    const id = generateId();
    
    // Replaced SQLite INSERT with DynamoDB PutCommand
    const putCommand = new PutCommand({
      TableName: TABLES.TIME_WORKED,
      Item: {
        id: id,
        contact_id: contact_id,
        date: date,
        hours: hours || 0,
        minutes: minutes || 0,
        description: description || null,
      },
    });
    
    await docClient.send(putCommand);
    res.json({ id: id, status: "logged" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
