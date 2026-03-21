const jwt=require('jsonwebtoken');
const User=require('../models/user');

const protect=async (req, res, next) =>{
    try{
    let token;
    if(req.headers.authorization){
        token=req.headers.authorization.split(' ')[1];

    }
    if(!token){
        return res.status(401).json({message:'Not authorized, no token'});
    }
    const decoded=jwt.verify(token,process.env.JWT_SECRET);
    const user=await User.findById(decoded.id);
    if(!user){
        return res.status(401).json({message:' user not found'});
    }
    req.user=user;
    next();
}
    catch(error){
        console.error(error);
        res.status(401).json({message:'Not authorized, token failed'});
    }
    
}


module.exports={protect};