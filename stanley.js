// Michael Kitas Puppeter Tutorial

// https://www.youtube.com/watch?v=WOhtW3KxGHo&list=PLuJJZ-W1NwdqgvE0D-1SMS7EpWIC5cKqu&index=2&ab_channel=MichaelKitas

// Puppeter is a library that allows you to control a headless browser (chrome) using javascript

// Headless browser - a browser that runs without a GUI

// Puppeteer is a Node library which provides a high-level API to control Chrome or Chromium over the DevTools Protocol.

// Puppeteer runs headless by default, but can be configured to run full (non-headless) Chrome or Chromium.

// Puppeteer is a Node library which provides a high-level API to control Chrome or Chromium over the DevTools Protocol.




const puppeteer = require('puppeteer-extra');
// add stealth plugin to the puppeteer and use all defaults ( all evasion techniques)
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

const productUrl = 'https://www.stanley1913.com/products/the-quencher-protour-flip-straw-tumbler-30-oz?variant=53972935770472';
const cartUrl = 'https://www.stanley1913.com/cart';

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
        // log(`Request: ${request.url()}`);
        request.continue();
    });
    
    // Log console messages from the page
    // page.on('console', msg => log(`Page Console: ${msg.text()}`));
    
    return { browser, page };
}

async function waitForSelectorAndClick(page, selector, timeout = 5000) {
    try {
        await page.waitForSelector(selector, { visible: true, timeout });
        await page.click(selector);
        return true;
    } catch (error) {
        log(`Failed to find or click selector: ${selector}`);
        return false;
    }
}

async function waitForHrefAndClick(page, hrefValue, timeout = 5000) {
    try {
        // Wait for element with specific href
        await page.waitForFunction(
            (href) => {
                const elements = document.querySelectorAll(`a[href="${href}"]`);
                return elements.length > 0;
            },
            { timeout },
            hrefValue
        );

        // Click the element
        await page.evaluate((href) => {
            const element = document.querySelector(`a[href="${href}"]`);
            if (element) element.click();
        }, hrefValue);

        return true;
    } catch (error) {
        log(`Failed to find or click href: ${hrefValue}`);
        return false;
    }
}

async function handlePopup(page) {
    try {
        // Common popup selectors
        const popupSelectors = [
            '.popup-close',           // Generic popup close button
            '.modal-close',           // Modal close button
            '.newsletter-close',      // Newsletter popup
            '.promo-close',           // Promotional popup
            '[aria-label="Close"]',   // Accessibility close button
            '.overlay-close'          // Overlay close button
        ];

        // Check for any popup and try to close it
        for (const selector of popupSelectors) {
            const popupExists = await page.$(selector);
            if (popupExists) {
                log('Found popup, attempting to close...');
                await page.click(selector);
                await delay(1000); // Wait for popup to close
                return true;
            }
        }

        // If no popup found with selectors, try clicking outside
        const body = await page.$('body');
        if (body) {
            const box = await body.boundingBox();
            if (box) {
                // Click in the top-left corner of the page
                await page.mouse.click(10, 10);
                await delay(1000);
                return true;
            }
        }

        return false;
    } catch (error) {
        log(`Error handling popup: ${error.message}`);
        return false;
    }
}

