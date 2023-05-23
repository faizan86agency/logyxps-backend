const mongoose = require("mongoose");

const buyerDetailSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "user",
        },
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
    { timestamps: true }
);

const BuyerDetailModel = mongoose.model("buyer_detail", buyerDetailSchema);

module.exports = { BuyerDetailModel };
