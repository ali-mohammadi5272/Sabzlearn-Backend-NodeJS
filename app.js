require("dotenv").config();
const express = require("express");
const path = require("path");
const { VERSION } = process.env;
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRouter = require(`./modules/${VERSION}/auth/routes`);
const userRouter = require(`./modules/${VERSION}/user/routes`);
const categoryRouter = require(`./modules/${VERSION}/category/routes`);
const courseRouter = require(`./modules/${VERSION}/course/routes`);
const sessionRouter = require(`./modules/${VERSION}/session/routes`);
const commentRouter = require(`./modules/${VERSION}/comment/routes`);
const contactUsRouter = require(`./modules/${VERSION}/contactUs/routes`);
const newsletterRouter = require(`./modules/${VERSION}/newsletter/routes`);
const searchRouter = require(`./modules/${VERSION}/search/routes`);
const notificationRouter = require(`./modules/${VERSION}/notification/routes`);
const discountCodeRouter = require(`./modules/${VERSION}/discountCode/routes`);
const departmentRouter = require(`./modules/${VERSION}/department/routes`);
const ticketRouter = require(`./modules/${VERSION}/ticket/routes`);
const menuRouter = require(`./modules/${VERSION}/menu/routes`);

const app = express();

app.use(
  cors(),
  express.json(),
  express.urlencoded({ extended: false }),
  express.static(path.join(process.cwd(), "public")),
  helmet(),
  cookieParser(process.env.CookieSecretKey)
);

app.use(`/api/${VERSION}/auth/`, authRouter);
app.use(`/api/${VERSION}/users/`, userRouter);
app.use(`/api/${VERSION}/categories/`, categoryRouter);
app.use(`/api/${VERSION}/courses/`, courseRouter);
app.use(`/api/${VERSION}/sessions/`, sessionRouter);
app.use(`/api/${VERSION}/comments/`, commentRouter);
app.use(`/api/${VERSION}/contact-us/`, contactUsRouter);
app.use(`/api/${VERSION}/newsletter/`, newsletterRouter);
app.use(`/api/${VERSION}/search/`, searchRouter);
app.use(`/api/${VERSION}/notifications/`, notificationRouter);
app.use(`/api/${VERSION}/discountCodes/`, discountCodeRouter);
app.use(`/api/${VERSION}/departments/`, departmentRouter);
app.use(`/api/${VERSION}/tickets/`, ticketRouter);
app.use(`/api/${VERSION}/menus/`, menuRouter);

app.use((err, req, res, next) => {
  return res.status(500).json({ message: err.message });
});

app.use((req, res) => {
  return res.status(400).json({ message: "Bad Request. Wrong Api !!" });
});

module.exports = app;
