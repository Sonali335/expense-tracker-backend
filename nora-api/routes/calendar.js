const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { authenticateToken } = require("../middleware/auth");

// GET /calendar/events?start_date=&end_date=
// Response: { events: [...] }
router.get("/events", authenticateToken, (req, res) => {
  const { start_date, end_date } = req.query;
  const events = [];
  db.all("SELECT * FROM invoices WHERE date BETWEEN ? AND ?", [start_date, end_date], (err, invoices) => {
    if (invoices) invoices.forEach(inv => events.push({ date: inv.date, type: "invoice", title: `Invoice #${inv.number}`, amount: inv.total }));
    db.all("SELECT * FROM expenses WHERE date BETWEEN ? AND ?", [start_date, end_date], (err, expenses) => {
      if (expenses) expenses.forEach(exp => events.push({ date: exp.date, type: "expense", title: exp.vendor_name, amount: -exp.amount }));
      res.json({ events });
    });
  });
});

// GET /calendar/dashboard
// Response: { net_profit, gross_profit, cash_in_bank }
router.get("/dashboard", authenticateToken, (req, res) => {
  let dashboard = { net_profit: 0, gross_profit: 0, cash_in_bank: 0 };
  db.all("SELECT * FROM invoices", [], (err, invoices) => {
    invoices.forEach(inv => dashboard.gross_profit += inv.total);
    db.all("SELECT * FROM expenses", [], (err, expenses) => {
      expenses.forEach(exp => dashboard.net_profit += -exp.amount);
      dashboard.cash_in_bank = dashboard.gross_profit + dashboard.net_profit;
      res.json(dashboard);
    });
  });
});

module.exports = router;
