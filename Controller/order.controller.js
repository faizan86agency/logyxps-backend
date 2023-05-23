const { OrderModel } = require("../Model/Order.model");
const {
  bluedart,
  ecomExpress,
  calculateEcomExpress,
  calculateExpressBees,
  calculateDTDC,
  calculateDelhivery,
} = require("./ShippingPartners.controller");

const addOrderDetails = async (req, res) => {
  let data = req.body;

  try {
    let order_detail = new OrderModel(data);
    await order_detail.save();
    res.send({ order_detail });
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: error });
  }
};

const addPackageDetails = async (req, res) => {
  let data = req.body;
  try {
    await OrderModel.findByIdAndUpdate(data.order_id, data);

    let order_detail = await OrderModel.findById(data.order_id);
    res.send({ order_detail });
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: error });
  }
};

const addOtherDetails = async (req, res) => {
  let data = req.body;
  try {
    await OrderModel.findByIdAndUpdate(data.order_id, data);
    let other_detail = await OrderModel.findById(data.order_id);
    res.send({ other_detail });
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: error });
  }
};

const getOrderDetails = async (req, res) => {
  const { orderId } = req.params;
  try {
    let order = await OrderModel.findById(orderId)
      .populate("buyer_detail_id")
      .populate("pickup_address_id")
      .populate("userID");
    if (order) {
      let response = {
        order,
      };
      // calculation of ecom express charges
      let ecom = await calculateEcomExpress(order);
      if (ecom) {
        response.ecom = ecom;
      }
      // calculation of xpressbees charges

      let xpressBees = await calculateExpressBees(order);
      if (xpressBees) {
        response.xpressBees = xpressBees;
      }
      // calculation of DTDC charges

      let dtdc = await calculateDTDC(order);
      if (dtdc) {
        response.dtdc = dtdc;
      }

      // calculation of Delhivery charges

      let delhivery = await calculateDelhivery(order);
      if (delhivery) {
        response.delhivery = delhivery;
      }

      res.send(response);
    } else {
      res.status(404).send({ message: "Not Found" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: error });
  }
};

const getAllUserOrders = async (req, res) => {
  const { userID } = req.body;
  const { status, page, limit, payment_method, filterBy } = req.query;

  try {
    let query = {};
    query.userID = userID;
    if (status) {
      query.status = status;
    }
    if (payment_method) {
      query.payment_method = payment_method;
    }

    // let days = filterBy[0];
    if (filterBy) {
      let startDate, endDate;

      if (filterBy === "today") {
        startDate = new Date();
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date();
        endDate.setHours(23, 59, 59, 999);
      } else if (filterBy === "yesterday") {
        const currentDate = new Date();
        startDate = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate() - 1
        );
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate() - 1
        );
        endDate.setHours(23, 59, 59, 999);
      } else if (filterBy === "7days") {
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);
        endDate = new Date();
      } else if (filterBy === "30days") {
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 30);
        endDate = new Date();
      } else if (filterBy === "thismonth") {
        const currentDate = new Date();
        startDate = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          1
        );
        endDate = new Date();
      } else if (filterBy === "lastmonth") {
        const currentDate = new Date();
        startDate = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() - 1,
          1
        );
        endDate = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          0
        );
      } else if (filterBy === "thisyear") {
        const currentDate = new Date();
        startDate = new Date(currentDate.getFullYear(), 0, 1);
        endDate = new Date();
      }

      query.createdAt = { $gte: startDate, $lte: endDate };
    }

    let orders = await OrderModel.find(query)
      .populate("buyer_detail_id")
      .populate("pickup_address_id")
      .limit(limit || 5)
      .skip((page - 1) * limit);
    res.send({ orders });
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: error });
  }
};

const getAllOrders = async (req, res) => {
  const { status, page, limit, payment_method, filterBy } = req.query;
  let query = {};
  if (status) {
    query.status = status;
  }
  if (payment_method) {
    query.payment_method = payment_method;
  }

  // let days = filterBy[0];
  if (filterBy) {
    let startDate, endDate;

    if (filterBy === "today") {
      startDate = new Date();
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date();
      endDate.setHours(23, 59, 59, 999);
    } else if (filterBy === "yesterday") {
      const currentDate = new Date();
      startDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate() - 1
      );
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate() - 1
      );
      endDate.setHours(23, 59, 59, 999);
    } else if (filterBy === "7days") {
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);
      endDate = new Date();
    } else if (filterBy === "30days") {
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);
      endDate = new Date();
    } else if (filterBy === "thismonth") {
      const currentDate = new Date();
      startDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
      );
      endDate = new Date();
    } else if (filterBy === "lastmonth") {
      const currentDate = new Date();
      startDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - 1,
        1
      );
      endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
    } else if (filterBy === "thisyear") {
      const currentDate = new Date();
      startDate = new Date(currentDate.getFullYear(), 0, 1);
      endDate = new Date();
    }

    query.createdAt = { $gte: startDate, $lte: endDate };
  }
  try {
    const allorders = await OrderModel.find(query)
      .populate("buyer_detail_id")
      .populate("pickup_address_id")
      .populate("user_id")
      .select({ password: 0 });
    res.send({ allorders });
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: error });
  }
};

const addOrder = async (req, res) => {
  const data = req.body;
  try {
    let order = new OrderModel(data);
    await order.save();

    res.send({ order });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Bad request" });
  }
};

// cancellation of the order

const cancelOrder = async (req, res) => {
  const { orderID } = req.params;

  try {
    let data = await OrderModel.findByIdAndUpdate(orderID, {
      status: "Cancelled",
    });
    res.send({ message: "Order is successfully cancelled." });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Bad request" });
  }
};

const addMultipleOrders = async (req, res) => {
  const { orders, userID } = req.body;
  try {
    let data = orders.map((item) => ({ ...item, userID }));

    await OrderModel.insertMany(data);
    res.send({ message: "Orders are created successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Bad request" });
  }
};

module.exports = {
  addOrderDetails,
  addPackageDetails,
  addOtherDetails,
  getOrderDetails,
  getAllUserOrders,
  getAllOrders,
  addOrder,
  cancelOrder,
  addMultipleOrders,
};
