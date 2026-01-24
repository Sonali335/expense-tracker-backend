# Testing Auth Endpoints

## Quick start (no Docker)

1. Ensure `USE_IN_MEMORY_USERS=true` in `.env` (default for local dev).
2. Start the API: `npm run dev`
3. Run the curl commands below.

## Register

**PowerShell** (use a JSON file to avoid quote escaping):

```powershell
curl.exe -X POST http://localhost:8000/auth/register -H "Content-Type: application/json" -d "@scripts/register-body.json"
```

**Bash / Git Bash / Unix**:

```bash
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"sarima","password":"sarima"}'
```

Success: `{"status":"user_created","id":"...","username":"sarima"}`

## Login

```powershell
curl.exe -X POST http://localhost:8000/auth/login -H "Content-Type: application/json" -d "@scripts/register-body.json"
```

```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"sarima","password":"sarima"}'
```

Success: `{"token":"...","username":"sarima","id":"..."}`

## Using DynamoDB Local instead

1. Start DynamoDB Local: `docker run -d -p 8001:8000 --name dynamodb-local amazon/dynamodb-local`
2. Create table: `npm run dynamodb:init`
3. Set `USE_IN_MEMORY_USERS=false` in `.env`
4. Restart the API and use the same curl commands.
