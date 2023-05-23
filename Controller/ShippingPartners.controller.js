const axios = require("axios");
const FormData = require("form-data");
const { EcomModel } = require("../Model/ShippingPartners/ecom.model");
const {
  ExpressBeesModel,
} = require("../Model/ShippingPartners/expressBees.model");
const { DTDCModel } = require("../Model/ShippingPartners/dtdc.model");
const { DelhiveryModel } = require("../Model/ShippingPartners/delhivery.model");

const bluedart = async (order) => {
  let payload = {
    pPinCodeFrom: order?.pickup_address_id?.pincode,
    pPinCodeTo: order?.buyer_detail_id?.pincode,
    pProductCode: "E",
    pSubProductCode: "P",
    pPudate: `/Date(${Date.now()})/`,
    pPickupTime: "16:00",
    profile: {
      Api_type: "S",
      Area: "ALL",
      Customercode: "",
      IsAdmin: "",
      LicenceKey: "kh7mnhqkmgegoksipxr0urmqesesseup",
      LoginID: "GG940111",
      Version: "1.10",
    },
  };
  const endpoint = `https://netconnect.bluedart.com/API-QA/Ver1.10/Demo/ShippingAPI/Finder/ServiceFinderQuery.svc/rest/GetDomesticTransitTimeForPinCodeandProduct`;
  let result = {};

  try {
    let r = await axios.post(endpoint, payload);
    result = r?.data?.GetDomesticTransitTimeForPinCodeandProductResult;
    // console.log(result);
    return Promise.resolve(result);
  } catch (error) {
    console.log(err);
    return Promise.reject(err);
  }
};

const ecomExpress = async (order) => {
  const url = "https://ratecard.ecomexpress.in/services/rateCalculatorAPI/";
  let data = new FormData();

  let productType = order?.payment_method === "COD" ? "cod" : "ppd";
  let codAmount =
    order?.payment_method === "COD" ? order?.grand_total_order : 0;
  //   console.log(productType, codAmount);

  data.append("username", "LOGYXPRESS310592");
  data.append("password", "U3cpYr4Tvq3S");
  data.append(
    "json_input",
    `[{
        "orginPincode": ${order?.pickup_address_id?.pincode},
        "destinationPincode": ${order?.buyer_detail_id?.pincode},
        "productType":"${productType}",
    "chargeableWeight": ${order?.weight_kg},
    "codAmount": ${codAmount}
  }]`
  );
  let result = {};

  try {
    let response = await axios.post(url, data);
    // console.log(response.data[0]);
    result = response?.data[0];
    return Promise.resolve(result);
  } catch (error) {
    console.log("error");
    return Promise.reject(error);
  }
};

