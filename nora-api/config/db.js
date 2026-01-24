// DynamoDB Configuration
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");

// Initialize DynamoDB client configuration
const dynamoConfig = {
  region: process.env.AWS_REGION || "us-east-1",
};

// Add credentials if provided (for local development or explicit credentials)
if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
  dynamoConfig.credentials = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  };
}

// For local DynamoDB (DynamoDB Local)
if (process.env.DYNAMODB_ENDPOINT) {
  dynamoConfig.endpoint = process.env.DYNAMODB_ENDPOINT;
  // Use dummy credentials for local DynamoDB
  if (!dynamoConfig.credentials) {
    dynamoConfig.credentials = {
      accessKeyId: "local",
      secretAccessKey: "local",
    };
  }
}

// Initialize DynamoDB client
let client;
let docClient;

try {
  client = new DynamoDBClient(dynamoConfig);
  // Create DynamoDB Document Client for simplified JSON operations
  docClient = DynamoDBDocumentClient.from(client);
  console.log("DynamoDB client initialized successfully");
} catch (error) {
  console.error("Error initializing DynamoDB client:", error.message);
  console.warn("Server will start but DynamoDB operations will fail until configured");
  // Create a dummy client to prevent crashes
  client = new DynamoDBClient(dynamoConfig);
  docClient = DynamoDBDocumentClient.from(client);
}

// Table names from environment variables (with defaults)
const TABLES = {
  USERS: process.env.DYNAMODB_TABLE_USERS || "nora-users",
  CONTACTS: process.env.DYNAMODB_TABLE_CONTACTS || "nora-contacts",
  INVOICES: process.env.DYNAMODB_TABLE_INVOICES || "nora-invoices",
  EXPENSES: process.env.DYNAMODB_TABLE_EXPENSES || "nora-expenses",
  TIME_WORKED: process.env.DYNAMODB_TABLE_TIME_WORKED || "nora-time-worked",
};

// Helper function to generate unique ID (replaces SQLite AUTOINCREMENT)
function generateId() {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

module.exports = {
  docClient,
  TABLES,
  generateId,
};
