# AI Quiz Generator

A full-stack web application that generates quiz questions from PDF documents using AI. Upload your course materials or textbooks and get intelligent quiz questions to help you study faster and smarter.

## Features

- **PDF Upload**: Drag & drop PDF files up to 10MB
- **AI Question Generation**: Uses OpenAI GPT-3.5-turbo to generate 10 multiple-choice questions
- **Question Editor**: Review and edit generated questions before taking the quiz
- **Interactive Quiz**: Take the quiz with immediate feedback
- **Detailed Results**: View your score and review all questions with correct/incorrect answers
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

### Frontend

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Data Fetching**: React Query (TanStack Query)
- **File Upload**: react-dropzone
- **Icons**: Lucide React

### Backend

- **Framework**: FastAPI
- **Language**: Python
- **PDF Processing**: PyPDF2
- **AI Integration**: OpenAI API
- **Environment**: python-dotenv

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Python 3.8+
- OpenAI API key

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd ai-quiz-app
   ```

2. **Frontend Setup**

   ```bash
   npm install
   ```

3. **Backend Setup**

   ```bash
   cd backend
   pip install -r requirements.txt
   ```

4. **Environment Variables**

   Create `.env.local` in the root directory:

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

   Create `.env` in the backend directory:

   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   ```

### Running the Application

1. **Start the Backend**

   ```bash
   cd backend
   python main.py
   ```

   Backend will run on http://localhost:8000

2. **Start the Frontend**
   ```bash
   npm run dev
   ```
   Frontend will run on http://localhost:3000

## Usage

1. **Upload PDF**: Drag and drop a PDF file or click to upload
2. **Wait for Processing**: The AI will extract text and generate questions
3. **Edit Questions**: Review and modify questions if needed
4. **Take Quiz**: Answer the multiple-choice questions
5. **View Results**: See your score and review all answers

## Project Structure

```
ai-quiz-app/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Main page
│   │   ├── providers.tsx       # React Query provider
│   │   └── globals.css         # Global styles
│   ├── components/
│   │   ├── UploadSection.tsx   # PDF upload interface
│   │   ├── QuestionEditor.tsx  # Question editing interface
│   │   ├── QuizView.tsx        # Quiz taking interface
│   │   └── ResultsView.tsx     # Results and scoring
│   ├── hooks/
│   │   └── useApi.ts           # API integration hooks
│   └── store/
│       └── quiz.ts             # Zustand store
├── backend/
│   ├── main.py                 # FastAPI application
│   ├── requirements.txt        # Python dependencies
│   └── .env.example           # Environment variables template
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

## API Endpoints

- `GET /health` - Health check
- `POST /generate-questions` - Upload PDF and generate questions
- `POST /submit-quiz` - Submit quiz answers (for future scoring features)

## Error Handling

The application includes comprehensive error handling for:

- Invalid file types (only PDF supported)
- File size limits (10MB maximum)
- Empty PDFs or text extraction failures
- API failures and network issues
- OpenAI API rate limits and errors

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For questions or issues, please open an issue on GitHub.
