const path = require('path');
const dayjs = require('dayjs');
const execa = require('execa');
const DaoModel = require('../model/dao');
// const table = require('text-table');
/**
 * 机器人定时广播, 8, 12, 19 点播报
 */
module.exports = {
  schedule: {
    // cron: '0 0 19 * * *',
    // interval: '10s',
    cron: '0 0 7,11,18,20,22,0 * * *',
    type: 'worker',
    // disable: true,
  },
  async task(ctx) {
    console.log('broadcast club message start...');
    // 获取 nft 价格
    // const nfts = await NftModel.find({ product: 'DeBox' });
    const nfts = await ctx.helper.get('/nft/info/all/');
    // console.log(nfts);
    const coins = await ctx.helper.get('/coin/info/all/');

    let msg = '蜂鸟播报\n';
    msg += dayjs().format('YYYY-MM-DD HH:mm:ss');
    msg += '\n';
    msg += '\n';
    const nftMsgs = [[ 'NFT  ', '    涨跌(天)', '    地板价(e)' ]];
    for (const key in nfts) {
      const nft = nfts[key];
      nftMsgs.push([
        `${nft.short_name}(${nft.cname})`,
        '    ' + nft.diff.toFixed(2) + '%   ',
        '    ' + nft.floor_price.toFixed(2),
        // '('+parseInt(nft.nft_stats.stats.stats1D.volume)+'eth)',
      ]);
    }

    msg += nftMsgs.map(m => m.join('')).join('\n'); // table(nftMsgs, { align: [ 'l', 'c', 'c'] });
    console.log(msg);

    msg += '\n';
    msg += '\n';
    const coinMsg = [[ '加密货币', '  涨跌(天) ', '   价格(u)' ]];
    for (const key in coins) {
      const coin = coins[key];
      const price = `${coin.price.split('.')[0]}.${coin.price
        .split('.')[1]
        .slice(0, 2)}`;
      const percentToggle = `${coin.percentToggle.split('.')[0]}.${coin.percentToggle
        .split('.')[1]
        .slice(0, 2)}%`;
      coinMsg.push([
        coin.name.padEnd(5, ' '),
        `    ${coin.isUp ? '+' : '-'}${percentToggle}  `,
        `  ${price}`.padStart(9 + (10 - price.length), ' '),
      ]);
    }
    // msg += table(coinMsg, { align: [ 'l', 'c', 'r' ] });
    msg += coinMsg.map(m => m.join('')).join('\n'); // table(nftMsgs, { align: [ 'l', 'c', 'c'] });
    // await robot.debox.sendText(msg, '蜂鸟测试');
    // 发消息  开发者社群 109597   新手群 101280  测试群 118544
    const groups = await DaoModel.find({ name: [ '蜂鸟测试2', '蜂鸟测试' ] });

    // 如果 msg 行数小于 10 则不播
    if (msg.split('\n')?.length < 10) return;

    groups.forEach(group => {
      try {
        execa(
          'go',
          [
            'run',
            'send_chat_msg.go',
            '-k',
            'x-api-key', // apikey
            '-u',
            '-1',
            '-g',
            // '109597', // 开发者社群
            group.groupId.toString(),
            '-m',
            msg,
          ],
          {
            cwd: path.resolve(__dirname, '../sdk/debox-chat-go-sdk/example'),
          }
        );
      } catch (e) {
        console.error(e);
      }
    });
    console.log('broadcast club message end...');
  },
};
