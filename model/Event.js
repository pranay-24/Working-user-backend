const { Timestamp } = require('mongodb');
const mongoose = require('mongoose');

const rooms = {
    MusicRoom:'MusicRoom',
    GreatHall:'GreatHall',
    Quad:'Quad',
    EastCommonRoom:'EastCommonRoom',
    SouthSittingRoom: 'SouthSittingRoom',
  }


const eventSchema = new mongoose.Schema({
    name: {type:String,
        required:true},
    date: {type:Date,
        required:true},
    startFrom:{type:Date,
        required:true},
    endAt:{type:Date,
        required:true},
    guestcount: Number,
    room:{type:String,
        enum:Object.values(rooms),
        required:true},
    
  });

  module.exports =  mongoose.model('User', userSchema);