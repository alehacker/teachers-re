// models/User.model.js
const { Schema, model } = require('mongoose');

const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      required: [true, 'Username is required.'],
      unique: true
    },
    email: {
        type: String,
        required: [true, 'Email is required.'],
        // this match will disqualify all the emails with accidental empty spaces, 
        //missing dots in front of (.)com and the ones with no domain at all
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.'],
        unique: true,
        lowercase: true,
        trim: true
      },
    password: {
      type: String,
      required: [true, 'Password is required.']
    },
    grade: {
        type: String,
        enum : ['Kinder','1st', '2nd','3rd', '4th', '5th']
    },
    subject: {
        type: String,
        enum : ['Art', 'Math', 'Music', 'Reading', 'Science','Social Studies', 'Spanish']
    }
  },
  {
    timestamps: true
  }
);

module.exports = model('User', userSchema);


// **************************************
//  Sample user model
// **************************************


// const mongoose = require('mongoose');
// const Schema   = mongoose.Schema;

// const UserSchema = new Schema({
//   username: String,
//   email:    String,
//   password: String,
//   picPath: String,
//   picName: String,
//   posts: [ { type: Schema.Types.ObjectId, ref: 'Post' } ]
// });

// const User = mongoose.model('User', UserSchema);

// module.exports = User;