const calculateEcomExpress = async (order) => {
  try {
    let destination = await EcomModel.findOne({
      PINCODE: order.buyer_detail_id.pincode,
    });
    let origin = await EcomModel.findOne({
      PINCODE: order.pickup_address_id.pincode,
    });

    if (!destination || !origin) {
      return false;
    }

    let ZONE = "";

    let metroCities = ["DELHI", "MUMBAI", "BENGALURU", "CHENNAI", "KOLKATA"];

    if (destination.CITYNAME === origin.CITYNAME) {
      ZONE = "A";
    } else if (destination.STATE === origin.STATE) {
      ZONE = "B";
    } else if (
      metroCities.includes(destination.CITYNAME) &&
      metroCities.includes(origin.CITYNAME)
    ) {
      ZONE = "C";
    } else if (
      destination.REGION === "NTHEST" ||
      origin.REGION === "NTHEST" ||
      destination.STATE === "JK" ||
      origin.STATE === "JK" ||
      destination.STATE === "HP" ||
      origin.STATE === "HP"
    ) {
      ZONE = "E";
    } else {
      ZONE = "D";
    }

    let res = {
      ZONE,
    };

    const { actual_volume_weight } = order;

    switch (ZONE) {
      case "A": {
        res.esteemate_delivery_tat = "1-2";
        let cost = 0;
        if (actual_volume_weight > 5) {
          cost = Math.ceil((actual_volume_weight - 5) / 0.5) * 25;
          cost += 9 * 20;
          cost += 30;
        } else if (actual_volume_weight > 0.5) {
          cost = Math.ceil((actual_volume_weight - 0.5) / 0.5) * 20;
          // console.log({ cost });
          cost += 30;
        } else {
          cost = 30;
        }
        res.esteemate_cost_of_delivery = cost;
        break;
      }
      case "B": {
        res.esteemate_delivery_tat = "2-3";
        let cost = 0;
        if (actual_volume_weight > 5) {
          cost = Math.ceil((actual_volume_weight - 5) / 0.5) * 35;
          cost += 9 * 30;
          cost += 40;
        } else if (actual_volume_weight > 0.5) {
          cost = Math.ceil((actual_volume_weight - 0.5) / 0.5) * 30;
          cost += 40;
        } else {
          cost = 40;
        }
        res.esteemate_cost_of_delivery = cost;
        break;
      }
      case "C": {
        res.esteemate_delivery_tat = "3-4";
        let cost = 0;
        if (actual_volume_weight > 5) {
          cost = Math.ceil((actual_volume_weight - 5) / 0.5) * 41;
          cost += 9 * 35;
          cost += 45;
        } else if (actual_volume_weight > 0.5) {
          cost = Math.ceil((actual_volume_weight - 0.5) / 0.5) * 35;
          cost += 45;
        } else {
          cost = 45;
        }
        res.esteemate_cost_of_delivery = cost;
        break;
      }
      case "D": {
        res.esteemate_delivery_tat = "4-5";
        let cost = 0;
        if (actual_volume_weight > 5) {
          cost = Math.ceil((actual_volume_weight - 5) / 0.5) * 47;
          cost += 9 * 45;
          cost += 50;
        } else if (actual_volume_weight > 0.5) {
          cost = Math.ceil((actual_volume_weight - 0.5) / 0.5) * 45;
          cost += 50;
        } else {
          cost = 50;
        }
        res.esteemate_cost_of_delivery = cost;
        break;
      }
      case "E": {
        res.esteemate_delivery_tat = "5-6";
        let cost = 0;
        if (actual_volume_weight > 5) {
          cost = Math.ceil((actual_volume_weight - 5) / 0.5) * 50;
          cost += 9 * 50;
          cost += 55;
        } else if (actual_volume_weight > 0.5) {
          cost = Math.ceil((actual_volume_weight - 0.5) / 0.5) * 50;
          cost += 55;
        } else {
          cost = 55;
        }
        res.esteemate_cost_of_delivery = cost;
        break;
      }
      case "F": {
        res.esteemate_delivery_tat = "Minimum 10";
        let cost = 0;
        if (actual_volume_weight > 5) {
          cost = Math.ceil((actual_volume_weight - 5) / 0.5) * 65;
          cost += 9 * 70;
          cost += 120;
        } else if (actual_volume_weight > 0.5) {
          cost = Math.ceil((actual_volume_weight - 0.5) / 0.5) * 70;
          cost += 120;
        } else {
          cost = 120;
        }
        res.esteemate_cost_of_delivery = cost;
        break;
      }
      default: {
        console.log("NOT IN SWITCH");
        break;
      }
    }

    return Promise.resolve(res);
  } catch (error) {
    console.log(error);
    return Promise.reject(false);
  }
};

