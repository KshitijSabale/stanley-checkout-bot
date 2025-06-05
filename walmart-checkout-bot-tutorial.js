const puppeteer = require('puppeteer');

// Link to course: https://whop.com/coding-a-checkout-bot-for-beginners/

// page is instance of browser that you are going to interact with

// how to interact with page?

const productUrlAmazon = 'https://www.amazon.in/OnePlus-Bluetooth-Adaptive-Cancellation-Charging/dp/B0CRH561RC/?_encoding=UTF8&pd_rd_w=qmVT3&content-id=amzn1.sym.509965a2-791b-4055-b876-943397d37ed3%3Aamzn1.symc.fc11ad14-99c1-406b-aa77-051d0ba1aade&pf_rd_p=509965a2-791b-4055-b876-943397d37ed3&pf_rd_r=TQ9N6K8BDREFFQXQJ9N2&pd_rd_wg=F86dz&pd_rd_r=227df31b-8f41-4687-864b-3686d3aa7d01&ref_=pd_hp_d_atf_ci_mcx_mr_ca_hp_atf_d';

const productUrlWalmart = 'https://www.walmart.com/ip/Dreo-Portable-Air-Conditioners-8000BTU-AC-Unit-Bedroom-Drainage-free-Cooling-Quiet-APP-Voice-Remote-24h-Timer-Fan-Dehumidifier-Smart-Air-Conditioner/14827021776?classType=REGULAR'

async function givePage(){
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    return page;
}

// async function addToCart(page) {
//     await page.goto(productUrl);
//     await page.waitForSelector('input[id="add-to-cart-button"]');
//     await page.click('input[id="add-to-cart-button"]', elem => {
//         console.log(elem);
//         elem.click();
//     });
// }

async function addToCart(page){
    await page.goto(productUrlWalmart);

}

async function addToCart(page){
    await page.goto(product_url);
    await page.waitForSelector("button[class='button spin-button prod-ProductCTA--primary button--primary']");
    await page.click("button[class='button spin-button prod-ProductCTA--primary button--primary']", elem => elem.click());
    await page.waitForNavigation();
    await page.click("button[class='button ios-primary-btn-touch-fix hide-content-max-m checkoutBtn button--primary']", elem => elem.click());
    await page.waitForNavigation();
    await page.click("button[data-automation-id='new-guest-continue-button']", elem => elem.click());
    await page.waitForNavigation();
    await page.waitFor(1000);
    await page.click("button[data-automation-id='fulfillment-continue']", elem => elem.click());
}

async function addToCart2(page){
    await page.goto(product_url);
    await page.waitForSelector("button[class='button spin-button prod-ProductCTA--primary button--primary']");
    await page.click("button[class='button spin-button prod-ProductCTA--primary button--primary']", elem => elem.click());
    await page.waitForNavigation();
    await page.$eval("button[class='button ios-primary-btn-touch-fix hide-content-max-m checkoutBtn button--primary']", elem => elem.click());
    await page.waitForNavigation();
    await page.waitFor(2000);
    await page.evaluate(() => document.getElementsByClassName('button c-margin-top width-full button--primary')[0].click());
    await page.waitForNavigation();
    await page.waitFor(1000);
    await page.evaluate(() => document.getElementsByClassName('button cxo-continue-btn button--primary')[0].click());
}

async function fillBillingDetails(page){
    await page.waitFor(1000);
    await page.waitForSelector("input[id='firstName']");
    await page.type("input[id='name']", "John Doe");
    await page.waitFor(1000);
    await page.waitForSelector("input[id='lastName']");
    await page.type("input[id='lastName']", "Doe");
    await page.waitFor(1000);
    await page.waitForSelector("input[id='addressLineOne']");
    await page.type("input[id='addressLineOne']", "123 Main St");
    await page.waitFor(1000);
    await page.waitForSelector("#phone");
    await page.type("#phone", "1234567890");
    await page.waitFor(1000);
    await page.waitForSelector("#email");
    await page.type("#email", "john.doe@example.com");
    await page.waitFor(1000);
    const city = await page.$("input[id='city']");
    await city.click({clickCount: 3});
    await city.type("New York");
    await page.waitFor(1000);
    const postalCode = await page.$("input[id='postalCode']");
    await postalCode.click({clickCount: 3});
    await postalCode.type("10001");
    await page.waitFor(1000);
    await page.$eval(() => document.getElementsByClassName('button button--primary')[0].click());
}

async function fillPaymentDetails(page){
    await page.waitFor(1000);
    await page.type('#creditCard', '1234567890');

    // select dropdown
    await page.waitFor(1000);
    await page.select('#month-chooser', '12');
    await page.waitFor(1000);
    await page.select('#year-chooser', '2025');
    await page.waitFor(1000);
    await page.type('#cvv', '123');
    await page.$eval("button[class='button spin-button button--primary']", elem => elem.click());
    
}

async function submitOrder(page){
    await page.waitFor(2000);
    await page.evaluate(() => document.getElementsByClassName('button auto-submit-place-order no-margin set-full-width-button pull-right-m place-order-btn btn-block-s button--primary')[0].click());
}

async function superClick(page, className){
    try{
        await page.click("button[class='" + className + "']",elem => elem.click());
    }catch (err){
        try {
            await page.$eval(className, elem => elem.click());
        }catch(err2){
            await page.evaluate(() => document.getElementsByClassName(className)[0].click());
        }
    }
}



async function checkOut() {
    const page = await givePage();
    await addToCart(page);
    await fillBillingDetails(page);
    await fillPaymentDetails(page);
    await submitOrder(page);
}

checkOut();

// REDUCE DELAY BETWEEN STEPS TO OPTIMIZE BOT

// page.$eval vs page.click difference

// page.click is used to click on an element
// page.eval is used to evaluate a function

// page.click is used to click on an element
// page.eval is used to evaluate a function

// page.$eval is used to evaluate a function and return the element
// page.$ is used to return the element

// page.evaluate is used to evaluate a function and return the result
// page.evaluate is used to evaluate a function and return the result

