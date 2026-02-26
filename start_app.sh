#!/bin/bash

# Define cleanup function to kill background processes on exit
cleanup() {
    echo "Stopping frontend and backend servers..."
    kill $FRONTEND_PID $BACKEND_PID
    exit
}

# Trap SIGINT (Ctrl+C) and SIGTERM
trap cleanup SIGINT SIGTERM

echo "Starting backend server..."
cd backend
chmod +x start.sh
./start.sh &
BACKEND_PID=$!

echo "Starting frontend server..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!

echo "Both backend and frontend are running."
echo "Application can be stopped with Ctrl+C."
wait
