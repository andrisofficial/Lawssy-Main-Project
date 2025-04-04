#!/bin/bash

echo "==================================================="
echo "  Legal SaaS Client Database Setup"
echo "==================================================="
echo

echo "Checking for .env file..."
if [ ! -f .env ]; then
  echo "ERROR: .env file not found."
  echo "Please create a .env file with your Supabase credentials."
  echo "Required variables: REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY"
  exit 1
fi

echo "Checking Node.js installation..."
if ! command -v node &> /dev/null; then
  echo "ERROR: Node.js is not installed or not in PATH."
  echo "Please install Node.js from https://nodejs.org/"
  exit 1
fi

echo "Checking if database schema has changed..."
timestamp=$(date "+%Y%m%d%H%M%S")
cp create-client-tables.js create-client-tables-backup-$timestamp.js

echo "Creating client tables and inserting default data..."
node create-client-tables.js

if [ $? -ne 0 ]; then
  echo "ERROR: Failed to create client database tables."
  echo "See the error message above for details."
  exit 1
fi

echo
echo "==================================================="
echo "  Client Database Setup Complete"
echo "==================================================="
echo "You can now start the application with: npm start"
echo "or using the start-app script."
echo 