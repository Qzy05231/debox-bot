'use strict';
const mongoose = require('../db');

const CoinSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    desc: {
      type: String,
    },
    cname: String,
    icon: String,
  },
  {
    timestamps: true,
  }
);

const CoinModel = mongoose.model('coin', CoinSchema);

module.exports = CoinModel;
