require("dotenv").config();
const { default: connectToDB } = require("./configs/db");
const app = require("./app");
connectToDB();

app.listen(process.env.PORT, () => {
  console.log(`App listening on ${process.env.PORT}`);
});
