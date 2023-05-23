const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    buyer_detail_id: {
      buyer_name: { type: String },
      shipping_email: { type: String },
      phone_number: { type: String },
      alt_phone_number: { type: String },
      company_name: { type: String },
      gstin: { type: String },
      complete_address: { type: String },
      Landmark: { type: String },
      pincode: { type: String },
      city: { type: String },
      state: { type: String },
      country: { type: String },
      billing_address: { type: String },
      status: { type: Number, enum: [0, 1], default: 0 },
    },
    order_date: { type: Date },
    order_channel: { type: String },
    order_type: { type: String },
    order_tag: { type: String },
    payment_method: { type: String, enum: ["COD", "Prepaid"] },
    gift_wrap: { type: String },
    transaction_fee: { type: String },
    discounts: { type: String },
    sub_total_of_products: { type: String },
    other_change: { type: String },
    grand_total_order: { type: String },
    status: {
      type: String,
      enum: [
        "New",
        "Ready To Ship",
        "Pickups",
        "In Transit",
        "Delivered",
        "RTO",
        "Cancelled",
      ],
      default: "New",
    },
    product: [
      {
        product_name: { type: String },
        sku: { type: String },
        quantity: { type: Number },
        unit_price: { type: String },
        tax_rate: { type: String },
        hsn: { type: String },
        discount: { type: String },
        product_category: { type: String },
        status: { type: String, enum: ["0", "1", "2", "3"], default: "0" },
      },
    ],
    pickup_address_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "pickup_address",
    },
    weight_kg: { type: Number },
    length: { type: Number },
    width: { type: Number },
    height: { type: Number },
    actual_box_weight: { type: Number },
    actual_volume_weight: { type: Number },
    package_id: { type: String },
    reseller_name: { type: String },
    gstin_number: { type: String },
  },
  { timestamps: true }
);

const OrderModel = mongoose.model("order", orderSchema);

module.exports = { OrderModel };
