const { model, Schema } = require("mongoose");

const user = new Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  streak: {
    type: Number,
    default: 0,
  },
  longestStreak: {
    type: Number,
    default: 0,
  },

  totalSolved: {
    type: Number,
    default: 0,
  },

  lastSolvedDate: {
    type: Date,
  },
},{timestamps:true});

const User = model("user", user);

module.exports = User;
