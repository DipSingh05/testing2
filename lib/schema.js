import { z } from 'zod';

// Schema for scraping Upwork jobs request validation
export const scrapeRequestSchema = z.object({
  url: z.string().url('Invalid URL format'),
  limit: z.number().int().min(0).max(100).default(10),
  sortBy: z.enum(['recent', 'budget', 'date']).default('recent'),
  useMockData: z.boolean().optional().default(false),
  credentials: z.object({
    email: z.string().email().optional(),
    password: z.string().optional(),
  }).optional(),
});

// Schema for individual job data
export const jobSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  budget: z.string().optional(),
  hourlyRate: z.string().optional(),
  clientName: z.string().optional(),
  clientCountry: z.string().optional(),
  clientVerified: z.boolean(),
  postedDate: z.string(),
  skills: z.array(z.string()),
  jobType: z.string().optional(),
  experienceLevel: z.string().optional(),
  duration: z.string().optional(),
  url: z.string(),
});

// Schema for scraping response
export const scrapeResponseSchema = z.object({
  success: z.boolean(),
  jobs: z.array(jobSchema),
  count: z.number(),
  message: z.string().optional(),
});

// Schema for error response
export const errorResponseSchema = z.object({
  success: z.boolean(),
  error: z.string(),
  details: z.any().optional(),
});