async function waitForSelectorAndFill(page, selector, value, timeout = 5000) {
    try {
        await page.waitForSelector(selector, { visible: true, timeout });
        await page.focus(selector);
        // await page.evaluate((sel) => { document.querySelector(sel).value = ''; }, selector); // Clear field
        await page.click(selector, { clickCount: 3 });
        await page.keyboard.press('Backspace');
        await page.type(selector, value, { delay: 100 });
        return true;
    } catch (error) {
        log(`Failed to find or fill selector: ${selector}`);
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

async function clickButtonByTextUsingXPath(page, text, timeout = 5000) {
    const xpath = `//button[contains(translate(normalize-space(string(.)), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), '${text.toLowerCase()}')]`;
    await page.waitForXPath(xpath, { timeout });
    const [button] = await page.$x(xpath);
    if (button) {
        await button.click();
        return true;
    } else {
        log(`Button with text "${text}" not found`);
        return false;
    }
}

async function clickButtonByTextInsensitive(page, text, timeout = 5000) {
    const buttons = await page.locator('button').all();
    for (const button of buttons) {
        const btnText = await button.innerText();
        if (btnText.trim().toLowerCase().includes(text.toLowerCase())) {
            await button.click();
            return true;
        }
    }
    console.log(`[DEBUG] Button with text "${text}" not found`);
    return false;
}

async function clickButtonByText(page, text, timeout = 5000) {
    const buttonLocator = page.locator('button', {
        hasText: text,
    });
    try {
        await buttonLocator.waitFor({ timeout });
        await buttonLocator.click();
        return true;
    } catch (err) {
        console.log(`[DEBUG] Button with text "${text}" not found`);
        return false;
    }
}


async function addToCart() {
    const { browser, page } = await givePage();
    try {
        log('Navigating to product page...');
        await page.goto(productUrl, { waitUntil: 'networkidle0' });

        // Wait for page to load
        await delay(2000);
        
        // Try to find and click Add to Cart button
        log('Waiting for Add to Cart button...');
        const addToCartSuccess = await waitForSelectorAndClick(page, '[name="add"]');
        if (!addToCartSuccess) {
            throw new Error('Failed to add item to cart');
        }

        // Wait for page to load
        await delay(2000);

        // Try to find and click cart link
        log('Looking for cart link...');
        const cartLinkSuccess = await waitForHrefAndClick(page, '/cart');
        if (!cartLinkSuccess) {
            // If href click fails, try direct navigation
            log('Cart link not found, navigating directly...');
            await page.goto(cartUrl, { waitUntil: 'networkidle0' });
        }

        // Wait for page to load
        await delay(2000);

        // Try to find and click checkout link
        log('Looking for checkout link...');
        const checkoutLinkSuccess = await waitForHrefAndClick(page, '/checkout');
        if (!checkoutLinkSuccess) {
            throw new Error('Failed to proceed to checkout');
        }

        // log('Waiting for checkout button...');
        // const checkoutSuccess = await waitForSelectorAndClick(page, '[name="checkout"]');
        // if (!checkoutSuccess) {
        //     throw new Error('Failed to proceed to checkout');
        // }

        // Wait for and click View Cart button
        // log('Waiting for View Cart button...');
        // const viewCartSuccess = await waitForSelectorAndClick(page, '[id="cart-notification-button"]');
        // if (!viewCartSuccess) {
        //     throw new Error('Failed to view cart');
        // }

        // Handle any popups before checkout
        // log('Checking for popups...');
        // await handlePopup(page);

        // Wait for and click Checkout button
        // log('Waiting for Checkout button...');
        // const checkoutSuccess = await waitForSelectorAndClick(page, '.c-btn--dark.c-btn--full.cart__checkout');
        // if (!checkoutSuccess) {
        //     throw new Error('Failed to proceed to checkout');
        // }


        return { browser, page };
    } catch (error) {
        log(`Error in addToCart: ${error.message}`);
        await browser.close();
        throw error;
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

        // set phone country to IN using waitForSelectorAndSelect
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


        // log('Clicking Continue to shipping...');
        // await clickButtonByText(page, 'Continue'); // 'Continue to shipping'

        await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 50000 });

        // Wait for page to load
        await delay(2000);

    } catch (error) {
        log(`Error in fillCheckoutForm: ${error.message}`);
        throw error;
    }
}

async function fillPaymentForm(page) {
    try {
        // Wait for page to load
        await delay(2000);

        log('Clicking Continue to success...');
        const progressSuccess = await waitForSelectorAndClick(page, '[type="submit"]');
        if (!progressSuccess) {
            throw new Error('Failed to submit form');
        }

        // log('Clicking Continue to payment...');
        // await clickButtonByText(page, 'Continue'); // 'Continue to payment'


        // Wait for page to load
        await delay(2000);

        // fill card number
        const cardNumberSuccess = await waitForSelectorAndFill(page, '#number', '4539976554584618');
        if (!cardNumberSuccess) {
            throw new Error('Failed to fill card number');
        }

        // fill card expiry
        const cardExpirySuccess = await waitForSelectorAndFill(page, '#expiry', '11/31');

        // fill card verification value
        const cardVerificationValueSuccess = await waitForSelectorAndFill(page, '#verification_value', '816');
        if (!cardVerificationValueSuccess) {
            throw new Error('Failed to fill card verification value');
        }

        // fill card name
        const cardNameSuccess = await waitForSelectorAndFill(page, '#name', 'John Doe');
        if (!cardNameSuccess) {
            throw new Error('Failed to fill card name');
        }

        // click submit
        log('Clicking submit...');
        const paySuccess = await waitForSelectorAndClick(page, '[type="submit"]');
        if (!paySuccess) {
            throw new Error('Failed to submit form');
        }


        // click pay now button
        // await clickButtonByText(page, 'Pay'); // 'Pay now'

        // Wait for page to load
        await delay(2000);
        
    } catch (error) {
        log(`Error in fillPaymentForm: ${error.message}`);
        throw error;
    }
}

async function run() {
    let browser;
    try {
        log('Starting checkout process...');
        const result = await addToCart();
        browser = result.browser;
        await fillCheckoutForm(result.page);
        log('✅ Checkout process script completed.');

        await fillPaymentForm(result.page);
        log('✅ Payment process script completed.');
    } catch (error) {
        log(`❌ Error in checkout process: ${error.message}`);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

run();
