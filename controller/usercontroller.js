const User = require('./../models/usermodel');

exports.getAllUser =async (req,res)=>{

const users = await User.find();

res.status(200).json({

status:"success",
result: users.length,
data:{
    users
}

})


}