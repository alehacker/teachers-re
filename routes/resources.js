var express = require('express');
var router = express.Router();

const mongoose = require('mongoose'); 
const bcryptjs = require('bcryptjs');
const saltRounds = 10;

const Resource = require('../models/Resource.model')
const User = require('../models/User.model')

// ******************************************
//              All Resources Routes
// ******************************************

router.get('/add-resource', showAddForm);
router.post('/add-resource', addResource);
router.get('/all-resources', showAllResources);
router.get('/resource-details/:id', showResourceDetails);
router.get('/edit-resource/:id', displayEditForm);
router.post('/edit-resource/:id', editForm);
router.get('/delete-resource/:id', deleteResource);
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

    let formattedGrade = grade.toLowerCase()


    Resource.create({
        name,
        description,
        grade: formattedGrade,
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
        res.render('resources/resourceDetails.hbs', foundResource)
    })
    .catch((err) => {
        console.log(err)
    })
}

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
    let formattedGrade = grade.toLowerCase()

    console.log('here is the subject', subject)
    //conditional for case if both are filled do somehting here. else Resource line 148
    if (grade && subject){
        Resource.find({ 
        
            "$and": [
            {grade: formattedGrade},
            {subject}
        ]}
        
    )
    .then((foundResource) => {
        console.log(foundResource)
        res.render('resources/foundResource.hbs', {foundResource})
    })
    .catch((err) =>{
        console.log("On line 152", err)
    })
    } else {
        Resource.find({ 
        
            "$or": [
            {grade: formattedGrade},
            {subject}
        ]}
    )
    
    .then((foundResource) => {
        console.log(foundResource)
        res.render('resources/foundResource.hbs', {foundResource})
    })
    .catch((err) =>{
        console.log("On line 152", err)
    })
    }
  
}


// function displayFoundResource(req, res, next){
//     const { name, description, grade, subject, imageUrl} = req.query
//     console.log(req)
//     console.log(req.query)
//     console.log('here is the subject', subject)
    // Resource.find(subject)  
    //     //     "$or" :[
    // //         {grade},
    // //         {subject}
    // //     ]
    // // })
    // .then((foundResource) => {
    //     res.render('resources/foundResource.hbs', {foundResource})
    // })
    // .catch((err) =>{
    //     console.log(err)
    // })
// }

// app.get("/search", (req, res) => {
//     const query = req.query.q;
    
//     // query the database for the search results
//     const results = getResultsFromDatabase(query);
    
//     // send the results back to the client
//     res.send(results);
//   });

//   app.get("/", (req, res) => {
//     res.sendFile(__dirname + "/index.html");
//   });
//Model.find(subject: req.body.subject)














module.exports = router;