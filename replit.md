# Upwork Scraper

A web application that scrapes job listings from Upwork using Puppeteer, LangChain for data processing, and MCP servers for tool orchestration.

## Overview

This tool allows users to:
- Enter an Upwork search URL
- Configure scraping limits (minimum 5 jobs)
- Filter and sort scraped job listings
- View job details including title, description, budget, skills, and client information

## Tech Stack

- **Frontend**: React with TypeScript, Tailwind CSS, shadcn/ui components
- **Backend**: Express.js, Node.js
- **Scraping**: Puppeteer for headless browser automation
- **Processing**: LangChain for data processing and analysis
- **MCP**: Model Context Protocol server for tool orchestration

## Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   │   └── home.tsx   # Main scraper interface
│   │   ├── lib/           # Utilities and helpers
│   │   └── hooks/         # Custom React hooks
│   └── index.html
├── server/                 # Backend Express application
│   ├── scraper/           # Puppeteer scraper
│   │   └── upworkScraper.ts
│   ├── mcp/               # MCP server setup
│   │   └── mcpServer.ts
│   ├── langchain/         # LangChain processor
│   │   └── processor.ts
│   ├── routes.ts          # API endpoints
│   └── storage.ts         # In-memory storage
├── shared/                 # Shared types and schemas
│   └── schema.ts          # Zod schemas for job data
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

- **2024-11-28**: Initial implementation
  - Created job scraper with Puppeteer
  - Added LangChain integration for data processing
  - Implemented MCP server for tool orchestration
  - Built responsive UI with job cards grid

## Notes

- Upwork may block automated scraping; mock data is provided as fallback
- Minimum scrape limit is 5 jobs
- Jobs are stored in memory (cleared on server restart)
