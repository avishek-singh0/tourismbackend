const express = require('express');
const reviewcontoller = require('./../controller/reviewcontroller');
const authController = require('./../controller/authcontroller')
const router = express.Router();




router.route('/')
.get(reviewcontoller.getAllReview)
.post(
    authController.protect,
    authController.restricTo('user'),
    reviewcontoller.Createreview
    );


module.exports = router;