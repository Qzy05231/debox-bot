const fs = require('fs-extra');

// DeBox 一些最新的活动，通过推特获取 应该主要就是这三个推特
// 其他方面的，可能还会来自
// 1. 宣传大队
// 2. 基金会
// 3. 建设者联盟
// 一般上面三个推特都会转发 - 后期可以考虑加入后台管理系统，手动录入。


const tweets = {
  social: 'https://twitter.com/DeBox_Social', // 官方推特
  cn: 'https://twitter.com/DeBox_CN', // 中文频道，和很多国内项目合作
  rico: 'https://twitter.com/Hotpot01', // rico 负责市场活动， 很多活动他都会发推
};

/**
 * 可以先把所有的数据先存了。
 * 后期 看看5分钟抓一次？
 * 这里考虑就从这3个号里面，找最新的推文就可以。
 * @param {*} name
 * @param {*} url
 */
async function getDeBoxTwitterFromUrl(name, url) {
  const { browser } = global;
  try {
    await browser.url(url);
    // 这个推特是谁的账号? -- 用一个野号，避免被封号。
    await browser.setCookies({
      name: 'auth_token',
      value: '', // 推特 token
      domain: '.twitter.com',
    });

    await browser.url(name);

    const tweets = await browser.$$('div[data-testid="cellInnerDiv"]');
    for await (const tweet of tweets) {
      await delay();
      // const html = await tweet.getHTML();

      const timeEl = await tweet.$('time');
      await delay();
      const time = await timeEl.getAttribute('datetime');
      // const text = await (await tweet.$('[data-testid="tweetText"]')).getHTML();

      // console.log(logo, logoName, time, text);
      console.log(time);
    }

    //
  } catch (e) {
    console.error(e);
  }
}
async function delay(time = 1000) {
  return new Promise(resolve => {
    setTimeout(() => resolve(), time);
  });
}
module.exports = {
  schedule: {
    interval: '300s', // 5分钟抓一次?
    type: 'worker',
    disable: true,
  },
  async task() {
    // for (const name in tweets) {
    //   const url = tweets[name];
    //   await getDeBoxTwitterFromUrl(name, url);
    // }
  },
};
