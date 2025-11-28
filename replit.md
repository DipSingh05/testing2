# Upwork Scraper

A web application that scrapes job listings from Upwork using Puppeteer for headless browser automation.

## Overview

This tool allows users to:
- Enter an Upwork search URL
- Configure scraping limits (minimum 5 jobs)
- Filter and sort scraped job listings
- View job details including title, description, budget, skills, and client information
- Click through to view jobs directly on Upwork

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: JavaScript (no TypeScript)
- **Styling**: Tailwind CSS
- **Scraping**: Puppeteer for headless browser automation
- **Icons**: Lucide React

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── scrape/        # POST /api/scrape - Scrape jobs
│   │   └── jobs/          # GET /api/jobs - List jobs
│   ├── globals.css        # Global styles
│   ├── layout.js          # Root layout
│   └── page.js            # Main page component
├── lib/                    # Shared utilities
│   ├── scraper/           # Puppeteer scraper
│   │   └── upworkScraper.js
│   ├── schema.js          # Zod validation schemas
│   └── storage.js         # In-memory job storage
├── public/                 # Static assets
│   └── favicon.png
└── replit.md              # This file
```

## API Endpoints

- `POST /api/scrape` - Scrape jobs from Upwork URL
  - Body: `{ url: string, limit: number, sortBy: "date" | "budget" | "relevance" }`
  - Returns: Array of scraped jobs with metadata

- `GET /api/jobs` - Get all stored jobs
- `GET /api/jobs/:id` - Get a specific job by ID
- `DELETE /api/jobs` - Clear all stored jobs

## Running the Application

The application runs on port 5000 with:
```bash
npm run dev
```

## Recent Changes

- **2024-11-28**: Migrated to Next.js
  - Converted from React/Express/TypeScript to Next.js with JavaScript
  - Fixed job URL extraction to generate valid Upwork permalinks
  - Simplified project structure using App Router
  - Removed TypeScript, LangChain, and MCP dependencies

## Notes

- Upwork may block automated scraping; mock data is provided as fallback
- Minimum scrape limit is 5 jobs
- Jobs are stored in memory (cleared on server restart)
- Job URLs now use the canonical format: `https://www.upwork.com/jobs/~{jobId}`
