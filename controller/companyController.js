const {validationResult} = require('express-validator');
const companyDB = require('../model/companyDB')
const appError = require('../utils/appError');
const httpStatusText = require('../utils/httpStatusText');
const asyncWrapper = require("../middleware/asyncWrapper");

const getAllCompany = asyncWrapper(async (req,res) => {
    const query = req.query;

    const limit = query.limit || 10;
    const page = query.page || 1;
    const skip = (page - 1) * limit;

    const companies = await companyDB.find({}, {"__v": false}).limit(limit).skip(skip);

    res.json({ status: httpStatusText.SUCCESS, data: {companies}});
})


const createCompany = asyncWrapper(async (req, res, next) => {
    
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            const error = appError.create(errors.array(), 400, httpStatusText.FAIL)
            return next(error);
        }

        const newCompany = new companyDB(req.body);

        await newCompany.save();

      res.status(201).json({status: httpStatusText.SUCCESS, data: {company: newCompany}})
  })

  const getCompany = asyncWrapper(
    async (req, res, next) => {

        const company = await companyDB.findById(req.params.companyId);
        if(!company) {
            const error = appError.create('company not found', 404, httpStatusText.FAIL)
            return next(error);
        }
        return res.json({ status: httpStatusText.SUCCESS, data: {company}});
    
    }
)


const updateCompany = asyncWrapper(async (req, res) => {
    const companyId = req.params.companyId;    
    const updatedCompany = await companyDB.updateOne({_id: companyId}, {$set: {...req.body}});
    return res.status(200).json({status: httpStatusText.SUCCESS, data: {company: updatedCompany}})


})

const deleteCompany = asyncWrapper(async (req, res) => {
    await companyDB.deleteOne({_id: req.params.companyId});
    res.status(200).json({status: httpStatusText.SUCCESS, data: null});
})

module.exports = {
   getAllCompany,
   createCompany,
   getCompany,
   updateCompany,
   deleteCompany
}