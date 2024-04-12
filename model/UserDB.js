const mongoose = require('mongoose')
const validator = require('validator')
const userRole = require('../utils/userRole')
const companyDB = require('../model/companyDB')

const userSchema = new mongoose.Schema({
   name:{
      type:String,
      required:true
    },
    
    email:{
        type:String,
        required:true,
        unique:true,
        validate:[validator.isEmail, 'must provide valid email address']
    },

    password:{
        type:String,
        required:true
    },

    role:{
        type: String,
        enum: [userRole.JOBSEEKER, userRole.EMPOLYER],
        required: true
    },

    profile: {
        fullName: String,
        email: String,
        phone: String,
        address: String,
        summary: String,
        resume:String
    }

})

userSchema.virtual('details').get(function() {
    if (this.role === userRole.JOBSEEKER) {
      return this.profile;
    } else if (this.role === userRole.EMPOLYER) {
      return companyDB;
    }
})

module.exports = mongoose.model('User', userSchema)