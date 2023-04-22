'use strict';

const mongoose = require('mongoose');

mongoose.initMongo = function(config) {
  // 创建链接
  mongoose.connect(config.url, {
    auth: {
      username: config.user,
      password: config.password,
    },
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  mongoose.connection.on('connected', () => {
    console.log('Mongoose connection open to: ' + config.url);
  });

  mongoose.connection.on('error', err => {
    console.log('Mongoose connection error: ', err);
  });

  mongoose.connection.on('disconnected', () => {
    console.log('Mongoose connection disconnected');
  });
};


module.exports = mongoose;
