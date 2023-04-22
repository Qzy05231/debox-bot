const fs = require('fs-extra');
const TwitterDeboxModel = require('../model/tweets');

let i = 0;
/**
 * 爬取 debox twitter
 */
module.exports = {
  schedule: {
    interval: '10s',
    type: 'worker',
    disable: true,
    // immediate: true,
  },
  async task(ctx) {
    if (i === 1) {
      return;
    }
    i = 1;
    console.log('task run.......');
    const tweets = {
      social: 'https://twitter.com/DeBox_Social', // 官方推特
      // cn: 'https://twitter.com/DeBox_CN', // 中文频道，和很多国内项目合作
      // rico: 'https://twitter.com/Hotpot01', // rico 负责市场活动， 很多活动他都会发推
    };
    const { robot } = global;
    for (const name in tweets) {
      await robot.twitter.getAllTwitterList(tweets[name], {
        async onOneComplete(result) {
          await new TwitterDeboxModel(result).save();
        },
      });
    }
  },
};
