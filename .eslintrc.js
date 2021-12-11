module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
    es6: true,
    browser: true,
    jquery: true
  },
  extends: ["standard"],
  parserOptions: {
    ecmaVersion: 12
  },
  rules: {
    semi: ["error", "always"],
    quotes: ["error", "double"]
  }
};
