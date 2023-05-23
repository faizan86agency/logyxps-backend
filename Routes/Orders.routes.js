const express = require("express");
const {
  getAllUserOrders,
  addOrder,
  cancelOrder,
  addMultipleOrders,
} = require("../Controller/order.controller");
const { authenticator } = require("../Middleware/Authenticator");

const orderRouter = express.Router();

orderRouter.use(authenticator);

orderRouter.get("/get-user-orders", getAllUserOrders);

orderRouter.post("/add-order", addOrder);

orderRouter.post("/add-multiple-orders", addMultipleOrders);

orderRouter.patch("/cancel-order/:orderID", cancelOrder);

module.exports = {
  orderRouter,
};
