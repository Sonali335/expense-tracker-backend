# SQLite to DynamoDB Conversion Summary

## Overview
This document summarizes the conversion of the Nora API from SQLite to AWS DynamoDB. All API endpoints, request/response formats, and business logic remain **exactly the same**. Only the database layer has been replaced.

## Files Modified

### 1. `config/db.js` - **COMPLETELY REPLACED**
- **Before**: SQLite database connection with table creation
- **After**: DynamoDB client configuration using AWS SDK v3
- **Changes**:
  - Replaced `sqlite3.Database` with `DynamoDBClient` and `DynamoDBDocumentClient`
  - Added table name configuration via environment variables
  - Added `generateId()` helper function (replaces SQLite AUTOINCREMENT)
  - Removed table creation logic (tables must be created separately in DynamoDB)

### 2. `package.json` - **UPDATED**
- **Removed**: `sqlite3` dependency
- **Added**: 
  - `@aws-sdk/client-dynamodb` (v3.700.0)
  - `@aws-sdk/lib-dynamodb` (v3.700.0)

### 3. `routes/auth.js` - **CONVERTED**
- **SQLite Operations Replaced**:
  - `db.run("INSERT INTO users...")` → `PutCommand` with `docClient.send()`
  - `db.get("SELECT * FROM users...")` → `ScanCommand` with `FilterExpression`
- **Business Logic**: Unchanged (validation, password hashing, JWT generation)
- **Response Format**: Unchanged

### 4. `routes/contacts.js` - **CONVERTED**
- **SQLite Operations Replaced**:
  - `db.all("SELECT * FROM contacts...")` → `ScanCommand`
  - `db.run("INSERT INTO contacts...")` → `PutCommand`
  - `db.get("SELECT...WHERE id=?")` → `GetCommand`
  - `db.run("UPDATE contacts...")` → `UpdateCommand`
  - `db.run("DELETE FROM contacts...")` → `DeleteCommand`
- **Business Logic**: Unchanged (validation, response formatting)
- **Response Format**: Unchanged

### 5. `routes/invoices.js` - **CONVERTED**
- **SQLite Operations Replaced**:
  - `db.all("SELECT * FROM invoices...")` → `ScanCommand` with `FilterExpression`
  - `db.run("INSERT INTO invoices...")` → `PutCommand` (with items array)
  - `db.run("UPDATE invoices...")` → `UpdateCommand`
  - `db.run("DELETE FROM invoices...")` → `DeleteCommand`
- **Key Change**: Invoice items are now stored as an array within the invoice document (NoSQL pattern) instead of a separate table
- **Business Logic**: Unchanged (total calculation, status management)
- **Response Format**: Unchanged

### 6. `routes/expenses.js` - **CONVERTED**
- **SQLite Operations Replaced**:
  - `db.run("INSERT INTO expenses...")` → `PutCommand`
  - `db.run("UPDATE expenses...")` → `UpdateCommand`
- **Business Logic**: Unchanged
- **Response Format**: Unchanged

### 7. `routes/calendar.js` - **CONVERTED**
- **SQLite Operations Replaced**:
  - `db.all("SELECT * FROM invoices WHERE date BETWEEN...")` → `ScanCommand` with `FilterExpression`
  - `db.all("SELECT * FROM expenses WHERE date BETWEEN...")` → `ScanCommand` with `FilterExpression`
  - `db.all("SELECT * FROM invoices...")` → `ScanCommand` (for dashboard)
  - `db.all("SELECT * FROM expenses...")` → `ScanCommand` (for dashboard)
- **Business Logic**: Unchanged (event aggregation, dashboard calculations)
- **Response Format**: Unchanged

### 8. `routes/timeTracking.js` - **CONVERTED**
- **SQLite Operations Replaced**:
  - `db.run("INSERT INTO time_worked...")` → `PutCommand`
- **Business Logic**: Unchanged
- **Response Format**: Unchanged

## Key Conversion Patterns

