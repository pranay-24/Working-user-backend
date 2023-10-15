const express = require ('express')
const router = express.Router()
const Event = require('../model/Event')
const User = require ('../model/User')
const Task = require ('../model/Task')
const checkRole  = require('../middleware/checkRole')
const { body, validationResult } = require('express-validator');
const mongoose = require('mongoose')
const fetchuser = require('../middleware/fetchuser')
// GET all events
router.get('/events',fetchuser, checkRole(['Supervisor','Staging','AV','Server','Security']), async (req, res) => {
    try {
      const events = await Event.find().populate({
        path:'users',
        select:'name',
      });
      res.json(events);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  //get a particular event
router.get('/events/:eventId',fetchuser, checkRole(['Supervisor','Staging','AV','Server','Security']), async (req, res) => {
    try {
      const eventId = new mongoose.Types.ObjectId(req.params.eventId);
    const event = await Event.findById(eventId);

    if(!event){
    return res.status(400).json({error:"Event not found"})
    }
      const events = await Event.findById(eventId).populate({
        path:'users',
        select:'name',
      });
      res.json(events);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

//add an event 

  router.post('/events',fetchuser, checkRole(['Supervisor','Staging','AV','Server','Security']),[
    body('name').isLength({ min: 2 }).withMessage('Name is required'),
    body('room').isIn(['Hall1', 'Hall2', 'Hall3' , 'Hall4', 'Hall5']).withMessage('Invalid room'),
  ], async (req, res) => {
      //Validation
    const errors = validationResult (req);

    if(!errors.isEmpty()){
      res.status(400).json({errors:errors.array()});
    }

  try {
    let event = await Event.findOne({ name: req.body.name});
    if (event) {
        return res.status(400).json({ error: "Sorry a event with this name already exists" })
      }
      //add more conditions for checking if event can be created like room already booked

    const newEvent = req.body;
    event = await Event.create(newEvent);

    
    res.status(200).json({message:'new event created' });


  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }


});

//add user with user id to event id 
router.post('/events/:eventId/adduser/:userId', async (req, res) => {
    try {
      const eventId = new mongoose.Types.ObjectId(req.params.eventId);
      const userId = new mongoose.Types.ObjectId(req.params.userId);
  
      const event = await Event.findById(eventId);
      const user = await User.findById(userId);
  
      if (!event || !user) {
        return res.status(404).json({ error: 'Event or user not found' });
      }
  
      const existingUser = event.users.some(user => user.equals(userId));
      if(existingUser){
      return   res.status(400).json({error : 'User already added'})
      }

      event.users.push(userId); // Add user to the event's user array
      await event.save();
  
      res.status(200).json({ message: 'User added to the event' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
// remove user from event 
router.post('/events/:eventId/removeuser/:userId', async (req, res) => {
    try {
      const eventId = new mongoose.Types.ObjectId(req.params.eventId);
      const userId = new mongoose.Types.ObjectId(req.params.userId);
  
      const event = await Event.findById(eventId);
      const user = await User.findById(userId);
  
      if (!event || !user) {
        return res.status(404).json({ error: 'Event or user not found' });
      }
  
      const existingUser = event.users.some(user => user.equals(userId));
      if(existingUser){
        event.users.remove(userId);
        await event.save();
      return   res.status(200).json({message : 'User removed successfully'})
      }
 
      
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

//add task to event 
//done in task routes 

//remove task from event 
//done in task routes 

// PUT update event
router.put('/events/:id',[
    body('name').isLength({ min: 2 }).withMessage('Name is required'),
    body('room').isIn(['Hall1', 'Hall2', 'Hall3' , 'Hall4', 'Hall5']).withMessage('Invalid room'),
  ], async (req, res) => {
    //Validation
    const errors = validationResult (req);

    if(!errors.isEmpty()){
      res.status(400).json({errors:errors.array()});
    }

  try {
    const id = req.params.id;
    const updatedEvent = req.body;
    await Event.findByIdAndUpdate(id, updatedEvent);
    res.json({ message: 'Event updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// DELETE event
router.delete('/events/:id', async (req, res) => {
    try {
      const id = req.params.id;
      await User.findByIdAndDelete(id);
      res.json({ message: 'Evnt deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });


module.exports = router;