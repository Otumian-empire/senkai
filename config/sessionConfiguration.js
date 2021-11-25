const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const sessionLifeTime = 1000 * 60 * 60 * 24 * 7; // 1 week

/**
 *
 * @param { * } { uri, secret, isProdServer, collection }
 * @description uri -> database uri
 * @description secret -> session secret
 * @description isProdServer -> bool, true for Production, false for development
 * @description collection -> name of the session collection (table)
 * @returns express-session
 */
const sessionConfig = ({ uri, secret, isProdServer, collection }) => {
  return session({
    secret,
    cookies: {
      maxAge: sessionLifeTime,
      path: "/",
      // set httpOnly (https) and secure to true in PRODUCTION
      httpOnly: isProdServer,
      secure: isProdServer
    },
    store: new MongoDBStore(
      {
        uri,
        collection,
        expires: sessionLifeTime
      },
      (err) => {
        if (err) {
          // console.log(err);
        }
      }
    ),
    resave: false,
    saveUninitialized: false
  });
};

module.exports = sessionConfig;
