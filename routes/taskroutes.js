const express = require ('express')
const router = express.Router()

const Task = require('../model/Task')
const Event  = require ('../model/Event')

const { body, validationResult } = require('express-validator');
const mongoose = require('mongoose')

const isValidObjectId = mongoose.Types.ObjectId.isValid;
// GET all tasks associated to event  with eventId
router.get('/tasks/:eventId', async (req, res) => {
    try {

    const eventId = new mongoose.Types.ObjectId(req.params.eventId);
    const event = await Event.findById(eventId);

        if(!event){
            return res.status(404).json({ error: 'Event not found' });
        }
        const tasks = event.tasks;
        res.json(tasks);

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

// View task with task Id
router.get('/tasks/taskId/:taskId', async (req, res) => {
    try {
      const taskId = req.params.taskId;
      
      if (!isValidObjectId(taskId)) {
        return res.status(400).json({ error: 'Invalid task ID' });
      }
  
      const objectId = new mongoose.Types.ObjectId(taskId); 
   
    const task = await Task.findById(objectId);

        if(!task){
            return res.status(404).json({ error: 'task not found' });
        }
     
        res.json(task);

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

//create task to event with eventId

  router.post('/tasks/:eventId',[
    body('name').isLength({ min: 2 }).withMessage('Name is required'),
    
    body('role').isIn(['Supervisor', 'Staging', 'AV' , 'Security', 'Server']).withMessage('Invalid role'),
  ], async (req, res) => {
      //Validation
    const errors = validationResult (req);

    if(!errors.isEmpty()){
      res.status(400).json({errors:errors.array()});
    }

  try {


      const eventId = new mongoose.Types.ObjectId(req.params.eventId);
      const event = await Event.findById(eventId);
      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
      }

     
        const newTask = {name : req.body.name,
            role: req.body.role,
           eventId : eventId};

         let task  = await Task.create(newTask);

         event.tasks.push( task._id)
         await event.save();

         res.status(200).json({message:'new Task created' });
      

   
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }


});

// PUT update Task
router.put('/tasks/:eventId/:taskId',[
    body('name').isLength({ min: 2 }).withMessage('Name is required'),
    
    body('role').isIn(['Supervisor', 'Staging', 'AV' , 'Security', 'Server']).withMessage('Invalid role'),
  ], async (req, res) => {
    //Validation
    const errors = validationResult (req);

    if(!errors.isEmpty()){
      res.status(400).json({errors:errors.array()});
    }

  try {

    const eventId = new mongoose.Types.ObjectId(req.params.eventId);
    const taskId = new mongoose.Types.ObjectId(req.params.taskId);

      const event = await Event.findById(eventId);
      const task = await Task.findById(taskId);

      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
      }

   if (!task) {
        return res.status(404).json({ error: 'task not found' });
      }
   

    const updatedTask = {name : req.body.name,
        role: req.body.role,
       eventId : eventId};

       const existingtask = event.tasks.some(task => task.equals(taskId));
       if(existingtask){
        await Task.findByIdAndUpdate(taskId, updatedTask);

        res.json({ message: 'Task updated successfully' });
       }

   
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE Task
router.delete('/tasks/:eventId/:taskId', async (req, res) => {
  try {
    const taskId = new mongoose.Types.ObjectId(req.params.taskId);
    const eventId = new mongoose.Types.ObjectId(req.params.eventId);

    const event = await Event.findById(eventId);
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ error: 'task not found' });
    }
    if(!event){
      res.status(404).json({error:"Event not found"})
    }

    const existingtask = event.tasks.some(task => task.equals(taskId));
      if(existingtask){
        event.tasks.remove(taskId);
        await event.save();
      await Task.findByIdAndDelete(taskId) 
      return   res.status(200).json({message : 'task removed successfully'})
      }

  
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports  = router;