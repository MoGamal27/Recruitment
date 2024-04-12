const express = require('express')

const router = express.Router()

const companyController = require('../controller/companyController')

const checkRole = require('../middleware/checkRole')

router.route('/')
            .get(companyController.getAllCompany)
            .post(verifyToken, checkRole, companyController.createCompany);


router.route('/:companyId')
            .get(companyController.getCompany)
            .patch(checkRole, companyController.updateCompany)
            .delete(verifyToken, checkRole, companyController.deleteCompany);


module.exports = router;