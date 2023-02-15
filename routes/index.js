var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Teachers Resource Exchange' });
});
//Add here some resources or something nice about the page
//check on education.com for front, get images of people and students to make the page look pretty
module.exports = router;
