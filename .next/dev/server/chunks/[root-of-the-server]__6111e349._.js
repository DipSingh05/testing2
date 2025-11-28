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
    "generateMockJobs",
    ()=>generateMockJobs,
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
async function getBrowser() {
    if (!browser) {
        console.log('[Scraper] Launching Puppeteer browser...');
        browser = await __TURBOPACK__imported__module__$5b$externals$5d2f$puppeteer__$5b$external$5d$__$28$puppeteer$2c$__esm_import$29$__["default"].launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--disable-gpu',
                '--window-size=1920x1080',
                '--disable-web-security',
                '--disable-features=IsolateOrigins,site-per-process'
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
async function scrapeUpworkJobs(options) {
    const { url, limit, sortBy } = options;
    const jobs = [];
    let page = null;
    try {
        const browserInstance = await getBrowser();
        page = await browserInstance.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
        await page.setViewport({
            width: 1920,
            height: 1080
        });
        await page.setExtraHTTPHeaders({
            'Accept-Language': 'en-US,en;q=0.9',
            Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8'
        });
        console.log(`[Scraper] Navigating to: ${url}`);
        let navigationSuccess = false;
        let retries = 3;
        while(retries > 0 && !navigationSuccess){
            try {
                await page.goto(url, {
                    waitUntil: 'domcontentloaded',
                    timeout: 45000
                });
                navigationSuccess = true;
            } catch (navError) {
                retries--;
                console.log(`[Scraper] Navigation attempt failed, ${retries} retries left`);
                if (retries === 0) throw navError;
                await new Promise((resolve)=>setTimeout(resolve, 2000));
            }
        }
        console.log('[Scraper] Waiting for job listings to load...');
        const possibleSelectors = [
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
                    timeout: 10000
                });
                foundSelector = selector;
                console.log(`[Scraper] Found jobs using selector: ${selector}`);
                break;
            } catch  {
            // Try next selector
            }
        }
        if (!foundSelector) {
            console.log('[Scraper] No standard job selectors found, attempting generic extraction...');
        }
        await new Promise((resolve)=>setTimeout(resolve, 3000));
        if (limit > 10) {
            console.log('[Scraper] Scrolling to load more jobs...');
            await autoScroll(page, Math.min(limit / 10, 5));
        }
        console.log('[Scraper] Extracting job data...');
        const extractedJobs = await page.evaluate(()=>{
            const jobElements = document.querySelectorAll('[data-test="JobTile"], .job-tile, article[data-ev-label="search_results_impression"], section.air3-card-section, .up-card-section');
            console.log(`Found ${jobElements.length} job elements`);
            const jobs = [];
            jobElements.forEach((element)=>{
                try {
                    const titleElement = element.querySelector('[data-test="job-title-link"]') || element.querySelector('[data-test="JobTile-link"]') || element.querySelector('h2 a, h3 a') || element.querySelector('.job-title a') || element.querySelector('a[href*="/jobs/"]');
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
            const jobId = extractJobIdFromUrl(job.rawUrl);
            const canonicalUrl = jobId ? buildCanonicalJobUrl(jobId) : job.rawUrl.startsWith('http') ? job.rawUrl : job.rawUrl ? `https://www.upwork.com${job.rawUrl}` : '';
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
                url: canonicalUrl
            });
        }
        if (sortBy === 'budget') {
            jobs.sort((a, b)=>{
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
    } finally{
        if (page) {
            await page.close().catch(()=>{});
        }
    }
}
async function autoScroll(page, maxScrolls = 5) {
    await page.evaluate(async (maxScrolls)=>{
        await new Promise((resolve)=>{
            let totalHeight = 0;
            let scrollCount = 0;
            const distance = 500;
            const timer = setInterval(()=>{
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
function generateMockJobs(count) {
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
        'TypeScript Developer for API Development'
    ];
    const mockSkills = [
        [
            'React',
            'TypeScript',
            'Node.js',
            'Redux'
        ],
        [
            'Vue.js',
            'JavaScript',
            'CSS',
            'Vuex'
        ],
        [
            'Python',
            'Django',
            'PostgreSQL',
            'REST API'
        ],
        [
            'React Native',
            'iOS',
            'Android',
            'Mobile Development'
        ],
        [
            'Node.js',
            'Express',
            'MongoDB',
            'GraphQL'
        ],
        [
            'WordPress',
            'PHP',
            'MySQL',
            'WooCommerce'
        ],
        [
            'JavaScript',
            'HTML',
            'CSS',
            'Chrome Extension'
        ],
        [
            'Python',
            'Pandas',
            'NumPy',
            'Data Analysis'
        ],
        [
            'Figma',
            'UI Design',
            'UX Research',
            'Prototyping'
        ],
        [
            'TypeScript',
            'REST API',
            'GraphQL',
            'Node.js'
        ]
    ];
    const mockDescriptions = [
        'We are looking for an experienced developer to build a scalable e-commerce platform. The ideal candidate should have expertise in modern web technologies and a strong portfolio.',
        'Join our team to develop a cutting-edge SaaS application. We need someone who can work independently and deliver high-quality code.',
        "We're building an innovative product and need a talented developer to help bring our vision to life. Remote work is welcome.",
        'Looking for a skilled professional to help with our web application development. Must have excellent communication skills.',
        'Seeking a developer to join our growing startup. This is a long-term opportunity with potential for advancement.'
    ];
    const jobs = [];
    for(let i = 0; i < count; i++){
        const titleIndex = i % mockTitles.length;
        const descIndex = i % mockDescriptions.length;
        const mockJobId = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["randomUUID"])().replace(/-/g, '').slice(0, 18);
        jobs.push({
            id: (0, __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["randomUUID"])(),
            title: mockTitles[titleIndex],
            description: mockDescriptions[descIndex],
            budget: Math.random() > 0.5 ? `$${Math.floor(Math.random() * 5000) + 500}` : undefined,
            hourlyRate: Math.random() > 0.5 ? `$${Math.floor(Math.random() * 100) + 20}` : undefined,
            clientName: `Client ${i + 1}`,
            clientCountry: [
                'United States',
                'United Kingdom',
                'Canada',
                'Australia',
                'Germany'
            ][Math.floor(Math.random() * 5)],
            clientVerified: Math.random() > 0.3,
            postedDate: [
                'Just now',
                '1 hour ago',
                '3 hours ago',
                'Yesterday',
                '2 days ago'
            ][Math.floor(Math.random() * 5)],
            skills: mockSkills[titleIndex],
            jobType: Math.random() > 0.5 ? 'Fixed Price' : 'Hourly',
            experienceLevel: [
                'Entry Level',
                'Intermediate',
                'Expert'
            ][Math.floor(Math.random() * 3)],
            duration: [
                'Less than 1 month',
                '1 to 3 months',
                '3 to 6 months',
                'More than 6 months'
            ][Math.floor(Math.random() * 4)],
            url: `https://www.upwork.com/jobs/~${mockJobId}`
        });
    }
    return jobs;
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
    "jobSchema",
    ()=>jobSchema,
    "scrapeRequestSchema",
    ()=>scrapeRequestSchema,
    "scrapeResponseSchema",
    ()=>scrapeResponseSchema
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zod/lib/index.mjs [app-route] (ecmascript)");
;
const jobSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["z"].object({
    id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["z"].string(),
    title: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["z"].string(),
    description: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["z"].string(),
    budget: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["z"].string().optional(),
    hourlyRate: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["z"].string().optional(),
    clientName: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["z"].string().optional(),
    clientCountry: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["z"].string().optional(),
    clientVerified: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["z"].boolean().default(false),
    postedDate: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["z"].string(),
    skills: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["z"].string()).default([]),
    jobType: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["z"].string().optional(),
    experienceLevel: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["z"].string().optional(),
    duration: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["z"].string().optional(),
    url: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["z"].string()
});
const scrapeRequestSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["z"].object({
    url: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["z"].string().url('Please enter a valid Upwork URL'),
    limit: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["z"].number().min(5, 'Minimum scrape limit is 5').default(10),
    sortBy: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["z"].enum([
        'date',
        'budget',
        'relevance'
    ]).default('date')
});
const scrapeResponseSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["z"].object({
    jobs: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["z"].array(jobSchema),
    totalFound: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["z"].number(),
    scrapedCount: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["z"].number(),
    status: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["z"].enum([
        'success',
        'error',
        'partial'
    ]),
    message: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["z"].string().optional()
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
        const { url, limit, sortBy } = validatedData;
        console.log(`[API] Scrape request: ${url}, limit: ${limit}, sortBy: ${sortBy}`);
        let jobs = [];
        let status = 'success';
        let message = undefined;
        try {
            jobs = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$scraper$2f$upworkScraper$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["scrapeUpworkJobs"])({
                url,
                limit,
                sortBy
            });
            if (jobs.length === 0) {
                console.log('[API] No jobs found, returning mock data');
                jobs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$scraper$2f$upworkScraper$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateMockJobs"])(limit);
                status = 'partial';
                message = 'No jobs found on the page. Showing sample data for demonstration. This could be due to Upwork blocking automated access or the search returning no results.';
            }
        } catch (scrapeError) {
            console.error('[API] Scrape error:', scrapeError.message);
            jobs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$scraper$2f$upworkScraper$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateMockJobs"])(limit);
            status = 'partial';
            message = `Scraping failed: ${scrapeError.message}. Showing sample data for demonstration.`;
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