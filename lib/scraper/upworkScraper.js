import puppeteer from 'puppeteer';
import { randomUUID } from 'crypto';

let browser = null;
let isAuthenticated = false;

// Get random number for mouse movements
function getRndm(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Random delay to mimic human behavior
function randomDelay(min = 2000, max = 5000) {
  return new Promise(resolve => setTimeout(resolve, Math.random() * (max - min) + min));
}

// Generate random viewport size
function getRandomViewport() {
  const viewports = [
    { width: 1920, height: 1080 },
    { width: 1366, height: 768 },
    { width: 1536, height: 864 },
    { width: 1440, height: 900 },
  ];
  return viewports[Math.floor(Math.random() * viewports.length)];
}

// Get random user agent
function getRandomUserAgent() {
  const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  ];
  return userAgents[Math.floor(Math.random() * userAgents.length)];
}

async function getBrowser() {
  if (!browser) {
    console.log('[Scraper] Launching Puppeteer browser...');
    browser = await puppeteer.launch({
      headless: false, // CRITICAL: Must be false for Cloudflare
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-blink-features=AutomationControlled',
        '--disable-features=IsolateOrigins,site-per-process',
        '--window-size=1920,1080',
        '--lang=en-US,en',
        '--disable-web-security',
      ],
      ignoreDefaultArgs: ['--enable-automation'],
      ignoreHTTPSErrors: true,
    });
    
    console.log('[Scraper] Browser launched successfully');
  }
  return browser;
}

export async function closeBrowser() {
  if (browser) {
    await browser.close();
    browser = null;
    isAuthenticated = false;
  }
}

// Wait for Cloudflare challenge to complete
async function waitForCloudflare(page) {
  console.log('[Scraper] Checking for Cloudflare challenge...');
  
  try {
    // Check if Cloudflare challenge page is present
    const isCloudflare = await page.evaluate(() => {
      return document.body.innerText.includes('Checking your browser') ||
             document.body.innerText.includes('Just a moment') ||
             document.title.includes('Just a moment') ||
             !!document.querySelector('#challenge-running') ||
             !!document.querySelector('.ray-id') ||
             !!document.querySelector('iframe[src*="challenges.cloudflare.com"]');
    });

    if (isCloudflare) {
      console.log('[Scraper] Cloudflare challenge detected! Waiting up to 30 seconds...');
      
      // Wait for the challenge to complete (max 30 seconds)
      let attempts = 0;
      const maxAttempts = 60; // 30 seconds with 500ms checks
      
      while (attempts < maxAttempts) {
        await randomDelay(500, 500);
        
        const challengeComplete = await page.evaluate(() => {
          // Check if challenge is no longer present
          const hasChallenge = document.body.innerText.includes('Checking your browser') ||
                              document.body.innerText.includes('Just a moment') ||
                              !!document.querySelector('#challenge-running');
          return !hasChallenge;
        });
        
        if (challengeComplete) {
          console.log('[Scraper] Cloudflare challenge completed successfully!');
          await randomDelay(2000, 4000); // Extra wait after completion
          return true;
        }
        
        attempts++;
      }
      
      console.log('[Scraper] Cloudflare challenge timeout - proceeding anyway');
    } else {
      console.log('[Scraper] No Cloudflare challenge detected');
    }
    
    return true;
  } catch (error) {
    console.log('[Scraper] Error checking for Cloudflare:', error.message);
    return false;
  }
}

// Login to Upwork
async function loginToUpwork(page, email, password) {
  if (isAuthenticated) {
    console.log('[Scraper] Already authenticated');
    return;
  }

  if (!email || !password) {
    console.log('[Scraper] WARNING: No credentials provided. This will likely fail!');
    return;
  }

  try {
    console.log('[Scraper] Logging into Upwork...');
    
    await page.goto('https://www.upwork.com/ab/account-security/login', {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    });

    // Wait for Cloudflare on login page
    await waitForCloudflare(page);
    await randomDelay(3000, 5000);

    // Enter email
    await page.waitForSelector('#login_username', { visible: true, timeout: 20000 });
    
    await page.click('#login_username');
    await randomDelay(500, 1000);
    
    // Type email character by character (human-like)
    for (const char of email) {
      await page.keyboard.type(char);
      await randomDelay(50, 150);
    }
    
    await randomDelay(1000, 2000);

    // Click continue
    await page.click('#login_password_continue');
    await randomDelay(3000, 5000);

    // Random mouse movements
    for (let i = 0; i < 5; i++) {
      await page.mouse.move(getRndm(100, 1000), getRndm(100, 800));
      await randomDelay(500, 1000);
    }

    // Enter password
    await page.waitForSelector('#login_password', { visible: true, timeout: 20000 });
    
    await page.click('#login_password');
    await randomDelay(500, 1000);
    
    // Type password character by character
    for (const char of password) {
      await page.keyboard.type(char);
      await randomDelay(50, 150);
    }
    
    await randomDelay(1000, 2000);

    // Click login
    await page.click('#login_control_continue');

    // More random mouse movements
    for (let i = 0; i < 5; i++) {
      await page.mouse.move(getRndm(100, 1500), getRndm(100, 900));
      await randomDelay(800, 1500);
    }

    // Wait for navigation
    await randomDelay(10000, 15000);

    isAuthenticated = true;
    console.log('[Scraper] Successfully authenticated!');
  } catch (error) {
    console.error('[Scraper] Login failed:', error.message);
    throw new Error('Authentication failed: ' + error.message);
  }
}

