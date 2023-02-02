const express = require("express");
const Router = express();
const JonController = require("./Controller");

Router.get("/getjob", JonController.getjob);
module.exports = Router;
