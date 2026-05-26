const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: false
  },
  school: {
    type: String,
    trim: true
  },
  major: {
    type: String,
    trim: true
  },
  skills: [{
    type: String,
    trim: true
  }],
  githubId: {
    type: String,
    unique: true,
    sparse: true
  },
  githubUsername: {
    type: String
  },
  avatar: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    trim: true,
    maxlength: 500
  },
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

module.exports = mongoose.model('User', userSchema);