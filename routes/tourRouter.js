const express= require('express');
const tourcontroller = require('./../controller/tourcontroller');
const router = express.Router();
const authController = require('./../controller/authcontroller')

router
.route('/top-5-cheap')
.get(tourcontroller.aliasTopTours,tourcontroller.getAllTours)

router
.route('/tour-stats')
.get(tourcontroller.getTourStats);

router.route('/monthly-plan/:year').get(tourcontroller.getMonthlyPlan);

router.route('/tour-stats/').get(tourcontroller.getTourStats);



router
.route('/')
.get(authController.protect,tourcontroller.getAllTours)
.post(tourcontroller.createTour)


router
.route('/:id')
.get(tourcontroller.getTour)
.patch(tourcontroller.updateTour)
.delete(authController.protect,authController.restricTo('admin','lead-guide'),tourcontroller.deletetour)



module.exports = router;