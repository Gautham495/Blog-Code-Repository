const express = require("express");
const cors = require("cors")({ origin: true });
var useragent = require("express-useragent");

const { mellisearch } = require("./mellisearch");

const api = express();

api.use(cors);
api.use(useragent.express());

api.set("trust proxy", true);

api.use("/v1/mellisearch", mellisearch);

module.exports = {
  api,
};
