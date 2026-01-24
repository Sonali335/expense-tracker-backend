# DynamoDB NoSQL Workbench Setup Guide

This guide will help you set up and use DynamoDB NoSQL Workbench with your Nora API for local development.

## Prerequisites

1. ✅ DynamoDB NoSQL Workbench installed on your PC
2. ✅ Node.js and npm installed
3. ✅ Your Nora API project ready

---

## Step 1: Download and Start DynamoDB Local

DynamoDB NoSQL Workbench requires DynamoDB Local to be running. You have several options:

### Option A: Use Docker (Easiest - No Java Required) ⭐ RECOMMENDED

If you have Docker Desktop installed:

1. **Start Docker Desktop** (make sure it's running)

2. **Run DynamoDB Local in Docker**:
   ```powershell
   docker run -d -p 8000:8000 --name dynamodb-local amazon/dynamodb-local
   ```
   
   The `-d` flag runs it in the background (detached mode).
   The `-p 8000:8000` maps port 8000.
   The `--name dynamodb-local` gives it a name for easy management.

3. **Verify it's running**:
   ```powershell
   docker ps
   ```
   You should see `dynamodb-local` in the list.

4. **To stop DynamoDB Local**:
   ```powershell
   docker stop dynamodb-local
   ```

5. **To start it again later**:
   ```powershell
   docker start dynamodb-local
   ```

6. **To remove the container** (if needed):
   ```powershell
   docker rm dynamodb-local
   ```

**Don't have Docker?** Download Docker Desktop from: https://www.docker.com/products/docker-desktop/

---

### Option B: Install Java (If you prefer JAR method)

If you want to use the JAR file method:

1. **Download Java**:
   - Go to: https://www.oracle.com/java/technologies/downloads/
   - Download Java 17 or later (JDK)
   - Install it

2. **Verify Java installation**:
   ```powershell
   java -version
   ```

3. **Download DynamoDB Local**:
   - Go to: https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.DownloadingAndRunning.html
   - Download `dynamodb_local_latest.zip`
   - Extract it to a folder (e.g., `C:\dynamodb-local\`)

4. **Start DynamoDB Local**:
   ```powershell
   cd C:\dynamodb-local
   java -Djava.library.path=./DynamoDBLocal_lib -jar DynamoDBLocal.jar -sharedDb
   ```

---

### Option C: Use AWS DynamoDB (Cloud - Requires AWS Account)

If you have an AWS account and want to use real DynamoDB:

1. **Create AWS Account** (if you don't have one):
   - Go to: https://aws.amazon.com/
   - Sign up (free tier available)

2. **Configure AWS Credentials**:
   - Install AWS CLI: https://aws.amazon.com/cli/
   - Run: `aws configure`
   - Enter your Access Key ID and Secret Access Key

3. **Update your `.env` file**:
   ```env
   # Remove or comment out DYNAMODB_ENDPOINT
   # DYNAMODB_ENDPOINT=http://localhost:8000
   
   # Add your AWS credentials
   AWS_ACCESS_KEY_ID=your_access_key_id
   AWS_SECRET_ACCESS_KEY=your_secret_access_key
   AWS_REGION=us-east-1
   ```

4. **Create tables in AWS Console**:
   - Go to: https://console.aws.amazon.com/dynamodb/
   - Create tables manually or use AWS CLI

**Note**: This uses real AWS resources and may incur costs (though free tier covers most development needs).

---

### Option D: Use Node.js DynamoDB Local (Alternative)

There's also a Node.js version, but Docker is still easier. If interested:
```powershell
npm install -g dynamodb-local
dynamodb-local --sharedDb
```

**However, this still requires Java internally, so Docker is better.**

---

## Step 2: Connect NoSQL Workbench to DynamoDB Local

1. **Open DynamoDB NoSQL Workbench**

2. **Create a New Connection**:
   - Click on "Add connection" or the "+" button
   - Connection name: `Local DynamoDB` (or any name you prefer)
   - Endpoint: `http://localhost:8000`
   - Access key ID: `dummy` (or any value - not used for local)
   - Secret access key: `dummy` (or any value - not used for local)
   - Region: `us-east-1` (or any region - not used for local)

3. **Test Connection**:
   - Click "Test connection"
   - You should see a success message

4. **Save and Connect**:
   - Click "Save" and then "Connect"

---

## Step 3: Create Tables Using NoSQL Workbench

### Method 1: Create Tables via Workbench UI

1. **In NoSQL Workbench, click "Create table"**

2. **Create Users Table**:
   - Table name: `nora-users`
   - Partition key: `id` (String)
   - Click "Create table"

3. **Create Contacts Table**:
   - Table name: `nora-contacts`
   - Partition key: `id` (String)
   - Click "Create table"

4. **Create Invoices Table**:
   - Table name: `nora-invoices`
   - Partition key: `id` (String)
   - Click "Create table`

5. **Create Expenses Table**:
   - Table name: `nora-expenses`
   - Partition key: `id` (String)
   - Click "Create table"

6. **Create Time Worked Table**:
   - Table name: `nora-time-worked`
   - Partition key: `id` (String)
   - Click "Create table"

### Method 2: Import Table Definitions (JSON)

You can also create tables by importing JSON definitions. Here's how:

1. In NoSQL Workbench, go to "Operations" → "Create table"
2. Click "Import from JSON"
3. Use the JSON definitions provided below

#### Users Table JSON:
```json
{
  "TableName": "nora-users",
  "KeySchema": [
    {
      "AttributeName": "id",
      "KeyType": "HASH"
    }
  ],
  "AttributeDefinitions": [
    {
      "AttributeName": "id",
      "AttributeType": "S"
    }
  ],
  "BillingMode": "PAY_PER_REQUEST"
}
```

#### Contacts Table JSON:
```json
{
  "TableName": "nora-contacts",
  "KeySchema": [
    {
      "AttributeName": "id",
      "KeyType": "HASH"
    }
  ],
  "AttributeDefinitions": [
    {
      "AttributeName": "id",
      "AttributeType": "S"
    }
  ],
  "BillingMode": "PAY_PER_REQUEST"
}
```

#### Invoices Table JSON:
```json
{
  "TableName": "nora-invoices",
  "KeySchema": [
    {
      "AttributeName": "id",
      "KeyType": "HASH"
    }
  ],
  "AttributeDefinitions": [
    {
      "AttributeName": "id",
      "AttributeType": "S"
    }
  ],
  "BillingMode": "PAY_PER_REQUEST"
}
```

#### Expenses Table JSON:
```json
{
  "TableName": "nora-expenses",
  "KeySchema": [
    {
      "AttributeName": "id",
      "KeyType": "HASH"
    }
  ],
  "AttributeDefinitions": [
    {
      "AttributeName": "id",
      "AttributeType": "S"
    }
  ],
  "BillingMode": "PAY_PER_REQUEST"
}
```

#### Time Worked Table JSON:
```json
{
  "TableName": "nora-time-worked",
  "KeySchema": [
    {
      "AttributeName": "id",
      "KeyType": "HASH"
    }
  ],
  "AttributeDefinitions": [
    {
      "AttributeName": "id",
      "AttributeType": "S"
    }
  ],
  "BillingMode": "PAY_PER_REQUEST"
}
```

---

## Step 4: Configure Your API to Use DynamoDB Local

Update your `.env` file to point to DynamoDB Local:

```env
API_BASE_URL=http://localhost:8000
JWT_SECRET=NoraApp_Secret2026
PORT=8000

# AWS Configuration for DynamoDB Local
AWS_REGION=us-east-1
DYNAMODB_ENDPOINT=http://localhost:8000

# DynamoDB Table Names
DYNAMODB_TABLE_USERS=nora-users
DYNAMODB_TABLE_CONTACTS=nora-contacts
DYNAMODB_TABLE_INVOICES=nora-invoices
DYNAMODB_TABLE_EXPENSES=nora-expenses
DYNAMODB_TABLE_TIME_WORKED=nora-time-worked
```

**Important**: The `DYNAMODB_ENDPOINT` tells your API to use local DynamoDB instead of AWS.

---

## Step 5: Using NoSQL Workbench Features

### View Tables
- In the left sidebar, you'll see all your tables
- Click on a table name to view its details

### Add Sample Data
1. Click on a table (e.g., `nora-contacts`)
2. Go to "Items" tab
3. Click "Add item"
4. Enter data manually or use JSON format
5. Click "Save"

### Query Data
1. Select a table
2. Go to "Items" tab
3. Use the search/filter to find items
4. Click on an item to view/edit it

### Run Operations
1. Go to "Operations" tab
2. You can run:
   - GetItem
   - PutItem
   - UpdateItem
   - DeleteItem
   - Query
   - Scan

### Visualize Data
- Use the "Visualizer" tab to see your data in a graphical format
- Great for understanding relationships and data structure

---

## Step 6: Test Your API

1. **Start DynamoDB Local** (if not already running):
   ```powershell
   cd C:\dynamodb-local
   java -Djava.library.path=./DynamoDBLocal_lib -jar DynamoDBLocal.jar -sharedDb
   ```

2. **Start your API**:
   ```powershell
   cd "c:\Users\Student\Desktop\ITS - Sem 4\5 Capstone Project\Nora\NORA-Backend\nora-api"
   npm start
   ```

3. **Test Registration**:
   ```bash
   POST http://localhost:8000/auth/register
   Body: {
     "username": "testuser",
     "password": "password123"
   }
   ```

4. **Check in NoSQL Workbench**:
   - Open the `nora-users` table
   - Go to "Items" tab
   - You should see the newly created user!

---

## Common Operations in NoSQL Workbench

### Adding a Contact Manually
1. Select `nora-contacts` table
2. Go to "Items" → "Add item"
3. Enter JSON:
   ```json
   {
     "id": "1737567890123xyz789abc",
     "full_name": "John Doe",
     "email": "john@example.com",
     "company_name": "Acme Corp",
     "category": "customer_vendor",
     "language": "en",
     "currency": "CAD",
     "created_at": "2026-01-23T12:00:00.000Z"
   }
   ```
4. Click "Save"

### Viewing All Items
1. Select any table
2. Go to "Items" tab
3. All items will be displayed in a table format

### Editing an Item
1. Click on an item in the "Items" tab
2. Make your changes
3. Click "Save"

### Deleting an Item
1. Select an item
2. Click the "Delete" button (trash icon)
3. Confirm deletion

---

## Troubleshooting

### Issue: Cannot connect to DynamoDB Local
**Solution**: 
- Make sure DynamoDB Local is running on port 8000
- Check that no other application is using port 8000
- Verify the endpoint in NoSQL Workbench is `http://localhost:8000`

### Issue: Tables not showing in Workbench
**Solution**:
- Make sure you're connected to the correct DynamoDB instance
- Refresh the connection
- Check that tables were created successfully

### Issue: API can't connect to DynamoDB Local
**Solution**:
- Verify `DYNAMODB_ENDPOINT=http://localhost:8000` in `.env`
- Make sure DynamoDB Local is running
- Restart your API server after changing `.env`

### Issue: "Table not found" errors
**Solution**:
- Create the tables in NoSQL Workbench first
- Verify table names match exactly (case-sensitive)
- Check your `.env` file for correct table names

---

## Quick Start Script

Create a batch file to start DynamoDB Local easily:

**Create `start-dynamodb.bat`**:
```batch
@echo off
cd C:\dynamodb-local
start "DynamoDB Local" java -Djava.library.path=./DynamoDBLocal_lib -jar DynamoDBLocal.jar -sharedDb
echo DynamoDB Local is starting...
echo Open NoSQL Workbench and connect to http://localhost:8000
pause
```

Save this in your `dynamodb-local` folder and double-click to start.

---

## Next Steps

1. ✅ Start DynamoDB Local
2. ✅ Connect NoSQL Workbench
3. ✅ Create all 5 tables
4. ✅ Update `.env` file
5. ✅ Start your API
6. ✅ Test API endpoints
7. ✅ View data in NoSQL Workbench

---

## Benefits of Using NoSQL Workbench

- **Visual Interface**: Easy to view and manage data
- **No AWS Account Needed**: Works completely offline
- **Fast Development**: No network latency
- **Free**: No costs for local development
- **Data Visualization**: See your data structure clearly
- **Query Testing**: Test queries before implementing in code

---

## Export/Import Data

### Export Data from Workbench
1. Select a table
2. Go to "Items" tab
3. Click "Export" → Choose format (JSON/CSV)
4. Save the file

### Import Data
1. Select a table
2. Go to "Items" tab
3. Click "Import" → Select your file
4. Data will be imported

This is useful for:
- Backing up test data
- Sharing sample data with team
- Migrating data between environments

---

## Tips

1. **Keep DynamoDB Local Running**: Leave it running while developing
2. **Use Workbench for Testing**: Test queries and operations before coding
3. **Visualize Relationships**: Use the visualizer to understand data flow
4. **Export Sample Data**: Export test data for documentation
5. **Multiple Connections**: You can connect to both local and AWS DynamoDB

---

## Summary

You now have:
- ✅ DynamoDB Local running
- ✅ NoSQL Workbench connected
- ✅ All tables created
- ✅ API configured to use local DynamoDB
- ✅ Ability to view and manage data visually

Your development environment is ready! 🎉
