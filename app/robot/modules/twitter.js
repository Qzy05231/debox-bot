const cheerio = require('cheerio');
const { delay } = require('../utils');
class Twitter {
  init(browser) {
    this.browser = browser;
    this.page = null;
  }

  async login() {
    const { browser } = this;
    console.log(browser);
    if (!this.page) {
      this.page = await browser.newPage();
    }
    await this.page.setCookie({
      name: 'auth_token',
      value: '',
      domain: '.twitter.com',
    });
  }

  async getAllTwitterList(twUrl, options) {
    await this.login();
    const { page } = this;

    await page.goto(twUrl);

    const data = {};

    const getData = async () => {
      const tweets = await page.$$eval(
        'article[data-testid="tweet"]',
        els => {
          return els.map(el => {
            return {
              html: el.outerHTML,
              publishTime: el.querySelector('time')?.getAttribute('datetime'),
            };
          });
        }
      );
      for await (const tweet of tweets) {
        const { publishTime, html } = tweet;
        try {
          if (data[publishTime]) continue;
          data[publishTime] = true;

          const $ = cheerio.load(html);

          const userName = $('[data-testid="User-Name"] a[role="link"]')
            .eq(0)
            .text();
          const twitterId = $('[data-testid="User-Name"] a[role="link"]')
            .eq(1)
            .text()
            .replace(/^@/, '');
          const userLogo = $('.css-9pa8cd').attr('src');
          const content = $('[data-testid="tweetText"]').html();
          let mentionUsers = content.match(/(@\w+?)\b/g);
          mentionUsers = Array.from(
            new Set([ ...(mentionUsers || []) ].filter(t => t))
          ).map(twitterId => {
            twitterId = twitterId.replace(/^@/, '');
            return {
              twitterId,
              twitterUrl: 'https://twitter.com/' + twitterId,
            };
          });
          const imgs = [];
          $('[data-testid="tweetPhoto"]')
            .find('img')
            .each(function() {
              imgs.push($(this).attr('src'));
            });

          const replyNum = $('[role="group"] > div').eq(0).text();
          const retweetNum = $('[role="group"] > div').eq(1).text();
          const likeNum = $('[role="group"] > div').eq(2).text();
          const viewNum = $('[role="group"] > div').eq(3).text();
          // console.log(user, logo, time, aites, text, imgs);

          // console.log(user, logo, time, aite, aites, text, imgs);

          await options?.onOneComplete?.({
            authorName: userName,
            authorLogo: userLogo,
            publishTime,
            content,
            imgs,
            authorTwitterId: twitterId,
            authorTwitterUrl: 'https://twitter.com/' + twitterId,
            replyNum,
            retweetNum,
            mentionUsers,
            likeNum,
            viewNum,
          });
          // await new TwitterDeboxModel().save();
        } catch (e) {
          // empty
          console.error(e);
        }
      }
    };

    while (true) {
      await page.evaluate(() => {
        return new Promise(resolve => {
          const distance = 100;
          window.scrollBy(0, distance);
          resolve();
        });
      });
      await getData();
      await delay(0.2);
    }
  }
}

module.exports = new Twitter();
