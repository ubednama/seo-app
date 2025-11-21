# SiteSage Backend

This repository contains the backend service for the SiteSage SEO Performance Analyzer. It is a production-grade web platform built with FastAPI that analyzes website URLs for SEO and performance quality, generates structured reports, and provides AI-powered insights.

## Project Overview

The backend is responsible for the following core features:

- **URL Auditing and Data Collection:** Asynchronously crawls submitted URLs to extract key SEO and performance metrics.
- **SEO Analysis and Scoring:** Computes a comprehensive SEO score based on a variety of factors.
- **AI Insight Generation:** Utilizes a Large Language Model (LLM) to provide human-readable summaries and actionable recommendations.
- **Report Generation:** Delivers structured SEO reports in JSON format and as downloadable PDFs.

### Tech Stack

- **Framework:** FastAPI
- **Language:** Python
- **AI Orchestration:** LangChain (with Google Gemini)
- **Database:** PostgreSQL with Alembic for migrations
- **Testing:** Pytest

## Getting Started

To run the backend service locally, follow these steps:

1. **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd seo-app
    ```

2. **Install dependencies:**

    ```bash
    pip install -r backend/requirements.txt
    pip install -r backend/requirements-dev.txt
    ```

3. **Set up the environment:**

    Create a `.env` file in the root of the project directory (`seo-app/.env`) and add the following environment variables:

    ```text
    # backend/core/config.py
    PROJECT_NAME="SiteSage API"
    API_V1_STR="/api/v1"
    
    # Database settings
    DATABASE_URL="postgresql+asyncpg://user:password@host:port/database"
    TEST_DATABASE_URL="postgresql+asyncpg://user:password@host:port/test_database"

    # AI settings
    GEMINI_API_KEY="your-gemini-api-key"
    ```

4. **Run database migrations:**

    Navigate to the backend directory and run the following command:

    ```bash
    cd backend
    alembic upgrade head
    ```

5. **Start the server:**

    ```bash
    uvicorn main:app --reload
    ```

The API will be available at `http://localhost:8000`.

## API Documentation

Once the server is running, you can access the interactive API documentation at the following URLs:

- **Swagger UI:** [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc:** [http://localhost:8000/redoc](http://localhost:8000/redoc)

The OpenAPI schema is available at `http://localhost:8000/openapi.json`.

## Endpoints

The primary endpoint for analyzing a URL is:

- `POST /api/v1/seo-reports/`

    **Request Body:**

    ```json
    {
      "url": "https://example.com",
      "include_ai_insights": true
    }
    ```

    **Response:**

    ```json
    {
      "id": 1,
      "url": "https://example.com",
      "status": "pending",
      "created_at": "2023-10-27T10:00:00Z"
    }
    ```

You can then retrieve the report using its ID:

- `GET /api/v1/seo-reports/{report_id}`

## Running Tests

To run the test suite, navigate to the `backend` directory and run `pytest`:

```bash
cd backend
pytest
```
