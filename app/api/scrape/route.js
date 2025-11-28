import { NextResponse } from 'next/server';
import { scrapeUpworkJobs } from '../../../lib/scraper/upworkScraper.js';
import { setJobs, getJobs } from '../../../lib/storage.js';
import { scrapeRequestSchema } from '../../../lib/schema.js';

export async function POST(request) {
  try {
    const body = await request.json();
    const validatedData = scrapeRequestSchema.parse(body);
    const { url, limit, sortBy, credentials } = validatedData;

    console.log(`[API] Scrape request: ${url}, limit: ${limit}, sortBy: ${sortBy}`);

    let jobs = [];
    let status = 'success';
    let message = undefined;

    try {
      // Pass credentials to scraper if provided
      jobs = await scrapeUpworkJobs({ 
        url, 
        limit, 
        sortBy,
        credentials: credentials || {
          email: process.env.UPWORK_EMAIL,
          password: process.env.UPWORK_PASSWORD
        }
      });

      if (jobs.length === 0) {
        console.log('[API] No jobs found');
        status = 'partial';
        message = 'No jobs found on the page. This could be due to no matching results or the search query returning empty results.';
      }
    } catch (scrapeError) {
      console.error('[API] Scrape error:', scrapeError.message);
      status = 'error';
      message = `Scraping failed: ${scrapeError.message}`;
      
      return NextResponse.json(
        { 
          error: message,
          jobs: [],
          totalFound: 0,
          scrapedCount: 0,
          status 
        },
        { status: 500 }
      );
    }

    setJobs(jobs);

    return NextResponse.json({
      jobs,
      totalFound: jobs.length,
      scrapedCount: jobs.length,
      status,
      message,
    });
  } catch (error) {
    console.error('[API] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to scrape jobs' },
      { status: 400 }
    );
  }
}