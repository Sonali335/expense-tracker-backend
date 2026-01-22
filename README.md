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
