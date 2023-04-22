'use strict';
const mongoose = require('../db');

const DaoSchema = new mongoose.Schema(
  {
    groupId: {
      type: Number, // 组 id
      required: true,
      unique: true,
    },
    daoUrl: String,
    name: String,
    isBroadcast: Boolean, // 是否播报
    broadcaseCron: String, // 播报规则
    stats: { // debox 数据
      type: Object,
      default: {},
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const DaoModel = mongoose.model('dao', DaoSchema);

module.exports = DaoModel;
