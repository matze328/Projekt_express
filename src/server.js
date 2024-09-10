const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { AppRouter } = require("./routes");

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use("/v1", AppRouter);


module.exports = app;
