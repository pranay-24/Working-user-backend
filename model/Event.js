const { Timestamp } = require('mongodb');
const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    name: String,
    date: Date,
    startFrom:Timestamp,
    endAt:Timestamp,
    guestcount: Number,

  });

  module.exports =  mongoose.model('User', userSchema);