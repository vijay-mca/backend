const mongoose = require("mongoose");

const ConnectDB = async (req, res) => {
  try {
    mongoose.set("strictQuery", false);
    mongoose.connect(process.env.DB_URL);

    const db = mongoose.connection;

    db.on("error", console.error.bind(console, "connection error: "));
    db.once("open", function () {
      console.log("Connected successfully");
    });
  } catch (err) {
    console.error(err.message);
  }
};

module.exports = ConnectDB;
