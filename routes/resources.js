var express = require('express');
var router = express.Router();

const mongoose = require('mongoose'); 
const bcryptjs = require('bcryptjs');
const saltRounds = 10;

const { isLoggedIn, isLoggedOut, isCreator, isNotCreator} = require('../middleware/route-guard')

const fileUploader = require('../config/cloudinary.config');

const Resource = require('../models/Resource.model')
const User = require('../models/User.model')

// ******************************************
//              All Resources Routes
// ******************************************

router.get('/add-resource', isLoggedIn, showAddForm);
router.post('/add-resource', isLoggedIn, fileUploader.single('imageUrl'), addResource);
router.get('/all-resources', showAllResources);
router.get('/resource-details/:id', showResourceDetails);
router.get('/edit-resource/:id', isCreator, displayEditForm);
router.post('/edit-resource/:id', isCreator, fileUploader.single('imageUrl'), editForm);
router.get('/delete-resource/:id', isCreator, deleteResource);
router.get('/find-resource', showFindResource);
router.post('/find-resource', displayFoundResource);

// ********************************************
//    Functions for the Add-Resource routes
// ********************************************

function showAddForm (req, res, next) {
    res.render('resources/addResource.hbs')
}

function addResource(req, res, next) {
    const { name, description, grade, subject,imageUrl } = req.body

    // let formattedGrade = grade.toLowerCase()
    // let formattedSubject = subject.toLowerCase()


    Resource.create({
        name,
        description,
        grade,
        subject,
        imageUrl: req.file.path, //This was done with Cloudinary
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
        res.render('resources/allResources.hbs', { foundResources });
    })
    .catch((err) => {
        console.log(err)
    })
}

// ********************************************
//   Functions for the Resource-Details route
// ********************************************
function showResourceDetails(req, res, next){
    Resource.findById(req.params.id)
    .populate('creator')
    .then((foundResource) => {
        let urlArray = foundResource.imageUrl.split('.')
        let extension = urlArray[urlArray.length-1]
        if (extension === 'jpg' || extension === 'jpeg' || extension === 'png') {
            res.render('resources/resourceDetailsImage.hbs', foundResource)
        } else {

            res.render('resources/resourceDetails.hbs', foundResource)
        }
    })
    .catch((err) => {
        console.log(err)
    })
}
// function showResourceDetails(req, res, next){
//     Resource.findById(req.params.id)
//     .populate('creator')
//     .then((foundResource) => {
//         res.render('resources/resourceDetails.hbs', foundResource)
//     })
//     .catch((err) => {
//         console.log(err)
//     })
// }

//Found that to pull the url from cloudinary
// String url = cloudinary.url().format("jpg").generate("sample");

// ********************************************
//    Functions for the Edit-Resource routes
// ********************************************

function displayEditForm(req, res, next){
    Resource.findById(req.params.id)
    .then((foundResource) => {
        res.render('resources/editResource.hbs', foundResource)
    })
    .catch((err) => {
        console.log(err)
    })
}

function editForm(req, res, next){
    const { name, description, grade, subject, imageUrl} = req.body
    Resource.findByIdAndUpdate(req.params.id, 
        {
            name,
            description,
            grade,
            subject,
            imageUrl
        },
        {new: true})
    .then((updatedResource) => {
        console.log(updatedResource)
        res.redirect(`/resources/resource-details/${req.params.id}`)
    })
    .catch((err) => {
        console.log(err)
    })
}


// ********************************************
//   Functions for the Delete Resource routes
// ********************************************
function deleteResource(req, res, next){
    Resource.findByIdAndDelete(req.params.id)
    .then((confirmation) => {
        console.log(confirmation)
        res.redirect('/resources/all-resources')
    })
    .catch((err) => {
        console.log(err)
    })
}

// ********************************************
//    Functions for the Find-Resource routes
// ********************************************
function showFindResource(req, res, next) {
  res.render('resources/findResource.hbs')
}

function displayFoundResource(req, res, next){
    const { name, description, grade, subject, imageUrl} = req.body

    //conditional for case if both are filled do somehting here. else Resource line 148
    if (grade && subject){
        Resource.find({ 
            "$and": [
            {grade},
            {subject}
        ]}  
    )
    .then((foundResource) => {
        if (!foundResource.length) {
            res.render('resources/findResource.hbs', {errorMessage: 'No Resources Found.  Try Again'})
        }
        console.log('**** for $and...here is the resource I got***', foundResource)
        res.render('resources/foundResource.hbs', {foundResource})
    })
    .catch((err) =>{
        console.log(err)
    })
    } else {
        Resource.find({ 
            "$or": [
            {grade},
            {subject}
        ]}
    )
    .then((foundResource) => {
        if (!foundResource.length) {
            res.render('resources/findResource.hbs', {errorMessage: 'No Resources Found.  Try Again'})
        }
        console.log('**** for $or...here is the resource I got***', foundResource)
        res.render('resources/foundResource.hbs', {foundResource})
    })
    .catch((err) =>{
        console.log(err)
    })
    } 
}





module.exports = router;