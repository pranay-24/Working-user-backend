const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const role = {
    Supervisor:'Supervisor',
    Staging:'Staging',
    AV:'AV',
    Security:'Security',
    Server : 'Server',
  }
  
  const userSchema = new mongoose.Schema({
    email: {type:String,
    required:true},
    name: {type:String,
      required:true},
    password: {type:String,
      required:true},
    role:{type:String,
      enum:Object.values(role),
      required:true,
    },
    mobile:Number,
    address:String,
    emergencyFullName:String,
    emergencyMobile:Number,
    emergencyRelationship:String,
    preferredHospitalName:String,
    preferredHospitalAddress:String,
    preferredHospitalContact:Number,
    insuranceCompany:String,
    insuranceContact:Number,
    insurancePolicy:String,
    uniformSize:String,
  });

  userSchema.pre('save', async function (next) {
    try {
      // Check if the password has been modified or is new
      if (!this.isModified('password')) {
        return next();
      }
  
      // Generate a salt
      const salt = await bcrypt.genSalt(10);
  
      // Hash the password using the salt
      const hashedPassword = await bcrypt.hash(this.password, salt);
  
      // Set the hashed password
      this.password = hashedPassword;
  
      return next();
    } catch (error) {
      return next(error);
    }
  });

  module.exports  = mongoose.model('User', userSchema);