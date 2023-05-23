const PickupAddressModel = require("../Model/PickupAddress.model");


const addPickupAddress = async (req, res) => {
    let data = req.body;
    try {
        let pickup_address = new PickupAddressModel(data);
        await pickup_address.save();
        res.send({ pickup_address, msg: "address added" });
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: error });
    }
}

const getPickupAddress = async (req, res) => {
    let { data } = req.params;
    try {
        let address = await PickupAddressModel.find({ user_id: data });
        res.send({ address });
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: error });
    }
}



module.exports = { addPickupAddress, getPickupAddress }