const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    
    fullname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique : true
    },
    gender: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true
    },
    photo: {
        type: String,
       
    },
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
   
})

const userModel = mongoose.model('clazzo_user', userSchema)
module.exports = userModel