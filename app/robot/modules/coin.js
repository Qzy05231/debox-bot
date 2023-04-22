class Coin {
  async init(browser) {
    this.browser = browser;
  }

  async getStatsFromGoogle(name, url) {
    const { browser } = this;
    this.page = await browser.newPage();
    const { page } = this;
    await page.goto(url);
    setTimeout(async () => {
      if (!page.isClosed) {
        await page.close();
      }
    }, 30000);
    try {
      const selector = `div[data-source="${name}"] > div`;
      await page.waitForSelector(selector);
      const { html, text } = await page.$eval(selector, el => {
        return {
          html: el.outerHTML,
          text: el.outerText,
        };
      });
      // console.log(html, text);
      const percentToggleStr = /percent-toggle.+?aria-label="(.+?)"/.exec(
        html
      )[1];
      return {
        price: text.split('\n')[0], // 价格
        percentToggle: percentToggleStr.split(' ').pop(), // 百分比波动
        priceToggle: text.split('\n')[2].replace(/-|\+|\s|[a-zA-Z]/g, ''), // 价格波动
        isUp: !percentToggleStr.includes('Down'),
      };
    } catch (e) {
      console.error(e);
    } finally {
      await page.close();
    }
  }
}

module.exports = new Coin();
