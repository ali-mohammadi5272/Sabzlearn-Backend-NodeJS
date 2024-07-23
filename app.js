require("dotenv").config();
const express = require("express");
const {
  default: authRouter,
} = require(`./routes/${process.env.VERSION}/authRouter`);
const {
  default: userRouter,
} = require(`./routes/${process.env.VERSION}/userRouter`);
const {
  default: categoryRouter,
} = require(`./routes/${process.env.VERSION}/categoryRouter`);

const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet());
app.use(cors());
app.use(cookieParser());

app.use(`/api/${process.env.VERSION}/auth/`, authRouter);
app.use(`/api/${process.env.VERSION}/users/`, userRouter);
app.use(`/api/${process.env.VERSION}/categories/`, categoryRouter);

module.exports = app;
