// This file is created by egg-ts-helper@1.34.7
// Do not modify this file!!!!!!!!!
/* eslint-disable */

import 'egg';
import ExportCoin = require('../../../app/model/coin');
import ExportCoinStat = require('../../../app/model/coin_stat');
import ExportNft = require('../../../app/model/nft');
import ExportNftStat = require('../../../app/model/nft_stat');
import ExportToolAccount = require('../../../app/model/tool_account');
import ExportTweets = require('../../../app/model/tweets');
import ExportTwitterUser = require('../../../app/model/twitter_user');

declare module 'egg' {
  interface IModel {
    Coin: ReturnType<typeof ExportCoin>;
    CoinStat: ReturnType<typeof ExportCoinStat>;
    Nft: ReturnType<typeof ExportNft>;
    NftStat: ReturnType<typeof ExportNftStat>;
    ToolAccount: ReturnType<typeof ExportToolAccount>;
    Tweets: ReturnType<typeof ExportTweets>;
    TwitterUser: ReturnType<typeof ExportTwitterUser>;
  }
}
