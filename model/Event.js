
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
       },
    date: {type:String,
         },
    startFrom:{type:String,
         },
    endAt:{type:String,
         },
    guestcount: {type:String},
    room:{type:String,
        enum:Object.values(rooms),
        required:true},//staff
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],

  });

  module.exports =  mongoose.model('Event', eventSchema);