# Backend Server Startup Guide

## Quick Start Commands

### 1. Start Backend Server (Required)
Open a new terminal/command prompt and run:
```bash
cd "c:\Users\hp\Desktop\HFC-Front and back + Admin JerryAregabackupp22 locally\backtypeorm"
node server.js
```

### 2. Expected Output
You should see:
```
Attempting to connect to database...
Database config: { host: 'localhost', port: '3306', username: 'root', database: 'hfc_database' }
Database connection established successfully
Server started on port 5000
Backend API available at: http://localhost:5000
```

### 3. If Database Connection Fails
The server will still start in debug mode:
```
Failed to connect to database: [error details]
Starting server without database connection for debugging...
Server started on port 5000 (WITHOUT DATABASE)
Backend API available at: http://localhost:5000
```

## Current Status

✅ **Frontend**: Running on http://localhost:5173
❌ **Backend**: Needs manual startup on port 5000

## Integration Fixes Completed

1. **API Endpoints**: All frontend calls now match backtypeorm routes
2. **ID Types**: Changed from string to number for TypeORM compatibility
3. **Authentication**: JWT Bearer token flow configured
4. **CRUD Operations**: All entities updated with proper validation
5. **File Uploads**: Flexible multer configuration for various field names
6. **Missing Routes**: Added thematic-areas and mission-vision endpoints

## Test After Backend Starts

1. Login at http://localhost:5173/login
2. Test CRUD operations for:
   - Reports (with file upload)
   - Case Stories
   - Staff Management
   - Alumni
   - Projects
   - Gallery Items

## Troubleshooting

- If login fails: Check backend console for errors
- If CRUD fails: Verify JWT token in browser dev tools
- If file upload fails: Check multer configuration and field names
