var express = require('express');
var router = express.Router();

const mongoose = require('mongoose'); 
const bcryptjs = require('bcryptjs');
const saltRounds = 10;

const User = require('../models/User.model')


// ******************************************
//              All User Routes
// ******************************************

/* GET users listing. */
router.get('/signup', signUp);
router.post('/signup',validateSignUp);
// router.get('/login', login(req, res, next) );
// router.post('/login',validateLogin(req, res, next));
// router.get('/profile', showProfile(req, res, next) );
// router.get('/logout', logoutUser(req, res, next));

function signUp(req, res, next){
    res.render('auth/signup.hbs');
}

function validateSignUp(req, res, next){
    const { username, email, password, grade, subject } = req.body;
    if(!username || !email || !password){
        res.render('auth/signup.hbs', 
        {errorMessage: 'All fields are mandatory.  Please Provide username, email and password'})
        return;
    }

    bcryptjs
    .genSalt(saltRounds)
    .then((salt) => {
        return bcryptjs.hash(password, salt)
    })
    .then((hashedPassword) => {
        return User.create({
            username,
            email,
            password: hashedPassword,
            grade,
            subject
        });
    })
    .then(newUser => {
        console.log('Newly created user is: ', newUser);
        //I need to decide where to redirect...Maybe profile
        res.redirect('/')  
    })
    .catch(error => {
        if (error instanceof mongoose.Error.ValidationError) {
            res.status(500).render('auth/signup', { errorMessage: error.message });
        } else if (error.code === 11000 ){
            res.status(500).render('auth/signup', {
                errorMessage: 'Username and email need to be unique.  Either username or email is already used'
            });
        } else {
            next(error);
        }        
    })
}









module.exports = router;
