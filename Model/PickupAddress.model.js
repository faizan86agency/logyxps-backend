const mongoose = require("mongoose");

const pickupAddressSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "user",
    },
    address_type: { type: String },
    contact_person: { type: String },
    contact_number: { type: String },
    email_address: { type: String },
    alt_phone: { type: String },
    compelete_address: { type: String },
    landmark: { type: String },
    pincode: { type: String },
    city: { type: String },
    state_id: { type: String },
    country_id: { type: String },
    map_location: { type: String },
    supplier_address: { type: String },
    rto_address: { type: String },

}, {
    timestamps: true,

});

const PickupAddressModel = mongoose.model(
    "pickup_address",
    pickupAddressSchema
);

module.exports = PickupAddressModel;
