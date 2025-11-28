import { NextResponse } from 'next/server';
import { scrapeUpworkJobs, generateMockJobs } from '../../../lib/scraper/upworkScraper.js';
import { setJobs, getJobs } from '../../../lib/storage.js';
import { scrapeRequestSchema } from '../../../lib/schema.js';

export async function POST(request) {
  try {
    const body = await request.json();
    const validatedData = scrapeRequestSchema.parse(body);
    const { url, limit, sortBy } = validatedData;

    console.log(`[API] Scrape request: ${url}, limit: ${limit}, sortBy: ${sortBy}`);

    let jobs = [];
    let status = 'success';
    let message = undefined;

    try {
      jobs = await scrapeUpworkJobs({ url, limit, sortBy });

      if (jobs.length === 0) {
        console.log('[API] No jobs found, returning mock data');
        jobs = generateMockJobs(limit);
        status = 'partial';
        message = 'No jobs found on the page. Showing sample data for demonstration. This could be due to Upwork blocking automated access or the search returning no results.';
      }
    } catch (scrapeError) {
      console.error('[API] Scrape error:', scrapeError.message);
      jobs = generateMockJobs(limit);
      status = 'partial';
      message = `Scraping failed: ${scrapeError.message}. Showing sample data for demonstration.`;
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
