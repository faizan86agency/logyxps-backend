const express = require("express");
const { shopifyCallback, shopifyLogin } = require("../Controller/shopify.controller");
const shopifyRouter = express.Router();

shopifyRouter.get("/shopify", shopifyLogin);
shopifyRouter.get("/shopify/callback", shopifyCallback);

module.exports = {
    shopifyRouter
}
