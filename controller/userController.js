const User = require('../model/UserDB');
const asyncWrapper = require("../middleware/asyncWrapper");
const httpStatusText = require('../utils/httpStatusText');
const appError = require('../utils/appError');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const generateJWT = require("../utils/generateJWT");



const register = asyncWrapper(async (req, res, next) => {
    const { name, email, password, role } = req.body;

    const oldUser = await User.findOne({ email: email});

    if(oldUser) {
        const error = appError.create('user already exists', 400, httpStatusText.FAIL)
        return next(error);
    }

    // password hashing
    const hashedPassword = await bcrypt.hash(password, 10);


    const newUser = new User({
        name,
        email,
        password: hashedPassword,
        role,
       
    })

    // generate JWT token 
    const token = await generateJWT({email: newUser.email, id: newUser._id, role: newUser.role});
    newUser.token = token;

    await newUser.save();


    res.status(201).json({status: httpStatusText.SUCCESS, data: {user: newUser}})

})

const login = asyncWrapper(async (req, res, next) => {
    const {email, password} = req.body;

    if(!email && !password) {
        const error = appError.create('email and password are required', 400, httpStatusText.FAIL)
        return next(error);
    }

    const user = await User.findOne({email: email});

    if(!user) {
        const error = appError.create('user not found', 400, httpStatusText.FAIL)
        return next(error);
    }

    const matchedPassword = await bcrypt.compare(password, user.password);

    if(user && matchedPassword) {
        // logged in successfully

       const token = await generateJWT({email: user.email, id: user._id, role: user.role});

        return res.json({ status: httpStatusText.SUCCESS, data: {token}});
    } else {
        const error = appError.create('something wrong', 500, httpStatusText.ERROR)
        return next(error);
    }

})


module.exports = {
    register,
    login
}