/**
 * Creates nora-users table in DynamoDB Local.
 * Run after starting DynamoDB Local (e.g. Docker on port 8001).
 * Usage: node scripts/init-dynamodb-local.js
 */
require("dotenv").config();
const { DynamoDBClient, CreateTableCommand } = require("@aws-sdk/client-dynamodb");

const tableName = process.env.DYNAMODB_TABLE_USERS || "nora-users";

const dynamoConfig = {
  region: process.env.AWS_REGION || "us-east-1",
};

if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
  dynamoConfig.credentials = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  };
}

if (process.env.DYNAMODB_ENDPOINT) {
  dynamoConfig.endpoint = process.env.DYNAMODB_ENDPOINT;
  if (!dynamoConfig.credentials) {
    dynamoConfig.credentials = { accessKeyId: "local", secretAccessKey: "local" };
  }
} else {
  console.error("DYNAMODB_ENDPOINT is not set. This script is for DynamoDB Local only.");
  process.exit(1);
}

const client = new DynamoDBClient(dynamoConfig);

async function run() {
  try {
    await client.send(
      new CreateTableCommand({
        TableName: tableName,
        AttributeDefinitions: [{ AttributeName: "username", AttributeType: "S" }],
        KeySchema: [{ AttributeName: "username", KeyType: "HASH" }],
        BillingMode: "PAY_PER_REQUEST",
      })
    );
    console.log(`Table "${tableName}" created successfully.`);
  } catch (err) {
    if (err.name === "ResourceInUseException") {
      console.log(`Table "${tableName}" already exists.`);
      return;
    }
    console.error("Error creating table:", err.message);
    process.exit(1);
  }
}

run();
