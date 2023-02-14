var express = require('express');
var router = express.Router();

const mongoose = require('mongoose'); 
const bcryptjs = require('bcryptjs');
const saltRounds = 10;

const { isLoggedIn, isLoggedOut, isCreator, isNotCreator} = require('../middleware/route-guard')

const User = require('../models/User.model')
const Resource = require('../models/Resource.model')


// ******************************************
//              All User Routes
// ******************************************

router.get('/signup', signUp);
router.post('/signup',validateSignUp);
router.get('/login', isLoggedIn, login);
router.post('/login',validateLogin);
router.get('/profile', showProfile);
router.get('/logout', logoutUser);

// ********************************************
//        Functions for the signUp routes
// ********************************************

function signUp(req, res, next){
    res.render('auth/signup.hbs');
}

function validateSignUp(req, res, next){
    const { username, email, password, grade, subject } = req.body;
    console.log('here is the grade ---->', req.body.grade)
    console.log('here is the subject ----->', req.body.subject)
    console.log('*** here are the values', req.body)

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

// ********************************************
//        Functions for the login routes
// ********************************************

function login(req, res, next) {
    res.render('auth/login.hbs');
}

function validateLogin(req, res, next) {
    const { username, password } = req.body;
    if (!username || !password) {
        res.render('auth/login.hbs', {
          errorMessage: 'Please enter both, email and password to login.'
        });
        return;
    }
    User.findOne({ username })
    .then(user => {
        if (!user) {
          res.render('auth/login.hbs', { errorMessage: 'Email is not registered. Try with other email.' });
          return;
        } else if (bcryptjs.compareSync(password, user.password)) {
            req.session.user = user
            console.log('SESSION =====> ', req.session);
            res.redirect('/users/profile');
        } else {
          res.render('auth/login.hbs', { errorMessage: 'Incorrect password.' });
        }
      })
    .catch(error => next(error));
}

// ********************************************
//       Functions for the profile route
// ********************************************

function showProfile(req, res, next) {
    const user = req.session.user
    console.log('SESSION =====> ', req.session.user);
    Resource.find({
        creator: user._id
    })
        .populate('creator')
        .then((foundResources) => {
            res.render('users/profile.hbs', {foundResources, user });
        })
}

// function showAllResources(req, res, next){
//     Resource.find()
//     .populate('creator')
//     .then((foundResources) => {
//         res.render('resources/allResources.hbs', { foundResources });
//     })
//     .catch((err) => {
//         console.log(err)
//     })
// }

// ********************************************
//       Functions for the logout route
// ********************************************

function logoutUser(req, res, next) {
    req.session.destroy(err => {
        if (err) next(err);
        res.redirect('/');
    });
}

module.exports = router;
