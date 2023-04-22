const fs = require('fs-extra');
const CoinStatModel = require('../model/coin_stat');

const coins = {
  ETH: 'https://www.google.com/finance/quote/ETH-USD',
  BTC: 'https://www.google.com/finance/quote/BTC-USD',
  BNB: 'https://www.google.com/finance/quote/BNB-USD',
  USDT: 'https://www.google.com/finance/quote/USDT-USD',
};
/**
 * 采集 coin 价格信息
 * TODO: 替换掉 google 源, 换国内的
 */
module.exports = {
  schedule: {
    interval: '1h',
    type: 'worker',
    // disable: true,
  },
  async task() {
    const { coin } = global.robot;
    for (const name in coins) {
      const url = coins[name];
      const res = await coin.getStatsFromGoogle(name, url);
      // console.log('res', res);
      if (res.price) {
        await new CoinStatModel({
          name,
          ...res,
        }).save();
      }
    }
  },
};
