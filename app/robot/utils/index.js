async function delay(time = 1) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, time * 1000);
  });
}

module.exports = {
  delay,
};
