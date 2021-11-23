module.exports = {
  getRandomStrings: () => {
    return require("crypto").randomBytes(20).toString("hex");
  }
};
