'use strict';
const mongoose = require('../db');

const TweetsSchema = new mongoose.Schema(
  {
    publishTime: Date,
    authorTwitterId: String,
    authorTwitterUrl: String,
    authorName: String,
    authorLogo: String,
    mentionUsers: Array,
    content: String,
    imgs: Array,
    replyNum: String,
    retweetNum: String,
    likeNum: String,
    viewNum: String,
  },
  {
    timestamps: true,
  }
);

const TweetsModel = mongoose.model('tweets', TweetsSchema);

module.exports = TweetsModel;
