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