const calculateExpressBees = async (order) => {
  try {
    let destination = await ExpressBeesModel.findOne({
      Pincode: order.buyer_detail_id.pincode,
    });
    let origin = await ExpressBeesModel.findOne({
      Pincode: order.pickup_address_id.pincode,
    });

    if (!destination || !origin) {
      return false;
    }
    let ZONE = "";

    let metroCities = [
      "NEW DELHI",
      "MUMBAI",
      "BANGALORE",
      "CHENNAI",
      "KOLKATA",
    ];

    let NTHEST = [
      "ARUNACHAL PRADESH",
      "ASSAM",
      "MANIPUR",
      "MEGHALAYA",
      "MIZORAM",
      "NAGALAND",
      "SIKKIM",
      "TRIPURA",
    ];

    if (destination.City === origin.City) {
      ZONE = "A";
    } else if (destination.State === origin.State) {
      ZONE = "B";
    } else if (
      metroCities.includes(destination.City) &&
      metroCities.includes(origin.City)
    ) {
      ZONE = "C";
    } else if (
      NTHEST.includes(origin.State) ||
      NTHEST.includes(destination.State) ||
      destination.State === "JAMMU AND KASHMIR" ||
      origin.State === "JAMMU AND KASHMIR" ||
      destination.State === "HIMACHAL PRADESH" ||
      origin.State === "HIMACHAL PRADESH"
    ) {
      ZONE = "E";
    } else {
      ZONE = "D";
    }

    let res = {
      ZONE,
    };

    const { actual_volume_weight } = order;

    switch (ZONE) {
      case "A": {
        res.esteemate_delivery_tat = "1-2";
        let cost = 0;
        if (actual_volume_weight > 5) {
          cost = Math.ceil((actual_volume_weight - 5) / 0.5) * 24;
          cost += 9 * 19;
          cost += 29;
        } else if (actual_volume_weight > 0.5) {
          cost = Math.ceil((actual_volume_weight - 0.5) / 0.5) * 19;
          // console.log({ cost });
          cost += 29;
        } else {
          cost = 29;
        }
        res.esteemate_cost_of_delivery = cost;
        break;
      }
      case "B": {
        res.esteemate_delivery_tat = "2-3";
        let cost = 0;
        if (actual_volume_weight > 5) {
          cost = Math.ceil((actual_volume_weight - 5) / 0.5) * 34;
          cost += 9 * 29;
          cost += 39;
        } else if (actual_volume_weight > 0.5) {
          cost = Math.ceil((actual_volume_weight - 0.5) / 0.5) * 29;
          cost += 39;
        } else {
          cost = 39;
        }
        res.esteemate_cost_of_delivery = cost;
        break;
      }
      case "C": {
        res.esteemate_delivery_tat = "3-4";
        let cost = 0;
        if (actual_volume_weight > 5) {
          cost = Math.ceil((actual_volume_weight - 5) / 0.5) * 42;
          cost += 9 * 34;
          cost += 44;
        } else if (actual_volume_weight > 0.5) {
          cost = Math.ceil((actual_volume_weight - 0.5) / 0.5) * 34;
          cost += 44;
        } else {
          cost = 44;
        }
        res.esteemate_cost_of_delivery = cost;
        break;
      }
      case "D": {
        res.esteemate_delivery_tat = "4-5";
        let cost = 0;
        if (actual_volume_weight > 5) {
          cost = Math.ceil((actual_volume_weight - 5) / 0.5) * 46;
          cost += 9 * 44;
          cost += 49;
        } else if (actual_volume_weight > 0.5) {
          cost = Math.ceil((actual_volume_weight - 0.5) / 0.5) * 44;
          cost += 49;
        } else {
          cost = 49;
        }
        res.esteemate_cost_of_delivery = cost;
        break;
      }
      case "E": {
        res.esteemate_delivery_tat = "5-6";
        let cost = 0;
        if (actual_volume_weight > 5) {
          cost = Math.ceil((actual_volume_weight - 5) / 0.5) * 49;
          cost += 9 * 49;
          cost += 54;
        } else if (actual_volume_weight > 0.5) {
          cost = Math.ceil((actual_volume_weight - 0.5) / 0.5) * 49;
          cost += 54;
        } else {
          cost = 54;
        }
        res.esteemate_cost_of_delivery = cost;
        break;
      }
      case "F": {
        res.esteemate_delivery_tat = "Minimum 10";
        let cost = 0;
        if (actual_volume_weight > 5) {
          cost = Math.ceil((actual_volume_weight - 5) / 0.5) * 64;
          cost += 9 * 69;
          cost += 119;
        } else if (actual_volume_weight > 0.5) {
          cost = Math.ceil((actual_volume_weight - 0.5) / 0.5) * 69;
          cost += 119;
        } else {
          cost = 119;
        }
        res.esteemate_cost_of_delivery = cost;
        break;
      }
      default: {
        console.log("NOT IN SWITCH");
        break;
      }
    }

    return Promise.resolve(res);
  } catch (error) {
    console.log(error);
    return Promise.reject(false);
  }
};

