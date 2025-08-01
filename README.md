# 🧠 AI-Powered PDF Quiz Generator

A modern full-stack web application that transforms your PDF documents into interactive quiz questions using artificial intelligence. Perfect for students, educators, and professionals who want to enhance their learning experience by generating smart quizzes from course materials, textbooks, research papers, and other educational content.

![AI Quiz Generator](https://img.shields.io/badge/AI-Powered-blue?style=for-the-badge&logo=openai)
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)

## ✨ Features

- **📄 Smart PDF Upload**: Intuitive drag & drop interface with support for PDFs up to 10MB
- **🤖 AI Question Generation**: Leverages OpenAI GPT-3.5-turbo to create 10 intelligent multiple-choice questions
- **✏️ Question Editor**: Review, edit, and customize generated questions before taking the quiz
- **🎯 Interactive Quiz Experience**: Clean, distraction-free quiz interface with immediate feedback
- **📊 Detailed Results & Analytics**: Comprehensive scoring with question-by-question review
- **💾 Progress Persistence**: Automatic saving of quiz progress and results
- **📱 Responsive Design**: Seamless experience across desktop, tablet, and mobile devices
- **🎨 Modern UI/UX**: Beautiful purple/blue gradient theme with smooth animations
- **⚡ Real-time Processing**: Live feedback during PDF processing and question generation
- **🔧 Error Handling**: Robust error management with user-friendly messages

## 🛠 Tech Stack

