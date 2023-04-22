'use strict';
const mongoose = require('../db');

const TwitterUserSchema = new mongoose.Schema(
  {
    userName: String,
    userLogo: String,
    twitterId: String,
    twitterUrl: String,
  },
  {
    timestamps: true,
  }
);

const TwitterUserModel = mongoose.model('twitter_user', TwitterUserSchema);

module.exports = TwitterUserModel;
