# AI-HR-Platform

A full-stack AI-powered HR recruitment platform built with React, Vite, Express, MongoDB, and JWT authentication.

## Features
- Recruiter and applicant authentication
- Job posting and management
- Applications and status tracking
- Resume upload flow
- AI analysis placeholder endpoint
- Dashboard API routes

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
- POST /api/upload
- POST /api/ai/analyze
- GET /api/dashboard/recruiter
- GET /api/dashboard/applicant