### Frontend

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router and React Server Components
- **Language**: [TypeScript](https://www.typescriptlang.org/) for type safety and better developer experience
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) for utility-first styling and responsive design
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/) for lightweight and scalable state management
- **Data Fetching**: [React Query (TanStack Query)](https://tanstack.com/query) for server state management and caching
- **File Upload**: [react-dropzone](https://react-dropzone.js.org/) for drag & drop file handling
- **Icons**: [Lucide React](https://lucide.dev/) for beautiful, consistent icons

### Backend

- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) for high-performance Python web API
- **Language**: Python 3.8+ with async/await support
- **PDF Processing**: [PyPDF2](https://pypdf2.readthedocs.io/) for text extraction from PDF documents
- **AI Integration**: [OpenAI API](https://openai.com/api/) with GPT-3.5-turbo for intelligent question generation
- **Environment Management**: [python-dotenv](https://pypi.org/project/python-dotenv/) for configuration
- **Data Validation**: [Pydantic](https://pydantic.dev/) for request/response validation

### Infrastructure & Deployment

- **CORS**: Configured for cross-origin requests between frontend and backend
- **File Validation**: Type checking and size limits for uploaded files
- **Error Handling**: Comprehensive error management with user-friendly messages
- **Environment Variables**: Secure configuration management

## 🚀 Getting Started

### Prerequisites

Before running the application, make sure you have the following installed:

- **Node.js** 18+ and **npm** (for frontend development)
- **Python** 3.8+ (for backend API)
- **OpenAI API Key** ([Get one here](https://platform.openai.com/api-keys))

### 📦 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/ramondavidev/AI-powered-PDF-quiz-generator.git
   cd AI-powered-PDF-quiz-generator
   ```

2. **Frontend Setup**

   Install Node.js dependencies:

   ```bash
   npm install
   ```

3. **Backend Setup**

   Navigate to backend directory and install Python dependencies:

   ```bash
   cd backend
   pip install -r requirements.txt
   ```

4. **Environment Configuration**

   **Frontend Environment** - Create `.env.local` in the root directory:

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

   **Backend Environment** - Create `.env` in the `backend` directory:

   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   FRONTEND_URL=http://localhost:3000
   ```

   > ⚠️ **Important**: Make sure to replace `your_openai_api_key_here` with your actual OpenAI API key

### 🏃‍♂️ Running the Application

#### Option 1: Using VS Code Tasks (Recommended)

If you're using VS Code, you can use the predefined tasks:

1. **Start Backend**: Press `Ctrl+Shift+P` → "Tasks: Run Task" → "Start Backend Server"
2. **Start Frontend**: Press `Ctrl+Shift+P` → "Tasks: Run Task" → "Start Frontend Development Server"

#### Option 2: Manual Setup

1. **Start the Backend Server**

   ```bash
   cd backend
   python main.py
   ```

   ✅ Backend will be available at: http://localhost:8000

2. **Start the Frontend Development Server**
   ```bash
   # In a new terminal, from the root directory
   npm run dev
   ```
   ✅ Frontend will be available at: http://localhost:3000

### 🔧 Development Scripts

```bash
# Frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Backend
python main.py       # Start FastAPI server
pip freeze           # List installed packages
```

## 🎯 How to Use

1. **📤 Upload Your PDF**

   - Drag and drop a PDF file onto the upload area, or click to browse
   - Supported: PDF files up to 10MB in size
   - The app will extract text content from your document

2. **⏳ AI Processing**

   - Watch the progress as AI analyzes your PDF content
   - GPT-3.5-turbo generates 10 intelligent multiple-choice questions
   - Processing typically takes 10-30 seconds depending on document length

3. **✏️ Review & Edit Questions**

   - Review the generated questions in the Question Editor
   - Edit questions, answers, or explanations if needed
   - Ensure questions meet your learning objectives
   - **🔄 Auto-Save**: All edits are automatically saved to local storage

4. **🎮 Take the Interactive Quiz**

   - Answer all questions at your own pace
   - Questions are presented one at a time for better focus
   - No time limits - learn at your own speed
   - **💾 Progress Tracking**: Your quiz progress is automatically saved after each answer

5. **📊 View Detailed Results**
   - See your overall score and performance breakdown
   - Review each question with correct/incorrect indicators
   - Learn from explanations for better understanding
   - **📝 History**: Completed quizzes are saved to your local history (last 10 quizzes)

### 🔄 Saved Progress Features

The app automatically saves your work and progress using your browser's local storage:

- **📱 Resume Anywhere**: If you accidentally close the browser or navigate away, your progress is preserved
- **⚡ Instant Recovery**: Return to the app and you'll see notifications about saved progress
- **📚 Quiz History**: Access your last 10 completed quizzes with scores and timestamps
- **✏️ Edited Questions**: Modified questions are preserved between sessions
- **🛡️ Data Safety**: Warning before leaving with unsaved progress
- **🧹 Smart Cleanup**: Old data (24+ hours) is automatically cleaned up

**To access saved data:** Look for the "View History" or "Resume Saved Progress" buttons in the interface, or check for automatic notifications when you return to the app.

## 📁 Project Structure

```
AI-powered-PDF-quiz-generator/
├── 📁 src/                          # Frontend source code
│   ├── 📁 app/                      # Next.js App Router
│   │   ├── layout.tsx               # Root layout with providers
│   │   ├── page.tsx                 # Main application page
│   │   ├── providers.tsx            # React Query provider setup
│   │   └── globals.css              # Global styles and Tailwind
│   ├── 📁 components/               # React components
│   │   ├── UploadSection.tsx        # PDF upload interface
│   │   ├── QuestionEditor.tsx       # Question editing interface
│   │   ├── QuizView.tsx             # Quiz taking interface
│   │   ├── ResultsView.tsx          # Results and scoring display
│   │   ├── SavedProgressManager.tsx # Progress persistence
│   │   ├── Toast.tsx                # Notification system
│   │   └── Footer.tsx               # Application footer
│   ├── 📁 hooks/                    # Custom React hooks
│   │   ├── useApi.ts                # API integration hooks
│   │   └── usePersistence.ts        # Local storage persistence
│   ├── 📁 store/                    # State management
│   │   └── quiz.ts                  # Zustand store for quiz state
│   ├── 📁 types/                    # TypeScript type definitions
│   ├── 📁 utils/                    # Utility functions
│   │   └── localStorage.ts          # Local storage helpers
│   └── 📁 assets/                   # Static assets (icons, images)
├── 📁 backend/                      # Backend API
│   ├── main.py                      # FastAPI application
│   ├── requirements.txt             # Python dependencies
│   ├── Dockerfile                   # Docker configuration
│   └── .env.example                 # Environment variables template
├── package.json                     # Node.js dependencies and scripts
├── tailwind.config.js               # Tailwind CSS configuration
├── tsconfig.json                    # TypeScript configuration
├── next.config.js                   # Next.js configuration
└── README.md                        # This file
```

## 🔌 API Endpoints

### Main Endpoints

| Method | Endpoint              | Description                  | Request  | Response        |
| ------ | --------------------- | ---------------------------- | -------- | --------------- |
| `GET`  | `/`                   | Root endpoint with API info  | -        | API metadata    |
| `GET`  | `/health`             | Health check for monitoring  | -        | Status object   |
| `POST` | `/generate-questions` | Upload PDF and generate quiz | PDF file | Questions array |

### Example API Usage

**Health Check:**

```bash
curl http://localhost:8000/health
```

**Generate Questions:**

```bash
curl -X POST \
  http://localhost:8000/generate-questions \
  -H "Content-Type: multipart/form-data" \
  -F "file=@your-document.pdf"
```

**Response Format:**

```json
{
  "questions": [
    {
      "id": "uuid-string",
      "question": "What is the main topic discussed?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct_answer": 0,
      "explanation": "Detailed explanation of the correct answer"
    }
  ],
  "total_questions": 10,
  "processing_time": "12.3s"
}
```

## 🚨 Error Handling & Troubleshooting

The application includes comprehensive error handling for issues:

### File Upload Issues

- **Invalid file type**: Only PDF files are supported
- **File too large**: Maximum file size is 10MB
- **Empty or corrupted PDF**: PDF must contain readable text
- **Upload timeout**: Large files may take longer to process

### API Integration Issues

- **OpenAI API key missing**: Ensure `OPENAI_API_KEY` is set in backend `.env`
- **Network connectivity**: Check internet connection for API calls


<div align="center">

**Made with ❤️ by [Ramon Davi](https://github.com/ramondavidev)**

⭐ **Star this repo if you found it helpful!** ⭐

</div>
