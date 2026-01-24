const express = require("express");
const router = express.Router();
// Replaced SQLite db with DynamoDB docClient and helper functions
const { docClient, TABLES, generateId } = require("../config/db");
const { authenticateToken } = require("../middleware/auth");
const { PutCommand, UpdateCommand } = require("@aws-sdk/lib-dynamodb");

// POST /expenses
// Request: { date, category_id, vendor_name, amount, currency, tax_amount, is_paid, description }
// Response: { id, status }
// Replaced SQLite INSERT with DynamoDB PutCommand
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { date, category_id, vendor_name, amount, currency, tax_amount, is_paid, description } = req.body;
    
    const id = generateId();
    
    // Replaced SQLite INSERT with DynamoDB PutCommand
    const putCommand = new PutCommand({
      TableName: TABLES.EXPENSES,
      Item: {
        id: id,
        date: date,
        category_id: category_id || null,
        vendor_name: vendor_name || null,
        amount: amount || 0,
        currency: currency || null,
        tax_amount: tax_amount || 0,
        is_paid: is_paid ? 1 : 0,
        description: description || null,
      },
    });
    
    await docClient.send(putCommand);
    res.json({ id: id, status: "created" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /expenses/:id
// Replaced SQLite UPDATE with DynamoDB UpdateCommand
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const { amount, description } = req.body;
    const id = req.params.id;
    
    // Replaced SQLite UPDATE with DynamoDB UpdateCommand
    const updateCommand = new UpdateCommand({
      TableName: TABLES.EXPENSES,
      Key: { id: id },
      UpdateExpression: "SET amount = :amount, description = :description",
      ExpressionAttributeValues: {
        ":amount": amount,
        ":description": description,
      },
    });
    
    await docClient.send(updateCommand);
    res.json({ id: parseInt(id), status: "updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
