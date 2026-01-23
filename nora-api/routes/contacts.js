const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { authenticateToken } = require("../middleware/auth");

// GET /contacts
// Response: Array of contact objects
router.get("/", authenticateToken, (req, res) => {
  db.all("SELECT * FROM contacts ORDER BY id DESC", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// POST /contacts
// Request Payload: { full_name, email, company_name, category, language, currency }
// Response Payload: { id, full_name, company_name, category, email, created_at }
router.post("/", authenticateToken, (req, res) => {
  const { full_name, email, company_name, category, language, currency } = req.body;
  
  if (!full_name || !email) {
    return res.status(400).json({ error: "full_name and email are required" });
  }
  
  db.run(
    "INSERT INTO contacts (full_name, email, company_name, category, language, currency) VALUES (?, ?, ?, ?, ?, ?)",
    [full_name, email, company_name, category, language, currency],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      db.get("SELECT id, full_name, company_name, category, email, created_at FROM contacts WHERE id=?", [this.lastID], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(row);
      });
    }
  );
});

// PUT /contacts/:id
// Request Payload: { full_name, email, company_name }
// Response Payload: { id, full_name, status }
router.put("/:id", authenticateToken, (req, res) => {
  const { full_name, email, company_name } = req.body;
  const id = req.params.id;
  
  if (!full_name) {
    return res.status(400).json({ error: "full_name is required" });
  }
  
  db.run(
    "UPDATE contacts SET full_name=?, email=?, company_name=? WHERE id=?",
    [full_name, email, company_name, id],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) {
        return res.status(404).json({ error: "Contact not found" });
      }
      res.json({ id: parseInt(id), full_name, status: "success" });
    }
  );
});

// DELETE /contacts/:id
// Response Payload: { status, id }
router.delete("/:id", authenticateToken, (req, res) => {
  const id = req.params.id;
  db.run("DELETE FROM contacts WHERE id=?", [id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ status: "deleted", id: parseInt(id) });
  });
});

module.exports = router;
