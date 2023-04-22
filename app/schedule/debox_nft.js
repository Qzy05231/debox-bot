const NftModel = require('../model/nft');
const NftStatModel = require('../model/nft_stat');

/**
 * 采集 nft 信息
 */
module.exports = {
  schedule: {
    interval: '1h',
    // interval: '2m',
    type: 'worker',
    // disable: true,
    // immediate: true,
  },
  async task(ctx) {
    const { robot } = global;
    console.log('开始采集 debox nft 价格信息...');
    const nfts = await NftModel.find({ product: 'DeBox' });
    const fromApi =
      'https://api.element.market/graphql?args=CollectionDetailStats';
    // console.log(nfts);

    for await (const nft of nfts) {
      // console.log('采集 nft.id:', nft.id);
      const res = await robot.debox.getNftStat({
        url: nft.elementUrl, // 页面
        fromApi, // 识别的 api
      });
      // console.log('采集 nft.id数据:', res);
      await new NftStatModel({
        nftId: nft.id,
        elementId: res.id,
        name: res.name,
        slug: res.slug,
        stats: res.stats,
        ownerCount: res.stats.ownerCount,
        totalVolume: res.stats.totalVolume,
        floorPrice: res.stats.floorPrice,
        coinChain: res.stats?.collectionFloorPrice?.coin?.chain,
      }).save();
    }
  },
};
