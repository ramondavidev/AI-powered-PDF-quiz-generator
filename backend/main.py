from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import PyPDF2
import io
from openai import OpenAI
import json
import uuid
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get API key from environment variables
api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    raise ValueError("OPENAI_API_KEY environment variable is required")

print("OpenAI API key loaded from environment")

app = FastAPI(title="Quiz Generator API", version="1.0.0")

# CORS middleware - Configure for production
allowed_origins = [
    "http://localhost:3000",  # Local development
    "https://localhost:3000", # Local development with HTTPS
    "https://ai-powered-pdf-quiz-generator.vercel.app",  # Vercel production
]

# Add production origins from environment variables if available
frontend_url = os.getenv("FRONTEND_URL")
if frontend_url:
    allowed_origins.append(frontend_url)

# For Railway deployment, also allow any localhost origin
if os.getenv("RAILWAY_ENVIRONMENT"):
    allowed_origins.extend([
        "http://localhost:3000",
        "https://localhost:3000",
        "https://ai-powered-pdf-quiz-generator.vercel.app",
        "*"  # Allow all origins in Railway for testing
    ])

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins if not os.getenv("RAILWAY_ENVIRONMENT") else ["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# OpenAI client - Initialize after environment is loaded
client = OpenAI(api_key=api_key)

# Pydantic models
class Question(BaseModel):
    id: str
    question: str
    options: List[str]
    correctAnswer: int

class QuestionGenerationResponse(BaseModel):
    questions: List[Question]

class QuizAnswer(BaseModel):
    questionId: str
    answer: int

class QuizSubmission(BaseModel):
    answers: List[QuizAnswer]

class QuizResult(BaseModel):
    questionId: str
    isCorrect: bool
    correctAnswer: int

class QuizSubmissionResponse(BaseModel):
    score: int
    totalQuestions: int
    results: List[QuizResult]

# Helper functions
def extract_text_from_pdf(file_content: bytes) -> str:
    """Extract text from PDF file."""
    try:
        pdf_file = io.BytesIO(file_content)
        pdf_reader = PyPDF2.PdfReader(pdf_file)
        
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text() + "\n"
        
        return text.strip()
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error reading PDF: {str(e)}")

async def generate_questions_with_openai(text: str, num_questions: int = 10) -> List[Question]:
    """Generate quiz questions using OpenAI API."""
    
    # Ensure text is not empty
    if not text or len(text.strip()) < 100:
        raise HTTPException(status_code=400, detail="Text is too short to generate meaningful questions. Please provide more content.")
    
    # Limit text length to avoid token limits (roughly 3000 characters = ~750 tokens)
    text_excerpt = text[:3000] if len(text) > 3000 else text
    
    prompt = f"""
    Based on the following text, generate exactly {num_questions} multiple-choice questions. 
    Each question should have 4 options and test understanding of the key concepts.
    
    IMPORTANT: Return ONLY a JSON array (not an object). The response must start with [ and end with ].
    
    Use this exact format:
    [
        {{
            "question": "Question text here?",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correctAnswer": 0
        }},
        {{
            "question": "Another question?",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correctAnswer": 1
        }}
    ]
    
    Make sure:
    - Questions test comprehension, not just memorization
    - All 4 options are plausible
    - The correctAnswer index (0-3) points to the correct option
    - Questions are clear and unambiguous
    - Return ONLY the JSON array, no additional text or formatting
    
    Text to analyze:
    {text_excerpt}
    """
    
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are an expert quiz generator. Always respond with valid JSON only."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=2000
        )
        
        content = response.choices[0].message.content.strip()
        print(f"OpenAI Response: {content}")  # Debug logging
        
        # Clean up the response - remove markdown formatting if present
        if content.startswith("```json"):
            content = content[7:]  # Remove ```json
        if content.startswith("```"):
            content = content[3:]   # Remove ```
        if content.endswith("```"):
            content = content[:-3]  # Remove closing ```
        
        content = content.strip()
        
        # Parse JSON response
        questions_data = json.loads(content)
        
        # Handle different response formats
        if isinstance(questions_data, dict):
            # Check if it's an error response
            if "error" in questions_data:
                raise HTTPException(status_code=500, detail=f"AI returned error: {questions_data['error']}")
            
            # If it's a dict, look for common keys that might contain the questions
            if "questions" in questions_data:
                questions_data = questions_data["questions"]
            elif "data" in questions_data:
                questions_data = questions_data["data"]
            elif "items" in questions_data:
                questions_data = questions_data["items"]
            else:
                # Check if it looks like a single question object
                if "question" in questions_data and "options" in questions_data:
                    questions_data = [questions_data]
                else:
                    raise ValueError(f"Unexpected response format. Expected questions array but got: {list(questions_data.keys()) if isinstance(questions_data, dict) else type(questions_data)}")
        
        # Ensure questions_data is now a list
        if not isinstance(questions_data, list):
            raise ValueError("Expected a list of questions, got: " + str(type(questions_data)))
        
        # Convert to Question objects
        questions = []
        for i, q_data in enumerate(questions_data):
            if not isinstance(q_data, dict):
                raise ValueError(f"Question {i} should be a dictionary, got: {type(q_data)}")
                
            question = Question(
                id=str(uuid.uuid4()),
                question=q_data["question"],
                options=q_data["options"],
                correctAnswer=q_data["correctAnswer"]
            )
            questions.append(question)
        
        return questions
    
    except json.JSONDecodeError as e:
        print(f"JSON Decode Error: {str(e)}")
        print(f"Content that failed to parse: {content}")
        raise HTTPException(status_code=500, detail=f"Error parsing AI response as JSON: {str(e)}")
    except KeyError as e:
        print(f"Key Error: {str(e)}")
        print(f"Question data: {q_data if 'q_data' in locals() else 'N/A'}")
        raise HTTPException(status_code=500, detail=f"Missing required field in AI response: {str(e)}")
    except ValueError as e:
        print(f"Value Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Invalid data format in AI response: {str(e)}")
    except Exception as e:
        print(f"Unexpected Error: {str(e)}")
        print(f"Error type: {type(e)}")
        raise HTTPException(status_code=500, detail=f"Error generating questions: {str(e)}")

