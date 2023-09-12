
const mongoose = require('mongoose');

const rooms = {
    Hall1:'Hall1',
    Hall2:'Hall2',
    Hall3:'Hall3',
    Hall4:'Hall4',
    Hall5: 'Hall5',
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
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  });

  module.exports =  mongoose.model('Event', eventSchema);