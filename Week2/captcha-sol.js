const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const ac = require('@antiadmin/anticaptchaofficial');

ac.setAPIKey('a725f7ff819271ff5cfa6bf229dbad75'); // create own key 
puppeteer.use(StealthPlugin());

const URL = 'https://www.google.com/recaptcha/api2/demo';

async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function givePage() {
    const browser = await puppeteer.launch({ headless: false });
    let page = await browser.newPage();
    return page;
}

async function getToken() {
    const token = await ac.solveRecaptchaV2Proxyless(URL, "6Le-wvkSAAAAAPBMRTvw0Q4Muexq9bi0DJwx_mJ-");
    console.log('Token received: ' + token);
    return token;
}

async function solveCaptchaAndSubmit(page) {
    let token = await getToken();
    await page.waitForSelector("#g-recaptcha-response");
    await page.evaluate((token) => {
        document.querySelector("textarea[id='g-recaptcha-response']").value  = token; // innerHTML
    }, token);

    // 
    await delay(5000); // Give Google time to validate the token each token value from 0 to 1 - 0.7 > good - 0.3 - bad token
    await page.click("input[type='submit']");
    // await waitForSelectorAndClick(page, "input[type='submit']");
} // add retry logic 

async function run() {
    let page = await givePage();
    await page.goto(URL);
    await solveCaptchaAndSubmit(page); // first time token takes time after that it gets faster and faster .. fire this function 2 to 5 min before the captcha expires
}

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