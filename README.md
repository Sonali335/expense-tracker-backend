# Expense Tracker Backend APIs

| Endpoint | Method | Request | Response | Description |
|----------|--------|---------|----------|-------------|
| `/api/auth/register` | POST | `{ name, email, password }` | `{ message, user }` | Register a new user (mock/in-memory for now) |
| `/api/auth/login` | POST | `{ email, password }` | `{ token, user }` | Authenticate user and return JWT |
| `/api/auth/me` | GET | Header: `Authorization: Bearer <token>` | `{ id, name, email }` | Get logged-in user info |
| `/api/upload/pdf` | POST | FormData with PDF file | `{ uploadId, fileName, status }` | Upload PDF and return upload ID |
| `/api/upload/:uploadId` | GET | Header: `Authorization` | `{ expenses: [ { date, description, amount, category } ] }` | Get extracted expenses for review |
| `/api/expenses` | POST | `{ expenses: [...] }` | `{ message, savedExpenses: [...] }` | Save confirmed expenses (mock/in-memory) |
| `/api/expenses` | GET | Header: `Authorization` | `{ expenses: [...] }` | List all saved expenses for logged-in user |
| `/api/reports` | GET | Query: `?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD` | `{ totalExpense, categoryWise, monthlySummary }` | Generate expense analysis reports |
| `/api/health` | GET | - | `{ status: "ok" }` | Test backend server is running |
| `/api/logout` | POST (optional) | - | `{ message: "Logged out" }` | Frontend token clearing (no DB needed) |


# Files & Their Purpose

### server.js
- Starts the backend server
- Listens on a port (default 5000)
- Entry point of backend

### app.js
- Configures Express app
- Enables JSON parsing and CORS
- Connects API routes (`/api/auth`, `/api/upload`, `/api/expenses`, `/api/reports`)

### routes/ → Defines the endpoints for your APIs
- **auth.routes.js** → login, register, get profile
- **upload.routes.js** → upload PDF, get uploaded file
- **expense.routes.js** → get all expenses
- **report.routes.js** → get reports / analysis

### controllers/ → Contains the logic for each route
- Example: `auth.controller.js` → creates JWT for login
- Example: `upload.controller.js` → stores PDF and returns upload ID

### middlewares/auth.middleware.js → Protects certain routes
- Checks if user has a valid JWT token
- Only allows logged-in users to access protected APIs

### uploads/pdfs/ → Folder to store uploaded PDF files

### package.json → Lists dependencies and scripts
- Run backend: `npm run dev`

### .env → Stores environment variables
