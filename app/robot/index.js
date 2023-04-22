const initBrowser = require('./browser');
const debox = require('./modules/debox');
const coin = require('./modules/coin');
const twitter = require('./modules/twitter');
const utils = require('./utils');

async function initRobot(options) {
  console.info('robot init start...');
  const browser = await initBrowser();
  const robot = {
    debox,
    coin,
    twitter,
    utils,
  };
  global.robot = robot;

  console.info('robot init...');
  robot.twitter.init(browser, options?.twitter);
  await robot.debox.init(browser, options?.debox);
  await robot.coin.init(browser, options?.coin);

  console.info('robot inited success!');
  return robot;
}

module.exports = { initRobot };
