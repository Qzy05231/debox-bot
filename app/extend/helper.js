module.exports = {
  formatUser(user) {},
  // 运行任务，失败后重试
  async runTask(fn, times = 3) {
    for (let i = 0; i < times; i++) {
      try {
        await fn();
        return;
      } catch (e) {
        // ignore
      }
    }
  },
  async delay(time = 1) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, time * 1000);
    });
  },
  async get(url) {
    try {
      const { data } = await this.ctx.curl(this.config.apiHost + url, {
        dataType: 'json',
      });

      if (data.code === 200) {
        return data.data;
      }
    } catch (e) {
      console.error(e);
    }
    return null;
  },
};
