import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { scrapeUpworkJobs, generateMockJobs } from "../scraper/upworkScraper";
import type { Job } from "@shared/schema";

// MCP Server for Upwork Scraper
export class UpworkMCPServer {
  private server: Server;
  private lastScrapedJobs: Job[] = [];

  constructor() {
    this.server = new Server(
      {
        name: "upwork-scraper-mcp",
        version: "1.0.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
  }

  private setupToolHandlers(): void {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: "scrape_upwork_jobs",
            description:
              "Scrape job listings from Upwork based on a search URL. Returns structured job data including titles, descriptions, budgets, skills, and more.",
            inputSchema: {
              type: "object",
              properties: {
                url: {
                  type: "string",
                  description: "The Upwork search URL to scrape jobs from",
                },
                limit: {
                  type: "number",
                  description:
                    "Maximum number of jobs to scrape. Minimum is 5, use 0 for all available jobs.",
                  default: 10,
                },
                sortBy: {
                  type: "string",
                  enum: ["date", "budget", "relevance"],
                  description: "How to sort the scraped jobs",
                  default: "date",
                },
              },
              required: ["url"],
            },
          },
          {
            name: "get_last_scraped_jobs",
            description:
              "Get the jobs from the last scraping operation without making a new request",
            inputSchema: {
              type: "object",
              properties: {},
            },
          },
          {
            name: "analyze_job_market",
            description:
              "Analyze the scraped jobs to provide insights about the job market",
            inputSchema: {
              type: "object",
              properties: {
                jobs: {
                  type: "array",
                  description: "Array of job objects to analyze",
                },
              },
            },
          },
        ],
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      switch (name) {
        case "scrape_upwork_jobs": {
          const { url, limit = 10, sortBy = "date" } = args as {
            url: string;
            limit?: number;
            sortBy?: "date" | "budget" | "relevance";
          };

          try {
            const jobs = await scrapeUpworkJobs({ url, limit, sortBy });
            this.lastScrapedJobs = jobs;

            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify({
                    success: true,
                    jobCount: jobs.length,
                    jobs: jobs,
                  }),
                },
              ],
            };
          } catch (error) {
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify({
                    success: false,
                    error: error instanceof Error ? error.message : "Unknown error",
                  }),
                },
              ],
              isError: true,
            };
          }
        }

        case "get_last_scraped_jobs": {
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify({
                  success: true,
                  jobCount: this.lastScrapedJobs.length,
                  jobs: this.lastScrapedJobs,
                }),
              },
            ],
          };
        }

        case "analyze_job_market": {
          const { jobs } = args as { jobs?: Job[] };
          const jobsToAnalyze = jobs || this.lastScrapedJobs;

          const analysis = this.analyzeJobs(jobsToAnalyze);

          return {
            content: [
              {
                type: "text",
                text: JSON.stringify({
                  success: true,
                  analysis,
                }),
              },
            ],
          };
        }

        default:
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify({ error: `Unknown tool: ${name}` }),
              },
            ],
            isError: true,
          };
      }
    });
  }

  private analyzeJobs(jobs: Job[]): object {
    if (jobs.length === 0) {
      return { message: "No jobs to analyze" };
    }

    // Skill frequency analysis
    const skillCounts: Record<string, number> = {};
    jobs.forEach((job) => {
      job.skills.forEach((skill) => {
        skillCounts[skill] = (skillCounts[skill] || 0) + 1;
      });
    });

    const topSkills = Object.entries(skillCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([skill, count]) => ({ skill, count }));

    // Budget analysis
    const budgets: number[] = [];
    jobs.forEach((job) => {
      if (job.budget) {
        const match = job.budget.match(/[\d,]+/);
        if (match) {
          budgets.push(parseFloat(match[0].replace(",", "")));
        }
      }
    });

    const avgBudget = budgets.length > 0
      ? budgets.reduce((a, b) => a + b, 0) / budgets.length
      : 0;

    // Country distribution
    const countryCounts: Record<string, number> = {};
    jobs.forEach((job) => {
      if (job.clientCountry) {
        countryCounts[job.clientCountry] = (countryCounts[job.clientCountry] || 0) + 1;
      }
    });

    // Experience level distribution
    const expLevelCounts: Record<string, number> = {};
    jobs.forEach((job) => {
      if (job.experienceLevel) {
        expLevelCounts[job.experienceLevel] = (expLevelCounts[job.experienceLevel] || 0) + 1;
      }
    });

    return {
      totalJobs: jobs.length,
      topSkills,
      averageBudget: avgBudget > 0 ? `$${avgBudget.toFixed(2)}` : "N/A",
      clientCountries: countryCounts,
      experienceLevels: expLevelCounts,
      verifiedClients: jobs.filter((j) => j.clientVerified).length,
      unverifiedClients: jobs.filter((j) => !j.clientVerified).length,
    };
  }

  async start(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.log("[MCP Server] Upwork Scraper MCP Server started");
  }
}

// Create and export a singleton instance
export const mcpServer = new UpworkMCPServer();
