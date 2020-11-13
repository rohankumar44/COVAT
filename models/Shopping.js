const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ShoppingSchema = new Schema({
    recent_orders : [{
        name: { type: String, required: true },
        shopkeeperId: { type: String, required: true },
        contactNumber : { type: Number, required: true },
        shopName: { type: String, required: true },
        shopAddress: { type: String, required: true },
        price: { type: Number, required: true },
        shippingAddress: { type: String, required: true },
        dateOfOrder: { type: String, required: true },
        dateOfDelivery: { 
            type: String, 
            default: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10).toString()
        },
        delivered: { type: String, default: "no" },
        quantity: { type: Number, required: true}
    }],
    cart : [{
        shopkeeperId: { type: String, required: true },
        available: { type: Number, required: true },
        shopName: { type: String, required: true },
        shopAddress: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, default: 1 },
        shippingAddress: { type: String, required: true }
    }]
});

module.exports = Shopping = mongoose.model("shopping", ShoppingSchema);