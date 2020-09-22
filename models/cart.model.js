/** @format */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
require("mongoose-currency").loadType(mongoose);
const Currency = mongoose.Schema.Types.Currency;

const cartSchema = new Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
        },
        dishes: [
            {
                type : mongoose.Schema.Types.ObjectId,
                ref : 'dish'
            }
        ],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("cart", cartSchema, "carts");
