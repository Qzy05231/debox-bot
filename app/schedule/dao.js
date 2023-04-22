const DaoModel = require('../model/dao');

const daoUrls = [
  'https://debox.space/dao/QKU4xJAU',
  'https://debox.site/dao/a8YOOpas',
  'https://debox.site/dao/PDO5pD7o',
  'https://debox.site/dao/thOly9BR',
  'https://debox.site/dao/oIk1Zni3',
  'https://debox.site/dao/8UMEGmWn',
  'https://debox.space/dao/xJcwqzj5',
  'https://debox.site/dao/OwI3PopM',
  'https://debox.site/dao/eAmUf3DN',
  'https://debox.space/dao/VjokMKOY',
  'https://debox.space/dao/eAmceYsk',
  'https://debox.site/dao/RR09CARj',
  'https://debox.site/dao/wC6DlLGJ',
  'https://debox.site/dao/6GAsfDx3',
  'https://debox.space/dao/1765hexk',
  'https://debox.site/dao/oIkW50L1',
  'https://debox.space/dao/ln2ChEFs',
  'https://debox.space/dao/j9QqEf05',
];

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
    const { robot } = global;
    console.log('task run.......');
    for await (const daoUrl of daoUrls) {
      console.log('daoUrl', daoUrl);
      try {
        const res = await robot.debox.getDaoStat(daoUrl);
        await DaoModel.findOneAndUpdate(
          { daoUrl },
          {
            daoUrl,
            groupId: res.group_id,
            name: res.name,
            stats: res,
          },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
      } catch (e) {
        console.error(e);
      }
    }
  },
};
