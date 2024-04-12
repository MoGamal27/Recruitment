const express = require('express')
const router = express.Router()
const multer = require('multer');
const Profile = require('../model/UserDB');

const diskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    
    filename: function(req, file, cb) {
        const ext = file.mimetype.split('/')[1];
        const fileName = `user-${Date.now()}.${ext}`;
        cb(null, fileName);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(appError.create('File must be a PDF', 400), false);
    }
};

const upload = multer({ 
    storage: diskStorage,
    fileFilter
});


router.post('/uploadResume', upload.single('resume'), async (req, res) => {
    try {
        
        const profile = new Profile.profile({
            resume: req.file.path 
        });

        await profile.save();

        res.status(201).send('Profile created successfully');
    } catch (error) {
        res.status(400).send(error.message);
    }
});

module.exports = router;


