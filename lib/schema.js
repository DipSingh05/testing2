import { z } from 'zod';

export const jobSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  budget: z.string().optional(),
  hourlyRate: z.string().optional(),
  clientName: z.string().optional(),
  clientCountry: z.string().optional(),
  clientVerified: z.boolean().default(false),
  postedDate: z.string(),
  skills: z.array(z.string()).default([]),
  jobType: z.string().optional(),
  experienceLevel: z.string().optional(),
  duration: z.string().optional(),
  url: z.string(),
});

export const scrapeRequestSchema = z.object({
  url: z.string().url('Please enter a valid Upwork URL'),
  limit: z.number().min(5, 'Minimum scrape limit is 5').default(10),
  sortBy: z.enum(['date', 'budget', 'relevance']).default('date'),
});

export const scrapeResponseSchema = z.object({
  jobs: z.array(jobSchema),
  totalFound: z.number(),
  scrapedCount: z.number(),
  status: z.enum(['success', 'error', 'partial']),
  message: z.string().optional(),
});
