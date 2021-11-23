require("dotenv").config();

module.exports = {
  DEV_MONGO_URI: process.env.DEV_MONGO_URI,
  PROD_MONGO_URI: process.env.PROD_MONGO_URI,
  PORT: process.env.port || 3000,
  APP_NAME: process.env.APP_NAME,
  SESSION_STORE_COLLECTION_NAME: process.env.SESSION_STORE_COLLECTION_NAME,
  SESSION_SECRET: process.env.SESSION_SECRET
};
