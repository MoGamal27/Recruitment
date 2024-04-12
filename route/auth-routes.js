const router = require('express').Router();
const passport = require('passport');
const {register, login} = require('../controller/userController')

router.post('/register',register)

router.post('/login',login)

function isLoggedIn(req, res, next) {
    req.user ? next() : res.sendStatus(401);
  }


router.get('/auth/google',
  passport.authenticate('google', {scope:['email','profile'] } 
))

router.get( '/auth/google/callback',
  passport.authenticate( 'google', {
    successRedirect: '/profile',
    failureRedirect: '/auth/google/failure'
  })
);

router.get('/auth/google/failure', (req,res)=>{
    res.send('Failed to Authenticate')
})

module.exports = router;



