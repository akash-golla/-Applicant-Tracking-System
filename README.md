# AI-HR-Platform

AI-HR-Platform is a full-stack applicant tracking system built with React, Vite, Express, MongoDB, JWT authentication, and ATS-inspired recruitment workflows.

## What is included
- Recruiter and applicant authentication with JWT
- Role-based authorization for recruiter and applicant routes
- Public job board with search and filtering
- Recruiter job CRUD and application pipeline updates
- Applicant resume upload with Multer
- Resume parsing, skill extraction, matching, and candidate scoring
- Application lifecycle tracking from applied to rejected
- Email notifications for interview invites and status updates
- Recruiter and applicant dashboard endpoints
- Docker and docker-compose support for local deployment

## Prerequisites
- Node.js 20+
- MongoDB 7+ (or use local MongoDB in development)
- Optional: OpenAI or Gemini API key for richer AI summaries
- Optional: AWS credentials for S3-backed resume storage

## Local development

### Backend
```bash
cd server
npm install
cp .env.example .env
npm run dev
```

### Frontend
```bash
cd client
npm install
npm run dev
```

### Optional: Docker
```bash
docker compose up --build
```

## Environment variables
Create `server/.env` from `server/.env.example` and set the required values:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/ai-hr-platform
CLIENT_URL=http://localhost:5173
JWT_SECRET=change_this_secret
OPENAI_API_KEY=
GEMINI_API_KEY=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_FROM=no-reply@ai-hr.local
```

## API highlights
- POST /api/auth/register
- POST /api/auth/login
- GET /api/jobs
- POST /api/applications
- PATCH /api/applications/:id/status
- POST /api/upload
- POST /api/ai/analyze
- GET /api/dashboard/recruiter
- GET /api/dashboard/applicant
- GET /api/notifications
- POST /api/notifications/interview

## Verification
The backend builds successfully and its tests pass.

