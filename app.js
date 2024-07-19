const express = require("express");
const { default: authRouter } = require("./routes/authRouter");

const app = express();

app.use(express.json());
app.use(express.urlencoded());

app.use("/api/auth/", authRouter);

module.exports = app;
