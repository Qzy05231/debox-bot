'use strict';
const mongoose = require('./db');
const ToolAccountModel = require('./model/tool_account');
const { initRobot } = require('./robot');

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = async app => {
  const { router, controller } = app;

  initRobot({
    debox: {
      async onInit(debox) {
        const account = await ToolAccountModel.findOne({ name: 'debox-login' });
        debox.cookies = account?.cookies;
        // console.log(debox.cookies);
      },
      async onAfterLogin(debox) {
        await ToolAccountModel.findOneAndUpdate(
          { name: 'debox-login' },
          {
            name: 'debox-login',
            url: debox.chatUrl,
            cookies: debox.cookies,
          },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
      },
    },
  });
  // 初始化数据库
  console.log('开始初始化数据库...');
  await mongoose.initMongo(app.config.mongo);
  console.log('初始化机器人...');

  router.get('/debox-login', controller.debox.login);
  router.get('/', controller.home.index);
};
