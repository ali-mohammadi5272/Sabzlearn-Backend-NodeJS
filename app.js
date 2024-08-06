require("dotenv").config();
const express = require("express");
const { VERSION } = process.env;
const authRouter = require(`./routes/${VERSION}/authRouter`);
const userRouter = require(`./routes/${VERSION}/userRouter`);
const categoryRouter = require(`./routes/${VERSION}/categoryRouter`);
const courseRouter = require(`./routes/${VERSION}/courseRouter`);
const sessionRouter = require(`./routes/${VERSION}/sessionRouter`);
const commentRouter = require(`./routes/${VERSION}/commentRouter`);
const contactUsRouter = require(`./routes/${VERSION}/contactUsRouter`);
const newsletterRouter = require(`./routes/${VERSION}/newsletterRouter`);
const searchRouter = require(`./routes/${VERSION}/searchRouter`);

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

app.use(`/api/${VERSION}/auth/`, authRouter);
app.use(`/api/${VERSION}/users/`, userRouter);
app.use(`/api/${VERSION}/categories/`, categoryRouter);
app.use(`/api/${VERSION}/courses/`, courseRouter);
app.use(`/api/${VERSION}/sessions/`, sessionRouter);
app.use(`/api/${VERSION}/comments/`, commentRouter);
app.use(`/api/${VERSION}/contact-us/`, contactUsRouter);
app.use(`/api/${VERSION}/newsletter/`, newsletterRouter);
app.use(`/api/${VERSION}/search/`, searchRouter);

app.use((err, req, res, next) => {
  return res.status(500).json({ message: err.message });
});

app.use((req, res) => {
  return res.status(400).json({ message: "Bad Request. Wrong Api !!" });
});

module.exports = app;
