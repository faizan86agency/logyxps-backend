const { BuyerDetailModel } = require("../Model/Buyer.model");

const addBuyerDetails = async (req, res) => {
  let data = req.body;

  try {
    let buyer_details = new BuyerDetailModel(data);
    await buyer_details.save();
    res.send({ buyer_details });
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: error });
  }
};

module.exports = {
  addBuyerDetails,
};
