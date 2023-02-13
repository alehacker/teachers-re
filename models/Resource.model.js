const { Schema, model } = require('mongoose');

const resourceSchema = new Schema({
    name: String,
    description: String,
    grade: String,
    subject: String,
    imageUrl: String,
    creator: { type: Schema.Types.ObjectId, ref: "User" },
  });

module.exports = model('Resource', resourceSchema);

//Do enum or grade and subject
//research how to verify 
// use cloudinary - research - it will turn the file into a URL that can be found on MongoDB
