require("dotenv").config();
const { default: connectToDB } = require("./configs/db");
const app = require("./app");
connectToDB();

app.listen(process.env.port, () => {
  console.log(`App listening on ${process.env.port}`);
});