const calculateDTDC = async (order) => {
  try {
    let destination = await DTDCModel.findOne({
      Pincode: order.buyer_detail_id.pincode,
    });
    console.log(destination, order.buyer_detail_id.pincode);
    let origin = await DTDCModel.findOne({
      Pincode: order.pickup_address_id.pincode,
    });

    if (!destination || !origin) {
      return false;
    }

    let ZONE = "";

    let metroCities = [
      "NEW DELHI",
      "MUMBAI",
      "BANGALORE",
      "CHENNAI",
      "KOLKATA",
    ];
    let NTHEST = [
      "ARUNACHAL PRADESH",
      "ASSAM",
      "MANIPUR",
      "MEGHALAYA",
      "MIZORAM",
      "NAGALAND",
      "SIKKIM",
      "TRIPURA",
    ];

    if (destination.City === origin.City) {
      ZONE = "A";
    } else if (destination.State === origin.State) {
      ZONE = "B";
    } else if (
      metroCities.includes(destination.City) &&
      metroCities.includes(origin.City)
    ) {
      ZONE = "C";
    } else if (
      NTHEST.includes(destination.State) ||
      NTHEST.includes(origin.State) ||
      destination.State === "JAMMU AND KASHMIR" ||
      origin.State === "JAMMU AND KASHMIR" ||
      destination.State === "HIMACHAL PRADESH" ||
      origin.State === "HIMACHAL PRADESH"
    ) {
      ZONE = "E";
    } else {
      ZONE = "D";
    }

    let res = {
      ZONE,
    };

    const { actual_volume_weight } = order;

    switch (ZONE) {
      case "A": {
        res.esteemate_delivery_tat = "1-2";
        let cost = 0;
        if (actual_volume_weight > 5) {
          cost = Math.ceil((actual_volume_weight - 5) / 0.5) * 25;
          cost += 9 * 20;
          cost += 30;
        } else if (actual_volume_weight > 0.5) {
          cost = Math.ceil((actual_volume_weight - 0.5) / 0.5) * 20;
          // console.log({ cost });
          cost += 30;
        } else {
          cost = 30;
        }
        res.esteemate_cost_of_delivery = cost;
        break;
      }
      case "B": {
        res.esteemate_delivery_tat = "2-3";
        let cost = 0;
        if (actual_volume_weight > 5) {
          cost = Math.ceil((actual_volume_weight - 5) / 0.5) * 35;
          cost += 9 * 30;
          cost += 40;
        } else if (actual_volume_weight > 0.5) {
          cost = Math.ceil((actual_volume_weight - 0.5) / 0.5) * 30;
          cost += 40;
        } else {
          cost = 40;
        }
        res.esteemate_cost_of_delivery = cost;
        break;
      }
      case "C": {
        res.esteemate_delivery_tat = "3-4";
        let cost = 0;
        if (actual_volume_weight > 5) {
          cost = Math.ceil((actual_volume_weight - 5) / 0.5) * 41;
          cost += 9 * 35;
          cost += 45;
        } else if (actual_volume_weight > 0.5) {
          cost = Math.ceil((actual_volume_weight - 0.5) / 0.5) * 35;
          cost += 45;
        } else {
          cost = 45;
        }
        res.esteemate_cost_of_delivery = cost;
        break;
      }
      case "D": {
        res.esteemate_delivery_tat = "4-5";
        let cost = 0;
        if (actual_volume_weight > 5) {
          cost = Math.ceil((actual_volume_weight - 5) / 0.5) * 47;
          cost += 9 * 45;
          cost += 50;
        } else if (actual_volume_weight > 0.5) {
          cost = Math.ceil((actual_volume_weight - 0.5) / 0.5) * 45;
          cost += 50;
        } else {
          cost = 50;
        }
        res.esteemate_cost_of_delivery = cost;
        break;
      }
      case "E": {
        res.esteemate_delivery_tat = "5-6";
        let cost = 0;
        if (actual_volume_weight > 5) {
          cost = Math.ceil((actual_volume_weight - 5) / 0.5) * 50;
          cost += 9 * 50;
          cost += 55;
        } else if (actual_volume_weight > 0.5) {
          cost = Math.ceil((actual_volume_weight - 0.5) / 0.5) * 50;
          cost += 55;
        } else {
          cost = 55;
        }
        res.esteemate_cost_of_delivery = cost;
        break;
      }
      case "F": {
        res.esteemate_delivery_tat = "Minimum 10";
        let cost = 0;
        if (actual_volume_weight > 5) {
          cost = Math.ceil((actual_volume_weight - 5) / 0.5) * 65;
          cost += 9 * 70;
          cost += 120;
        } else if (actual_volume_weight > 0.5) {
          cost = Math.ceil((actual_volume_weight - 0.5) / 0.5) * 70;
          cost += 120;
        } else {
          cost = 120;
        }
        res.esteemate_cost_of_delivery = cost;
        break;
      }
      default: {
        console.log("NOT IN SWITCH");
        break;
      }
    }

    return Promise.resolve(res);
  } catch (error) {
    console.log(error);
    return Promise.reject(false);
  }
};

