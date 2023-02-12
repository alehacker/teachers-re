var express = require('express');
var router = express.Router();

const mongoose = require('mongoose'); 
const bcryptjs = require('bcryptjs');
const saltRounds = 10;

const Resource = require('../models/Resource.model')


// ******************************************
//              All Resources Routes
// ******************************************

router.get('/add-resource', showAddForm);
router.post('/add-resource', addResource);
router.get('/all-resources', showAllResources);
// router.get('/find-resource', showFindResource);
// router.post('/find-resource', displayFoundResource);
// router.get('/resource-details/:id', showResourceDetails );
// router.get('/delete-resource/:id', deleteResource);
// router.get('/edit-resource/:id', displayEditForm);
// router.post('/edit-resource/:id', editForm);

// ********************************************
//    Functions for the Add-Resource routes
// ********************************************

function showAddForm (req, res, next) {
    res.render('resources/addResource.hbs')
}

function addResource(req, res, next) {
    const { name, description, grade, subject,imageUrl } = req.body

    Resource.create({
        name,
        description,
        grade,
        subject,
        imageUrl, //figure out how to add any other kind of file, and how to handle it
        creator: req.session.user._id
    })
    .then((newResource) => {
        console.log(newResource)
        res.redirect('/resources/all-resources')
    })
    .catch((err) => {
        console.log(err)
    })
}

// ********************************************
//    Functions for the All-Resource routes
// ********************************************

function showAllResources(req, res, next){
    Resource.find()
    .populate('creator')
    .then((foundResources) => {
        res.render('../views/resources/allResources.hbs', { foundResources });
    })
    .catch((err) => {
        console.log(err)
    })
}







// ********************************************
//    Functions for the Find-Resource routes
// ********************************************








// ********************************************
//   Functions for the Resource-Details route
// ********************************************


// ********************************************
//   Functions for the Delete Resource routes
// ********************************************



// ********************************************
//    Functions for the Edit-Resource routes
// ********************************************

module.exports = router;