'use strict';
const { Schema } = require('mongoose');
const mongoose = require('../db');

// 数字货币状态
const CoinStatSchema = new mongoose.Schema(
  {
    coinId: mongoose.Schema.ObjectId,
    // 名称
    name: {
      type: String,
      required: true,
    },
    // 价格
    price: {
      type: String,
      required: true,
    },
    // 百分比波动
    percentToggle: {
      type: String,
    },
    // 价格波动
    priceToggle: {
      type: String,
    },
    // 是否上涨
    isUp: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

const CoinStatModel = mongoose.model('coin_stat', CoinStatSchema);

module.exports = CoinStatModel;
