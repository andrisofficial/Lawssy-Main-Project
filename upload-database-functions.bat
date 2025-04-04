@echo off
setlocal enabledelayedexpansion

echo ===================================================
echo   Legal SaaS Database Functions Upload
echo ===================================================
echo.

echo Checking for .env file...
if not exist .env (
    echo Error: .env file not found.
    echo Please create a .env file with your Supabase credentials:
    echo REACT_APP_SUPABASE_URL=your-project-url
    echo REACT_APP_SUPABASE_ANON_KEY=your-anon-key
    exit /b 1
)

echo Checking for Node.js...
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Error: Node.js is not installed.
    echo Please install Node.js from https://nodejs.org/
    exit /b 1
)

echo Checking for database-functions.sql...
if not exist database-functions.sql (
    echo Error: database-functions.sql not found.
    echo Please ensure the SQL functions file exists in the current directory.
    exit /b 1
)

echo Installing required packages...
call npm install @supabase/supabase-js dotenv

echo Uploading database functions...
node upload-database-functions.js

if %ERRORLEVEL% equ 0 (
    echo.
    echo Database functions uploaded successfully!
    echo You can now run setup-client-db.bat to create the database tables.
) else (
    echo.
    echo Error: Failed to upload database functions.
    echo Please check the error messages above and try again.
    exit /b 1
)

endlocal 