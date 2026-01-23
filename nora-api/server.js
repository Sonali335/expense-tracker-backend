require("dotenv").config(); // Load environment variables
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

// Routes
const authRoutes = require("./routes/auth");
const contactsRoutes = require("./routes/contacts");
const invoicesRoutes = require("./routes/invoices");
const expensesRoutes = require("./routes/expenses");
const calendarRoutes = require("./routes/calendar");
const timeRoutes = require("./routes/timeTracking");

const app = express();
const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.API_BASE_URL || `http://localhost:${PORT}`; 

app.use(cors());
app.use(bodyParser.json());

// Root route
app.get("/", (req, res) => {
  res.json({ 
    message: "Nora API is running", 
    version: "1.0.0",
    endpoints: {
      auth: "/auth",
      contacts: "/contacts",
      invoices: "/invoices",
      expenses: "/expenses",
      calendar: "/calendar",
      timeTracking: "/time_worked"
    }
  });
});

// Routes
app.use("/auth", authRoutes);
app.use("/contacts", contactsRoutes);
app.use("/invoices", invoicesRoutes);
app.use("/expenses", expensesRoutes);
app.use("/calendar", calendarRoutes);
app.use("/time_worked", timeRoutes);

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, () => console.log(`Nora API running at ${BASE_URL}`));