# API endpoints
@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "service": "Quiz Generator API"}

@app.post("/generate-questions", response_model=QuestionGenerationResponse)
async def generate_questions(file: UploadFile = File(...)):
    """Generate quiz questions from uploaded PDF."""
    
    # Validate file type
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are supported")
    
    # Validate file size (10MB limit)
    content = await file.read()
    if len(content) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File size too large. Maximum 10MB allowed.")
    
    # Extract text from PDF
    text = extract_text_from_pdf(content)
    
    if not text.strip():
        raise HTTPException(status_code=400, detail="No text found in PDF. Please ensure the PDF contains readable text.")
    
    # Generate questions
    questions = await generate_questions_with_openai(text)
    
    return QuestionGenerationResponse(questions=questions)

@app.post("/submit-quiz", response_model=QuizSubmissionResponse)
async def submit_quiz(submission: QuizSubmission):
    """Submit quiz answers and get results."""
    # This is a simplified version - in a real app, you'd store questions in a database
    # For now, we'll just return a mock response
    
    results = []
    score = 0
    
    for answer in submission.answers:
        # In a real implementation, you'd look up the correct answer from stored questions
        # For demo purposes, we'll assume some answers are correct
        is_correct = True  # This would be determined by comparing with stored correct answers
        correct_answer = 0  # This would come from the stored question
        
        if is_correct:
            score += 1
        
        results.append(QuizResult(
            questionId=answer.questionId,
            isCorrect=is_correct,
            correctAnswer=correct_answer
        ))
    
    return QuizSubmissionResponse(
        score=score,
        totalQuestions=len(submission.answers),
        results=results
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
