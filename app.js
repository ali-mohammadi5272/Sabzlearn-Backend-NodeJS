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
const sessionRouter = require(`./routes/${VERSION}/sessionRouter`);
const commentRouter = require(`./routes/${VERSION}/commentRouter`);
const contactUsRouter = require(`./routes/${VERSION}/contactUsRouter`);
const newsletterRouter = require(`./routes/${VERSION}/newsletterRouter`);
const searchRouter = require(`./routes/${VERSION}/searchRouter`);
const notificationRouter = require(`./routes/${VERSION}/notificationRouter`);
const discountCodeRouter = require(`./routes/${VERSION}/discountCodeRouter`);
const orderRouter = require(`./routes/${VERSION}/orderRouter`);
const departmentRouter = require(`./routes/${VERSION}/departmentRouter`);
const ticketRouter = require(`./routes/${VERSION}/ticketRouter`);
const menuRouter = require(`./routes/${VERSION}/menuRouter`);

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
app.use(`/api/${VERSION}/orders/`, orderRouter);
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
