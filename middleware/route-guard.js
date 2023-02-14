// middleware/route-guard.js

const Resource = require('../models/Resource.model')

// checks if the user is logged in when trying to access a specific page
const isLoggedIn = (req, res, next) => {
    if (!req.session.user) {
      return res.redirect('/users/login');
    }
    next();
  };
  
  // if an already logged in user tries to access the login page it
  // redirects the user to the home page
const isLoggedOut = (req, res, next) => {
if (req.session.user) {
    return res.redirect('/');
}
next();
};

const isCreator = (req, res, next) => {

    Resource.findById(req.params.id)
    .populate('creator')
    .then((foundResource) => {
        if (!req.session.user || foundResource.creator._id.toString() !== req.session.user._id) {
            res.render('index.hbs', {errorMessage: "You are not authorized."})
        } else {
            next()
        }
    })
    .catch((err) => {
        console.log(err)
    })

}

const isNotCreator = (req, res, next) => {

    Resource.findById(req.params.id)
    .populate('creator')
    .then((foundResource) => {
        if (!req.session.user || foundResource.creator._id.toString() === req.session.user._id) {
            res.render('index.hbs')
        } else {
            next()
        }
    })
    .catch((err) => {
        console.log(err)
    })

}

module.exports = {
isLoggedIn,
isLoggedOut,
isCreator,
isNotCreator
};