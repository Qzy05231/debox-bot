'use strict';
const mongoose = require('../db');

const ToolAccountSchema = new mongoose.Schema(
  {
    name: {
      // url简称, 自定义
      type: String,
    },
    url: {
      // 要登录的url
      type: String,
      required: true,
      unique: true,
    },
    username: {
      // 用户名
      type: String,
    },
    password: {
      // 密码
      type: String,
    },
    cookies: {
      // cookie
      type: Array,
    },
  },
  {
    timestamps: true,
  }
);

const ToolAccountModel = mongoose.model('tool_account', ToolAccountSchema);

module.exports = ToolAccountModel;
