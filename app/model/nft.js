'use strict';
const mongoose = require('../db');

const NftSchema = new mongoose.Schema(
  {
    name: {
      // nft 名称
      type: String,
      required: true,
      unique: true,
    },
    assetCount: Number, // nft 数量
    contract: String, // 合约地址
    tokenType: String, // 合约类型
    product: String, // 产品名称
    shortName: String, // nft 简称
    cname: String, // 中文名
    desc: String, // nft 介绍
    elementUrl: String, // element 市场链接
    icon: String, // nft 图标
  },
  {
    timestamps: true,
  }
);

const NftModel = mongoose.model('nft', NftSchema);

module.exports = NftModel;
