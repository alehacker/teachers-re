const { Schema, model } = require('mongoose');


const resourceSchema = new Schema({
    name: String,
    description: String,
    grade: {
        type: String,
        enum : ['Kinder','1st', '2nd','3rd', '4th', '5th'],
        required: true
    },
    subject: {
        type: String,
        enum : ['Art', 'Math', 'Music', 'Reading', 'Science','Social Studies', 'Spanish'],
        required: true
    },
    imageUrl: String,
    creator: { type: Schema.Types.ObjectId, ref: "User" },
  });

module.exports = model('Resource', resourceSchema);


