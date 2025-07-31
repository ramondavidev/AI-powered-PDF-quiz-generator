<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# AI Quiz Generator - Copilot Instructions

This is a full-stack application for generating quiz questions from PDF documents using AI.

## Project Structure

- **Frontend**: Next.js 15 with TypeScript, Tailwind CSS, Zustand (state management), React Query (data fetching)
- **Backend**: FastAPI with OpenAI integration for question generation
- **AI Integration**: OpenAI GPT-3.5-turbo for generating quiz questions from PDF content

## Key Features

1. PDF upload and text extraction
2. AI-powered question generation (10 questions with multiple choice answers)
3. Question editing interface
4. Interactive quiz taking experience
5. Scoring and detailed results view
6. Error handling and loading states

## Coding Guidelines

- Use TypeScript for type safety
- Follow React functional components with hooks
- Use Tailwind CSS for styling (matching the purple/blue gradient theme)
- Implement proper error handling for API calls
- Use Zustand for global state management
- Use React Query for server state management
- Follow the component structure: UploadSection → QuestionEditor → QuizView → ResultsView

## UI/UX Design

- Purple/blue gradient theme
- Clean, modern interface matching the provided screenshots
- Responsive design
- Loading states and feedback
- Smooth transitions and animations

## API Integration

- RESTful API design with FastAPI
- File upload handling for PDFs
- OpenAI integration for question generation
- Proper error responses and validation
