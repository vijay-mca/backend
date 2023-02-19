const express = require("express");
const router = express.Router();
const ResponseModel = require("../schema/Response");

router.get("/", async (req, res) => {
  const response = await ResponseModel.find().exec();
  return res.json({ status: "success", result: response });
});

router.post("/", async (req, res) => {
  const resp = new ResponseModel();
  const ReferenceNo = "CRQ_CQ_021623_00004501";
  const HouseNo = "MDE054376093";

  const response = await ResponseModel.findOne({
    ReferenceNo: ReferenceNo,
  }).exec();

  if (response) {
    const house = await ResponseModel.findOne({
      ReferenceNo: ReferenceNo,
      "House.HouseNo": HouseNo,
    }).exec();
    let HouseDet =
      "WSD0214230636161CENTER AND RELEASED GENERAL EXAM         9B712983169  ";
    if (house) {
      const result = await ResponseModel.updateOne(
        { _id: house._id },
        { $push: { "House.$[h].HouseDetails": HouseDet } },
        { arrayFilters: [{ "h.HouseNo": HouseNo }] }
      );
      return res.json({ status: "success", result });
    } else {
      const result = await ResponseModel.updateOne(
        { _id: response._id },
        { $push: { House: { HouseNo: HouseNo } } }
      );

      return res.json({ status: "success", result });
    }
  } else {
    resp.ReferenceNo = ReferenceNo;
    const house = await ResponseModel.findOne({
      ReferenceNo: ReferenceNo,
      "House.HouseNo": HouseNo,
    }).exec();
    //     { arrayFilter: [{ "h.HouseNo": HouseNo }] }
    let HouseDet = "WSD0214230214502HCBPA HOLD AT PORT OF ARRIVAL  ";
    if (house) {
      await ResponseModel.updateOne(
        { _id: house._id },
        { $push: { "House.$[h].HouseDetails": HouseDet } },
        { arrayFilters: [{ "h.HouseNo": HouseNo }] }
      );
    } else {
      resp.House.push({ HouseNo: HouseNo });
      const result = await resp.save();
      return res.json({ status: "success", result });
    }
  }
});

router.get("/filter/:responseNo/:houseNo", async (req, res) => {
  try {
    const ReferenceNo = req.params.responseNo;
    const HouseNo = req.params.houseNo;

    //[ { $getField: "House.$[h].HouseNo" }, HouseNo ]
    // const result = await ResponseModel.find({
    //   ReferenceNo: ReferenceNo,
    //   "House.HouseNo": HouseNo,
    // });

    const result = await ResponseModel.aggregate([
      //Pre-filter to have data arrays with at least one matching date
      { $match: { ReferenceNo } },
      //Filter the items array
      {
        $addFields: {
          HouseInfo: {
            $filter: {
              input: "$House",
              as: "item",
              cond: {
                $and: [{ $eq: ["$$item.HouseNo", HouseNo] }],
              },
            },
          },
        },
      },
    ]);
const ResponseData = {
    ReferenceNo: result[0].ReferenceNo,
    HouseInfo: result[0].HouseInfo
}
    return res.json({ status: "success", ResponseData });
  } catch (err) {
    return res.json({ staus: "error", message: err.message });
  }
});

module.exports = router;
