import puppeteer from 'puppeteer';
import { randomUUID } from 'crypto';

let browser = null;

async function getBrowser() {
  if (!browser) {
    console.log('[Scraper] Launching Puppeteer browser...');
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        '--window-size=1920x1080',
        '--disable-web-security',
        '--disable-features=IsolateOrigins,site-per-process',
      ],
    });
    console.log('[Scraper] Browser launched successfully');
  }
  return browser;
}

export async function closeBrowser() {
  if (browser) {
    await browser.close();
    browser = null;
  }
}

function extractJobIdFromUrl(url) {
  if (!url) return null;
  const match = url.match(/~([a-zA-Z0-9]+)/);
  return match ? match[1] : null;
}

function buildCanonicalJobUrl(jobId) {
  return `https://www.upwork.com/jobs/~${jobId}`;
}

export async function scrapeUpworkJobs(options) {
  const { url, limit, sortBy } = options;
  const jobs = [];
  let page = null;

  try {
    const browserInstance = await getBrowser();
    page = await browserInstance.newPage();

    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    );

    await page.setViewport({ width: 1920, height: 1080 });

    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9',
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
    });

    console.log(`[Scraper] Navigating to: ${url}`);

    let navigationSuccess = false;
    let retries = 3;

    while (retries > 0 && !navigationSuccess) {
      try {
        await page.goto(url, {
          waitUntil: 'domcontentloaded',
          timeout: 45000,
        });
        navigationSuccess = true;
      } catch (navError) {
        retries--;
        console.log(`[Scraper] Navigation attempt failed, ${retries} retries left`);
        if (retries === 0) throw navError;
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }

    console.log('[Scraper] Waiting for job listings to load...');

    const possibleSelectors = [
      '[data-test="JobTile"]',
      '.job-tile',
      'article[data-ev-label]',
      'section.air3-card-section',
      '[data-test="job-tile-list"]',
      '.up-card-section',
    ];

    let foundSelector = null;
    for (const selector of possibleSelectors) {
      try {
        await page.waitForSelector(selector, { timeout: 10000 });
        foundSelector = selector;
        console.log(`[Scraper] Found jobs using selector: ${selector}`);
        break;
      } catch {
        // Try next selector
      }
    }

    if (!foundSelector) {
      console.log('[Scraper] No standard job selectors found, attempting generic extraction...');
    }

    await new Promise((resolve) => setTimeout(resolve, 3000));

    if (limit > 10) {
      console.log('[Scraper] Scrolling to load more jobs...');
      await autoScroll(page, Math.min(limit / 10, 5));
    }

    console.log('[Scraper] Extracting job data...');
    const extractedJobs = await page.evaluate(() => {
      const jobElements = document.querySelectorAll(
        '[data-test="JobTile"], .job-tile, article[data-ev-label="search_results_impression"], section.air3-card-section, .up-card-section'
      );

      console.log(`Found ${jobElements.length} job elements`);

      const jobs = [];

      jobElements.forEach((element) => {
        try {
          const titleElement =
            element.querySelector('[data-test="job-title-link"]') ||
            element.querySelector('[data-test="JobTile-link"]') ||
            element.querySelector('h2 a, h3 a') ||
            element.querySelector('.job-title a') ||
            element.querySelector('a[href*="/jobs/"]');

          const title = titleElement?.textContent?.trim() || '';
          const jobUrl = titleElement?.getAttribute('href') || '';

          if (!title) return;

          const descriptionElement =
            element.querySelector('[data-test="JobDescription"]') ||
            element.querySelector('[data-test="job-description-text"]') ||
            element.querySelector('.job-description') ||
            element.querySelector('.air3-truncation') ||
            element.querySelector('[data-test="UpCLineClamp"]') ||
            element.querySelector('p');

          const description = descriptionElement?.textContent?.trim() || '';

          const budgetElement =
            element.querySelector('[data-test="budget"]') ||
            element.querySelector('[data-test="is-fixed-price"]') ||
            element.querySelector('.job-budget') ||
            element.querySelector('[data-test="JobBudget"]') ||
            element.querySelector('[data-qa="job-budget"]');

          const budget = budgetElement?.textContent?.trim() || '';

          const hourlyRateElement =
            element.querySelector('[data-test="hourly-rate"]') ||
            element.querySelector('[data-qa="hourly-rate"]') ||
            element.querySelector('.job-hourly-rate');

          const hourlyRate = hourlyRateElement?.textContent?.trim() || '';

          const postedElement =
            element.querySelector('[data-test="posted-on"]') ||
            element.querySelector('[data-test="job-pubdate"]') ||
            element.querySelector('.job-posted-date') ||
            element.querySelector('time') ||
            element.querySelector('[data-qa="job-posted-on"]') ||
            element.querySelector('small');

          const postedDate = postedElement?.textContent?.trim() || 'Recently';

          const skillElements = element.querySelectorAll(
            '[data-test="Skill"], [data-test="token"] span, .air3-token, .skill-badge, .up-skill-badge'
          );
          const skills = [];
          skillElements.forEach((skill) => {
            const text = skill.textContent?.trim();
            if (text && text.length < 50 && text.length > 1) {
              skills.push(text);
            }
          });

          const clientElement =
            element.querySelector('[data-test="client-company-name"]') ||
            element.querySelector('.client-name') ||
            element.querySelector('[data-qa="client-company-name"]');
          const clientName = clientElement?.textContent?.trim() || '';

          const locationElement =
            element.querySelector('[data-test="client-location"]') ||
            element.querySelector('[data-qa="client-location"]') ||
            element.querySelector('.client-location');
          const clientCountry = locationElement?.textContent?.trim() || '';

          const verifiedElement = element.querySelector(
            '[data-test="payment-verified"], .payment-verified, [data-qa="payment-verified"]'
          );
          const clientVerified = !!verifiedElement;

          const expElement =
            element.querySelector('[data-test="experience-level"]') ||
            element.querySelector('[data-qa="experience-level"]') ||
            element.querySelector('.experience-level');
          const experienceLevel = expElement?.textContent?.trim() || '';

          const typeElement =
            element.querySelector('[data-test="job-type"]') ||
            element.querySelector('[data-qa="job-type"]');
          const jobType = typeElement?.textContent?.trim() || '';

          const durationElement =
            element.querySelector('[data-test="duration"]') ||
            element.querySelector('[data-qa="duration"]');
          const duration = durationElement?.textContent?.trim() || '';

          jobs.push({
            title,
            description,
            budget,
            hourlyRate,
            clientName,
            clientCountry,
            clientVerified,
            postedDate,
            skills,
            jobType,
            experienceLevel,
            duration,
            rawUrl: jobUrl,
          });
        } catch (err) {
          // Skip problematic elements
        }
      });

      return jobs;
    });

    console.log(`[Scraper] Extracted ${extractedJobs.length} jobs from page`);

    const limitedJobs = limit === 0 ? extractedJobs : extractedJobs.slice(0, limit);

    for (const job of limitedJobs) {
      const jobId = extractJobIdFromUrl(job.rawUrl);
      const canonicalUrl = jobId
        ? buildCanonicalJobUrl(jobId)
        : job.rawUrl.startsWith('http')
        ? job.rawUrl
        : job.rawUrl
        ? `https://www.upwork.com${job.rawUrl}`
        : '';

      jobs.push({
        id: randomUUID(),
        title: job.title,
        description: job.description,
        budget: job.budget || undefined,
        hourlyRate: job.hourlyRate || undefined,
        clientName: job.clientName || undefined,
        clientCountry: job.clientCountry || undefined,
        clientVerified: job.clientVerified,
        postedDate: job.postedDate,
        skills: job.skills,
        jobType: job.jobType || undefined,
        experienceLevel: job.experienceLevel || undefined,
        duration: job.duration || undefined,
        url: canonicalUrl,
      });
    }

    if (sortBy === 'budget') {
      jobs.sort((a, b) => {
        const budgetA = parseFloat((a.budget || '0').replace(/[^0-9.]/g, '')) || 0;
        const budgetB = parseFloat((b.budget || '0').replace(/[^0-9.]/g, '')) || 0;
        return budgetB - budgetA;
      });
    }

    console.log(`[Scraper] Successfully processed ${jobs.length} jobs`);
    return jobs;
  } catch (error) {
    console.error('[Scraper] Error scraping jobs:', error);
    throw error;
  } finally {
    if (page) {
      await page.close().catch(() => {});
    }
  }
}

