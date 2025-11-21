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
- **AI Orchestration:** LangChain
- **Database:** PostgreSQL with Alembic for migrations
- **Testing:** Pytest

## Implemented Features

- **Modular Architecture:** The codebase is organized into a modular structure, separating concerns between API endpoints, services, and database models.
- **Asynchronous Task Processing:** SEO analysis is handled asynchronously using `BackgroundTasks` to ensure the API remains responsive.
- **AI-Powered Insights:** The `AIInsightGenerator` service integrates with Google's Gemini models via LangChain to generate a qualitative summary and actionable recommendations based on the raw SEO data.
- **Custom PDF Reporting:** The `get_report_pdf` endpoint generates a downloadable PDF report of the SEO analysis, with a dynamically generated filename based on the analyzed URL.
- **Database Migrations:** Alembic is configured to manage database schema changes.
- **Error Handling and Logging:** The application includes structured logging and error handling to provide insights into runtime issues.

## Features Not Yet Implemented

- **User Authentication and Authorization:** The current implementation does not include user accounts or role-based access control.
- **Historical Report Tracking:** While the database schema includes fields for tracking changes over time, the API does not yet expose endpoints for historical data analysis.
- **Batch URL Analysis:** The API does not yet support the submission of multiple URLs for analysis in a single request.
- **CI/CD Pipeline:** A continuous integration and deployment pipeline has not yet been set up.
- **Containerization:** Docker and Docker Compose have not yet been configured for the project.

## Getting Started

To run the backend service locally, follow these steps:

1. **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2. **Install dependencies:**

    ```bash
    pip install -r requirements.txt
    ```

3. **Set up the environment:**

    Create a `.env` file in the root of the backend directory and add the following environment variables:

    ```
    GOOGLE_API_KEY="your-google-api-key"
    DATABASE_URL="postgresql://user:password@host:port/database"
    ```

4. **Run database migrations:**

    ```bash
    alembic upgrade head
    ```

5. **Start the server:**

    ```bash
    uvicorn main:app --reload
    ```

The API will be available at `http://localhost:8000`.

## API Documentation

Once the server is running, you can access the interactive API documentation at `http://localhost:8000/docs`.