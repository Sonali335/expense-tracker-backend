# DynamoDB Setup Guide for Nora API

This guide explains how to set up and use DynamoDB with the Nora API after converting from SQLite.

## Prerequisites

1. AWS Account with DynamoDB access
2. AWS CLI configured (or IAM credentials)
3. Node.js and npm installed

## Installation

1. Install dependencies:
```bash
npm install
```

This will install:
- `@aws-sdk/client-dynamodb` - AWS SDK v3 for DynamoDB
- `@aws-sdk/lib-dynamodb` - DynamoDB Document Client for simplified operations

## Environment Variables

Add the following to your `.env` file:

```env
# AWS Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key

# DynamoDB Table Names (optional - defaults provided)
DYNAMODB_TABLE_USERS=nora-users
DYNAMODB_TABLE_CONTACTS=nora-contacts
DYNAMODB_TABLE_INVOICES=nora-invoices
DYNAMODB_TABLE_EXPENSES=nora-expenses
DYNAMODB_TABLE_TIME_WORKED=nora-time-worked

# For Local DynamoDB (if using DynamoDB Local)
# DYNAMODB_ENDPOINT=http://localhost:8000
```

## Creating DynamoDB Tables

You need to create the following tables in DynamoDB. You can do this via:
- AWS Console
- AWS CLI
- CloudFormation
- Terraform

### Table Structure

All tables use `id` as the partition key (String type).

#### 1. Users Table
- **Table Name**: `nora-users` (or value from `DYNAMODB_TABLE_USERS`)
- **Partition Key**: `id` (String)
- **Attributes**: `id`, `username`, `password`

#### 2. Contacts Table
- **Table Name**: `nora-contacts` (or value from `DYNAMODB_TABLE_CONTACTS`)
- **Partition Key**: `id` (String)
- **Attributes**: `id`, `full_name`, `email`, `company_name`, `category`, `language`, `currency`, `created_at`

#### 3. Invoices Table
- **Table Name**: `nora-invoices` (or value from `DYNAMODB_TABLE_INVOICES`)
- **Partition Key**: `id` (String)
- **Attributes**: `id`, `contact_id`, `number`, `date`, `due_date`, `currency`, `total`, `status`, `items` (List/Array)

**Note**: In DynamoDB, `invoice_items` are stored as an array within the invoice document (NoSQL pattern), unlike the separate SQLite table.

#### 4. Expenses Table
- **Table Name**: `nora-expenses` (or value from `DYNAMODB_TABLE_EXPENSES`)
- **Partition Key**: `id` (String)
- **Attributes**: `id`, `date`, `category_id`, `vendor_name`, `amount`, `currency`, `tax_amount`, `is_paid`, `description`

#### 5. Time Worked Table
- **Table Name**: `nora-time-worked` (or value from `DYNAMODB_TABLE_TIME_WORKED`)
- **Partition Key**: `id` (String)
- **Attributes**: `id`, `contact_id`, `date`, `hours`, `minutes`, `description`

## AWS CLI Commands to Create Tables

```bash
# Users Table
aws dynamodb create-table \
  --table-name nora-users \
  --attribute-definitions AttributeName=id,AttributeType=S \
  --key-schema AttributeName=id,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region us-east-1

# Contacts Table
aws dynamodb create-table \
  --table-name nora-contacts \
  --attribute-definitions AttributeName=id,AttributeType=S \
  --key-schema AttributeName=id,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region us-east-1

# Invoices Table
aws dynamodb create-table \
  --table-name nora-invoices \
  --attribute-definitions AttributeName=id,AttributeType=S \
  --key-schema AttributeName=id,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region us-east-1

# Expenses Table
aws dynamodb create-table \
  --table-name nora-expenses \
  --attribute-definitions AttributeName=id,AttributeType=S \
  --key-schema AttributeName=id,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region us-east-1

# Time Worked Table
aws dynamodb create-table \
  --table-name nora-time-worked \
  --attribute-definitions AttributeName=id,AttributeType=S \
  --key-schema AttributeName=id,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region us-east-1
```

## Key Differences from SQLite

1. **No Auto-increment IDs**: IDs are generated using `generateId()` function (timestamp + random string)
2. **No Separate Invoice Items Table**: Invoice items are stored as an array within the invoice document
3. **No JOINs**: DynamoDB doesn't support JOINs. Related data is either embedded or fetched separately
4. **Scan vs Query**: Most operations use `ScanCommand` for simplicity. For better performance with large datasets, consider adding Global Secondary Indexes (GSIs)
5. **Filtering**: Filtering is done using `FilterExpression` instead of SQL WHERE clauses

## Performance Considerations

For production use, consider:

1. **Global Secondary Indexes (GSIs)** for common query patterns:
   - Contacts by email
   - Invoices by contact_id
   - Invoices by status
   - Expenses by date range

2. **Query vs Scan**: For better performance, use `QueryCommand` with GSIs instead of `ScanCommand` when possible

3. **Batch Operations**: Use `BatchGetCommand` and `BatchWriteCommand` for multiple operations

## Testing

After setting up tables, test the API endpoints:

```bash
# Start the server
npm start

# Test endpoints (with authentication token)
curl -X GET http://localhost:8000/contacts \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Migration Notes

- All API endpoints, request/response formats, and business logic remain exactly the same
- Only the database layer has changed from SQLite to DynamoDB
- All routes now use async/await syntax
- Error handling remains consistent with the original implementation
