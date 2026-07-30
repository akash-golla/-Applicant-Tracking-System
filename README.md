# AI-HR-Platform

A full-stack AI-powered HR recruitment platform built with React, Vite, Express, MongoDB, JWT authentication, and ATS-inspired workflows.

## Features
- Recruiter and applicant authentication with JWT
- Role-based authorization for recruiter and applicant routes
- Public job board with search and filtering
- Job CRUD for recruiters
- Applicant resume upload with Multer
- Resume parsing and candidate insight generation
- Semantic-style skill matching and candidate scoring
- Application lifecycle tracking from applied through rejected
- Notifications and email notification flow
- Dashboard endpoints for recruiter and applicant insights

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
