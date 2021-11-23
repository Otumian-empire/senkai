// system modules
const path = require("path");

// third party modules
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// application configuration keys
const port = require("./config/config").PORT;
const appName = require("./config/config").APP_NAME;
const sessionCollectionName =
  require("./config/config").SESSION_STORE_COLLECTION_NAME;
const sessionSecret = require("./config/config").SESSION_SECRET;
const devMongoUri = require("./config/config").DEV_MONGO_URI;
const prodMongoUri = require("./config/config").PROD_MONGO_URI;

// application modules
const httpLogger = require("./config/httpLogger");
const sessionConfiguration = require("./config/sessionConfiguration");

// routes
const webRouter = require("./routes/web");
const apiRouter = require("./routes/api");

// express app
const app = express();

// NODE_ENV - true=>PROD, false=>DEV
const isProdServer = app.get("env") !== "development";

// set mongoUri to production Uri when not in development
const mongoUri = isProdServer ? prodMongoUri : devMongoUri;

// session store configuration options
const sessionConfigOptions = {
  secret: sessionSecret,
  isProdServer: isProdServer,
  uri: mongoUri,
  collection: sessionCollectionName
};

// session and session store configuration
app.use(sessionConfiguration(sessionConfigOptions));

// static files
app.use(express.static(path.join(__dirname, "static")));

// view setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(httpLogger);
app.use(cors());

// end points
app.use("/", webRouter);
app.use("/api", apiRouter);

// Errors
app.use((_req, res) => {
  res.status(404).render("error/404", { appName });
});

app.use((_req, res) => {
  res.status(500).render("error/500");
});

// serving on port ${port}
// only serve when the database is connected
mongoose
  .connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    app.listen(port, () => {
      console.log("mongodb connected");
      console.log(`listening on port ${port}`);
    });
  })
  .catch((err) => console.log(err));
