const puppeteer = require('puppeteer-extra');

const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

async function initBrowser() {
  return new Promise((resolve, reject) => {
    puppeteer
      .launch({
        ignoreHTTPSErrors: true,
        headless: true,
        args: [ '--no-sandbox',],
      })
      .then(browser => {
        resolve(browser);
      })
      .catch(e => {
        console.error(e);
        reject(e);
      });
  });
}

module.exports = initBrowser;
