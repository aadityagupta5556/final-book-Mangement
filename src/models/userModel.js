
const mongoose = require('mongoose');
const userModel = new mongoose.Schema({

    title: {
        type: String,
        required: true,
        enum: ["Mr", "Mrs", "Miss"]
    },
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    address: {
        street: {
        type:String,defautl:null
        },
        city:{
        type:String,
        default:null
        },
        pincode:{
        type:String,
        default:null},
    }
}, { timestamps: true });

module.exports= mongoose.model('userModel',userModel)
