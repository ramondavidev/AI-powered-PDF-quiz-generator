#!/usr/bin/env python3
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

print("Environment check:")
print(f"OPENAI_API_KEY: {'Set' if os.getenv('OPENAI_API_KEY') else 'Not set'}")

try:
    from openai import OpenAI
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    print("OpenAI client created successfully")
except Exception as e:
    print(f"Error creating OpenAI client: {e}")

try:
    import fastapi
    print(f"FastAPI version: {fastapi.__version__}")
except Exception as e:
    print(f"Error importing FastAPI: {e}")

print("All imports successful, trying to import main module...")
try:
    import main
    print("Main module imported successfully")
except Exception as e:
    print(f"Error importing main: {e}")
    import traceback
    traceback.print_exc()
