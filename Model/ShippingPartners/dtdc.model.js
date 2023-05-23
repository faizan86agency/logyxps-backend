const { default: mongoose } = require("mongoose");

const DTDCSchema = mongoose.Schema({
  Pincode: { type: Number },
  City: { type: String },
  State: { type: String },
  Area: { type: String },
  PincodeCategory: { type: String },
  EndMileTAT: { type: Number },
  LineHaulTAT: { type: Number },
});

const DTDCModel = mongoose.model("dtdc", DTDCSchema);

module.exports = {
  DTDCModel,
};