### 1. SELECT → Scan/Get
```javascript
// SQLite
db.all("SELECT * FROM table", (err, rows) => { ... });
db.get("SELECT * FROM table WHERE id=?", [id], (err, row) => { ... });

// DynamoDB
const scanCommand = new ScanCommand({ TableName: TABLES.TABLE });
const result = await docClient.send(scanCommand);
const rows = result.Items || [];

const getCommand = new GetCommand({ TableName: TABLES.TABLE, Key: { id } });
const result = await docClient.send(getCommand);
const row = result.Item;
```

### 2. INSERT → Put
```javascript
// SQLite
db.run("INSERT INTO table (col1, col2) VALUES (?, ?)", [val1, val2], function(err) {
  const id = this.lastID;
});

// DynamoDB
const id = generateId();
const putCommand = new PutCommand({
  TableName: TABLES.TABLE,
  Item: { id, col1: val1, col2: val2 }
});
await docClient.send(putCommand);
```

### 3. UPDATE → UpdateCommand
```javascript
// SQLite
db.run("UPDATE table SET col1=? WHERE id=?", [val1, id], function(err) {
  if (this.changes === 0) { /* not found */ }
});

// DynamoDB
const updateCommand = new UpdateCommand({
  TableName: TABLES.TABLE,
  Key: { id },
  UpdateExpression: "SET col1 = :val1",
  ExpressionAttributeValues: { ":val1": val1 }
});
await docClient.send(updateCommand);
```

### 4. DELETE → DeleteCommand
```javascript
// SQLite
db.run("DELETE FROM table WHERE id=?", [id], function(err) { ... });

// DynamoDB
const deleteCommand = new DeleteCommand({
  TableName: TABLES.TABLE,
  Key: { id }
});
await docClient.send(deleteCommand);
```

### 5. WHERE Clauses → FilterExpression
```javascript
// SQLite
db.all("SELECT * FROM table WHERE status=? AND contact_id=?", [status, contact_id], ...);

// DynamoDB
const scanCommand = new ScanCommand({
  TableName: TABLES.TABLE,
  FilterExpression: "status = :status AND contact_id = :contact_id",
  ExpressionAttributeValues: {
    ":status": status,
    ":contact_id": contact_id
  }
});
```

## Architecture Changes

### Database Schema
- **Before**: Relational tables with foreign keys and separate `invoice_items` table
- **After**: NoSQL documents with embedded arrays (invoice items stored within invoice document)

### ID Generation
- **Before**: SQLite AUTOINCREMENT integers
- **After**: `generateId()` function using timestamp + random string

### Query Patterns
- **Before**: SQL queries with JOINs, WHERE clauses, ORDER BY
- **After**: Scan operations with FilterExpression (for simple queries) or Query operations with GSIs (for optimized queries)

## What Stayed the Same

✅ All API endpoints and routes  
✅ All request/response formats  
✅ All validation logic  
✅ All business logic (calculations, status management)  
✅ All error handling patterns  
✅ All authentication/authorization  
✅ All middleware usage  

## What Changed

❌ Database connection method  
❌ Database operations (SQL → DynamoDB commands)  
❌ ID generation (AUTOINCREMENT → generateId())  
❌ Invoice items storage (separate table → embedded array)  
❌ Query syntax (SQL → DynamoDB expressions)  
❌ All routes now use async/await (instead of callbacks)  

## Next Steps

1. **Install Dependencies**: Run `npm install`
2. **Set Environment Variables**: Configure AWS credentials and table names in `.env`
3. **Create DynamoDB Tables**: Use AWS Console, CLI, or CloudFormation (see `DYNAMODB_SETUP.md`)
4. **Test API**: Verify all endpoints work with DynamoDB
5. **Optimize (Optional)**: Add Global Secondary Indexes for better query performance

## Performance Considerations

- **Scan Operations**: Current implementation uses `ScanCommand` which scans entire tables. For production, consider:
  - Adding Global Secondary Indexes (GSIs) for common query patterns
  - Using `QueryCommand` instead of `ScanCommand` when possible
  - Implementing pagination for large result sets

## Testing Checklist

- [ ] User registration and login
- [ ] Contact CRUD operations
- [ ] Invoice creation with items
- [ ] Invoice filtering by status and contact_id
- [ ] Expense creation and updates
- [ ] Calendar events retrieval
- [ ] Dashboard calculations
- [ ] Time tracking logging
