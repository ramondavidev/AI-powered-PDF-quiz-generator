#!/bin/bash
echo "Starting AI Quiz Generator Backend..."
echo "Python version: $(python --version)"
echo "Current directory: $(pwd)"
echo "Files in current directory:"
ls -la
echo "Environment variables:"
echo "PORT: $PORT"
echo "OPENAI_API_KEY: ${OPENAI_API_KEY:+SET}"
echo "Starting uvicorn..."
python -m uvicorn main:app --host 0.0.0.0 --port $PORT --log-level info
