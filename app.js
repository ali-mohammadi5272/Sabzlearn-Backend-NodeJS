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
const {
  default: courseRouter,
} = require(`./routes/${process.env.VERSION}/courseRouter`);
const {
  default: sessionRouter,
} = require(`./routes/${process.env.VERSION}/sessionRouter`);

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

app.get("/courses/covers/:fileName", (req, res) => {
  res.sendFile(path.join(process.cwd(), req.url));
});
app.get("/courses/sessions/:fileName", (req, res) => {
  res.sendFile(path.join(process.cwd(), req.url));
});

module.exports = app;
