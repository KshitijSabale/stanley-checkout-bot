Write Maintainable and Concise Code

When coding you should always write concise code. Let's use Puppeteer for an exampel.

 In Puppeteer, tasks are going to be pretty repetitive. This can be solved in many ways, but let's talk about one for now. Helper Functions are one of my favorite ways to condense code; it's a function that turns 3+ lines of code into one. This not only condenses code but makes it a lot more maintainable.


For example, in the Apple Bot script I had two different helper functions. One that was for clicking and one that was for typing. 

Example without helper function:

await page.waitForSelector("button[id='submit-button']");
await page.click("button[id='submit-button']");
await page.waitForTimeout(500);

await page.waitForSelector("input[id='email']");
await page.type("input[id='email']", "test@example.com");
await page.waitForTimeout(500);  
Example with helper function:

await smart_click_with_pause(page, "button[id='submit-button']", 500);
await smartType(page, "input[id='email']", "test@example.com", 500);


Helper functions:

async function smart_click_with_pause(page, selector, pause) {
    await page.waitForSelector(selector, { timeout: 10000 });
    await page.evaluate((s) => document.querySelector(s).click(), selector);
    await new Promise(r => setTimeout(r, pause));
}

async function smartType(page, selector, value, pause) {
    await page.waitForSelector(selector, { timeout: 10000 });
    await page.type(selector, value);
    await new Promise(r => setTimeout(r, pause));
}
By using helper functions, I was able to cut down the code significantly, making it more readable and easier to maintain. It's all about writing less and achieving more!




Tracking Variable Values

Another function of logs is to ensure that specific variables hold the desired value as you're executing the program.


Tracking Application Steps

when you implement a large amount of logic, you will probably have a lot of helper functions or multi-step processes in your program. In this case, logs can help you track the various steps of your program as it runs, and in case the program runs into an error, you can verify which exact helper function caused the issue.


for input fields - use type and no evaluate 
for button - use evaluate dont use click


popup we dont care if we are using evaluate 
for click , popup fucks with us 


do not use wait for networkidle 
as we just care about the element we are focusing on 
networkidle means we say that there are no respone  from backend to frontend - network is idle
but rather we want that network can be idle and we just want our element to be loaded



rotate IPS

change user agent

use anti capcha soluting

use website crawler tools