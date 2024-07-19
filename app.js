require("dotenv").config();
const express = require("express");

const app = express();

app.use(express.json());
app.use(express.urlencoded());

app.listen(process.env.port, () => {
  console.log(`App listening on ${process.env.port}`);
});