const calculateDelhivery = async (order) => {
  try {
    let destination = await DelhiveryModel.findOne({
      Pincode: order.buyer_detail_id.pincode,
    });
    let origin = await DelhiveryModel.findOne({
      Pincode: order.pickup_address_id.pincode,
    });

    if (!destination || !origin) {
      return false;
    }
    let ZONE = "";

    let metroCities = ["Delhi", "Mumbai", "Bangalore", "Chennai", "Kolkata"];
    let NTHEST = [
      "Arunachal Pradesh",
      "Assam",
      "Manipur",
      "Meghalaya",
      "Mizoram",
      "Nagaland",
      "Sikkim",
      "Tripura",
    ];

    if (destination.City === origin.City) {
      ZONE = "A";
    } else if (destination.State === origin.State) {
      ZONE = "B";
    } else if (
      metroCities.includes(destination.City) &&
      metroCities.includes(origin.City)
    ) {
      ZONE = "C";
    } else if (
      NTHEST.includes(destination.State) ||
      NTHEST.includes(origin.State) ||
      destination.State === "Jammu & Kashmir" ||
      origin.State === "Jammu & Kashmir" ||
      destination.State === "Himachal Pradesh" ||
      origin.State === "Himachal Pradesh"
    ) {
      ZONE = "E";
    } else {
      ZONE = "D";
    }

    let res = {
      ZONE,
    };

    const { actual_volume_weight } = order;

    switch (ZONE) {
      case "A": {
        res.esteemate_delivery_tat = "1-2";
        let cost = 0;
        if (actual_volume_weight > 5) {
          cost = Math.ceil((actual_volume_weight - 5) / 0.5) * 25;
          cost += 9 * 20;
          cost += 30;
        } else if (actual_volume_weight > 0.5) {
          cost = Math.ceil((actual_volume_weight - 0.5) / 0.5) * 20;
          // console.log({ cost });
          cost += 30;
        } else {
          cost = 30;
        }
        res.esteemate_cost_of_delivery = cost;
        break;
      }
      case "B": {
        res.esteemate_delivery_tat = "2-3";
        let cost = 0;
        if (actual_volume_weight > 5) {
          cost = Math.ceil((actual_volume_weight - 5) / 0.5) * 35;
          cost += 9 * 30;
          cost += 40;
        } else if (actual_volume_weight > 0.5) {
          cost = Math.ceil((actual_volume_weight - 0.5) / 0.5) * 30;
          cost += 40;
        } else {
          cost = 40;
        }
        res.esteemate_cost_of_delivery = cost;
        break;
      }
      case "C": {
        res.esteemate_delivery_tat = "3-4";
        let cost = 0;
        if (actual_volume_weight > 5) {
          cost = Math.ceil((actual_volume_weight - 5) / 0.5) * 41;
          cost += 9 * 35;
          cost += 45;
        } else if (actual_volume_weight > 0.5) {
          cost = Math.ceil((actual_volume_weight - 0.5) / 0.5) * 35;
          cost += 45;
        } else {
          cost = 45;
        }
        res.esteemate_cost_of_delivery = cost;
        break;
      }
      case "D": {
        res.esteemate_delivery_tat = "4-5";
        let cost = 0;
        if (actual_volume_weight > 5) {
          cost = Math.ceil((actual_volume_weight - 5) / 0.5) * 47;
          cost += 9 * 45;
          cost += 50;
        } else if (actual_volume_weight > 0.5) {
          cost = Math.ceil((actual_volume_weight - 0.5) / 0.5) * 45;
          cost += 50;
        } else {
          cost = 50;
        }
        res.esteemate_cost_of_delivery = cost;
        break;
      }
      case "E": {
        res.esteemate_delivery_tat = "5-6";
        let cost = 0;
        if (actual_volume_weight > 5) {
          cost = Math.ceil((actual_volume_weight - 5) / 0.5) * 50;
          cost += 9 * 50;
          cost += 55;
        } else if (actual_volume_weight > 0.5) {
          cost = Math.ceil((actual_volume_weight - 0.5) / 0.5) * 50;
          cost += 55;
        } else {
          cost = 55;
        }
        res.esteemate_cost_of_delivery = cost;
        break;
      }
      case "F": {
        res.esteemate_delivery_tat = "Minimum 10";
        let cost = 0;
        if (actual_volume_weight > 5) {
          cost = Math.ceil((actual_volume_weight - 5) / 0.5) * 65;
          cost += 9 * 70;
          cost += 120;
        } else if (actual_volume_weight > 0.5) {
          cost = Math.ceil((actual_volume_weight - 0.5) / 0.5) * 70;
          cost += 120;
        } else {
          cost = 120;
        }
        res.esteemate_cost_of_delivery = cost;
        break;
      }
      default: {
        console.log("NOT IN SWITCH");
        break;
      }
    }

    return Promise.resolve(res);
  } catch (error) {
    console.log(error);
    return Promise.reject(false);
  }
};

module.exports = {
  bluedart,
  ecomExpress,
  calculateEcomExpress,
  calculateExpressBees,
  calculateDelhivery,
  calculateDTDC,
};
