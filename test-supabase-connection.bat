@echo off
echo ===================================================
echo   Supabase Connection Test
echo ===================================================
echo.

echo Checking for .env file...
if not exist .env (
  echo ERROR: .env file not found.
  echo Please create a .env file with your Supabase credentials.
  echo Required variables: REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY
  exit /b 1
)

echo Checking Node.js installation...
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
  echo ERROR: Node.js is not installed or not in PATH.
  echo Please install Node.js from https://nodejs.org/
  exit /b 1
)

echo Running connection test...
node test-supabase-connection.js

if %ERRORLEVEL% neq 0 (
  echo.
  echo Connection test failed. Please check your Supabase credentials.
  exit /b 1
)

echo.
echo ===================================================
echo  Next Steps:
echo ===================================================
echo 1. Run setup-client-db.bat to create database tables
echo 2. Start your application with: npm start
echo ===================================================
echo. 