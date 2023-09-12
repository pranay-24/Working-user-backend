const express = require ('express')
const router = express.Router()
const bcrypt = require('bcryptjs');
const User = require('../model/User')
const { body, validationResult } = require('express-validator');

// GET all users
router.get('/users', async (req, res) => {
    try {
      const users = await User.find();
      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.post('/users',[
    body('name').isLength({ min: 2 }).withMessage('Name is required'),
    body('email').isEmail().withMessage('Invalid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').isIn(['Supervisor', 'Staging', 'AV' , 'Security', 'Server']).withMessage('Invalid role'),
  ], async (req, res) => {
      //Validation
    const errors = validationResult (req);

    if(!errors.isEmpty()){
      res.status(400).json({errors:errors.array()});
    }

  try {
    const newUser = req.body;
    const user = await User.create(newUser);
    res.status(200).json({message:'new user created'});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT update user
router.put('/users/:id',[
    body('name').isLength({ min: 2 }).withMessage('Name is required'),
    body('email').isEmail().withMessage('Invalid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').isIn(['Supervisor', 'Staging', 'AV' , 'Security', 'Server']).withMessage('Invalid role'),
  ], async (req, res) => {
    //Validation
    const errors = validationResult (req);

    if(!errors.isEmpty()){
      res.status(400).json({errors:errors.array()});
    }

  try {
    const id = req.params.id;
    const updatedUser = req.body;
    await User.findByIdAndUpdate(id, updatedUser);
    res.json({ message: 'User updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE user
router.delete('/users/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await User.findByIdAndDelete(id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports  = router;