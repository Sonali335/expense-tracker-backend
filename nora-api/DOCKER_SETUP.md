# Docker Setup for DynamoDB Local (No Java Required)

This guide shows you how to use Docker to run DynamoDB Local without installing Java.

## Why Docker?

- ✅ No Java installation needed
- ✅ Easy to start/stop
- ✅ Isolated environment
- ✅ Works on Windows, Mac, and Linux
- ✅ Free and lightweight

---

## Step 1: Install Docker Desktop

1. **Download Docker Desktop**:
   - Go to: https://www.docker.com/products/docker-desktop/
   - Click "Download for Windows"
   - Run the installer
   - Follow the installation wizard

2. **Start Docker Desktop**:
   - After installation, Docker Desktop should start automatically
   - Look for the Docker icon in your system tray
   - Wait until it says "Docker Desktop is running"

3. **Verify Docker is working**:
   ```powershell
   docker --version
   ```
   You should see something like: `Docker version 24.x.x`

---

## Step 2: Run DynamoDB Local in Docker

### First Time Setup (Create and Start Container)

```powershell
docker run -d -p 8001:8000 --name dynamodb-local amazon/dynamodb-local
```

**What this does:**
- `-d` = Run in detached mode (background)
- `-p 8000:8000` = Map port 8000 from container to your PC
- `--name dynamodb-local` = Give it a friendly name
- `amazon/dynamodb-local` = The official DynamoDB Local Docker image

**Note**: The first time you run this, Docker will download the image (about 500MB). This only happens once.

### Verify It's Running

```powershell
docker ps
```

You should see `dynamodb-local` in the list with status "Up".

---

## Step 3: Connect NoSQL Workbench

1. Open DynamoDB NoSQL Workbench
2. Add connection:
   - Endpoint: `http://localhost:8000`
   - Access key: `dummy`
   - Secret key: `dummy`
   - Region: `us-east-1`
3. Test and connect

---

## Step 4: Configure Your API

Your `.env` file should have:
```env
DYNAMODB_ENDPOINT=http://localhost:8000
```

This tells your API to use the Docker container instead of AWS.

---

## Managing DynamoDB Local Container

### Start the Container
```powershell
docker start dynamodb-local
```

### Stop the Container
```powershell
docker stop dynamodb-local
```

### View Container Status
```powershell
docker ps -a
```

### View Container Logs
```powershell
docker logs dynamodb-local
```

### Remove the Container (if you want to start fresh)
```powershell
docker stop dynamodb-local
docker rm dynamodb-local
```

Then run the `docker run` command again to create a new one.

---

## Quick Start Script

Create a batch file `start-dynamodb-docker.bat`:

```batch
@echo off
echo Starting DynamoDB Local in Docker...
docker start dynamodb-local
if %errorlevel% neq 0 (
    echo Container not found. Creating new container...
    docker run -d -p 8000:8000 --name dynamodb-local amazon/dynamodb-local
)
echo DynamoDB Local is running on http://localhost:8000
echo Open NoSQL Workbench and connect to http://localhost:8000
pause
```

Save this file and double-click to start DynamoDB Local.

---

## Troubleshooting

### Issue: "docker: command not found"
**Solution**: Docker Desktop is not installed or not in PATH. Install Docker Desktop.

### Issue: "Cannot connect to Docker daemon"
**Solution**: 
- Make sure Docker Desktop is running
- Check the system tray for Docker icon
- Restart Docker Desktop if needed

### Issue: "Port 8000 is already in use"
**Solution**: 
- Check what's using port 8000: `netstat -ano | findstr :8000`
- Stop the other application or use a different port:
  ```powershell
  docker run -d -p 8001:8000 --name dynamodb-local amazon/dynamodb-local
  ```
  Then update `.env` to use port 8001.

### Issue: Container keeps stopping
**Solution**: 
- Check logs: `docker logs dynamodb-local`
- Make sure Docker Desktop has enough resources allocated
- Try recreating the container

---

## Data Persistence

By default, data in the Docker container is **temporary** - it disappears when you remove the container.

### To Persist Data (Optional)

Create a volume to save data:

```powershell
docker run -d -p 8000:8000 -v dynamodb-data:/home/dynamodblocal/data --name dynamodb-local amazon/dynamodb-local
```

This saves data to a Docker volume named `dynamodb-data`.

### To View Saved Data

```powershell
docker volume ls
docker volume inspect dynamodb-data
```

---

## Benefits of Docker Method

✅ **No Java Required** - Docker handles everything  
✅ **Easy Management** - Simple start/stop commands  
✅ **Isolated** - Doesn't affect your system  
✅ **Consistent** - Same environment every time  
✅ **Portable** - Works the same on any OS  
✅ **Clean** - Easy to remove when done  

---

## Summary

1. ✅ Install Docker Desktop
2. ✅ Run: `docker run -d -p 8000:8000 --name dynamodb-local amazon/dynamodb-local`
3. ✅ Connect NoSQL Workbench to `http://localhost:8000`
4. ✅ Create tables in NoSQL Workbench
5. ✅ Start your API
6. ✅ Start developing!

---

## Next Steps

After Docker is set up:
- Follow the main guide: `DYNAMODB_WORKBENCH_GUIDE.md`
- Create tables in NoSQL Workbench
- Test your API endpoints
- View data in NoSQL Workbench

Happy coding! 🐳
