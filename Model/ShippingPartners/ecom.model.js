const { default: mongoose } = require("mongoose");

const EcomSchema = mongoose.Schema({
  PINCODE: { type: Number },
  AREA: { type: String },
  DCCode: { type: String },
  CITYNAME: { type: String },
  STATE: { type: String },
  REGION: { type: String },
  Status: { type: String },
});

const EcomModel = mongoose.model("ecom", EcomSchema);

module.exports = {
  EcomModel,
};
