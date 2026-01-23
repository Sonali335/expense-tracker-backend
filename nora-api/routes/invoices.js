const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { authenticateToken } = require("../middleware/auth");

// GET /invoices?status=&contact_id=
// Response: Array of invoices
router.get("/", authenticateToken, (req, res) => {
  const { status, contact_id } = req.query;
  let query = "SELECT * FROM invoices WHERE 1=1";
  let params = [];
  if (status) { query += " AND status=?"; params.push(status); }
  if (contact_id) { query += " AND contact_id=?"; params.push(contact_id); }
  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// POST /invoices
// Request: { contact_id, number, date, due_date, currency, items:[{description, quantity, unit_price, taxes}] }
// Response: { id, number, total, status }
router.post("/", authenticateToken, (req, res) => {
  const { contact_id, number, date, due_date, currency, items } = req.body;
  db.run("INSERT INTO invoices (contact_id, number, date, due_date, currency) VALUES (?, ?, ?, ?, ?)",
    [contact_id, number, date, due_date, currency], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      const invoice_id = this.lastID;
      let total = 0;
      const stmt = db.prepare("INSERT INTO invoice_items (invoice_id, description, quantity, unit_price, taxes) VALUES (?, ?, ?, ?, ?)");
      items.forEach(item => {
        stmt.run(invoice_id, item.description, item.quantity, item.unit_price, item.taxes.join(","));
        total += item.quantity * item.unit_price;
      });
      db.run("UPDATE invoices SET total=? WHERE id=?", [total, invoice_id]);
      res.json({ id: invoice_id, number, total, status: "draft" });
    });
});

// PUT /invoices/:id
// Request: { number, items } (optional items update)
// Response: { id, status }
router.put("/:id", authenticateToken, (req, res) => {
  const id = req.params.id;
  const { number } = req.body;
  db.run("UPDATE invoices SET number=? WHERE id=?", [number, id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: parseInt(id), status: "updated" });
  });
});

// DELETE /invoices/:id
router.delete("/:id", authenticateToken, (req, res) => {
  const id = req.params.id;
  db.run("DELETE FROM invoices WHERE id=?", [id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ status: "deleted", id: parseInt(id) });
  });
});

// POST /invoices/:id/void
router.post("/:id/void", authenticateToken, (req, res) => {
  const id = req.params.id;
  db.run("UPDATE invoices SET status='void' WHERE id=?", [id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ status: "voided", id: parseInt(id) });
  });
});

module.exports = router;
