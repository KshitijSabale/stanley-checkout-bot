const puppeteer = require('puppeteer-extra');
// add stealth plugin to the puppeteer and use all defaults ( all evasion techniques)
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

const anticaptcha = require('@antiadmin/anticaptchaofficial');

const pageUrl = 'https://www.google.com/recaptcha/api2/demo';

// Your anticaptcha API key
const ANTICAPTCHA_KEY = 'a725f7ff819271ff5cfa6bf229dbad75';

// Enable verbose logging
const DEBUG = true;

async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function log(message) {
    if (DEBUG) {
        console.log(`[DEBUG] ${message}`);
    }
}

async function solveCaptcha(page) {
    try {
        // Get the site key from the page
        const siteKey = await page.evaluate(() => {
            return document.querySelector('.g-recaptcha').getAttribute('data-sitekey');
        });

        log(`Found site key: ${siteKey}`);

        // Set the API key
        anticaptcha.setAPIKey(ANTICAPTCHA_KEY);

        // Create task
        const task = {
            type: 'NoCaptchaTaskProxyless',
            websiteURL: page.url(),
            websiteKey: siteKey
        };

        log('Solving captcha...');
        const result = await anticaptcha.createTask(task);
        const taskId = result.taskId;
        
        // Wait for the task to be solved
        const solution = await anticaptcha.getTaskResult(taskId);
        log(`Captcha solved! Token: ${solution.token}`);

        // Execute the callback function with the token
        await page.evaluate((token) => {
            document.getElementById('g-recaptcha-response').innerHTML = token;
            // Call the callback function
            window.___grecaptcha_cfg.clients[0].aa.l.callback(token);
        }, solution.token);

        return true;
    } catch (error) {
        log(`Error solving captcha: ${error.message}`);
        return false;
    }
}

async function givePage() {
    log('Launching browser...');
    const browser = await puppeteer.launch({ 
        headless: false,
        defaultViewport: null,
        args: ['--start-maximized'],
    });
    const page = await browser.newPage();
    
    // Enable request interception for debugging
    await page.setRequestInterception(true);
    page.on('request', request => {
        request.continue();
    });
    
    return { browser, page };
}

async function fillCaptchaForm() {
    const { browser, page } = await givePage();
    
    try {
        log('Navigating to page...');
        await page.goto(pageUrl);
        
        // Wait for the captcha to load
        await page.waitForSelector('.g-recaptcha');
        
        // Solve the captcha
        const captchaSolved = await solveCaptcha(page);
        if (!captchaSolved) {
            throw new Error('Failed to solve captcha');
        }

        // Wait a bit for the captcha to be processed
        await delay(2000);

        // Click the submit button
        await waitForSelectorAndClick(page, "#recaptcha-demo-submit");
        
        // Wait for the result
        await page.waitForSelector('.recaptcha-success');
        
        log('Captcha form submitted successfully!');
        return { browser, page };
    } catch (error) {
        log(`Error in fillCaptchaForm: ${error.message}`);
        throw error;
    }
}


async function run() {
    let browser;
    try {
        log('Starting captcha solving process...');
        const result = await fillCaptchaForm();
        browser = result.browser;
        log('✅ Captcha solving process completed.');
    } catch (error) {
        log(`❌ Error in captcha solving process: ${error.message}`);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

// Run the script
run();




async function waitForSelectorAndClick(page, selector, timeout = 5000) {
    try {
        await page.waitForSelector(selector, { visible: true, timeout });
        await page.evaluate((sel) => {
            document.querySelector(sel).click();
        }, selector);
        return true;
    } catch (error) {
        log(`Failed to find or click selector: ${selector}`);
        return false;
    }
}

async function waitForSelectorAndFill(page, selector, value, timeout = 5000) {
    try {
        await page.waitForSelector(selector, { visible: true, timeout });
        // await page.focus(selector);
        // await page.evaluate((sel) => { document.querySelector(sel).value = ''; }, selector); // Clear field
        // await page.click(selector, { clickCount: 3 });
        // await page.keyboard.press('Backspace');
        await page.type(selector, value, { delay: 100 });
        return true;
    } catch (error) {
        log(`Failed to find or fill selector: ${selector}`);
        return false;
    }
}

/*

TODO: go to that page 
click on the captcha button




*/