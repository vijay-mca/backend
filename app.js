const express = require("express");
const  dotenv = require("dotenv");
const path = require("path");
const ConnectDB = require("./database/db");
const app = express();

const envPath = path.resolve(__dirname, ".env");

dotenv.config({ path: envPath });

ConnectDB();

const port = Number(process.env.PORT) | 3000;

app.use("/response", require("./router/response.router"))

app.listen(port, () => {
  console.log("Server running");
});
