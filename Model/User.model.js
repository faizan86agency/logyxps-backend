const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true },
    company: { type: String, required: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    gender: { type: String },
    city: { type: String },
    state_id: { type: String },
    pincode: { type: String },
    status: { type: String, enum: ["active", "disable"], default: "active" },
    verified: { type: Boolean, default: false },
    role: { type: String, enum: ["user", "Admin"], default: "user" },
    profile_img: { type: String },
    email_verified_at: { type: Boolean },
    terms_and_conditions: { type: String },
    isCompleted: { type: Boolean, default: false },
    company_type: { type: String },
    monthly_expected_orders: { type: String },
    selling_channels: [{ type: String }],
    is_international: { type: Boolean },
    website_url: { type: String },
    company_details: {
      company_logo: { type: String },
      registered_company_name: { type: String },
      brand_name: { type: String },
    },
    company_registerd_address: {
      address_line_1: { type: String },
      address_line_2: { type: String },
      city: { type: String },
      pincode: { type: Number },
      state: { type: String },
      country: { type: String },
    },
  },
  { timestamps: true }
);

const UserModel = mongoose.model("user", userSchema);

module.exports = { UserModel };
