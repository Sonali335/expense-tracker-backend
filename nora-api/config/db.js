const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(":memory:"); // Replace with DynamoDB later

db.serialize(() => {
  // Users
  db.run(`CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  )`);

  // Contacts
  db.run(`CREATE TABLE contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT,
    email TEXT,
    company_name TEXT,
    category TEXT,
    language TEXT,
    currency TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`);

  // Invoices
  db.run(`CREATE TABLE invoices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    contact_id INTEGER,
    number TEXT,
    date TEXT,
    due_date TEXT,
    currency TEXT,
    total REAL DEFAULT 0,
    status TEXT DEFAULT 'draft'
  )`);

  db.run(`CREATE TABLE invoice_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    invoice_id INTEGER,
    description TEXT,
    quantity INTEGER,
    unit_price REAL,
    taxes TEXT
  )`);

  // Expenses
  db.run(`CREATE TABLE expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT,
    category_id INTEGER,
    vendor_name TEXT,
    amount REAL,
    currency TEXT,
    tax_amount REAL,
    is_paid INTEGER,
    description TEXT
  )`);

  // Time Tracking
  db.run(`CREATE TABLE time_worked (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    contact_id INTEGER,
    date TEXT,
    hours INTEGER,
    minutes INTEGER,
    description TEXT
  )`);
});

module.exports = db;
