
const checkRole =(  allowedRoles)=>{
return (req,res,next)=>{


// const allowedRole = ['Supervisor'];
const userRole = req.headers['role'];

if(allowedRoles.includes(userRole)){
    
    next();
}else{
  res.status(403).json({error:'Access denied'})  
}
}
}

module.exports = checkRole