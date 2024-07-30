const express = require('express');
const usercontroller = require('./../controller/usercontroller');
const authcontroller = require('./../controller/authcontroller');
const router = express.Router();

router.post('/signup', authcontroller.signup)
router.post('/login',authcontroller.login)
// router.post('/forgotPassword', authcontroller.forgotPassword)
// router.patch('/resetPassword/:token', authcontroller.resetPassword)

// router
//     .route('/')
//     .get(usercontroller.getAllUsers)
//     .post(usercontroller.createUser);

router.route('/').get(usercontroller.getAllUser)


// router
//     .route('/:id')
//     .get(usercontroller.getUsers)
//     .patch(usercontroller.updateUser)
//     .delete(usercontroller.deleteUser);


module.exports = router;
