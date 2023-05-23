const { default: mongoose } = require("mongoose");

const AdminSchmema = mongoose.Schema({
  name: { type: String },
  email: { type: String },
  password: { type: String },
});

const AdminModel = mongoose.model("admin", AdminSchmema);

module.exports = {
  AdminModel,
};
