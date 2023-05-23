const express = require("express");
const { connect } = require("./Config/db");
const {
  registerUser,
  checkExistingEmail,
  loginUser,
  getUserDetails,
  getAllUsers,
  verifyUser,
  requestForgotPassword,
  confirmPasswordData,
  updateUserDetails,
} = require("./Controller/user.controller");
const cors = require("cors");
const { addBuyerDetails } = require("./Controller/buyer.controller");
const {
  addOrderDetails,
  addPackageDetails,
  getOrderDetails,
  getAllOrders,
} = require("./Controller/order.controller");
const {
  addPickupAddress,
  getPickupAddress,
} = require("./Controller/pickup.controller");
const { orderRouter } = require("./Routes/Orders.routes");
const { shippingPartnerRouter } = require("./Routes/ShippingPartners.routes");
const { authenticator } = require("./Middleware/Authenticator");
const { AdminAuth } = require("./Controller/Admin.controller");
const { adminAuthenticator } = require("./Middleware/AdminAuthenticator");
const { shopifyRouter } = require("./Routes/Shopify.routes");

const app = express();

app.use(cors());

app.use(express.static("Frontend/dist"));
app.use(express.json());

// all api routes will start with /api

app.get("/api/hello", (req, res) => {
  res.send("Hello");
});

//shopify Routes
app.use("/", shopifyRouter);

// api request to check the user is exist or not
app.post("/api/check-email", checkExistingEmail);

// api route for user registration
app.post("/api/customer-registration", registerUser);

// api for verify user
app.post("/api/email-verify", verifyUser);

// api request to login the user
app.post("/api/login", loginUser);

// api request to details of the user
app.get("/api/user-details/:userId", getUserDetails);

// api to get all user details
app.get("/api/all-user-details", adminAuthenticator, getAllUsers);

// api to get all orders details
app.get("/api/all-orders-details", adminAuthenticator, getAllOrders);

// api to update the user
app.patch("/api/update-user-info/", authenticator, updateUserDetails);

// api to request email for reset password
app.post("/api/user/request-password", requestForgotPassword);

// api to confirm password
app.post("/api/user/confirm-password", confirmPasswordData);

// api to post the buyer details
app.post("/api/buyer-details", addBuyerDetails);

// api to post the order details
app.post("/api/order-detail", addOrderDetails);

app.get("/api/get-order-details/:orderId", getOrderDetails);

// api to post the pickup addresses details
app.post("/api/add-pickup-address", addPickupAddress);

// api to get the pickup addresses
app.get("/api/pickup-address/:data", getPickupAddress);

// api to save the package Details
app.post("/api/save-package-weight", addPackageDetails);

// api to orders
app.use("/api/orders", orderRouter);
// app.use("/api/sp", shippingPartnerRouter);

// admin Login

app.post("/api/admin-login", AdminAuth);

// // html request
// app.get("/*", (req, res) => {
//   res.setHeader("Content-Type", "text/html");
//   res.sendFile(__dirname + "/Frontend/dist/index.html");
// });

app.listen(8080, async () => {
  try {
    await connect;
    console.log("server is running");
  } catch (error) {
    console.log(error);
  }
});
