module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/puppeteer [external] (puppeteer, esm_import)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

const mod = await __turbopack_context__.y("puppeteer");

__turbopack_context__.n(mod);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[project]/lib/scraper/upworkScraper.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "closeBrowser",
    ()=>closeBrowser,
    "scrapeUpworkJobs",
    ()=>scrapeUpworkJobs
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$puppeteer__$5b$external$5d$__$28$puppeteer$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/puppeteer [external] (puppeteer, esm_import)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/crypto [external] (crypto, cjs)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$puppeteer__$5b$external$5d$__$28$puppeteer$2c$__esm_import$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$puppeteer__$5b$external$5d$__$28$puppeteer$2c$__esm_import$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
let browser = null;
let isAuthenticated = false;
// Get random number for mouse movements
function getRndm(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
// Random delay to mimic human behavior (longer delays)
function randomDelay(min = 2000, max = 5000) {
    return new Promise((resolve)=>setTimeout(resolve, Math.random() * (max - min) + min));
}
// Generate random viewport size
function getRandomViewport() {
    const viewports = [
        {
            width: 1920,
            height: 1080
        },
        {
            width: 1366,
            height: 768
        },
        {
            width: 1536,
            height: 864
        },
        {
            width: 1440,
            height: 900
        }
    ];
    return viewports[Math.floor(Math.random() * viewports.length)];
}
// Get random user agent (updated to latest versions)
function getRandomUserAgent() {
    const userAgents = [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:132.0) Gecko/20100101 Firefox/132.0'
    ];
    return userAgents[Math.floor(Math.random() * userAgents.length)];
}
async function getBrowser() {
    if (!browser) {
        console.log('[Scraper] Launching Puppeteer browser with stealth mode...');
        browser = await __TURBOPACK__imported__module__$5b$externals$5d2f$puppeteer__$5b$external$5d$__$28$puppeteer$2c$__esm_import$29$__["default"].launch({
            headless: false,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-blink-features=AutomationControlled',
                '--disable-features=IsolateOrigins,site-per-process',
                '--window-size=1920,1080',
                '--lang=en-US,en'
            ]
        });
        console.log('[Scraper] Browser launched successfully');
    }
    return browser;
}
async function closeBrowser() {
    if (browser) {
        await browser.close();
        browser = null;
        isAuthenticated = false;
    }
}
// Login to Upwork (CRITICAL: This significantly improves scraping success)
async function loginToUpwork(page, email, password) {
    if (isAuthenticated) {
        console.log('[Scraper] Already authenticated');
        return;
    }
    if (!email || !password) {
        console.log('[Scraper] No credentials provided, skipping authentication');
        return;
    }
    try {
        console.log('[Scraper] Logging into Upwork...');
        await page.goto('https://www.upwork.com/ab/account-security/login', {
            waitUntil: 'networkidle2',
            timeout: 60000
        });
        await randomDelay(2000, 4000);
        // Enter email
        await page.waitForSelector('#login_username', {
            visible: true,
            timeout: 10000
        });
        await page.type('#login_username', email, {
            delay: getRndm(50, 150)
        });
        await randomDelay(1000, 2000);
        // Click continue with email
        await page.click('#login_password_continue');
        await randomDelay(2000, 3000);
        // Random mouse movements (human-like behavior)
        for(let i = 0; i < 5; i++){
            await page.mouse.move(getRndm(100, 1000), getRndm(100, 800));
            await randomDelay(500, 1000);
        }
        // Enter password
        await page.waitForSelector('#login_password', {
            visible: true,
            timeout: 10000
        });
        await page.type('#login_password', password, {
            delay: getRndm(50, 150)
        });
        await randomDelay(1000, 2000);
        // Click login
        await page.click('#login_control_continue');
        // More random mouse movements
        for(let i = 0; i < 5; i++){
            await page.mouse.move(getRndm(100, 1500), getRndm(100, 900));
            await randomDelay(800, 1500);
        }
        // Wait for navigation to complete
        await randomDelay(5000, 8000);
        isAuthenticated = true;
        console.log('[Scraper] Successfully authenticated');
    } catch (error) {
        console.error('[Scraper] Login failed:', error.message);
        throw new Error('Authentication required but failed');
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
async function scrapeUpworkJobs(options) {
    const { url, limit, sortBy, credentials } = options;
    const jobs = [];
    let page = null;
    try {
        const browserInstance = await getBrowser();
        page = await browserInstance.newPage();
        // Set random viewport
        const viewport = getRandomViewport();
        await page.setViewport(viewport);
        // Set random user agent
        const userAgent = getRandomUserAgent();
        await page.setUserAgent(userAgent);
        // Remove webdriver detection
        await page.evaluateOnNewDocument(()=>{
            // Remove webdriver flag
            Object.defineProperty(navigator, 'webdriver', {
                get: ()=>false
            });
            // Add chrome object
            window.chrome = {
                runtime: {}
            };
            // Mock permissions
            const originalQuery = window.navigator.permissions.query;
            window.navigator.permissions.query = (parameters)=>parameters.name === 'notifications' ? Promise.resolve({
                    state: Notification.permission
                }) : originalQuery(parameters);
            // Mock plugins
            Object.defineProperty(navigator, 'plugins', {
                get: ()=>[
                        1,
                        2,
                        3,
                        4,
                        5
                    ]
            });
            // Mock languages
            Object.defineProperty(navigator, 'languages', {
                get: ()=>[
                        'en-US',
                        'en'
                    ]
            });
            // Mock platform
            Object.defineProperty(navigator, 'platform', {
                get: ()=>'Win32'
            });
        });
        // Set realistic headers
        await page.setExtraHTTPHeaders({
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
            'Accept-Encoding': 'gzip, deflate, br',
            'sec-ch-ua': '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
            'sec-fetch-dest': 'document',
            'sec-fetch-mode': 'navigate',
            'sec-fetch-site': 'none',
            'sec-fetch-user': '?1',
            'upgrade-insecure-requests': '1'
        });
        // CRITICAL: Login to Upwork first (improves success rate significantly)
        if (credentials?.email && credentials?.password) {
            await loginToUpwork(page, credentials.email, credentials.password);
        } else {
            console.log('[Scraper] WARNING: No credentials provided. Scraping without authentication may have limited success.');
        }
        console.log(`[Scraper] Navigating to: ${url}`);
        // Add random delay before navigation (rate limiting)
        await randomDelay(3000, 6000);
        let navigationSuccess = false;
        let retries = 3;
        while(retries > 0 && !navigationSuccess){
            try {
                await page.goto(url, {
                    waitUntil: 'networkidle2',
                    timeout: 60000
                });
                navigationSuccess = true;
            } catch (navError) {
                retries--;
                console.log(`[Scraper] Navigation attempt failed, ${retries} retries left`);
                if (retries === 0) throw navError;
                await randomDelay(5000, 10000); // Longer delay between retries
            }
        }
        // Longer wait for page to fully load
        await randomDelay(4000, 7000);
        // Simulate human mouse movements
        for(let i = 0; i < 8; i++){
            await page.mouse.move(getRndm(100, 1500), getRndm(100, 900));
            await randomDelay(300, 800);
        }
        console.log('[Scraper] Waiting for job listings to load...');
        const possibleSelectors = [
            'section[data-test="JobTile"]',
            '[data-test="JobTile"]',
            '.job-tile',
            'article[data-ev-label]',
            'section.air3-card-section',
            '[data-test="job-tile-list"]',
            '.up-card-section'
        ];
        let foundSelector = null;
        for (const selector of possibleSelectors){
            try {
                await page.waitForSelector(selector, {
                    timeout: 15000
                });
                foundSelector = selector;
                console.log(`[Scraper] Found jobs using selector: ${selector}`);
                break;
            } catch  {
            // Try next selector
            }
        }
        if (!foundSelector) {
            console.log('[Scraper] No job selectors found - possible blocking or empty results');
            // Take screenshot for debugging
            await page.screenshot({
                path: 'debug-screenshot.png'
            });
            throw new Error('Could not find job listings. Possible bot detection or no results.');
        }
        // Random delay before scrolling
        await randomDelay(2000, 4000);
        // Scroll to load more jobs (if needed) - smaller batches
        if (limit > 10) {
            console.log('[Scraper] Scrolling to load more jobs...');
            const scrolls = Math.min(Math.ceil(limit / 10), 3); // Max 3 scrolls (smaller batches)
            await humanLikeScroll(page, scrolls);
        }
        // Another delay before extraction
        await randomDelay(3000, 5000);
        console.log('[Scraper] Extracting job data...');
        const extractedJobs = await page.evaluate(()=>{
            const jobElements = document.querySelectorAll('section[data-test="JobTile"], [data-test="JobTile"], .job-tile, article[data-ev-label="search_results_impression"], section.air3-card-section, .up-card-section');
            console.log(`Found ${jobElements.length} job elements`);
            const jobs = [];
            jobElements.forEach((element)=>{
                try {
                    const titleElement = element.querySelector('[data-test="job-title-link"]') || element.querySelector('[data-test="JobTile-link"]') || element.querySelector('h2 a, h3 a, h4 a') || element.querySelector('.job-tile-title a') || element.querySelector('.job-title a') || element.querySelector('a[href*="/jobs/"]');
                    const title = titleElement?.textContent?.trim() || '';
                    const jobUrl = titleElement?.getAttribute('href') || '';
                    if (!title) return;
                    const descriptionElement = element.querySelector('[data-test="JobDescription"]') || element.querySelector('[data-test="job-description-text"]') || element.querySelector('.job-description') || element.querySelector('.air3-truncation') || element.querySelector('[data-test="UpCLineClamp"]') || element.querySelector('p');
                    const description = descriptionElement?.textContent?.trim() || '';
                    const budgetElement = element.querySelector('[data-test="budget"]') || element.querySelector('[data-test="is-fixed-price"]') || element.querySelector('.job-budget') || element.querySelector('[data-test="JobBudget"]') || element.querySelector('[data-qa="job-budget"]');
                    const budget = budgetElement?.textContent?.trim() || '';
                    const hourlyRateElement = element.querySelector('[data-test="hourly-rate"]') || element.querySelector('[data-qa="hourly-rate"]') || element.querySelector('.job-hourly-rate');
                    const hourlyRate = hourlyRateElement?.textContent?.trim() || '';
                    const postedElement = element.querySelector('[data-test="posted-on"]') || element.querySelector('[data-test="job-pubdate"]') || element.querySelector('.job-posted-date') || element.querySelector('time') || element.querySelector('[data-qa="job-posted-on"]') || element.querySelector('small');
                    const postedDate = postedElement?.textContent?.trim() || 'Recently';
                    const skillElements = element.querySelectorAll('[data-test="Skill"], [data-test="token"] span, .air3-token, .skill-badge, .up-skill-badge');
                    const skills = [];
                    skillElements.forEach((skill)=>{
                        const text = skill.textContent?.trim();
                        if (text && text.length < 50 && text.length > 1) {
                            skills.push(text);
                        }
                    });
                    const clientElement = element.querySelector('[data-test="client-company-name"]') || element.querySelector('.client-name') || element.querySelector('[data-qa="client-company-name"]');
                    const clientName = clientElement?.textContent?.trim() || '';
                    const locationElement = element.querySelector('[data-test="client-location"]') || element.querySelector('[data-qa="client-location"]') || element.querySelector('.client-location');
                    const clientCountry = locationElement?.textContent?.trim() || '';
                    const verifiedElement = element.querySelector('[data-test="payment-verified"], .payment-verified, [data-qa="payment-verified"]');
                    const clientVerified = !!verifiedElement;
                    const expElement = element.querySelector('[data-test="experience-level"]') || element.querySelector('[data-qa="experience-level"]') || element.querySelector('.experience-level');
                    const experienceLevel = expElement?.textContent?.trim() || '';
                    const typeElement = element.querySelector('[data-test="job-type"]') || element.querySelector('[data-qa="job-type"]');
                    const jobType = typeElement?.textContent?.trim() || '';
                    const durationElement = element.querySelector('[data-test="duration"]') || element.querySelector('[data-qa="duration"]');
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
                        rawUrl: jobUrl
                    });
                } catch (err) {
                // Skip problematic elements
                }
            });
            return jobs;
        });
        console.log(`[Scraper] Extracted ${extractedJobs.length} jobs from page`);
        const limitedJobs = limit === 0 ? extractedJobs : extractedJobs.slice(0, limit);
        for (const job of limitedJobs){
            const fullUrl = buildFullJobUrl(job.rawUrl);
            jobs.push({
                id: (0, __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["randomUUID"])(),
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
                url: fullUrl
            });
        }
        if (sortBy === 'budget') {
            jobs.sort((a, b)=>{
                const budgetA = parseFloat((a.budget || '0').replace(/[^0-9.]/g, '')) || 0;
                const budgetB = parseFloat((b.budget || '0').replace(/[^0-9.]/g, '')) || 0;
                return budgetB - budgetA;
            });
        } else if (sortBy === 'date') {
            const dateOrder = {
                'Just now': 0,
                '1 minute ago': 1,
                '5 minutes ago': 2,
                '10 minutes ago': 3,
                '1 hour ago': 4,
                '2 hours ago': 5,
                '3 hours ago': 6,
                'Today': 7,
                'Yesterday': 8,
                '2 days ago': 9,
                '3 days ago': 10,
                'Recently': 11
            };
            jobs.sort((a, b)=>{
                const orderA = dateOrder[a.postedDate] ?? 99;
                const orderB = dateOrder[b.postedDate] ?? 99;
                return orderA - orderB;
            });
        }
        console.log(`[Scraper] Successfully processed ${jobs.length} jobs`);
        return jobs;
    } catch (error) {
        console.error('[Scraper] Error scraping jobs:', error);
        throw error;
    } finally{
        if (page) {
            await page.close().catch(()=>{});
        }
    }
}
// Human-like scrolling with random delays
async function humanLikeScroll(page, maxScrolls = 3) {
    await page.evaluate(async (maxScrolls)=>{
        await new Promise((resolve)=>{
            let scrollCount = 0;
            const distance = 300; // Smaller scrolls
            const timer = setInterval(()=>{
                window.scrollBy(0, distance);
                scrollCount++;
                if (scrollCount >= maxScrolls * 3) {
                    clearInterval(timer);
                    resolve();
                }
            }, Math.random() * 1000 + 1000); // 1-2 second delays
        });
    }, maxScrolls);
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/lib/storage.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "addJobs",
    ()=>addJobs,
    "clearJobs",
    ()=>clearJobs,
    "getJobById",
    ()=>getJobById,
    "getJobs",
    ()=>getJobs,
    "setJobs",
    ()=>setJobs
]);
let jobs = [];
function getJobs() {
    return jobs;
}
function getJobById(id) {
    return jobs.find((job)=>job.id === id);
}
function setJobs(newJobs) {
    jobs = newJobs;
}
function addJobs(newJobs) {
    jobs = [
        ...jobs,
        ...newJobs
    ];
}
function clearJobs() {
    jobs = [];
}
}),
"[project]/lib/schema.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "errorResponseSchema",
    ()=>errorResponseSchema,
    "jobSchema",
    ()=>jobSchema,
    "scrapeRequestSchema",
    ()=>scrapeRequestSchema,
    "scrapeResponseSchema",
    ()=>scrapeResponseSchema
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v3/external.js [app-route] (ecmascript) <export * as z>");
;
const scrapeRequestSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    url: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().url('Invalid URL format'),
    limit: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().int().min(0).max(100).default(10),
    sortBy: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        'recent',
        'budget',
        'date'
    ]).default('recent'),
    useMockData: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().optional().default(false),
    credentials: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        email: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().email().optional(),
        password: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional()
    }).optional()
});
const jobSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    title: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    description: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    budget: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    hourlyRate: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    clientName: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    clientCountry: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    clientVerified: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean(),
    postedDate: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    skills: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()),
    jobType: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    experienceLevel: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    duration: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    url: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()
});
const scrapeResponseSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    success: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean(),
    jobs: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(jobSchema),
    count: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number(),
    message: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional()
});
const errorResponseSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    success: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean(),
    error: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    details: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].any().optional()
});
}),
"[project]/app/api/scrape/route.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$scraper$2f$upworkScraper$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/scraper/upworkScraper.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$storage$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/storage.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/schema.js [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$scraper$2f$upworkScraper$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$scraper$2f$upworkScraper$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
async function POST(request) {
    try {
        const body = await request.json();
        const validatedData = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["scrapeRequestSchema"].parse(body);
        const { url, limit, sortBy, credentials } = validatedData;
        console.log(`[API] Scrape request: ${url}, limit: ${limit}, sortBy: ${sortBy}`);
        let jobs = [];
        let status = 'success';
        let message = undefined;
        try {
            // Pass credentials to scraper if provided
            jobs = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$scraper$2f$upworkScraper$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["scrapeUpworkJobs"])({
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
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: message,
                jobs: [],
                totalFound: 0,
                scrapedCount: 0,
                status
            }, {
                status: 500
            });
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$storage$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["setJobs"])(jobs);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            jobs,
            totalFound: jobs.length,
            scrapedCount: jobs.length,
            status,
            message
        });
    } catch (error) {
        console.error('[API] Error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: error.message || 'Failed to scrape jobs'
        }, {
            status: 400
        });
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__6111e349._.js.map