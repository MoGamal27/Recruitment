const {validationResult} = require('express-validator');
const jobDB = require('../model/jobDB')
const appError = require('../utils/appError');
const httpStatusText = require('../utils/httpStatusText');
const asyncWrapper = require("../middleware/asyncWrapper");

const getAllJob = asyncWrapper(async (req,res) => {
    const query = req.query;

    const limit = query.limit || 10;
    const page = query.page || 1;
    const skip = (page - 1) * limit;

    const jobs = await companyDB.find({}, {"__v": false}).limit(limit).skip(skip);

    res.json({ status: httpStatusText.SUCCESS, data: {jobs}});
})


const createJob = asyncWrapper(async (req, res, next) => {
    
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            const error = appError.create(errors.array(), 400, httpStatusText.FAIL)
            return next(error);
        }

        const newJob = new jobDB(req.body);

        await newJob.save();

      res.status(201).json({status: httpStatusText.SUCCESS, data: {job: newJob}})
  })

  const getJob = asyncWrapper(
    async (req, res, next) => {

        const job = await jobDB.findById(req.params.jobId);
        if(!job) {
            const error = appError.create('company not found', 404, httpStatusText.FAIL)
            return next(error);
        }
        return res.json({ status: httpStatusText.SUCCESS, data: {job}});
    
    }
)


const updateJob = asyncWrapper(async (req, res) => {
    const jobId = req.params.jobId;    
    const updatedJob = await jobDB.updateOne({_id: jobId}, {$set: {...req.body}});
    return res.status(200).json({status: httpStatusText.SUCCESS, data: {job: updatedJob}})


})

const deleteJob = asyncWrapper(async (req, res) => {
    await jobDB.deleteOne({_id: req.params.jobId});
    res.status(200).json({status: httpStatusText.SUCCESS, data: null});
})

module.exports = {
   getAllJob,
   createJob,
   getJob,
   updateJob,
   deleteJob
}