async function autoScroll(page, maxScrolls = 5) {
  await page.evaluate(async (maxScrolls) => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      let scrollCount = 0;
      const distance = 500;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;
        scrollCount++;

        if (totalHeight >= scrollHeight - window.innerHeight || scrollCount >= maxScrolls) {
          clearInterval(timer);
          resolve();
        }
      }, 500);
    });
  }, maxScrolls);
}

export function generateMockJobs(count) {
  const mockTitles = [
    'React Developer Needed for E-commerce Platform',
    'Full Stack Developer for SaaS Application',
    'Node.js Backend Engineer',
    'Senior Frontend Developer - Vue.js',
    'Mobile App Developer (React Native)',
    'Python Developer for Data Analysis',
    'WordPress Developer for Blog Migration',
    'JavaScript Expert for Browser Extension',
    'UI/UX Designer with Figma Experience',
    'TypeScript Developer for API Development',
  ];

  const mockSkills = [
    ['React', 'TypeScript', 'Node.js', 'Redux'],
    ['Vue.js', 'JavaScript', 'CSS', 'Vuex'],
    ['Python', 'Django', 'PostgreSQL', 'REST API'],
    ['React Native', 'iOS', 'Android', 'Mobile Development'],
    ['Node.js', 'Express', 'MongoDB', 'GraphQL'],
    ['WordPress', 'PHP', 'MySQL', 'WooCommerce'],
    ['JavaScript', 'HTML', 'CSS', 'Chrome Extension'],
    ['Python', 'Pandas', 'NumPy', 'Data Analysis'],
    ['Figma', 'UI Design', 'UX Research', 'Prototyping'],
    ['TypeScript', 'REST API', 'GraphQL', 'Node.js'],
  ];

  const mockDescriptions = [
    'We are looking for an experienced developer to build a scalable e-commerce platform. The ideal candidate should have expertise in modern web technologies and a strong portfolio.',
    'Join our team to develop a cutting-edge SaaS application. We need someone who can work independently and deliver high-quality code.',
    "We're building an innovative product and need a talented developer to help bring our vision to life. Remote work is welcome.",
    'Looking for a skilled professional to help with our web application development. Must have excellent communication skills.',
    'Seeking a developer to join our growing startup. This is a long-term opportunity with potential for advancement.',
  ];

  const jobs = [];

  for (let i = 0; i < count; i++) {
    const titleIndex = i % mockTitles.length;
    const descIndex = i % mockDescriptions.length;
    const mockJobId = randomUUID().replace(/-/g, '').slice(0, 18);

    jobs.push({
      id: randomUUID(),
      title: mockTitles[titleIndex],
      description: mockDescriptions[descIndex],
      budget: Math.random() > 0.5 ? `$${Math.floor(Math.random() * 5000) + 500}` : undefined,
      hourlyRate: Math.random() > 0.5 ? `$${Math.floor(Math.random() * 100) + 20}` : undefined,
      clientName: `Client ${i + 1}`,
      clientCountry: ['United States', 'United Kingdom', 'Canada', 'Australia', 'Germany'][
        Math.floor(Math.random() * 5)
      ],
      clientVerified: Math.random() > 0.3,
      postedDate: ['Just now', '1 hour ago', '3 hours ago', 'Yesterday', '2 days ago'][
        Math.floor(Math.random() * 5)
      ],
      skills: mockSkills[titleIndex],
      jobType: Math.random() > 0.5 ? 'Fixed Price' : 'Hourly',
      experienceLevel: ['Entry Level', 'Intermediate', 'Expert'][Math.floor(Math.random() * 3)],
      duration: ['Less than 1 month', '1 to 3 months', '3 to 6 months', 'More than 6 months'][
        Math.floor(Math.random() * 4)
      ],
      url: `https://www.upwork.com/jobs/~${mockJobId}`,
    });
  }

  return jobs;
}
