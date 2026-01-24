const express = require("express");
const router = express.Router();
// Replaced SQLite db with DynamoDB docClient and helper functions
const { docClient, TABLES, generateId } = require("../config/db");
const { authenticateToken } = require("../middleware/auth");
const { ScanCommand, GetCommand, PutCommand, UpdateCommand, DeleteCommand } = require("@aws-sdk/lib-dynamodb");

// GET /contacts
// Response: Array of contact objects
// Replaced SQLite SELECT with DynamoDB ScanCommand
router.get("/", authenticateToken, async (req, res) => {
  try {
    const scanCommand = new ScanCommand({
      TableName: TABLES.CONTACTS,
    });
    
    const result = await docClient.send(scanCommand);
    // Sort by id descending (replaced SQLite ORDER BY id DESC)
    const sortedContacts = (result.Items || []).sort((a, b) => parseInt(b.id) - parseInt(a.id));
    res.json(sortedContacts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /contacts
// Request Payload: { full_name, email, company_name, category, language, currency }
// Response Payload: { id, full_name, company_name, category, email, created_at }
// Replaced SQLite INSERT with DynamoDB PutCommand
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { full_name, email, company_name, category, language, currency } = req.body;
    
    if (!full_name || !email) {
      return res.status(400).json({ error: "full_name and email are required" });
    }
    
    const id = generateId();
    const created_at = new Date().toISOString();
    
    // Replaced SQLite INSERT with DynamoDB PutCommand
    const putCommand = new PutCommand({
      TableName: TABLES.CONTACTS,
      Item: {
        id: id,
        full_name: full_name,
        email: email,
        company_name: company_name || null,
        category: category || null,
        language: language || null,
        currency: currency || null,
        created_at: created_at,
      },
    });
    
    await docClient.send(putCommand);
    
    // Replaced SQLite SELECT with DynamoDB GetCommand to return created contact
    const getCommand = new GetCommand({
      TableName: TABLES.CONTACTS,
      Key: { id: id },
    });
    
    const result = await docClient.send(getCommand);
    const contact = result.Item;
    res.json({
      id: contact.id,
      full_name: contact.full_name,
      company_name: contact.company_name,
      category: contact.category,
      email: contact.email,
      created_at: contact.created_at,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /contacts/:id
// Request Payload: { full_name, email, company_name }
// Response Payload: { id, full_name, status }
// Replaced SQLite UPDATE with DynamoDB UpdateCommand
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const { full_name, email, company_name } = req.body;
    const id = req.params.id;
    
    if (!full_name) {
      return res.status(400).json({ error: "full_name is required" });
    }
    
    // Check if contact exists (replaced SQLite check for this.changes === 0)
    const getCommand = new GetCommand({
      TableName: TABLES.CONTACTS,
      Key: { id: id },
    });
    
    const existing = await docClient.send(getCommand);
    if (!existing.Item) {
      return res.status(404).json({ error: "Contact not found" });
    }
    
    // Replaced SQLite UPDATE with DynamoDB UpdateCommand
    const updateCommand = new UpdateCommand({
      TableName: TABLES.CONTACTS,
      Key: { id: id },
      UpdateExpression: "SET full_name = :full_name, email = :email, company_name = :company_name",
      ExpressionAttributeValues: {
        ":full_name": full_name,
        ":email": email || existing.Item.email,
        ":company_name": company_name !== undefined ? company_name : existing.Item.company_name,
      },
    });
    
    await docClient.send(updateCommand);
    res.json({ id: parseInt(id), full_name, status: "success" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /contacts/:id
// Response Payload: { status, id }
// Replaced SQLite DELETE with DynamoDB DeleteCommand
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const id = req.params.id;
    
    // Replaced SQLite DELETE with DynamoDB DeleteCommand
    const deleteCommand = new DeleteCommand({
      TableName: TABLES.CONTACTS,
      Key: { id: id },
    });
    
    await docClient.send(deleteCommand);
    res.json({ status: "deleted", id: parseInt(id) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
