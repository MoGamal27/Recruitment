require('dotenv').config()
const express = require('express')
const app = express()

app.listen(5000,()=>{
    console.log('Server running on port 5000')
})

const MONGO_URI= process.env.MONGO_URL;


mongoose.connect(MONGO_URI).then(() => {
    console.log('mongodb server started')
})


