const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

const commentSchema = new Schema({
    rating : {
        type : Number,
        required : true
    },
    comment : {
        type : String,
        required : true
    }
},{
    timestamps : true
})

const dishSchema = new Schema({
    name : {
        type : String,
        required : true,
        unique : true
    },
    image : {
        type : String,
        required : true
    },
    price : {
        type : Currency,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    quantity : {
        type : Number,
        required : true
    },
    comments : [commentSchema]
}, {
    timestamps : true
})

const Dish = mongoose.model('dish', dishSchema);

module.exports = Dish;