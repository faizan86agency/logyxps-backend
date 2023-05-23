const { default: mongoose } = require("mongoose");

const ExpressBeesSchema = mongoose.Schema({
  Pincode: { type: Number },
  City: { type: String },
  State: { type: String },
  CODDelivery: { type: String },
  PrepaidDelivery: { type: String },
  Pickup: { type: String },
});

const ExpressBeesModel = mongoose.model("xpressbee", ExpressBeesSchema);

module.exports = {
  ExpressBeesModel,
};
