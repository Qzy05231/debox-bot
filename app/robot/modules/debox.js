const fs = require('fs-extra');
const { delay } = require('../utils');

// 负责 debox 登录, 发消息
// TODO: 创建一个 debox 进程
// 维护这个进程，如果挂了，重启
// 发送消息，监听消息
class Debox {
  constructor() {
    this.chatUrl = 'https://app.debox.pro/';
    this.page = null;
    this.id = 'debox';
    this.cookies = null;
    this.loginImgHtml = '';
  }

  async init(browser, options) {
    this.browser = browser;
    Object.assign(this, options);
    this.onInit?.(this);
    // await this.login();
  }

  async login() {
    const { browser } = this;
    if (!this.page) {
      this.page = await browser.newPage();
    }

    const { page } = this;
    console.log('debox login start...');
    if (this.cookies?.length) {
      for (let i = 0; i < this.cookies.length; i++) {
        await page.setCookie(this.cookies[i]);
      }
    }

    await this.goToChatUrl();

    await new Promise(resolve => {
      this.timer && clearInterval(this.timer);
      this.timer = setInterval(async () => {
        console.log('debox wait for login...');

        // 已经登录
        const chatSearchEl = await page.$('input[placeholder="Search chat"]');
        if (chatSearchEl) {
          this.timer && clearInterval(this.timer);
          this.timer = null;
          resolve();
          return;
        }

        // 登录
        try {
          if (!this.loginImgHtml) {
            await page.waitForSelector('button.chakra-button');
            const connectWallet = await page.$('button.chakra-button');
            await connectWallet.click();
            await page.waitForSelector('button[aria-label="WalletConnect"]');
            const walletConnect = await page.$(
              'button[aria-label="WalletConnect"]'
            );
            await walletConnect.click();
            await page.waitForSelector('.walletconnect-qrcode__image');

            this.loginImgHtml = await page.$eval(
              '.walletconnect-qrcode__image',
              el => el.outerHTML
            );
          }
          console.log(this.loginImgHtml);
        } catch (e) {
          console.error(e);
        }

        // console.log('this.loginImgHtml', this.loginImgHtml);
      }, 5000);
    });
    // await page.waitForSelector('input[placeholder="Search chat"]');
    console.log('debox login end...');
    // 记录 cookie
    this.cookies = await page.cookies(this.chatUrl);

    this.page = page;
    this.onAfterLogin?.(this);
  }

  sendText(text, to) {
    return this._send({
      type: 'text',
      data: text,
      to,
    });
  }

  sendImage(url, to) {
    return this._send({
      type: 'image',
      data: url,
      to,
    });
  }

  async goToChatUrl() {
    const { page } = this;
    const currentUrl = await page.url();
    if (currentUrl !== this.chatUrl) {
      await page.goto(this.chatUrl);
    }
  }

  async _send({ type, data, to }) {
    // 检查是否登录
    await this.login();
    // 切换到聊天页面
    const { page } = this;
    await this.goToChatUrl();

    // 切换用户
    await page.waitForSelector(`[title='${to}']`);
    const user = await page.$(`[title='${to}']`);
    await user.click();

    let prevChatId;
    try {
      await page.waitForSelector('[id^="chat-list"] li');
      const chatList = await page.$('[id^="chat-list"]');

      prevChatId = await chatList.$eval('li:last-child', el =>
        el.getAttribute('id')
      );
      console.log('prevChatId', prevChatId);
    } catch (e) {}

    if (type === 'text') {
      const msgSelector = '[placeholder="Write message"]';
      await page.waitForSelector(msgSelector);
      const editor = await page.$(msgSelector);

      for await (const line of data.split('\n')) {
        await editor.type(line);
        await page.keyboard.down('ShiftLeft');
        await page.keyboard.press('Enter');
        await page.keyboard.up('ShiftLeft');
      }

      const send = await page.$('.chakra-stack [alt="send"]');
      await send.click();
    }

    if (type === 'image') {
      const uploadBtnSelector = 'img[alt="upload"] + input[type="file"]';
      await page.waitForSelector(uploadBtnSelector);
      const uploadBtn = await page.$(uploadBtnSelector);
      if (!fs.existsSync(data)) {
        throw new Error('上传的文件不存在');
      }
      await uploadBtn.uploadFile(data);
      // const send = await client.$('.chakra-stack [alt="send"]');
      // await send.click();
    }

    try {
      await this._checkSendSuccess(prevChatId);
    } catch (e) {}
  }

  async _checkSendSuccess(prevChatId) {
    await delay(3);
    const { page } = this;

    // 检查是否发送成功
    // await page.waitForSelector('[id^="chat-list"] li');
    // const chatList = await page.$('');
    const lastChatId = await page.$eval(
      '[id^="chat-list"] li:last-child',
      el => el.getAttribute('id')
    );
    console.log('lastChatId', lastChatId);
    if (lastChatId !== prevChatId) {
      console.log('发送成功');
    }
  }

  // 获取 nft 价格信息
  async getNftStat({ url, fromApi }) {
    const { browser } = this;
    const page = await browser.newPage();

    return new Promise(async (resolve, reject) => {
      try {
        await page.goto(url);
      } catch (e) {
        await page.close();
        return reject(e);
      }

      page.on('response', async response => {
        const url = response.url(); // 显示响应的 URL，字符串
        const ok = response.ok();
        try {
          if (url.includes(fromApi) && ok) {
            const text = await response.text();
            const data = JSON.parse(text).data.collection;
            await page.close();
            await page.off('response');
            if (data.name) {
              resolve(data);
            } else {
              reject(new Error('error'));
            }
          }
        } catch (e) {
          console.error('debox nft response error', e);
        }

        // console.log(response.headers()); // 显示响应的header对象
        // console.log(response.text()); // 显示响应的body，Promise
        // console.log(response.status()); // 显示响应的状态码，数值型
        // console.log(response.ok()); // 显示响应是否成功，布尔值
        // console.log(response.request()); // 显示响应对应的 request 对象
      });
    });
  }

  async getDaoStat(url) {
    const { browser } = this;
    const page = await browser.newPage();

    return new Promise(async (resolve, reject) => {
      page.on('response', async response => {
        const url = response.url(); // 显示响应的 URL，字符串
        const ok = response.ok();
        try {
          if (url.includes('/dao/invite_info') && ok) {
            const text = await response.text();
            const data = JSON.parse(text).data;
            await page.close();
            await page.off('response');
            resolve(data);
          }
        } catch (e) {
          console.error('debox dao response error', e);
        }
      });

      try {
        await page.goto(url);
      } catch (e) {
        await page.close();
        return reject(e);
      }
    });
  }
}

module.exports = new Debox();
