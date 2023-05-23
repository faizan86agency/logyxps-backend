const { default: mongoose } = require("mongoose");

const DelhiverySchema = mongoose.Schema({
  Pincode: { type: Number },
  City: { type: String },
  State: { type: String },
  DispatchCenter: { type: String },
  Prepaid: { type: String },
  ReversePickup: { type: String },
  COD: { type: String },
  REPL: { type: String },
});

const DelhiveryModel = mongoose.model("delhivery", DelhiverySchema);

module.exports = {
  DelhiveryModel,
};
