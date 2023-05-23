const express = require("express");
const { bluedart } = require("../Controller/ShippingPartners.controller");

const shippingPartnerRouter = express.Router();

shippingPartnerRouter.post("/bluedart", bluedart);

module.exports = { shippingPartnerRouter }