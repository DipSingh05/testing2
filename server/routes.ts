import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { scrapeUpworkJobs, generateMockJobs } from "./scraper/upworkScraper";
import { jobProcessor } from "./langchain/processor";
import { scrapeRequestSchema, type ScrapeResponse } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Main scraping endpoint
  app.post("/api/scrape", async (req, res) => {
    try {
      // Validate request body
      const parseResult = scrapeRequestSchema.safeParse(req.body);

      if (!parseResult.success) {
        return res.status(400).json({
          status: "error",
          message: "Invalid request parameters",
          errors: parseResult.error.errors,
        });
      }

      const { url, limit, sortBy } = parseResult.data;

      console.log(`[API] Scraping request: URL=${url}, Limit=${limit}, SortBy=${sortBy}`);

      // Validate that URL is from Upwork
      if (!url.includes("upwork.com")) {
        return res.status(400).json({
          status: "error",
          message: "URL must be from upwork.com",
        });
      }

      let jobs;
      let usedMockData = false;

      try {
        // Attempt to scrape real jobs
        jobs = await scrapeUpworkJobs({ url, limit, sortBy });

        // If no jobs found, use mock data for demo
        if (jobs.length === 0) {
          console.log("[API] No jobs found from scraping, using mock data for demo");
          jobs = generateMockJobs(limit === 0 ? 10 : limit);
          usedMockData = true;
        }
      } catch (scrapeError) {
        console.error("[API] Scraping failed, using mock data:", scrapeError);
        // Use mock data if scraping fails (e.g., blocked by Upwork)
        jobs = generateMockJobs(limit === 0 ? 10 : limit);
        usedMockData = true;
      }

      // Process jobs with LangChain
      const { processed, insights } = await jobProcessor.processJobs(jobs);

      // Store jobs in memory
      await storage.clearJobs();
      await storage.addJobs(processed);

      const response: ScrapeResponse = {
        jobs: processed,
        totalFound: processed.length,
        scrapedCount: processed.length,
        status: usedMockData ? "partial" : "success",
        message: usedMockData
          ? "Using sample data for demonstration. Live scraping may be blocked by Upwork."
          : `Successfully scraped ${processed.length} jobs`,
      };

      console.log(`[API] Returning ${processed.length} jobs`);
      res.json(response);
    } catch (error) {
      console.error("[API] Error in scrape endpoint:", error);
      res.status(500).json({
        status: "error",
        message: error instanceof Error ? error.message : "An unexpected error occurred",
        jobs: [],
        totalFound: 0,
        scrapedCount: 0,
      });
    }
  });

  // Get all stored jobs
  app.get("/api/jobs", async (req, res) => {
    try {
      const jobs = await storage.getJobs();
      res.json({ jobs, count: jobs.length });
    } catch (error) {
      console.error("[API] Error getting jobs:", error);
      res.status(500).json({
        message: error instanceof Error ? error.message : "Failed to get jobs",
      });
    }
  });

  // Get a specific job by ID
  app.get("/api/jobs/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const job = await storage.getJobById(id);

      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }

      res.json(job);
    } catch (error) {
      console.error("[API] Error getting job:", error);
      res.status(500).json({
        message: error instanceof Error ? error.message : "Failed to get job",
      });
    }
  });

  // Clear all jobs
  app.delete("/api/jobs", async (req, res) => {
    try {
      await storage.clearJobs();
      res.json({ message: "All jobs cleared" });
    } catch (error) {
      console.error("[API] Error clearing jobs:", error);
      res.status(500).json({
        message: error instanceof Error ? error.message : "Failed to clear jobs",
      });
    }
  });

  return httpServer;
}
