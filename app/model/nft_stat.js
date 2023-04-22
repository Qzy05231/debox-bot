'use strict';
const mongoose = require('../db');

const NftStatSchema = new mongoose.Schema(
  {
    nftId: {
      type: mongoose.Schema.ObjectId,
    },
    name: {
      type: String,
    },
    slug: {
      type: String,
    },
    elementId: String,
    stats: {
      type: Object,
      required: true,
    },
    ownerCount: Number, // 持仓地址数量
    totalVolume: Number, // 总交易额
    floorPrice: Number, // 地板价
    coinChain: String, // 单位
  },
  {
    timestamps: true,
  }
);

const NftStatModel = mongoose.model('nft_stat', NftStatSchema);

module.exports = NftStatModel;
