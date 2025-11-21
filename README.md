# SiteSage - AI-Powered SEO Performance Analyzer

[![Backend CI](https://github.com/your-username/your-repo/actions/workflows/backend.yml/badge.svg)](https://github.com/your-username/your-repo/actions/workflows/backend.yml)
[![Frontend CI](https://github.com/your-username/your-repo/actions/workflows/frontend.yml/badge.svg)](https://github.com/your-username/your-repo/actions/workflows/frontend.yml)

A production-grade SEO Analysis platform built with FastAPI, Next.js, and Google Gemini. This monorepo contains the full-stack application, containerized for easy deployment and development.

## Tech Stack

### Backend

* **Framework:** FastAPI
* **AI Integration:** LangChain with Google Gemini
* **Database:** PostgreSQL (Async with `asyncpg`)
* **Migrations:** Alembic
* **Testing:** Pytest

### Frontend

* **Framework:** Next.js
* **Styling:** Tailwind CSS
* **State Management:** React Query

### DevOps

* **Containerization:** Docker & Docker Compose
* **CI/CD:** GitHub Actions

## Quick Start (Docker)

This is the recommended method for running the application.

### Step 1: Create `.env` file

Create a `.env` file in the root of the project and add your Google API key:

```env
# .env
GOOGLE_API_KEY="your-google-api-key"
```

### Step 2: Build and Run the Application

Use Docker Compose to build and run all the services:

```bash
docker-compose up --build
```

### Step 3: Access the Application

* **Frontend:** [http://localhost:3000](http://localhost:3000)
* **Backend API Docs:** [http://localhost:8000/docs](http://localhost:8000/docs)

## Manual Setup (Local Development)

### Backend (`/backend`)

1. **Navigate to the backend directory:**

    ```bash
    cd backend
    ```

2. **Create and activate a virtual environment:**

    ```bash
    python -m venv venv
    source venv/bin/activate
    ```

3. **Install dependencies:**

    ```bash
    pip install -r requirements.txt
    ```

4. **Run database migrations:**

    ```bash
    alembic upgrade head
    ```

5. **Run the development server:**

    ```bash
    uvicorn main:app --reload
    ```

### Frontend (`/frontend`)

1. **Navigate to the frontend directory:**

    ```bash
    cd frontend
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Run the development server:**

    ```bash
    npm run dev
    ```

## Features

* **AI-Powered Insights:** Leverages Google Gemini via LangChain to provide human-readable summaries and actionable recommendations from raw SEO data.
* **Comprehensive SEO Analysis:** Audits URLs for critical on-page SEO factors including titles, meta descriptions, headings, and image alt-texts.
* **Asynchronous Architecture:** Built with a fully async backend using FastAPI and `asyncpg` for high-performance, non-blocking I/O.
* **PDF Report Generation:** Dynamically generates and downloads detailed SEO reports in PDF format.
* **Containerized Environment:** Fully containerized with Docker for consistent development, testing, and production environments.
* **Automated CI/CD:** GitHub Actions pipelines for both frontend and backend to ensure code quality and automate testing.

````

### Review of Your CI/CD and Docker Configuration

Based on my understanding of your setup, your CI/CD and Docker configurations are well-structured and follow best practices.

*   **`docker-compose.yml`:** The use of `depends_on` with `service_healthy` is excellent for ensuring the backend waits for the database to be ready. The separation of concerns between the services is clean.
*   **CI/CD (`.github/workflows/`):**
    *   The use of path-based triggers (`paths:`) is crucial for a monorepo and is implemented correctly.
    *   Caching dependencies (`cache: "npm"` and `cache: "pip"`) is a great performance optimization.
    *   The concurrency control (`cancel-in-progress: true`) is a professional touch that saves on runner minutes.
    *   The backend pipeline correctly spins up a PostgreSQL service for integration testing, which is a key requirement for a reliable CI process.

**Conclusion:** Your DevOps setup is solid and does not require any immediate changes. It's well-suited for this project and demonstrates a good understanding of modern CI/CD and containerization practices.