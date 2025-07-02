const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

const checkoutUrl = 'https://www.stanley1913.com/checkouts/cn/Z2NwLWFzaWEtc291dGhlYXN0MTowMUpZMVo0MDRQUzdaUzJDOTMxRVRZN0NaQg';
const paymentUrl = 'https://www.stanley1913.com/checkouts/cn/Z2NwLWFzaWEtc291dGhlYXN0MTowMUpZMVo0MDRQUzdaUzJDOTMxRVRZN0NaQg/payment';

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

async function waitForSelectorAndFill(page, selector, value, timeout = 5000) {
    try {
        await page.waitForSelector(selector, { visible: true, timeout });
        await page.focus(selector);
        await page.type(selector, value, { delay: 100 });
        return true;
    } catch (error) {
        log(`Failed to find or fill selector: ${selector}`);
        return false;
    }
}

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

async function waitForSelectorAndSelect(page, selector, value, timeout = 5000) {
    try {
        await page.waitForSelector(selector, { visible: true, timeout });
        await page.select(selector, value);
        return true;
    } catch (error) {
        log(`Failed to find or select value for selector: ${selector}`);
        return false;
    }
}

async function fillCheckoutForm(page) {
    try {
        // Wait for page to load
        await delay(2000);
        
        // Wait for and fill email
        log('Waiting for checkout form...');
        await page.waitForSelector('#email', { visible: true });
        
        // Fill all form fields using waitForSelectorAndFill
        const formData = {
            '#email': 'kshitijsabale@gmail.com',
            '[name="firstName"]': 'Kshitij',
            '[name="lastName"]': 'Sabale',
            '#shipping-address1': '123 Main St',
            '[name="city"]': 'New York',
            '[name="zone"]': 'New York',
            '[name="postalCode"]': '10001',
            '[name="phone"]': '9876323244',
        };

        for (const [selector, value] of Object.entries(formData)) {
            await delay(1000);
            const filled = await waitForSelectorAndFill(page, selector, value);
            if (filled) {
                log(`Filled ${selector} with ${value}`);
            } else {
                log(`Failed to fill ${selector}`);
                throw new Error(`Failed to fill ${selector}`);
            }
        }

        await delay(2000);

        // Set phone country to IN
        const countrySelected = await waitForSelectorAndSelect(page, 'select[name="phone_country_select"]', 'IN');
        if (!countrySelected) {
            throw new Error('Failed to select phone country');
        }

        // Wait before submit
        await delay(1000);

        // Submit form
        log('Clicking submit...');
        const submitSuccess = await waitForSelectorAndClick(page, '[type="submit"]');
        if (!submitSuccess) {
            throw new Error('Failed to submit form');
        }

        await page.waitForNavigation({ timeout: 50000 });

        // Wait for page to load
        await delay(2000);

        log('✅ Checkout form filled successfully');

    } catch (error) {
        log(`Error in fillCheckoutForm: ${error.message}`);
        throw error;
    }
}

async function fillPaymentForm(page) {
    try {
        // Wait for page to load
        await delay(2000);

        // Fill card number
        const cardNumberSuccess = await waitForSelectorAndFill(page, '#number', '4539976554584618');
        if (!cardNumberSuccess) {
            throw new Error('Failed to fill card number');
        }

        // Fill card expiry
        const cardExpirySuccess = await waitForSelectorAndFill(page, '#expiry', '11/31');
        if (!cardExpirySuccess) {
            throw new Error('Failed to fill card expiry');
        }

        // Fill card verification value
        const cardVerificationValueSuccess = await waitForSelectorAndFill(page, '#verification_value', '816');
        if (!cardVerificationValueSuccess) {
            throw new Error('Failed to fill card verification value');
        }

        // Click submit
        log('Clicking submit...');
        const paySuccess = await waitForSelectorAndClick(page, '[type="submit"]');
        if (!paySuccess) {
            throw new Error('Failed to submit form');
        }

        // Wait for page to load
        await delay(2000);
        
        log('✅ Payment form filled successfully');
        
    } catch (error) {
        log(`❌ Error in payment process: ${error.message}`);
        throw error;
    }
}

async function run() {
    const { browser, page } = await givePage();
    try {
        // First fill checkout form
        log('Navigating to checkout page...');
        await page.goto(checkoutUrl);
        await fillCheckoutForm(page);

        // Then fill payment form
        log('Navigating to payment page...');
        await page.goto(paymentUrl);
        await fillPaymentForm(page);

        // Keep browser open for 100 seconds to see the result
        await delay(100000);
        
    } catch (error) {
        log(`❌ Error in process: ${error.message}`);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

// Run the complete process
run();
