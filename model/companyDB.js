const mongoose = require('mongoose')


const companySchema = new mongoose.Schema({
  
    companyDetails: {
        name: String,
        email:String,
        phone:String,
        address:String,
        industry:String,
        description:String
      }
})

module.exports = mongoose.model('Company', companySchema)







