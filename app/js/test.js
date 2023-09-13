const puppeteer = require("puppeteer"),
      should = require("should");

let browser = null,
    page = null;

 
const iPhone = puppeteer.devices['iPhone 6'];
 
describe("Little Mix Home", function (){
    this.timeout(60 * 1000);

    before(async () => {
        browser = await puppeteer.launch({headless: true}) // with visual
        page = await browser.newPage(); 
        await page.emulate(iPhone);
        
    });
    after(async () => {
        await browser.close();    

    });
    it("Should Show Splash Screen", async function() {
        await page.goto("https://dixgosvdvewt1.cloudfront.net");
        await page.waitFor(100);
        
        await page.waitForSelector('.sc-dxgOiQ.bpPOjj', {visible: true});

    });
})