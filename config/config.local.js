/* eslint valid-jsdoc: "off" */

'use strict';
const path = require('path');

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = (exports = {});

  config.cluster = {
    listen: {
      port: 7001,
    },
  };

  config.logger = {
    dir: path.resolve(__dirname, '../logs'),
  };

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1594729480682_1432';

  // add your middleware config here
  config.middleware = [];

  config.apiHost = 'http://127.0.0.1:8000';
  config.host = 'http://127.0.0.1:7001/debox_bird';
  config.mongo = {
    url: 'mongodb://127.0.0.1:27017/debox_bird?authSource=debox_bird',
    user: 'debox_admin',
    password: 'CAE#HBs561WScce_12A2@!',
  };

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
    security: {
      csrf: {
        enable: false,
        headerName: 'x-csrf-token',
      },
    },
    onerror: {
      all(err, ctx) {
        console.error(err);
        ctx.body = 'error';
        ctx.status = 500;
      },
    },
  };
};
