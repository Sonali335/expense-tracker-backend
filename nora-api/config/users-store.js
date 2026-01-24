/**
 * Users store: DynamoDB or in-memory (for local dev when DynamoDB is unavailable).
 * Set USE_IN_MEMORY_USERS=true in .env to use in-memory store (no Docker/DynamoDB needed).
 */
const { docClient, TABLES, generateId } = require("./db");
const { GetCommand, PutCommand } = require("@aws-sdk/lib-dynamodb");

const USE_IN_MEMORY = process.env.USE_IN_MEMORY_USERS === "true";
const memoryStore = new Map(); // username -> { id, username, password }

async function getByUsername(username) {
  if (USE_IN_MEMORY) {
    return memoryStore.get(username) || null;
  }
  const result = await docClient.send(
    new GetCommand({ TableName: TABLES.USERS, Key: { username } })
  );
  return result.Item || null;
}

async function createUser(username, hashedPassword) {
  const id = generateId();
  const item = { id, username, password: hashedPassword };
  if (USE_IN_MEMORY) {
    memoryStore.set(username, item);
    return id;
  }
  await docClient.send(
    new PutCommand({ TableName: TABLES.USERS, Item: item })
  );
  return id;
}

module.exports = { getByUsername, createUser, USE_IN_MEMORY };
