const express = require("express");
const router = express.Router();
// Replaced SQLite db with DynamoDB docClient and helper functions
const { docClient, TABLES, generateId } = require("../config/db");
const { authenticateToken } = require("../middleware/auth");
const { ScanCommand, GetCommand, PutCommand, UpdateCommand, DeleteCommand } = require("@aws-sdk/lib-dynamodb");

// GET /invoices?status=&contact_id=
// Response: Array of invoices
// Replaced SQLite SELECT with DynamoDB ScanCommand with FilterExpression
router.get("/", authenticateToken, async (req, res) => {
  try {
    const { status, contact_id } = req.query;
    
    let filterExpression = null;
    let expressionAttributeValues = {};
    
    // Build filter expression (replaced SQLite WHERE clause)
    if (status && contact_id) {
      filterExpression = "status = :status AND contact_id = :contact_id";
      expressionAttributeValues[":status"] = status;
      expressionAttributeValues[":contact_id"] = contact_id;
    } else if (status) {
      filterExpression = "status = :status";
      expressionAttributeValues[":status"] = status;
    } else if (contact_id) {
      filterExpression = "contact_id = :contact_id";
      expressionAttributeValues[":contact_id"] = contact_id;
    }
    
    const scanCommand = new ScanCommand({
      TableName: TABLES.INVOICES,
      ...(filterExpression && {
        FilterExpression: filterExpression,
        ExpressionAttributeValues: expressionAttributeValues,
      }),
    });
    
    const result = await docClient.send(scanCommand);
    res.json(result.Items || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /invoices
// Request: { contact_id, number, date, due_date, currency, items:[{description, quantity, unit_price, taxes}] }
// Response: { id, number, total, status }
// Replaced SQLite INSERT with DynamoDB PutCommand
// Note: In DynamoDB, invoice_items are stored as an array within the invoice document (NoSQL pattern)
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { contact_id, number, date, due_date, currency, items } = req.body;
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "items array is required" });
    }
    
    const invoice_id = generateId();
    let total = 0;
    
    // Calculate total from items (same logic as SQLite)
    items.forEach(item => {
      total += item.quantity * item.unit_price;
    });
    
    // Replaced SQLite INSERT for invoices and invoice_items
    // In DynamoDB, we store items as an array within the invoice document
    const putCommand = new PutCommand({
      TableName: TABLES.INVOICES,
      Item: {
        id: invoice_id,
        contact_id: contact_id,
        number: number,
        date: date,
        due_date: due_date,
        currency: currency,
        total: total,
        status: "draft",
        items: items.map(item => ({
          description: item.description,
          quantity: item.quantity,
          unit_price: item.unit_price,
          taxes: Array.isArray(item.taxes) ? item.taxes : [],
        })),
      },
    });
    
    await docClient.send(putCommand);
    res.json({ id: invoice_id, number, total, status: "draft" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /invoices/:id
// Request: { number, items } (optional items update)
// Response: { id, status }
// Replaced SQLite UPDATE with DynamoDB UpdateCommand
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const id = req.params.id;
    const { number } = req.body;
    
    // Replaced SQLite UPDATE with DynamoDB UpdateCommand
    const updateCommand = new UpdateCommand({
      TableName: TABLES.INVOICES,
      Key: { id: id },
      UpdateExpression: "SET #num = :number",
      ExpressionAttributeNames: {
        "#num": "number",
      },
      ExpressionAttributeValues: {
        ":number": number,
      },
    });
    
    await docClient.send(updateCommand);
    res.json({ id: parseInt(id), status: "updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /invoices/:id
// Replaced SQLite DELETE with DynamoDB DeleteCommand
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const id = req.params.id;
    
    // Replaced SQLite DELETE with DynamoDB DeleteCommand
    // Note: In DynamoDB, items are stored within the invoice, so deleting the invoice removes items automatically
    const deleteCommand = new DeleteCommand({
      TableName: TABLES.INVOICES,
      Key: { id: id },
    });
    
    await docClient.send(deleteCommand);
    res.json({ status: "deleted", id: parseInt(id) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /invoices/:id/void
// Replaced SQLite UPDATE with DynamoDB UpdateCommand
router.post("/:id/void", authenticateToken, async (req, res) => {
  try {
    const id = req.params.id;
    
    // Replaced SQLite UPDATE with DynamoDB UpdateCommand
    const updateCommand = new UpdateCommand({
      TableName: TABLES.INVOICES,
      Key: { id: id },
      UpdateExpression: "SET #status = :status",
      ExpressionAttributeNames: {
        "#status": "status",
      },
      ExpressionAttributeValues: {
        ":status": "void",
      },
    });
    
    await docClient.send(updateCommand);
    res.json({ status: "voided", id: parseInt(id) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
