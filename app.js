require("dotenv").config();
const express = require("express");
const authRouter = require(`./routes/${process.env.VERSION}/authRouter`);
const userRouter = require(`./routes/${process.env.VERSION}/userRouter`);
const categoryRouter = require(`./routes/${process.env.VERSION}/categoryRouter`);
const courseRouter = require(`./routes/${process.env.VERSION}/courseRouter`);
const sessionRouter = require(`./routes/${process.env.VERSION}/sessionRouter`);
const commentRouter = require(`./routes/${process.env.VERSION}/commentRouter`);

const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(process.cwd(), "public")));
app.use(helmet());
app.use(cors());
app.use(cookieParser());

app.use(`/api/${process.env.VERSION}/auth/`, authRouter);
app.use(`/api/${process.env.VERSION}/users/`, userRouter);
app.use(`/api/${process.env.VERSION}/categories/`, categoryRouter);
app.use(`/api/${process.env.VERSION}/courses/`, courseRouter);
app.use(`/api/${process.env.VERSION}/sessions/`, sessionRouter);
app.use(`/api/${process.env.VERSION}/comments/`, commentRouter);

app.use((err, req, res, next) => {
  return res.status(500).json({ message: err.message });
});

app.use((req, res) => {
  return res.status(400).json({ message: "Bad Request. Wrong Api !!" });
});

module.exports = app;
