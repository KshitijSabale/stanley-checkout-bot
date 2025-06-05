// this is is npm package that we are going to use to automate the browser
const puppeteer = require('puppeteer-extra');
const fs = require('fs');

// add stealth plugin to the puppeteer and use all defaults ( all evasion techniques)
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin());


async function main(){
    // Launch a new browser instance in non-headless mode (visible browser)
    const browser = await puppeteer.launch({ headless: false });
    
    // Create a new page/tab in the browser
    const page = await browser.newPage();
    
    // Navigate to Google's homepage
    await page.goto('https://fill.dev/form/credit-card-simple');

    await page.screenshot({ path: 'screenshot.png' , fullPage: true });
    await page.pdf({ path: 'screenshot.pdf' , format: 'A4' });

    const html = await page.content();
    fs.writeFileSync('screenshot.html', html);

    // get title 
    const title = await page.evaluate(()=>{
        return document.title;
    });
    // console.log(title);

    // get url
    const url = await page.url();
    // console.log(url);

    // get text
    const text = await page.evaluate(()=>{
        return document.body.textContent;
    });
    // console.log(text);

    // get all links
    const links = await page.evaluate(()=>{
        return Array.from(document.querySelectorAll('a')).map(a=>a.href);
    });
    // console.log(links);

    // below code is for filling the form in the website and submitting it and then going back to the previous page

    let name = "Kshitij Sabale";
    let input_name = "input[id='cc-name']";

    // wait for the selector to be visible
    await page.waitForSelector(input_name);
    await page.type(input_name, name);
    // await page.evaluate((input_name, name)=>{
    //     document.querySelector(input_name).value = name;
    // }, input_name, name);

    let cc_type = "select[id='cc-type']";
    await page.waitForSelector(cc_type);
    await page.select(cc_type, "visa");

    let cc_number = "input[id='cc-number']";
    await page.waitForSelector(cc_number);
    await page.type(cc_number, "1234567890");

    let cc_expiry_month = "select[id='cc-exp-month']";
    await page.waitForSelector(cc_expiry_month);
    await page.select(cc_expiry_month, "12");
    let cc_expiry_year = "select[id='cc-exp-year']";
    await page.waitForSelector(cc_expiry_year);
    await page.select(cc_expiry_year, "2025");

    let cc_csc = "input[id='cc-csc']";
    await page.waitForSelector(cc_csc);
    await page.type(cc_csc, "123");

    let button_submit = "button[type='submit']";
    await page.waitForSelector(button_submit);
    // click the selector using evaluate function
    // evaluate function is used to execute javascript code in the browser
    await page.evaluate((button_submit)=>{
        document.querySelector(button_submit).click();
    }, button_submit);

    // click the selector using click function
    // await page.click(button_submit);

    // let back_button = "button[class='btn btn-primary']";
    // await page.waitForSelector(back_button);
    // await page.click(back_button);
    
    // Close the browser instance to free up system resources
    // await browser.close();
}

main();


// use document.querySelector to select the element
// document.querySelector('input[id="add-to-cart-button"]')