const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
   
    mailid : {
        type : String,
        
        unique : true,
        default: ''
    },
   
    admin : {
        type : Boolean,
        default : false
    }
}, {
    timestamps: true
})

userSchema.plugin(passportLocalMongoose)
module.exports = mongoose.model('user', userSchema, 'users')