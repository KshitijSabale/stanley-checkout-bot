import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
puppeteer.use(StealthPlugin());

const productUrl = 'https://www.stanley1913.com/products/the-quencher-protour-flip-straw-tumbler-30-oz?variant=53972783366504';


async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function give_page() {
    log('Launching browser...');
    const browser = await puppeteer.launch({ 
        headless: false,
        defaultViewport: null,
        args: ['--start-maximized'],
    });
    const page = await browser.newPage();


    return { browser, page };
}

async function add_to_cart(page) {
    let response = await page.evaluate(async () => {
        let response = await fetch("https://www.stanley1913.com/cart/add", {
            "headers": {
              "accept": "application/javascript",
              "accept-language": "en-GB,en-US;q=0.9,en;q=0.8,hi;q=0.7",
              "content-type": "multipart/form-data; boundary=----WebKitFormBoundaryC9R6UHRGRat6IP8U",
              "priority": "u=1, i",
              "sec-ch-ua": "\"Google Chrome\";v=\"137\", \"Chromium\";v=\"137\", \"Not/A)Brand\";v=\"24\"",
              "sec-ch-ua-mobile": "?0",
              "sec-ch-ua-platform": "\"macOS\"",
              "sec-fetch-dest": "empty",
              "sec-fetch-mode": "cors",
              "sec-fetch-site": "same-origin",
              "x-requested-with": "XMLHttpRequest",
              "Referer": "https://www.stanley1913.com/products/the-quencher-protour-flip-straw-tumbler-30-oz?variant=53972783366504",
              "Referrer-Policy": "strict-origin-when-cross-origin"
            },
            "body": "------WebKitFormBoundaryC9R6UHRGRat6IP8U\r\nContent-Disposition: form-data; name=\"form_type\"\r\n\r\nproduct\r\n------WebKitFormBoundaryC9R6UHRGRat6IP8U\r\nContent-Disposition: form-data; name=\"utf8\"\r\n\r\n✓\r\n------WebKitFormBoundaryC9R6UHRGRat6IP8U\r\nContent-Disposition: form-data; name=\"id\"\r\n\r\n53972783366504\r\n------WebKitFormBoundaryC9R6UHRGRat6IP8U\r\nContent-Disposition: form-data; name=\"properties[Shipping]\"\r\n\r\n\r\n------WebKitFormBoundaryC9R6UHRGRat6IP8U\r\nContent-Disposition: form-data; name=\"product-id\"\r\n\r\n8160972144767\r\n------WebKitFormBoundaryC9R6UHRGRat6IP8U\r\nContent-Disposition: form-data; name=\"section-id\"\r\n\r\ntemplate--24567762059624__4b86bc5c-f0d6-46d6-8684-1235f066332e\r\n------WebKitFormBoundaryC9R6UHRGRat6IP8U\r\nContent-Disposition: form-data; name=\"quantity\"\r\n\r\n1\r\n------WebKitFormBoundaryC9R6UHRGRat6IP8U\r\nContent-Disposition: form-data; name=\"sections\"\r\n\r\ncart-notification-product,cart-notification-button,cart-icon-bubble\r\n------WebKitFormBoundaryC9R6UHRGRat6IP8U\r\nContent-Disposition: form-data; name=\"sections_url\"\r\n\r\n/products/the-quencher-protour-flip-straw-tumbler-30-oz\r\n------WebKitFormBoundaryC9R6UHRGRat6IP8U--\r\n",
            "method": "POST"
          });
        return response;
    });
    console.log(response.json());
};

async function get_token(page) {
    let response = await page.evaluate(async () => {
        let response = await fetch("https://www.stanley1913.com/cart.js", {
            "headers": {
              "accept": "*/*",
              "accept-language": "en-GB,en-US;q=0.9,en;q=0.8,hi;q=0.7",
              "priority": "u=1, i",
              "sec-ch-ua": "\"Google Chrome\";v=\"137\", \"Chromium\";v=\"137\", \"Not/A)Brand\";v=\"24\"",
              "sec-ch-ua-mobile": "?0",
              "sec-ch-ua-platform": "\"macOS\"",
              "sec-fetch-dest": "empty",
              "sec-fetch-mode": "cors",
              "sec-fetch-site": "same-origin",
              "Referer": "https://www.stanley1913.com/cart",
              "Referrer-Policy": "strict-origin-when-cross-origin"
            },
            "body": null,
            "method": "GET"
          });
        return response;
    });
    console.log(response.json());
};


async function run() {
    try {
        const { browser, page } = await give_page();
        await page.goto(productUrl);
        await add_to_cart(page);
        await get_token(page);

    } catch (error) {
        log(`❌ Error in checkout process: ${error.message}`);
    }
}

run();

// get fetch 
const res = await fetch(productUrl);