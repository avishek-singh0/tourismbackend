const User = require('./../models/usermodel');
const catchAsync = require('../utils/catchAsync'); 
const jwt = require('jsonwebtoken');
const AppError = require('./../utils/appError')
const { promisify } = require('util');



const signtoken = id =>  {
    return jwt.sign({id}, process.env.JWT_SECRET,{
    expiresIn: process.env.JWT_EXPIRES_IN
}) };


exports.signup = catchAsync(async (req,res,next)=>{
    const role = req.body.role; 
    const newUser = await  User.create({
       name:req.body.name,
       email:req.body.email,
       password:req.body.password,
       passwordConfirm:req.body.passwordConfirm,
      role: role  || 'user'
    });


const token = signtoken(newUser._id)
console.log(token)
    res.status(201).json({
        status:'success',
       token,
        data:{
            user:newUser
        }
    })
});


exports.login =catchAsync(async (req,res,next) =>{
    const {email,password }= req.body;
 
    //1 Check if email and password exit
if(!email || !password){
   return  next(new AppError('Please Provide email and passoword!',400));
}

    //2 Check if user exists $$ password is correct  ({email:email})
const user = await User.findOne({email});
console.log(user);
  
// const correct = await user.correctPassword(password,user.password);
// console.log(correct)

if(!user || !(await user.correctPassword(password,user.password))){
     return next(new AppError('Incorrect email or passoword',401))
} 

    // const correct = await user.correctPassword(password);
    //  if(!user || !correct){
    //      return next(new AppError('Incorrect email or passoword',401))
    // }

       //3 if everything ok,end tokento client
const token = signtoken(user._id);

   res.status(200).json({
        status:"success",
        token
    })

})

exports.protect = catchAsync(async (req,res,next)=>{
    //1 Getting tokern and check of it there
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
      token = req.headers.authorization.split(' ')[1];

    }

    console.log(token)

    if (!token) {
        console.log('No token found in the headers');
        return next(new AppError('You are not logged in !Please logging',401));
    }
    //2 Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    //3 Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(
        new AppError(
          'The user belonging to this token does no longer exist.',
          401
        )
      );
    }

    //4 Check if user changes ppswd after the tokern war issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next(
          new AppError('User recently changed password! Please log in again.', 401)
        );
      }
    
      // GRANT ACCESS TO PROTECTED ROUTE
      req.user = currentUser;
      next();
   
});



exports.restricTo = (...roles)=>{
    return(req,res,next) =>{
        //roles = ['admin,'lead-guide] 
        if(!roles.includes(req.user.role)){
            return next(
                new AppError("You have no permission",403)
            )
        }
        next();
    }
}