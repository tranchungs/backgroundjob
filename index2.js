const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const JobRouter = require('./Job/job')
const PORT = 7454;


const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api", JobRouter);

app.listen(PORT, () => {
  console.log(`Sever listen on port ${PORT}`);
});
