const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { authenticateToken } = require("../middleware/auth");

// POST /expenses
// Request: { date, category_id, vendor_name, amount, currency, tax_amount, is_paid, description }
// Response: { id, status }
router.post("/", authenticateToken, (req, res) => {
  const { date, category_id, vendor_name, amount, currency, tax_amount, is_paid, description } = req.body;
  db.run("INSERT INTO expenses (date, category_id, vendor_name, amount, currency, tax_amount, is_paid, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [date, category_id, vendor_name, amount, currency, tax_amount, is_paid ? 1 : 0, description], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, status: "created" });
    });
});

// PUT /expenses/:id
router.put("/:id", authenticateToken, (req, res) => {
  const { amount, description } = req.body;
  const id = req.params.id;
  db.run("UPDATE expenses SET amount=?, description=? WHERE id=?", [amount, description, id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: parseInt(id), status: "updated" });
  });
});

module.exports = router;
