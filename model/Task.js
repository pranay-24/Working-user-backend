const mongoose = require('mongoose');

const role = {
    Supervisor:'Supervisor',
    Staging:'Staging',
    AV:'AV',
    Security:'Security',
    Server : 'Server',
  }

const taskSchema = new mongoose.Schema({
    name: {type:String,
        required:true},
    role : {
    type:String,
    enum: Object.values(role),
    },
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
  });

  module.exports =  mongoose.model('Task', taskSchema);
