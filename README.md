# AI-Powered Talent Acquisition System

An intelligent, end-to-end recruitment platform built for UTAR HackAttack2.0 hackathon. This system aims to streamline the hiring process using AI-driven resume filtering, candidate verification, interview scheduling, and real-time messaging.

## Features

- **Job Posting CRUD** – Create, read, update, and delete job listings.
- **Resume Filtering** – Automatically shortlists candidates based on job descriptions using AI.
- **Candidate Verification** – Verifies qualifications and work experience using LLMs or third-party APIs.
- **Interview Scheduling** – Allows recruiters to schedule interviews and sync with calendar systems.
- **Real-Time Messaging** – Chat functionality between recruiters and candidates.
- **Dashboard Overview** – Visual summaries of candidate pipelines and job performance (optional).

## Tech Stack

- **Frontend**: React, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **AI Tools**: OpenAI

## Installation

```bash

# 1. Clone the repository

git clone https://github.com/cqin626/HackAttackFE.git


# 2. Install dependencies

npm install


# 3. Set up environment variables

# Create a .env file and configure:

# - OPENAI_API_KEY

# - MONGODB_URI

# - GOOGLE_CLIENT_ID

# - GOOGLE_CLIENT_SECRET

# - GOOGLE_REDIRECT_URI

# - RECAPTCHA_SECRET_KEY


# 4. Start the development server

npm run dev
```
