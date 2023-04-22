'use strict';

const { Controller } = require('egg');

class DeboxController extends Controller {
  async login() {
    const { ctx } = this;
    const { robot } = global;
    console.log(robot);
    ctx.body = `<div style="width:200px;">${robot?.debox?.loginImgHtml}</div>`;
  }
}

module.exports = DeboxController;