function buildFullJobUrl(rawUrl) {
  if (!rawUrl) return '';
  
  if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://')) {
    return rawUrl;
  }
  
  if (rawUrl.startsWith('/')) {
    return `https://www.upwork.com${rawUrl}`;
  }
  
  return `https://www.upwork.com/${rawUrl}`;
}

export async function scrapeUpworkJobs(options) {
  const { url, limit, sortBy, credentials } = options;
  const jobs = [];
  let page = null;

  try {
    const browserInstance = await getBrowser();
    page = await browserInstance.newPage();

    // Enhanced anti-detection
    await page.evaluateOnNewDocument(() => {
      // Overwrite the `navigator.webdriver` property
      Object.defineProperty(navigator, 'webdriver', {
        get: () => false,
      });

      // Overwrite the `plugins` property to use a custom getter
      Object.defineProperty(navigator, 'plugins', {
        get: () => [1, 2, 3, 4, 5],
      });

      // Overwrite the `languages` property
      Object.defineProperty(navigator, 'languages', {
        get: () => ['en-US', 'en'],
      });

      // Add chrome object
      window.chrome = {
        runtime: {},
      };

      // Mock permissions
      const originalQuery = window.navigator.permissions.query;
      window.navigator.permissions.query = (parameters) => (
        parameters.name === 'notifications'
          ? Promise.resolve({ state: Notification.permission })
          : originalQuery(parameters)
      );
    });

    // Set random viewport
    const viewport = getRandomViewport();
    await page.setViewport(viewport);

    // Set random user agent
    const userAgent = getRandomUserAgent();
    await page.setUserAgent(userAgent);

    console.log(`[Scraper] Using viewport: ${viewport.width}x${viewport.height}`);

    // Set realistic headers
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'none',
      'Sec-Fetch-User': '?1',
    });

    // CRITICAL: Login first
    if (credentials?.email && credentials?.password) {
      await loginToUpwork(page, credentials.email, credentials.password);
    } else {
      console.log('[Scraper] ⚠️ WARNING: No credentials! Scraping will likely fail!');
    }

    console.log(`[Scraper] Navigating to: ${url}`);

    // Rate limiting delay
    await randomDelay(3000, 6000);

    let navigationSuccess = false;
    let retries = 3;

    while (retries > 0 && !navigationSuccess) {
      try {
        await page.goto(url, {
          waitUntil: 'domcontentloaded',
          timeout: 60000,
        });
        
        // CRITICAL: Wait for Cloudflare
        const cloudflareSuccess = await waitForCloudflare(page);
        
        if (!cloudflareSuccess) {
          console.log('[Scraper] Cloudflare check did not complete successfully');
        }
        
        navigationSuccess = true;
      } catch (navError) {
        retries--;
        console.log(`[Scraper] Navigation failed, ${retries} retries left:`, navError.message);
        if (retries === 0) {
          await page.screenshot({ path: 'error-navigation.png', fullPage: true });
          throw navError;
        }
        await randomDelay(8000, 12000);
      }
    }

    // Long wait for full page load
    await randomDelay(5000, 8000);

    // Human-like mouse movements
    for (let i = 0; i < 10; i++) {
      await page.mouse.move(getRndm(100, 1500), getRndm(100, 900));
      await randomDelay(300, 800);
    }

    console.log('[Scraper] Waiting for job listings...');

    const possibleSelectors = [
      'section[data-test="JobTile"]',
      '[data-test="JobTile"]',
      'div[data-test="main-tabs-index"]',
      '.job-tile',
      'article[data-ev-label]',
      'section.air3-card-section',
    ];

    let foundSelector = null;
    for (const selector of possibleSelectors) {
      try {
        await page.waitForSelector(selector, { timeout: 20000 });
        foundSelector = selector;
        console.log(`[Scraper] ✓ Found jobs using: ${selector}`);
        break;
      } catch {
        console.log(`[Scraper] ✗ Not found: ${selector}`);
      }
    }

    if (!foundSelector) {
      console.log('[Scraper] ❌ No job selectors found!');
      await page.screenshot({ path: 'error-no-jobs.png', fullPage: true });
      
      const pageContent = await page.content();
      if (pageContent.includes('cloudflare') || pageContent.includes('challenge')) {
        throw new Error('Still blocked by Cloudflare. Try again or check credentials.');
      }
      
      throw new Error('Could not find job listings.');
    }

    await randomDelay(2000, 4000);

    if (limit > 10) {
      console.log('[Scraper] Scrolling...');
      const scrolls = Math.min(Math.ceil(limit / 10), 3);
      await humanLikeScroll(page, scrolls);
    }

    await randomDelay(3000, 5000);

    console.log('[Scraper] Extracting job data...');
    const extractedJobs = await page.evaluate(() => {
      const jobElements = document.querySelectorAll(
        'section[data-test="JobTile"], [data-test="JobTile"], .job-tile, article[data-ev-label], section.air3-card-section'
      );

      const jobs = [];

      jobElements.forEach((element) => {
        try {
          const titleElement =
            element.querySelector('[data-test="job-title-link"]') ||
            element.querySelector('[data-test="JobTile-link"]') ||
            element.querySelector('h2 a, h3 a, h4 a') ||
            element.querySelector('.job-tile-title a') ||
            element.querySelector('a[href*="/jobs/"]');

          const title = titleElement?.textContent?.trim() || '';
          const jobUrl = titleElement?.getAttribute('href') || '';

          if (!title) return;

          const descriptionElement =
            element.querySelector('[data-test="JobDescription"]') ||
            element.querySelector('[data-test="job-description-text"]') ||
            element.querySelector('.air3-truncation') ||
            element.querySelector('[data-test="UpCLineClamp"]') ||
            element.querySelector('p');

          const description = descriptionElement?.textContent?.trim() || '';

          const budgetElement =
            element.querySelector('[data-test="budget"]') ||
            element.querySelector('[data-test="is-fixed-price"]') ||
            element.querySelector('[data-test="JobBudget"]');

          const budget = budgetElement?.textContent?.trim() || '';

          const hourlyRateElement =
            element.querySelector('[data-test="hourly-rate"]');

          const hourlyRate = hourlyRateElement?.textContent?.trim() || '';

          const postedElement =
            element.querySelector('[data-test="posted-on"]') ||
            element.querySelector('[data-test="job-pubdate"]') ||
            element.querySelector('time');

          const postedDate = postedElement?.textContent?.trim() || 'Recently';

          const skillElements = element.querySelectorAll('[data-test="Skill"], [data-test="token"] span');
          const skills = [];
          skillElements.forEach((skill) => {
            const text = skill.textContent?.trim();
            if (text && text.length < 50 && text.length > 1) {
              skills.push(text);
            }
          });

          const clientElement = element.querySelector('[data-test="client-company-name"]');
          const clientName = clientElement?.textContent?.trim() || '';

          const locationElement = element.querySelector('[data-test="client-location"]');
          const clientCountry = locationElement?.textContent?.trim() || '';

          const verifiedElement = element.querySelector('[data-test="payment-verified"]');
          const clientVerified = !!verifiedElement;

          const expElement = element.querySelector('[data-test="experience-level"]');
          const experienceLevel = expElement?.textContent?.trim() || '';

          const typeElement = element.querySelector('[data-test="job-type"]');
          const jobType = typeElement?.textContent?.trim() || '';

          const durationElement = element.querySelector('[data-test="duration"]');
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
          // Skip
        }
      });

      return jobs;
    });

    console.log(`[Scraper] Extracted ${extractedJobs.length} jobs`);

    const limitedJobs = limit === 0 ? extractedJobs : extractedJobs.slice(0, limit);

    for (const job of limitedJobs) {
      const fullUrl = buildFullJobUrl(job.rawUrl);

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
        url: fullUrl,
      });
    }

    if (sortBy === 'budget') {
      jobs.sort((a, b) => {
        const budgetA = parseFloat((a.budget || '0').replace(/[^0-9.]/g, '')) || 0;
        const budgetB = parseFloat((b.budget || '0').replace(/[^0-9.]/g, '')) || 0;
        return budgetB - budgetA;
      });
    } else if (sortBy === 'date') {
      const dateOrder = {
        'Just now': 0, '1 minute ago': 1, '5 minutes ago': 2,
        '10 minutes ago': 3, '1 hour ago': 4, '2 hours ago': 5,
        '3 hours ago': 6, 'Today': 7, 'Yesterday': 8,
        '2 days ago': 9, '3 days ago': 10, 'Recently': 11,
      };
      
      jobs.sort((a, b) => {
        const orderA = dateOrder[a.postedDate] ?? 99;
        const orderB = dateOrder[b.postedDate] ?? 99;
        return orderA - orderB;
      });
    }

    console.log(`[Scraper] ✓ Successfully processed ${jobs.length} jobs`);
    return jobs;
  } catch (error) {
    console.error('[Scraper] ❌ Error:', error);
    throw error;
  } finally {
    if (page) {
      await page.close().catch(() => {});
    }
  }
}

async function humanLikeScroll(page, maxScrolls = 3) {
  for (let i = 0; i < maxScrolls; i++) {
    await page.evaluate(() => {
      window.scrollBy(0, 300 + Math.random() * 200);
    });
    await randomDelay(1000, 2000);
  }
}