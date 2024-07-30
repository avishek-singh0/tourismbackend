const mongoose = require("mongoose");
const validator = require('validator');
const bcrypt = require('bcrypt');


const UserSchema = new mongoose.Schema({
    name:{
       type:String,
       required:[true,'Please tell your name!'] 
    },
    email: {
        type:String,
        required:[true,'Please provide your email'],
        unique: true,
        lowercase: true,
        validate:[validator.isEmail,'Please provide a vaild email']
    },
    photo:String,
    role:{
        type:String,
        enum:['user','guide','lead-guide','admin'],
        default:'user'

    },
    password:{
        type:String,
        require:[true,'Please provide a password'],
        minlength:8,
  // select:false  //not showing any output
    },
    passwordConfirm:{
        type:String,
        required:[true,'Please provide same password'],
        validate: {
            validator: function (el) {

                // work on create and save
                return el === this.password;
            },
            message: 'Password are not same!'
        }
    }
})

UserSchema.pre('save',async function(next){

    //Only run this fun passwor is modifed
    if(!this.isModified('password')) return next();  //call nextt middleware ,pre-> in between the doc

//Hash the passord with cost of 12
    this.password = await bcrypt.hash(this.password,12)
//delet pasdconf 
    this.passwordConfirm = undefined;
    next();

})

//retun true or false
UserSchema.methods.correctPassword =  async function(candidatePassword,userPassword) {
    return await bcrypt.compare(candidatePassword,userPassword);
}


UserSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
    if (this.passwordChangedAt) {
      const changedTimestamp = parseInt(
        this.passwordChangedAt.getTime() / 1000,
        10
      );
  
      return JWTTimestamp < changedTimestamp;
    }
  
    // False means NOT changed
    return false;
  };

  

const User = mongoose.model('User',UserSchema);

module.exports = User;