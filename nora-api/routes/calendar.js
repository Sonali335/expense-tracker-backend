const express = require("express");
const router = express.Router();
// Replaced SQLite db with DynamoDB docClient and helper functions
const { docClient, TABLES } = require("../config/db");
const { authenticateToken } = require("../middleware/auth");
const { ScanCommand } = require("@aws-sdk/lib-dynamodb");

// GET /calendar/events?start_date=&end_date=
// Response: { events: [...] }
// Replaced SQLite SELECT with DynamoDB ScanCommand and FilterExpression
router.get("/events", authenticateToken, async (req, res) => {
  try {
    const { start_date, end_date } = req.query;
    const events = [];
    
    // Replaced SQLite SELECT with DynamoDB ScanCommand for invoices
    const invoiceScanCommand = new ScanCommand({
      TableName: TABLES.INVOICES,
      FilterExpression: "#date BETWEEN :start_date AND :end_date",
      ExpressionAttributeNames: {
        "#date": "date",
      },
      ExpressionAttributeValues: {
        ":start_date": start_date,
        ":end_date": end_date,
      },
    });
    
    const invoiceResult = await docClient.send(invoiceScanCommand);
    if (invoiceResult.Items) {
      invoiceResult.Items.forEach(inv => {
        events.push({
          date: inv.date,
          type: "invoice",
          title: `Invoice #${inv.number}`,
          amount: inv.total || 0,
        });
      });
    }
    
    // Replaced SQLite SELECT with DynamoDB ScanCommand for expenses
    const expenseScanCommand = new ScanCommand({
      TableName: TABLES.EXPENSES,
      FilterExpression: "#date BETWEEN :start_date AND :end_date",
      ExpressionAttributeNames: {
        "#date": "date",
      },
      ExpressionAttributeValues: {
        ":start_date": start_date,
        ":end_date": end_date,
      },
    });
    
    const expenseResult = await docClient.send(expenseScanCommand);
    if (expenseResult.Items) {
      expenseResult.Items.forEach(exp => {
        events.push({
          date: exp.date,
          type: "expense",
          title: exp.vendor_name,
          amount: -(exp.amount || 0),
        });
      });
    }
    
    res.json({ events });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /calendar/dashboard
// Response: { net_profit, gross_profit, cash_in_bank }
// Replaced SQLite SELECT with DynamoDB ScanCommand
router.get("/dashboard", authenticateToken, async (req, res) => {
  try {
    let dashboard = { net_profit: 0, gross_profit: 0, cash_in_bank: 0 };
    
    // Replaced SQLite SELECT with DynamoDB ScanCommand for invoices
    const invoiceScanCommand = new ScanCommand({
      TableName: TABLES.INVOICES,
    });
    
    const invoiceResult = await docClient.send(invoiceScanCommand);
    if (invoiceResult.Items) {
      invoiceResult.Items.forEach(inv => {
        dashboard.gross_profit += inv.total || 0;
      });
    }
    
    // Replaced SQLite SELECT with DynamoDB ScanCommand for expenses
    const expenseScanCommand = new ScanCommand({
      TableName: TABLES.EXPENSES,
    });
    
    const expenseResult = await docClient.send(expenseScanCommand);
    if (expenseResult.Items) {
      expenseResult.Items.forEach(exp => {
        dashboard.net_profit -= exp.amount || 0;
      });
    }
    
    dashboard.cash_in_bank = dashboard.gross_profit + dashboard.net_profit;
    res.json(dashboard);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
