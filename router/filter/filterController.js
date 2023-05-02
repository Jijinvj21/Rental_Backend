const express = require("express");
const filter_router = express();
const filterController = require("../../util/filter");
const filterauthVerify = require("../../middleware/FilterAuthVerify");

filter_router.post("/filter", filterauthVerify, filterController.filter);

module.exports = filter_router;
