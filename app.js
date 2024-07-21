require("dotenv").config();
const express = require("express");
const {
  default: authRouter,
} = require(`./routes/${process.env.VERSION}/authRouter`);
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();

app.use(express.json());
app.use(express.urlencoded());
app.use(cors());
app.use(cookieParser());

app.use(`/api/${process.env.VERSION}/auth/`, authRouter);

module.exports = app;
