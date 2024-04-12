const express = require('express')

const router = express.Router()

const jobController = require('../controller/jobController')

const checkRole = require('../middleware/checkRole')

router.route('/')
            .get(jobController.getAllJob)
            .post(verifyToken, checkRole, jobController.createJob);


router.route('/:jobId')
            .get(jobController.getJob)
            .patch(checkRole, jobController.updateJob)
            .delete(verifyToken, checkRole, jobController.deleteJob);

module.exports = router;