const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ResponseSchema = new Schema({
  ReferenceNo: { type: String },
  AirWayFillNo: { type: String },
  House: [
    {
      HouseNo: { type: String },
      HouseDetails: { type: [String] },
    },
  ],
});
const ResponseModel = mongoose.model("response", ResponseSchema);
module.exports = ResponseModel;
